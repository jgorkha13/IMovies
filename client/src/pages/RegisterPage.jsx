import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password, phone, role });
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
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
              <h3 className="text-light fw-bold mt-3 mb-1">Create Account</h3>
              <p className="text-secondary small">Join IMovies to book cinema seats seamlessly</p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle-fill"></i> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary shadow-none"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-dark text-light border-secondary shadow-none"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Phone Number (Optional)</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <input
                    type="tel"
                    className="form-control bg-dark text-light border-secondary shadow-none"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-secondary small">Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary shadow-none"
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary small">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary shadow-none"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small">Account Type</label>
                <select
                  className="form-select bg-dark text-light border-secondary shadow-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Regular Moviegoer (User)</option>
                  <option value="admin">Cinema Manager (Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-cinema-red w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-secondary small">Already have an account? </span>
              <Link to="/login" className="text-danger small fw-semibold text-decoration-none">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
