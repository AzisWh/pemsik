import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API = 'data/matakuliah.json';
const STORAGE_KEY = 'matakuliah_local';

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

export const useMataKuliah = () =>
  useQuery({
    queryKey: ['matakuliah'],
    queryFn: getLocalData,
  });

export const useCreateMataKuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const current = await getLocalData();
      const newEntry = { id: Date.now(), ...newData };
      const updated = [...current, newEntry];
      setLocalData(updated);
      return newEntry;
    },
    onSuccess: () => qc.invalidateQueries(['matakuliah']),
  });
};

export const useUpdateMataKuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const current = await getLocalData();
      const updated = current.map((mk) =>
        mk.id === id ? { ...mk, ...updatedData } : mk
      );
      setLocalData(updated);
      return { id, ...updatedData };
    },
    onSuccess: () => qc.invalidateQueries(['matakuliah']),
  });
};

export const useDeleteMataKuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const current = await getLocalData();
      const updated = current.filter((mk) => mk.id !== id);
      setLocalData(updated);
      return id;
    },
    onSuccess: () => qc.invalidateQueries(['matakuliah']),
  });
};
