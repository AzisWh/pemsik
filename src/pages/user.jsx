import React, { useState } from "react";

const dummyUsers = [
  { id: 1, name: "Adel", email: "adel@gmail.com", role: "admin" },
  { id: 2, name: "Rizky", email: "rizky@gmail.com", role: "user" },
  { id: 3, name: "Salsa", email: "salsa@gmail.com", role: "user" },
];

const User = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [selected, setSelected] = useState(null);

  const handleEdit = (user) => {
    setSelected({ ...user });
  };

  const handleChange = (e) => {
    setSelected({ ...selected, role: e.target.value });
  };

  const handleSave = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === selected.id ? selected : u))
    );
    setSelected(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Manajemen User</h1>

      <table className="w-full border shadow-sm rounded overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Role</th>
            <th className="py-2 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4 capitalize">{user.role}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="mt-6 p-4 bg-white shadow rounded border">
          <h2 className="text-lg font-semibold mb-3">Edit Role: {selected.name}</h2>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Role</label>
            <select
              value={selected.role}
              onChange={handleChange}
              className="border rounded w-full p-2"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              onClick={() => setSelected(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
