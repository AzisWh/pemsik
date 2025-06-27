import React, { useState } from 'react';
import { useDosen } from '../utils/apiDosen';
import { useMahasiswa } from '../utils/apimahasiswa';
import { useMataKuliah } from '../utils/apimatakuliah';
import Swal from 'sweetalert2';
import { useKelas, useCreateKelas, useDeleteKelas } from '../utils/apikelas';

const Kelas = () => {
  const { data: kelas = [] } = useKelas();
  const create = useCreateKelas();
  const remove = useDeleteKelas();

  const { data: dosen = [] } = useDosen();
  const { data: mahasiswa = [] } = useMahasiswa();
  const { data: matakuliah = [] } = useMataKuliah();

  const [selectedMK, setSelectedMK] = useState(null);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const MAX_SKS_DOSEN = 10;
  const MAX_SKS_MAHASISWA = 9;

  const getMKById = (id) => matakuliah.find((m) => m.id === id);
  const getDosenById = (id) => dosen.find((d) => d.id === id);
  const getMhsById = (id) => mahasiswa.find((m) => m.id === id);

  const totalSKSDosen = (idDosen) =>
    kelas
      .filter((k) => k.dosenId === idDosen)
      .reduce((sum, k) => sum + (getMKById(k.mataKuliahId)?.sks || 0), 0);

  const totalSKSMahasiswa = (idMhs) =>
    kelas
      .filter(
        (k) => Array.isArray(k.mahasiswaIds) && k.mahasiswaIds.includes(idMhs)
      )
      .reduce((sum, k) => {
        const mk = matakuliah.find((m) => m.id === k.mataKuliahId);
        return sum + (mk?.sks || 0);
      }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedMK || !selectedDosen || selectedMahasiswa.length === 0) {
      return Swal.fire('Semua field harus diisi.');
    }

    const isDuplicate = kelas.some((k) => k.mataKuliahId === selectedMK.id);
    if (isDuplicate) {
      return Swal.fire('Mata kuliah ini sudah diajar oleh dosen lain.');
    }

    const sksMK = selectedMK.sks;
    const sksDosen = totalSKSDosen(selectedDosen.id) + sksMK;

    if (sksDosen > MAX_SKS_DOSEN) {
      return Swal.fire('Dosen melebihi batas maksimal SKS.');
    }

    const mhsInvalid = selectedMahasiswa.find(
      (m) => totalSKSMahasiswa(m.id) + sksMK > MAX_SKS_MAHASISWA
    );
    if (mhsInvalid) {
      return Swal.fire(`Mahasiswa ${mhsInvalid.nama} melebihi batas SKS.`);
    }

    create.mutate({
      dosenId: selectedDosen.id,
      mataKuliahId: selectedMK.id,
      mahasiswaIds: selectedMahasiswa.map((m) => m.id),
    });

    setSelectedMK(null);
    setSelectedDosen(null);
    setSelectedMahasiswa([]);
  };

  const totalPages = Math.ceil(kelas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedKelas = kelas.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <h1
        style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
        Pengelolaan Kelas
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        }}>
        {/* Matkul */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '4px',
              fontWeight: '600',
            }}>
            Matkul
          </label>
          <select
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
            value={selectedMK?.id || ''}
            onChange={(e) =>
              setSelectedMK(
                matakuliah.find((mk) => mk.id === parseInt(e.target.value))
              )
            }>
            <option value="">Pilih</option>
            {matakuliah.map((mk) => (
              <option key={mk.id} value={mk.id}>
                {mk.nama} - {mk.sks} SKS
              </option>
            ))}
          </select>
        </div>

        {/* Dosen */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '4px',
              fontWeight: '600',
            }}>
            Dosen
          </label>
          <select
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
            value={selectedDosen?.id || ''}
            onChange={(e) =>
              setSelectedDosen(
                dosen.find((d) => d.id === parseInt(e.target.value))
              )
            }>
            <option value="">Pilih</option>
            {dosen.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nama} (Total SKS: {totalSKSDosen(d.id)})
              </option>
            ))}
          </select>
        </div>

        {/* Mahasiswa */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '4px',
              fontWeight: '600',
            }}>
            Mahasiswa
          </label>
          <div
            style={{
              maxHeight: '130px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              padding: '8px',
            }}>
            {mahasiswa.map((m) => {
              const isSelected = selectedMahasiswa.some((s) => s.id === m.id);
              const sks = totalSKSMahasiswa(m.id);
              return (
                <label
                  key={m.id}
                  style={{ display: 'block', marginBottom: '4px' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMahasiswa([...selectedMahasiswa, m]);
                      } else {
                        setSelectedMahasiswa(
                          selectedMahasiswa.filter((s) => s.id !== m.id)
                        );
                      }
                    }}
                  />{' '}
                  {m.nama} (Total SKS: {sks})
                </label>
              );
            })}
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
            Simpan Kelas
          </button>
        </div>
      </form>

      <h2
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginTop: '40px',
          marginBottom: '8px',
        }}>
        Daftar Kelas
      </h2>

      <div
        style={{
          overflowX: 'auto',
          border: '1px solid #ccc',
          borderRadius: '6px',
        }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left' }}>
                Mata Kuliah
              </th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Dosen</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Mahasiswa</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedKelas.length > 0 ? (
              paginatedKelas.map((k) => {
                const mk = getMKById(k.mataKuliahId);
                const d = getDosenById(k.dosenId);
                const mhs = k.mahasiswaIds.map(getMhsById).filter(Boolean);

                return (
                  <tr key={k.id} style={{ borderTop: '1px solid #ccc' }}>
                    <td style={{ padding: '10px' }}>{mk?.nama}</td>
                    <td style={{ padding: '10px' }}>{d?.nama}</td>
                    <td style={{ padding: '10px' }}>
                      {mhs.map((m) => m.nama).join(', ')}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button
                        onClick={() => remove.mutate(k.id)}
                        style={{
                          color: '#dc2626',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ padding: '12px', textAlign: 'center' }}>
                  Tidak ada data kelas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}>
          Sebelumnya
        </button>
        <span>
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}>
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

export default Kelas;
