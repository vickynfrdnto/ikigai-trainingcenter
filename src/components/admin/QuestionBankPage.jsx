const QuestionBankPage = (props) => {
  const { IconBank, IconCheck, IconEdit, IconPlus, IconSearch, IconTrash, addBankOption, bankForm, bankSearch, cancelEditBankQuestion, deleteBankQuestion, editingBankId, filteredBankQuestions, removeBankOption, saveBankQuestion, setBankForm, setBankSearch, startEditBankQuestion, updateBankOptionText } = props;
  return (
<section className="m-card content-upload-section">
            <div className="m-card-title-box">
              <div className="m-title-icon"><IconBank /></div>
              <div>
                <h2 className="m-card-h2">Bank Soal</h2>
                <p className="m-card-p">Simpan soal agar bisa dipakai ulang di modul lain lewat tab "Upload Konten"</p>
              </div>
            </div>

            <div className="m-quiz-question-card">
              <input
                className="m-input-pill"
                type="text"
                placeholder="Tulis pertanyaan..."
                value={bankForm.question}
                onChange={e => setBankForm(prev => ({ ...prev, question: e.target.value }))}
              />

              <div className="m-input-row-2">
                <div className="m-input-group">
                  <label className="m-label">KATEGORI</label>
                  <input
                    className="m-input-pill"
                    type="text"
                    placeholder="Contoh: SOP Kasir"
                    value={bankForm.category}
                    onChange={e => setBankForm(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div className="m-input-group">
                  <label className="m-label">BOBOT NILAI</label>
                  <input
                    className="m-input-pill"
                    type="number"
                    min="1"
                    value={bankForm.weight}
                    onChange={e => setBankForm(prev => ({ ...prev, weight: Number(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <div className="m-quiz-options-list">
                {bankForm.options.map((opt, oIdx) => (
                  <div className="m-quiz-option-row" key={oIdx}>
                    <button
                      type="button"
                      className={`m-radio-correct ${bankForm.correctIndex === oIdx ? "active" : ""}`}
                      onClick={() => setBankForm(prev => ({ ...prev, correctIndex: oIdx }))}
                      title="Tandai sebagai jawaban benar"
                    >
                      {bankForm.correctIndex === oIdx && <IconCheck />}
                    </button>
                    <input
                      className="m-input-option"
                      type="text"
                      placeholder={`Opsi ${String.fromCharCode(65 + oIdx)}`}
                      value={opt}
                      onChange={e => updateBankOptionText(oIdx, e.target.value)}
                    />
                    {bankForm.options.length > 2 && (
                      <button type="button" className="m-btn-icon-danger" onClick={() => removeBankOption(oIdx)} title="Hapus opsi ini">
                        <IconTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="m-btn-add-option" onClick={addBankOption}>
                  <IconPlus /> Tambah Opsi
                </button>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="m-btn-primary-emerald" onClick={saveBankQuestion} style={{ flex: 1 }}>
                  {editingBankId ? (<><IconCheck /> Update Soal</>) : (<><IconPlus /> Simpan ke Bank Soal</>)}
                </button>
                {editingBankId && (
                  <button type="button" className="m-btn-action-sm off" onClick={cancelEditBankQuestion}>
                    Batal Edit
                  </button>
                )}
              </div>
            </div>

            <div className="m-search-pill" style={{ marginTop: 16 }}>
              <IconSearch />
              <input
                type="text"
                placeholder="Cari soal atau kategori..."
                value={bankSearch}
                onChange={e => setBankSearch(e.target.value)}
              />
            </div>

            <div className="m-module-list" style={{ marginTop: 12 }}>
              {filteredBankQuestions.length === 0 ? (
                <div className="m-empty-td">Belum ada soal di bank.</div>
              ) : (
                filteredBankQuestions.map(bq => (
                  <div className="m-module-card" key={bq.id}>
                    <div className="m-module-card-head">
                      <div>
                        <span className="m-role-pill checked">{bq.category || "Umum"}</span>
                        <h3 className="m-card-h2" style={{ marginTop: 6 }}>{bq.q}</h3>
                        <p className="m-card-p">Bobot: {bq.weight ?? 1} · Jawaban benar: {bq.a}</p>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button type="button" className="m-module-edit-btn" onClick={() => startEditBankQuestion(bq)} title="Edit soal">
                          <IconEdit />
                        </button>
                        <button type="button" className="m-btn-icon-danger" onClick={() => deleteBankQuestion(bq.id)} title="Hapus soal">
                          <IconTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
  );
};

export default QuestionBankPage;
