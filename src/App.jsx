import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dosen from './pages/dosen';
import MataKuliah from './pages/matakuliah';
import Register from './pages/Register';
import User from './pages/User';
import Kelas from './pages/kelas';
import Mahasiswa from './pages/mahasiswa';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <nav
        style={{
          padding: '10px',
          marginBottom: '20px',
          borderBottom: '1px solid gray',
        }}>
        <Link to="/" style={{ marginRight: '10px' }}>
          Dashboard
        </Link>
        <Link to="/dosen" style={{ marginRight: '10px' }}>
          Dosen
        </Link>
        <Link to="/mata-kuliah" style={{ marginRight: '10px' }}>
          Mata Kuliah
        </Link>
        <Link to="/user" style={{ marginRight: '10px' }}>
          User
        </Link>
        <Link to="/kelas" style={{ marginRight: '10px' }}>
          Kelas
        </Link>
        <Link to="/mahasiswa" style={{ marginRight: '10px' }}>
          Mahasiswa
        </Link>
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dosen" element={<Dosen />} />
        <Route path="/mata-kuliah" element={<MataKuliah />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/kelas" element={<Kelas />} />
        <Route path="/mahasiswa" element={<Mahasiswa />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
