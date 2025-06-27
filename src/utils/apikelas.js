import axios from 'axios';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API = '/data/kelas.json';
const STORAGE_KEY = 'kelas_local';

const getLocalData = async () => {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) return JSON.parse(local);

  try {
    const res = await axios.get(API);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    console.error('Gagal load data dari JSON:', err);
    return [];
  }
};

const setLocalData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const useKelas = () =>
  useQuery({
    queryKey: ['kelas'],
    queryFn: getLocalData,
  });

export const useCreateKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const current = await getLocalData();

      const isDuplicate = current.some(
        (k) => k.mataKuliahId === newData.mataKuliahId
      );
      if (isDuplicate) {
        throw new Swal.fire('Mata kuliah sudah diajar oleh dosen lain.');
      }

      const newEntry = {
        id: Date.now(),
        ...newData,
      };

      const updated = [...current, newEntry];
      setLocalData(updated);
      return newEntry;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kelas'] });
      Swal.fire('Kelas berhasil ditambahkan!');
    },
    onError: (error) => {
      Swal.fire(error.message || 'Gagal menambahkan kelas.');
    },
  });
};

export const useUpdateKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const current = await getLocalData();
      const updated = current.map((kelas) =>
        kelas.id === id ? { ...kelas, ...updatedData } : kelas
      );
      setLocalData(updated);
      return { id, ...updatedData };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kelas'] });
      Swal.fire('Kelas berhasil diperbarui!');
    },
    onError: () => {
      Swal.fire('Gagal memperbarui kelas.');
    },
  });
};

export const useDeleteKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const current = await getLocalData();
      const updated = current.filter((kelas) => kelas.id !== id);
      setLocalData(updated);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kelas'] });
      Swal.fire('Kelas berhasil dihapus!');
    },
    onError: () => {
      Swal.fire('Gagal menghapus kelas.');
    },
  });
};
