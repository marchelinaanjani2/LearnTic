import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import dewanspaceLogo from '../assets/dewanspace-logo.png';
import '../styles/login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email or Username dan password harus diisi');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Email or Username atau password salah');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="logo-container">
          <img src={dewanspaceLogo} alt="Dewanspace Logo" className="logo" />
        </div>
        
        <h2 className="login-title">Sign in to your account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address or Username</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or Username "
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-input"
            />
          </div>
          
          <button type="submit" className="submit-button">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;