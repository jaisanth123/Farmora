import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/firebase/Login';
import Register from './components/firebase/Register';
import FarmerRegistrationForm from './components/FarmerRegistrationForm';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/form" element={<FarmerRegistrationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
