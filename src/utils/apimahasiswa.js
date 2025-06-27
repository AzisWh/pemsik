import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API = '/data/mahasiswa.json';
const STORAGE_KEY = 'mahasiswa_local';

// Ambil dari localStorage, jika tidak ada ambil dari file JSON
const getLocalData = async () => {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) return JSON.parse(local);

  const res = await axios.get(API);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
  return res.data;
};

const setLocalData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// GET
export const useMahasiswa = () =>
  useQuery({
    queryKey: ['mahasiswa'],
    queryFn: getLocalData,
  });

export const useCreateMahasiswa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const current = await getLocalData();
      const newEntry = { id: Date.now(), ...newData };
      const updated = [...current, newEntry];
      setLocalData(updated);
      return newEntry;
    },
    onSuccess: () => qc.invalidateQueries(['mahasiswa']),
  });
};

export const useUpdateMahasiswa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const current = await getLocalData();
      const updated = current.map((m) =>
        m.id === id ? { ...m, ...updatedData } : m
      );
      setLocalData(updated);
      return { id, ...updatedData };
    },
    onSuccess: () => qc.invalidateQueries(['mahasiswa']),
  });
};

export const useDeleteMahasiswa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const current = await getLocalData();
      const updated = current.filter((m) => m.id !== id);
      setLocalData(updated);
      return id;
    },
    onSuccess: () => qc.invalidateQueries(['mahasiswa']),
  });
};
