// src/components/Login.jsx - WITH ADMIN SETUP BUTTON
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../backend/context/AuthContext";
import { createAdminAccount } from "../utils/createAdmin";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else {
        setError("Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSetup = async () => {
    if (!window.confirm('Create admin account?\n\nEmail: onlyinstrumentals365@gmail.com\nPassword: admin123\n\nThis is a ONE-TIME setup.')) {
      return;
    }

    try {
      setSetupLoading(true);
      setError("");
      
      const result = await createAdminAccount();
      
      if (result.success) {
        alert(
          '✅ Admin Account Created!\n\n' +
          `Email: ${result.credentials.email}\n` +
          `Password: ${result.credentials.password}\n` +
          `Username: ${result.credentials.username}\n` +
          `Role: ${result.credentials.role}\n\n` +
          'You can now login with these credentials.'
        );
        
        // Pre-fill login form
        setEmail(result.credentials.email);
        setPassword(result.credentials.password);
        setShowAdminSetup(false);
      } else if (result.existing) {
        alert('⚠️ Admin account already exists!\n\nPlease login with:\nEmail: onlyinstrumentals365@gmail.com\nPassword: admin123');
        setEmail('onlyinstrumentals365@gmail.com');
        setPassword('admin123');
      } else {
        setError(result.error || 'Failed to create admin account');
      }
    } catch (err) {
      console.error('Setup error:', err);
      setError('Failed to create admin account: ' + err.message);
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>SkillDuels</h1>
          <h2>Welcome Back</h2>
          <p>Log in to continue your battle journey</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>

        {/* ADMIN SETUP SECTION - REMOVE AFTER FIRST USE */}
        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center' 
        }}>
          {!showAdminSetup ? (
            <button
              onClick={() => setShowAdminSetup(true)}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                color: '#9ca3af',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#dc2626';
                e.target.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.color = '#9ca3af';
              }}
            >
              🔧 First Time Setup?
            </button>
          ) : (
            <div style={{
              padding: '1rem',
              background: 'rgba(220, 38, 38, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(220, 38, 38, 0.3)'
            }}>
              <p style={{ 
                color: '#fca5a5', 
                fontSize: '0.875rem', 
                marginBottom: '0.75rem',
                fontWeight: '500'
              }}>
                🛡️ Create Admin Account
              </p>
              <p style={{ 
                color: '#9ca3af', 
                fontSize: '0.75rem', 
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                This will create an admin account with:<br/>
                Email: onlyinstrumentals365@gmail.com<br/>
                Username: admin<br/>
                Password: admin123
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  onClick={handleAdminSetup}
                  disabled={setupLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: setupLoading ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    opacity: setupLoading ? 0.5 : 1
                  }}
                >
                  {setupLoading ? 'Creating...' : 'Create Admin'}
                </button>
                <button
                  onClick={() => setShowAdminSetup(false)}
                  disabled={setupLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    color: '#9ca3af',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        {/* END ADMIN SETUP SECTION */}
      </div>
    </div>
  );
};

export default Login;