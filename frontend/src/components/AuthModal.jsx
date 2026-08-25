import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, Calendar, Heart } from 'lucide-react';

// Custom Crisp 3D Vector Icons
const UserAvatar3DIcon = () => (
  <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="36" r="20" fill="#ffffff" />
    <path d="M20 82 C20 62 34 52 50 52 C66 52 80 62 80 82 Z" fill="#ffffff" />
  </svg>
);

const PatientIconSVG = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#ffffff" : "#475569"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const DoctorIconSVG = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#ffffff" : "#475569"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M10 4h4"></path>
    <path d="M4 19v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"></path>
    <circle cx="12" cy="9" r="3"></circle>
    <path d="M8 14v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4"></path>
  </svg>
);

const PhoneOtpBadgeSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="14" height="20" rx="3" fill="#2563eb" />
    <rect x="7" y="5" width="10" height="12" rx="1" fill="#ffffff" opacity="0.9" />
    <rect x="9" y="7" width="2" height="2" rx="0.5" fill="#3b82f6" />
    <rect x="13" y="7" width="2" height="2" rx="0.5" fill="#3b82f6" />
    <rect x="9" y="10" width="2" height="2" rx="0.5" fill="#3b82f6" />
    <rect x="13" y="10" width="2" height="2" rx="0.5" fill="#3b82f6" />
    <circle cx="12" cy="19" r="1" fill="#ffffff" />
  </svg>
);

export default function AuthModal({ onLoginSuccess }) {
  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [useOtpMode, setUseOtpMode] = useState(false);
  const [hasLoggedInBefore, setHasLoggedInBefore] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has logged in before on this browser
    const previousLogin = localStorage.getItem('has_logged_in_before');
    if (previousLogin === 'true') {
      setHasLoggedInBefore(true);
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('has_logged_in_before', 'true');
      const user = {
        name: role === 'patient' ? (name || 'Rohan Das') : (name || 'Dr. Rajesh Sharma'),
        role: role,
        email: email || `${role}@medicare.health`,
        phone: phone,
        id: role === 'patient' ? 'pat-001' : 'doc-101',
        specialization: role === 'doctor' ? 'Cardiologist' : null
      };
      onLoginSuccess(user);
    }, 600);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('has_logged_in_before', 'true');
      const user = {
        name: role === 'patient' ? 'Rohan Das' : 'Dr. Rajesh Sharma',
        role: role,
        email: role === 'patient' ? 'rohan.das@gmail.com' : 'dr.rajesh.sharma@gmail.com',
        phone: '+91 98765 43210',
        id: role === 'patient' ? 'pat-001' : 'doc-101',
        avatar: role === 'doctor' ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' : null,
        specialization: role === 'doctor' ? 'Cardiologist' : null
      };
      onLoginSuccess(user);
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 500,
        background: 'linear-gradient(135deg, #eef2ff 0%, #e0f2fe 50%, #eff6ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
      }}
    >
      {/* Seamless Full-Width Background Curved Wave Graphic */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '50vh',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.85
        }}
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        <path fill="#2563eb" d="M0,500 L1000,500 L1000,320 C700,280 400,480 0,220 Z" opacity="0.15"></path>
        <path fill="#3b82f6" d="M0,500 L1000,500 L1000,360 C650,320 350,460 0,280 Z" opacity="0.3"></path>
        <path fill="#2563eb" d="M0,500 L1000,500 L1000,400 C600,350 300,480 0,330 Z" opacity="0.65"></path>
      </svg>

      {/* Main Split Layout Container */}
      <div
        style={{
          maxWidth: '1240px',
          width: '100%',
          maxHeight: '92vh',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '50px',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        {/* LEFT COLUMN: BRANDING & CONSULTATION GRAPHIC */}
        <div>
          {/* Top Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 88 C20 65 8 45 8 28 C8 15 18 6 31 6 C40 6 46 11 50 16 C54 11 60 6 69 6 C82 6 92 15 92 28 C92 45 80 65 50 88 Z" stroke="#2563eb" strokeWidth="7" fill="none" strokeLinejoin="round"/>
              <rect x="45" y="24" width="10" height="24" rx="3" fill="#2563eb"/>
              <rect x="38" y="31" width="24" height="10" rx="3" fill="#2563eb"/>
              <circle cx="22" cy="72" r="7" stroke="#2563eb" strokeWidth="4" fill="#ffffff"/>
              <circle cx="22" cy="72" r="3" fill="#2563eb"/>
              <path d="M22 65 C22 55 26 48 30 48" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" fill="none"/>
            </svg>

            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1d4ed8', margin: 0, lineHeight: 1, letterSpacing: '-0.5px' }}>MediCare</h3>
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, display: 'block', marginTop: '2px' }}>Your Health, Our Priority</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, marginBottom: '12px' }}>
            Doctor Patient <br />
            <span style={{ color: '#2563eb' }}>Appointment System</span>
          </h1>

          {/* Accent Line */}
          <div style={{ width: '60px', height: '4px', background: '#2563eb', borderRadius: '4px', marginBottom: '16px' }}></div>

          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.5, maxWidth: '460px', marginBottom: '28px' }}>
            Book appointments, manage schedules and access your health care easily.
          </p>

          {/* Doctor & Patient Illustration Card */}
          <div
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '18px 20px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 40px rgba(37, 99, 235, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '430px'
            }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
                alt="Doctor Consultation"
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                  <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} /> Easy Booking
                </span>
                <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                  <Heart size={12} style={{ display: 'inline', marginRight: '4px' }} /> 24/7 AI Triage
                </span>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>Verified Doctors Queue</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Instant AI symptom assessment and slot booking.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FITTED WHITE LOGIN CARD */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '36px 32px',
              boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.15)',
              border: '1px solid #f1f5f9',
              textAlign: 'center'
            }}
          >
            {/* Top User Icon Circle */}
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 12px auto',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.25)'
              }}
            >
              <UserAvatar3DIcon />
            </div>

            {/* Dynamic Welcome Heading: "Welcome!" for 1st time vs "Welcome Back!" for returning users */}
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
              {hasLoggedInBefore ? "Welcome Back!" : "Welcome!"}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '18px' }}>
              {hasLoggedInBefore ? "Login to your account to continue" : "Access or sign in to your health account"}
            </p>

            {/* Role Switcher */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                background: '#f8fafc',
                padding: '5px',
                borderRadius: '12px',
                marginBottom: '18px',
                border: '1px solid #e2e8f0'
              }}
            >
              <button
                type="button"
                onClick={() => setRole('patient')}
                style={{
                  background: role === 'patient' ? '#2563eb' : 'transparent',
                  color: role === 'patient' ? '#ffffff' : '#64748b',
                  fontWeight: 700,
                  padding: '9px',
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <PatientIconSVG active={role === 'patient'} /> Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                style={{
                  background: role === 'doctor' ? '#2563eb' : 'transparent',
                  color: role === 'doctor' ? '#ffffff' : '#64748b',
                  fontWeight: 700,
                  padding: '9px',
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <DoctorIconSVG active={role === 'doctor'} /> Doctor
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Input 1: Email / Mobile */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '5px' }}>
                  {useOtpMode ? "Mobile Phone Number" : "Email Address"}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={useOtpMode ? "tel" : "text"}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      borderRadius: '11px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder={useOtpMode ? "+91 98765 43210" : (role === 'patient' ? 'Enter your email' : 'Enter doctor email')}
                    value={useOtpMode ? phone : email}
                    onChange={e => useOtpMode ? setPhone(e.target.value) : setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Input 2: Password or OTP */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '5px' }}>
                  {useOtpMode ? "OTP Code (Demo: 123456)" : "Password"}
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={useOtpMode ? "text" : "password"}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      borderRadius: '11px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder={useOtpMode ? "123456" : "Enter your password"}
                    value={useOtpMode ? otp : password}
                    onChange={e => useOtpMode ? setOtp(e.target.value) : setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ borderRadius: '4px', accentColor: '#2563eb' }}
                  />
                  Remember me
                </label>
                <span
                  style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => alert("Password reset link sent to your registered contact!")}
                >
                  Forgot Password?
                </span>
              </div>

              {/* Primary Login Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 700,
                  padding: '13px',
                  borderRadius: '11px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
                  transition: 'all 0.2s ease',
                  marginTop: '2px'
                }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : <><LogIn size={18} /> Login</>}
              </button>

            </form>

            {/* Social Logins Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0 14px 0', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
              <span>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
            </div>

            {/* Social Buttons: Google & Mobile Phone Badge */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#1e293b',
                  fontWeight: 600,
                  padding: '9px 10px',
                  borderRadius: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => setUseOtpMode(!useOtpMode)}
                style={{
                  background: useOtpMode ? '#eff6ff' : '#ffffff',
                  border: useOtpMode ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  color: useOtpMode ? '#2563eb' : '#1e293b',
                  fontWeight: 600,
                  padding: '9px 10px',
                  borderRadius: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <PhoneOtpBadgeSVG />
                Mobile OTP Login
              </button>
            </div>

            {/* Footer Sign Up Link */}
            <div style={{ marginTop: '20px', fontSize: '0.82rem', color: '#64748b' }}>
              Don't have an account? <span style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }} onClick={() => alert("Select Patient or Doctor and click Login to create your account!")}>Sign up</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
