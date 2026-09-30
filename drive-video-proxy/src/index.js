// src/index.js
//
// Cloudflare Worker: proxy streaming video dari Google Drive lewat Drive API
// (pakai service account), supaya <video> tag di frontend tidak lagi bergantung
// ke iframe /preview Google Drive yang gampang gagal karena third-party cookie
// blocking di browser.
//
// 100% GRATIS di Cloudflare Workers free tier (100.000 request/hari, tanpa kartu kredit).
//
// Env var yang dibutuhkan (di-set via `wrangler secret put`):
//   GOOGLE_SERVICE_ACCOUNT_JSON  -> isi lengkap file JSON service account

// ── Helper: base64url encode (dipakai untuk bikin JWT) ──
function base64UrlEncode(input) {
  let base64;
  if (typeof input === "string") {
    base64 = btoa(input);
  } else {
    // ArrayBuffer -> base64
    const bytes = new Uint8Array(input);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    base64 = btoa(binary);
  }
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ── Helper: ubah PEM private key jadi CryptoKey untuk signing RS256 ──
async function importPrivateKey(pem) {
  const pemBody = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

// ── Bikin JWT signed, tukar ke Google buat dapat access_token ──
async function getGoogleAccessToken(serviceAccount) {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaims = base64UrlEncode(JSON.stringify(claims));
  const unsignedToken = `${encodedHeader}.${encodedClaims}`;

  const privateKey = await importPrivateKey(serviceAccount.private_key);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(unsignedToken)
  );

  const jwt = `${unsignedToken}.${base64UrlEncode(signature)}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Gagal ambil access token: ${errText}`);
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

export default {
  async fetch(request, env) {
    // ── CORS ──
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // atau ganti dengan domain Firebase Hosting kamu spesifik
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Range",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const fileId = url.searchParams.get("id");

    if (!fileId) {
      return new Response("Missing file id", { status: 400, headers: corsHeaders });
    }

    try {
      const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
      const accessToken = await getGoogleAccessToken(serviceAccount);

      const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

      const range = request.headers.get("Range");
      const driveHeaders = { Authorization: `Bearer ${accessToken}` };
      if (range) driveHeaders["Range"] = range;

      const driveRes = await fetch(driveUrl, { headers: driveHeaders });

      if (!driveRes.ok && driveRes.status !== 206) {
        const errText = await driveRes.text();
        return new Response(`Gagal ambil file dari Drive: ${errText}`, {
          status: driveRes.status,
          headers: corsHeaders,
        });
      }

      const responseHeaders = new Headers(corsHeaders);
      responseHeaders.set("Content-Type", driveRes.headers.get("Content-Type") || "video/mp4");
      responseHeaders.set("Accept-Ranges", "bytes");
      responseHeaders.set("Cache-Control", "public, max-age=3600");
      if (driveRes.headers.get("Content-Range")) {
        responseHeaders.set("Content-Range", driveRes.headers.get("Content-Range"));
      }
      if (driveRes.headers.get("Content-Length")) {
        responseHeaders.set("Content-Length", driveRes.headers.get("Content-Length"));
      }

      return new Response(driveRes.body, {
        status: driveRes.status,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500, headers: corsHeaders });
    }
  },
};