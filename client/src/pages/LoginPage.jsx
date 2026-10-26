import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
    setLoading(true);

    try {
      await login(demoEmail, demoPassword);
      navigate(redirect);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card-dark p-4 p-md-5 shadow-lg">
            <div className="text-center mb-4">
              <span className="bg-danger text-white rounded-3 px-3 py-1 fs-4 fw-bold brand-font">
                <i className="bi bi-film me-1"></i> I-MOVIES
              </span>
              <h3 className="text-light fw-bold mt-3 mb-1">Welcome Back</h3>
              <p className="text-secondary small">Sign in to book tickets and manage your reservations</p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle-fill"></i> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-dark text-light border-secondary shadow-none"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-secondary small mb-0">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-key"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary shadow-none"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-cinema-red w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Sign In'}
              </button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="mt-4 pt-3 border-top border-secondary text-center">
              <span className="text-secondary small d-block mb-2">Fast 1-Click Demo Evaluation:</span>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('user@imovies.com', 'user123')}
                  className="btn btn-outline-secondary btn-sm flex-fill text-light"
                >
                  <i className="bi bi-person me-1 text-info"></i> Demo User
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@imovies.com', 'admin123')}
                  className="btn btn-outline-warning btn-sm flex-fill"
                >
                  <i className="bi bi-shield-check me-1 text-warning"></i> Demo Admin
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <span className="text-secondary small">Don't have an account? </span>
              <Link to="/register" className="text-danger small fw-semibold text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
