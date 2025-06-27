import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API = '/data/dosen.json';
const STORAGE_KEY = 'dosen_local';

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

export const useDosen = () =>
  useQuery({
    queryKey: ['dosen'],
    queryFn: getLocalData,
  });

let dummyDosen = [];

export const useCreateDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const current = await getLocalData();
      const newEntry = { id: Date.now(), ...newData };
      const updated = [...current, newEntry];
      setLocalData(updated);
      return newEntry;
    },
    onSuccess: () => qc.invalidateQueries(['dosen']),
  });
};

export const useUpdateDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const current = await getLocalData();
      const updated = current.map((d) =>
        d.id === id ? { ...d, ...updatedData } : d
      );
      setLocalData(updated);
      return { id, ...updatedData };
    },
    onSuccess: () => qc.invalidateQueries(['dosen']),
  });
};

export const useDeleteDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const current = await getLocalData();
      const updated = current.filter((d) => d.id !== id);
      setLocalData(updated);
      return id;
    },
    onSuccess: () => qc.invalidateQueries(['dosen']),
  });
};
