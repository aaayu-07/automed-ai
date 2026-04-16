import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PredictDiabetes from './pages/PredictDiabetes';
import PredictLifestyle from './pages/PredictLifestyle';
import Research from './pages/Research';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Contact from './pages/Contact';
import About from './pages/About';
import Privacy from './pages/Privacy';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/research" element={<Research />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/predict/diabetes" element={<PredictDiabetes />} />
          <Route path="/predict/lifestyle" element={<PredictLifestyle />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
