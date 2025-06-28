import React from 'react';
import { useDosen } from '../utils/apidosen';
import { useMahasiswa } from '../utils/apimahasiswa';
import { useMataKuliah } from '../utils/apimatakuliah';
import { useKelas } from '../utils/apikelas';

export const Dashboard = () => {
  const { data: mahasiswa = [] } = useMahasiswa();
  const { data: dosen = [] } = useDosen();
  const { data: matkul = [] } = useMataKuliah();
  const { data: kelas = [] } = useKelas();

  const data = [
    { label: 'Mahasiswa', value: mahasiswa.length, color: '#3b82f6' },
    { label: 'Dosen', value: dosen.length, color: '#10b981' },
    { label: 'Mata Kuliah', value: matkul.length, color: '#f59e0b' },
    { label: 'Kelas', value: kelas.length, color: '#ef4444' },
  ];

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ padding: '24px' }}>
      <h1
        style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        Dashboard
      </h1>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div
          style={{
            flex: '1 1 300px',
            border: '1px solid #ccc',
            padding: '16px',
            borderRadius: '8px',
          }}>
          <h3 style={{ marginBottom: '12px' }}>Horizontal Bar Chart</h3>
          {data.map((item) => (
            <div key={item.label} style={{ marginBottom: '12px' }}>
              <div>
                {item.label}: {item.value}
              </div>
              <div
                style={{
                  background: '#eee',
                  height: '20px',
                  borderRadius: '4px',
                }}>
                <div
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    background: item.color,
                    height: '100%',
                    borderRadius: '4px',
                  }}></div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            flex: '1 1 300px',
            border: '1px solid #ccc',
            padding: '16px',
            borderRadius: '8px',
          }}>
          <h3 style={{ marginBottom: '12px', textAlign: 'center' }}>
            Vertical Bar Chart
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              height: '200px',
              gap: '12px',
            }}>
            {data.map((item) => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '40px',
                    height: `${(item.value / maxValue) * 100}%`,
                    background: item.color,
                    borderRadius: '4px',
                  }}></div>
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Ring Display (Fake Doughnut/Pie Info) */}
        <div
          style={{
            flex: '1 1 300px',
            border: '1px solid #ccc',
            padding: '16px',
            borderRadius: '8px',
          }}>
          <h3 style={{ marginBottom: '12px' }}>Data Summary</h3>
          <ul>
            {data.map((item) => (
              <li key={item.label} style={{ marginBottom: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    backgroundColor: item.color,
                    borderRadius: '50%',
                    marginRight: '8px',
                  }}></span>
                {item.label}: {item.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
