import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as pdfjsLib from "pdfjs-dist";
import HTMLFlipBook from "react-pageflip";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

/* ── Icons ── */
const IconLoading = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity=".18" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconZoomIn = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);
const IconExpand = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);
const IconBook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
);

function usePdfPages(url, scale = 2) {
  const [pages, setPages] = useState([]);
  const [pageAspect, setPageAspect] = useState(1.414);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setPages([]);
    setLoading(true);
    setError(null);
    setProgress(0);

    if (!url) {
      setError("Dokumen belum memiliki URL file.");
      setLoading(false);
      return () => { cancelled = true; };
    }

    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument({ url }).promise;
        const rendered = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return;

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });

          if (i === 1 && !cancelled) {
            setPageAspect(viewport.height / viewport.width);
          }

          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext("2d", { alpha: false });

          await page.render({ canvasContext: ctx, viewport }).promise;
          rendered.push(canvas.toDataURL("image/jpeg", 0.94));

          if (!cancelled) setProgress(Math.round((i / pdf.numPages) * 100));
        }

        if (!cancelled) {
          setPages(rendered);
          setLoading(false);
        }
      } catch (err) {
        console.error("PDF reader error:", err);
        if (!cancelled) {
          setError("Gagal memuat dokumen PDF.");
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [url, scale]);

  return { pages, pageAspect, loading, error, progress };
}

function useElementSize() {
  const elRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!elRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    ro.observe(elRef.current);
    return () => ro.disconnect();
  }, []);

  return [elRef, size];
}

const ZOOM_FACTOR = 1.3;
const SPREAD_MIN_WIDTH = 640;
const FIT_MARGIN = 0.70;
const FIT_MARGIN_FULLSCREEN = 1.65;

const FlipbookDocViewer = ({ url, title, onFinishedReading }) => {
  const { pages, pageAspect, loading, error, progress } = usePdfPages(url);

  const wrapRef = useRef(null);
  const bookRef = useRef(null);
  const [stageRef, { width: stageWidth, height: stageHeight }] = useElementSize();

  const [currentPage, setCurrentPage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasNotifiedFinish, setHasNotifiedFinish] = useState(false);

  const totalPages = pages.length;

  const handleFlip = useCallback((e) => {
    const idx = e.data;
    setCurrentPage(idx);
    if (!hasNotifiedFinish && totalPages > 0 && idx >= totalPages - 2) {
      setHasNotifiedFinish(true);
      onFinishedReading?.();
    }
  }, [hasNotifiedFinish, totalPages, onFinishedReading]);

  const goPrev = useCallback(() => bookRef.current?.pageFlip()?.flipPrev(), []);
  const goNext = useCallback(() => bookRef.current?.pageFlip()?.flipNext(), []);

  const toggleFullscreen = useCallback(async () => {
    if (!wrapRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await wrapRef.current.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  const { isSpread, pageWidth, pageHeight } = useMemo(() => {
    const w = stageWidth || 900;
    const h = stageHeight || 500;
    const spread = w >= SPREAD_MIN_WIDTH;
    const margin = isFullscreen ? FIT_MARGIN_FULLSCREEN : FIT_MARGIN;

    const usableW = Math.max(220, w - 24) * margin;
    const usableH = Math.max(220, h - 12) * margin;

    let pw = spread ? usableW / 2 : usableW;
    let ph = pw * pageAspect;

    if (ph > usableH) {
      ph = usableH;
      pw = ph / pageAspect;
    }

    const zoom = zoomed ? ZOOM_FACTOR : 1;
    return {
      isSpread: spread,
      pageWidth: Math.floor(pw * zoom),
      pageHeight: Math.floor(ph * zoom),
    };
  }, [stageWidth, stageHeight, pageAspect, zoomed, isFullscreen]);

  if (error) {
    return (
      <div className="fb-reader fb-reader-state">
        <IconBook />
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fb-reader fb-reader-state">
        <IconLoading />
        <strong>Memuat materi...</strong>
        <div className="fb-loading-bar">
          <div className="fb-loading-fill" style={{ width: `${progress}%` }} />
        </div>
        <span>{progress}%</span>
      </div>
    );
  }

  const percentage = totalPages ? Math.round(((currentPage + 1) / totalPages) * 100) : 0;

  // Inline style ini sengaja dipaksa lewat JS (bukan cuma mengandalkan CSS
  // eksternal) supaya saat fullscreen aktif, wrapper benar-benar mengisi
  // 100vw x 100vh dengan flex-column, dan stage otomatis kebagian SISA
  // ruang (flex: 1) setelah header + toolbar. Ini yang membuat ResizeObserver
  // di stageRef akhirnya membaca ukuran layar penuh, bukan ukuran kecil
  // bawaan sebelum fullscreen — itu penyebab buku kelihatan kecil kemarin.
  const wrapFullscreenStyle = isFullscreen
    ? {
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
      }
    : undefined;

  const headerFullscreenStyle = isFullscreen ? { flexShrink: 0 } : undefined;
  const toolsFullscreenStyle = isFullscreen ? { flexShrink: 0 } : undefined;
  const stageFullscreenStyle = isFullscreen
    ? {
        flex: 1,
        minHeight: 0,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }
    : undefined;
  const progressFullscreenStyle = isFullscreen ? { flexShrink: 0 } : undefined;

  return (
    <div
      ref={wrapRef}
      className={`fb-reader ${isFullscreen ? "fb-reader-fullscreen" : ""}`}
      style={wrapFullscreenStyle}
    >
      {/* HEADER */}
      <div className="fb-reader-header" style={headerFullscreenStyle}>
        <div className="fb-reader-title">
          <span className="fb-reader-dot" />
          <span title={title}>{title}</span>
        </div>
        <div className="fb-reader-page">
          {Math.min(currentPage + 1, totalPages)} / {totalPages}
        </div>
      </div>

      <div className="fb-reader-tools" style={toolsFullscreenStyle}>
        <button
          type="button"
          className={`fb-reader-tool ${zoomed ? "is-active" : ""}`}
          onClick={() => setZoomed((v) => !v)}
          title={zoomed ? "Perkecil" : "Perbesar"}
          aria-label={zoomed ? "Perkecil" : "Perbesar"}
        >
          <IconZoomIn />
        </button>
        <button
          type="button"
          className="fb-reader-tool"
          onClick={toggleFullscreen}
          title="Layar penuh"
          aria-label="Layar penuh"
        >
          <IconExpand />
        </button>
      </div>

      {/* STAGE — react-pageflip menangani mekanika & animasi flip halaman */}
      <div
        className={`fb-reader-stage ${zoomed ? "is-zoomed" : ""}`}
        ref={stageRef}
        style={stageFullscreenStyle}
      >
        <button
          type="button"
          className="fb-reader-nav left"
          onClick={goPrev}
          disabled={currentPage === 0}
          aria-label="Halaman sebelumnya"
        >
          <IconChevronLeft />
        </button>

        <div
          className="fb-reader-book-frame"
          style={{ width: pageWidth * (isSpread ? 2 : 1), height: pageHeight }}
        >
          <div className="fb-reader-ground-shadow" />
          <HTMLFlipBook
            key={`${pageWidth}x${pageHeight}x${isSpread}`}
            width={pageWidth}
            height={pageHeight}
            minWidth={pageWidth}
            maxWidth={pageWidth}
            minHeight={pageHeight}
            maxHeight={pageHeight}
            size="fixed"
            usePortrait={!isSpread}
            showCover={true}
            drawShadow={true}
            maxShadowOpacity={0.18}
            mobileScrollSupport={true}
            flippingTime={700}
            onFlip={handleFlip}
            className="fb-book"
            ref={bookRef}
          >
            {pages.map((src, i) => (
              <div className="fb-reader-page-sheet" key={i}>
                <img src={src} alt={`Halaman ${i + 1}`} draggable={false} />
              </div>
            ))}
          </HTMLFlipBook>
        </div>

        <button
          type="button"
          className="fb-reader-nav right"
          onClick={goNext}
          disabled={currentPage >= totalPages - 1}
          aria-label="Halaman berikutnya"
        >
          <IconChevronRight />
        </button>
      </div>

      <div className="fb-reader-progress-line" style={progressFullscreenStyle}>
        <div className="fb-reader-progress">
          <div className="fb-reader-progress-fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
};

export default FlipbookDocViewer;