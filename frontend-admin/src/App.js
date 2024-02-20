import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import { AuthProvider, AuthContext } from './context/AuthContext.js';

const ProtectRoute = ({ children }) => {
  const { authData } = useContext(AuthContext);
  if (!authData.token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const LoginRoute = () => {
  const { authData } = useContext(AuthContext);
  if (authData.token != null) {
    return <Navigate to="/project" replace />;  
  }
  return <Login />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<LoginRoute />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
