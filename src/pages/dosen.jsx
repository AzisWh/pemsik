import React, { useState, useEffect } from 'react';
import {
  useDosen,
  useCreateDosen,
  useUpdateDosen,
  useDeleteDosen,
} from '../utils/apiDosen';

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

const Dosen = () => {
  const { data: dosens = [], isLoading } = useDosen();
  const create = useCreateDosen();
  const update = useUpdateDosen();
  const remove = useDeleteDosen();

  const [form, setForm] = useState({ id: null, nama: '', nip: '' });
  const [isEdit, setIsEdit] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(dosens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = dosens.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nama: form.nama,
      nip: form.nip,
    };

    if (isEdit && form.id) {
      update.mutate({ id: form.id, nama: form.nama, nip: form.nip });
    } else {
      create.mutate(payload);
    }
    setForm({ id: null, nama: '', nip: '' });
    setIsEdit(false);
  };

  const handleEdit = (d) => {
    setForm({ id: d.id, nama: d.nama, nip: d.nip });
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    remove.mutate(id);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h1 className="mb-6 text-2xl font-bold">Manajemen Dosen</h1>

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
          <label className="block mb-1 font-medium">NIP</label>
          <input
            type="text"
            placeholder="NIP"
            value={form.nip}
            onChange={(e) => setForm({ ...form, nip: e.target.value })}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '10px',
              padding: '8px',
            }}
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
            <th style={{ ...thTdStyle, ...headerStyle }}>NIP</th>
            <th style={{ ...thTdStyle, ...headerStyle }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((d) => (
            <tr key={d.id}>
              <td style={thTdStyle}>{d.nama}</td>
              <td style={thTdStyle}>{d.nip}</td>
              <td style={thTdStyle}>
                <button
                  onClick={() => handleEdit(d)}
                  style={{ ...buttonStyle, backgroundColor: '#facc15' }}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
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

export default Dosen;
