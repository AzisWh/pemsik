import React, { useState, useEffect } from 'react';
import {
  useCreateMahasiswa,
  useDeleteMahasiswa,
  useMahasiswa,
  useUpdateMahasiswa,
} from '../utils/apimahasiswa';
import Swal from 'sweetalert2';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thTdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
};

const headerStyle = {
  backgroundColor: '#f5f5f5',
};

const buttonStyle = {
  marginRight: '8px',
  padding: '6px 12px',
  border: 'none',
  cursor: 'pointer',
};

const Mahasiswa = () => {
  const { data: mahasiswas = [], isLoading } = useMahasiswa();
  const create = useCreateMahasiswa();
  const update = useUpdateMahasiswa();
  const remove = useDeleteMahasiswa();

  const [form, setForm] = useState({ id: null, nama: '', nim: '', sks: '' });
  const [isEdit, setIsEdit] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(mahasiswas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = mahasiswas.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      nama: form.nama,
      nim: form.nim,
      sks: parseInt(form.sks) || 0,
    };

    if (isEdit && form.id) {
      update.mutate({ id: form.id, ...payload }, o);
    } else {
      create.mutate(payload);
    }

    setForm({ id: null, nama: '', nim: '', sks: '' });
    setIsEdit(false);
  };

  const handleEdit = (m) => {
    setForm({ id: m.id, nama: m.nama, nim: m.nim, sks: m.sks.toString() });
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      remove.mutate(id, {
        onSuccess: () => Swal.fire('Data mahasiswa berhasil dihapus.'),
      });
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h1 className="mb-6 text-2xl font-bold">Manajemen Mahasiswa</h1>

      {/* FORM INPUT */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama</label>
          <input
            type="text"
            placeholder="Nama"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '10px',
              padding: '8px',
            }}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">NIM</label>
          <input
            type="text"
            placeholder="NIM"
            value={form.nim}
            onChange={(e) => setForm({ ...form, nim: e.target.value })}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '10px',
              padding: '8px',
            }}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">SKS yang Diambil</label>
          <input
            type="number"
            placeholder="SKS"
            value={form.sks}
            onChange={(e) => setForm({ ...form, sks: e.target.value })}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '10px',
              padding: '8px',
            }}
            min="0"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700">
          {isEdit ? 'Update' : 'Simpan'}
        </button>
      </form>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thTdStyle, ...headerStyle }}>Nama</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>NIM</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>SKS</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((m) => (
            <tr key={m.id}>
              <td style={thTdStyle}>{m.nama}</td>
              <td style={thTdStyle}>{m.nim}</td>
              <td style={thTdStyle}>{m.sks}</td>
              <td style={thTdStyle}>
                <button
                  onClick={() => handleEdit(m)}
                  style={{ ...buttonStyle, backgroundColor: '#facc15' }}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#ef4444',
                    color: 'white',
                  }}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ margin: '0 5px' }}>
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => handlePageChange(idx + 1)}
            style={{
              margin: '0 3px',
              fontWeight: currentPage === idx + 1 ? 'bold' : 'normal',
            }}>
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ margin: '0 5px' }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Mahasiswa;
