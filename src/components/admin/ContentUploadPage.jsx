const ContentUploadPage = (props) => {
  const { AudienceTargetEditor, DOCUMENT_TYPE_OPTIONS, IconCheck, IconPdf, IconPlus, IconTrash, IconUpload, IconVideo, addOption, addQuizQuestion, bankQuestions, departments, handleUploadModule, importFromBank, isUploading, jobRoles, modules, newModAudience, newModCategory, newModContentType, newModDesc, newModDocumentLink, newModDocumentType, newModKKM, newModMaxAttempt, newModOrder, newModPrereq, newModTitle, newModVideoLink, orgUnits, quizQuestions, removeOption, removeQuizQuestion, setCorrectOption, setNewModAudience, setNewModCategory, setNewModContentType, setNewModDesc, setNewModDocumentLink, setNewModDocumentType, setNewModKKM, setNewModMaxAttempt, setNewModOrder, setNewModPrereq, setNewModTitle, setNewModVideoLink, updateOptionText, updateQuestionText, updateQuestionWeight } = props;
  return (
<section className="m-card content-upload-section">
            <div className="m-card-title-box">
              <div className="m-title-icon"><IconVideo /></div>
              <div>
                <h2 className="m-card-h2">Upload Konten Training</h2>
                <p className="m-card-p">Tambahkan video atau dokumen dari OneDrive, beserta quiz evaluasinya</p>
              </div>
            </div>

            <form onSubmit={handleUploadModule} className="m-form-stack">
              {/* Judul */}
              <div className="m-input-group">
                <label className="m-label">JUDUL KONTEN</label>
                <input
                  className="m-input-pill"
                  type="text"
                  placeholder="Contoh: SOP Penerimaan Barang"
                  value={newModTitle}
                  onChange={e => setNewModTitle(e.target.value)}
                />
              </div>

              {/* Kategori */}
              <div className="m-input-group">
                <label className="m-label">KATEGORI</label>
                <div className="m-segmented-choice">
                  <button
                    type="button"
                    className={`m-seg-option ${newModCategory === "Modul" ? "active" : ""}`}
                    onClick={() => setNewModCategory("Modul")}
                  >
                    Modul Training
                  </button>
                  <button
                    type="button"
                    className={`m-seg-option ${newModCategory === "SOP" ? "active" : ""}`}
                    onClick={() => setNewModCategory("SOP")}
                  >
                    SOP
                  </button>
                </div>
              </div>

              {/* Tipe Materi */}
              <div className="m-input-group">
                <label className="m-label">TIPE MATERI</label>
                <div className="m-segmented-choice">
                  <button
                    type="button"
                    className={`m-seg-option ${newModContentType === "video" ? "active" : ""}`}
                    onClick={() => {
                      setNewModContentType("video");
                    }}
                  >
                    <IconVideo /> Video
                  </button>
                  <button
                    type="button"
                    className={`m-seg-option ${newModContentType === "document" ? "active" : ""}`}
                    onClick={() => {
                      setNewModContentType("document");
                      setNewModVideoLink("");
                    }}
                  >
                    <IconPdf /> Dokumen
                  </button>
                </div>
                {newModContentType === "document" && (
                  <p className="m-card-p" style={{ marginTop: 6 }}>
                    Dokumen (PDF/PPT/Word) memakai tautan OneDrive yang bisa diakses karyawan.
                  </p>
                )}
              </div>

              {/* Keterangan */}
              <div className="m-input-group">
                <label className="m-label">KETERANGAN</label>
                <textarea
                  className="m-textarea-pill"
                  placeholder="Jelaskan isi materi secara singkat..."
                  rows={3}
                  value={newModDesc}
                  onChange={e => setNewModDesc(e.target.value)}
                />
              </div>

              {/* Urutan & Prasyarat (Sequencing) */}
              <div className="m-input-row-2">
                <div className="m-input-group">
                  <label className="m-label">URUTAN MODUL</label>
                  <input
                    className="m-input-pill"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newModOrder}
                    onChange={e => setNewModOrder(e.target.value)}
                  />
                </div>
                <div className="m-input-group">
                  <label className="m-label">MODUL PRASYARAT (WAJIB SELESAI DULU)</label>
                  <select
                    className="m-select-pill"
                    value={newModPrereq}
                    onChange={e => setNewModPrereq(e.target.value)}
                  >
                    <option value="">— Tidak ada —</option>
                    {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                  </select>
                </div>
              </div>

              {/* KKM & Batas Retake */}
              <div className="m-input-row-2">
                <div className="m-input-group">
                  <label className="m-label">KKM / NILAI LULUS MINIMUM</label>
                  <input
                    className="m-input-pill"
                    type="number"
                    min="0"
                    max="100"
                    value={newModKKM}
                    onChange={e => setNewModKKM(e.target.value)}
                  />
                </div>
                <div className="m-input-group">
                  <label className="m-label">BATAS PERCOBAAN ULANG (0 = TANPA BATAS)</label>
                  <input
                    className="m-input-pill"
                    type="number"
                    min="0"
                    value={newModMaxAttempt}
                    onChange={e => setNewModMaxAttempt(e.target.value)}
                  />
                </div>
              </div>

              <AudienceTargetEditor units={orgUnits} departments={departments} jobRoles={jobRoles} value={newModAudience} onChange={setNewModAudience} />

              {/* Link OneDrive — dipakai baik untuk Video maupun Dokumen */}
              {newModContentType === "document" ? (
                <>
                  <div className="m-input-group">
                    <label className="m-label">LINK DOKUMEN ONEDRIVE</label>
                    <input
                      className="m-input-pill"
                      type="url"
                      placeholder="https://1drv.ms/... atau https://...sharepoint.com/..."
                      value={newModDocumentLink}
                      onChange={e => setNewModDocumentLink(e.target.value)}
                    />
                    <p className="m-card-p" style={{ marginTop: 6 }}>
                      Gunakan tautan embed/berbagi OneDrive dan pastikan karyawan memiliki izin membuka file.
                    </p>
                  </div>
                  <div className="m-input-group">
                    <label className="m-label">JENIS DOKUMEN</label>
                    <select
                      className="m-select-pill"
                      value={newModDocumentType}
                      onChange={e => setNewModDocumentType(e.target.value)}
                    >
                      {DOCUMENT_TYPE_OPTIONS.map(ext => (
                        <option key={ext} value={ext}>{ext.toUpperCase()}</option>
                      ))}
                    </select>
                    <p className="m-card-p" style={{ marginTop: 6 }}>
                      PDF tampil sebagai reader halus (flipbook), jenis lain (PPT/Word) tampil sebagai preview dokumen.
                    </p>
                  </div>
                </>
              ) : (
                <div className="m-input-group">
                  <label className="m-label">LINK VIDEO ONEDRIVE</label>
                  <input
                    className="m-input-pill"
                    type="url"
                    placeholder="https://1drv.ms/... atau https://...sharepoint.com/..."
                    value={newModVideoLink}
                    onChange={e => setNewModVideoLink(e.target.value)}
                  />
                  <p className="m-card-p" style={{ marginTop: 6 }}>
                    Gunakan tautan embed/berbagi OneDrive dan pastikan karyawan memiliki izin menonton file.
                  </p>
                </div>
              )}

              {/* Quiz Builder */}
              <div className="m-quiz-builder">
                <div className="m-label-row">
                  <label className="m-label">QUIZ EVALUASI</label>
                  <button type="button" className="m-btn-add-question" onClick={addQuizQuestion}>
                    <IconPlus /> Tambah Soal
                  </button>
                </div>

                {bankQuestions.length > 0 && (
                  <div className="m-bank-picker">
                    <span className="m-label">AMBIL DARI BANK SOAL:</span>
                    <div className="m-bank-picker-list">
                      {bankQuestions.slice(0, 8).map(bq => (
                        <button
                          type="button"
                          key={bq.id}
                          className="m-bank-picker-item"
                          onClick={() => importFromBank(bq)}
                          title="Tambahkan soal ini ke quiz"
                        >
                          <IconPlus /> {bq.q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizQuestions.map((q, qIdx) => (
                  <div className="m-quiz-question-card" key={qIdx}>
                    <div className="m-quiz-question-head">
                      <span className="m-quiz-question-num">Soal {qIdx + 1}</span>
                      {quizQuestions.length > 1 && (
                        <button
                          type="button"
                          className="m-btn-icon-danger"
                          onClick={() => removeQuizQuestion(qIdx)}
                          title="Hapus soal ini"
                        >
                          <IconTrash />
                        </button>
                      )}
                    </div>

                    <input
                      className="m-input-pill"
                      type="text"
                      placeholder="Tulis pertanyaan..."
                      value={q.question}
                      onChange={e => updateQuestionText(qIdx, e.target.value)}
                    />

                    <div className="m-input-group" style={{ maxWidth: 160 }}>
                      <label className="m-label">BOBOT NILAI</label>
                      <input
                        className="m-input-pill"
                        type="number"
                        min="1"
                        value={q.weight ?? 1}
                        onChange={e => updateQuestionWeight(qIdx, e.target.value)}
                      />
                    </div>

                    <div className="m-quiz-options-list">
                      {q.options.map((opt, oIdx) => (
                        <div className="m-quiz-option-row" key={oIdx}>
                          <button
                            type="button"
                            className={`m-radio-correct ${q.correctIndex === oIdx ? "active" : ""}`}
                            onClick={() => setCorrectOption(qIdx, oIdx)}
                            title="Tandai sebagai jawaban benar"
                          >
                            {q.correctIndex === oIdx && <IconCheck />}
                          </button>
                          <input
                            className="m-input-option"
                            type="text"
                            placeholder={`Opsi ${String.fromCharCode(65 + oIdx)}`}
                            value={opt}
                            onChange={e => updateOptionText(qIdx, oIdx, e.target.value)}
                          />
                          {q.options.length > 2 && (
                            <button
                              type="button"
                              className="m-btn-icon-danger"
                              onClick={() => removeOption(qIdx, oIdx)}
                              title="Hapus opsi ini"
                            >
                              <IconTrash />
                            </button>
                          )}
                        </div>
                      ))}

                      <button type="button" className="m-btn-add-option" onClick={() => addOption(qIdx)}>
                        <IconPlus /> Tambah Opsi
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="m-btn-primary-emerald" disabled={isUploading}>
                {isUploading ? "Menyimpan..." : (<><IconUpload /> Simpan Konten</>)}
              </button>
            </form>
          </section>
  );
};

export default ContentUploadPage;
