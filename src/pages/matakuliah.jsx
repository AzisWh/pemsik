import React, { useState, useEffect } from 'react';
import {
  useMataKuliah,
  useCreateMataKuliah,
  useUpdateMataKuliah,
  useDeleteMataKuliah,
} from '../utils/apimatakuliah';

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

const MataKuliah = () => {
  const { data: matkuls = [], isLoading } = useMataKuliah();
  const create = useCreateMataKuliah();
  const update = useUpdateMataKuliah();
  const remove = useDeleteMataKuliah();

  const [form, setForm] = useState({ kode: '', nama: '' });
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(matkuls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = matkuls.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      update.mutate({ id: editId, ...form });
    } else {
      create.mutate(form);
    }
    setForm({ kode: '', nama: '' });
    setEditId(null);
  };

  const handleEdit = (mk) => {
    setForm({ kode: mk.kode, nama: mk.nama });
    setEditId(mk.id);
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h1>Kelola MatKul</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Kode MK"
          value={form.kode}
          onChange={(e) => setForm({ ...form, kode: e.target.value })}
          required
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '10px',
            padding: '8px',
          }}
        />
        <input
          type="text"
          placeholder="Nama Mata Kuliah"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          required
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '10px',
            padding: '8px',
          }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          {editId ? 'Update' : 'Simpan'}
        </button>
      </form>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thTdStyle, ...headerStyle }}>Kode Matkul</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>Nama Matkul</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((mk) => (
            <tr key={mk.id}>
              <td style={thTdStyle}>{mk.kode}</td>
              <td style={thTdStyle}>{mk.nama}</td>
              <td style={thTdStyle}>
                <button
                  onClick={() => handleEdit(mk)}
                  style={{ ...buttonStyle, backgroundColor: '#facc15' }}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mk.id)}
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

export default MataKuliah;
