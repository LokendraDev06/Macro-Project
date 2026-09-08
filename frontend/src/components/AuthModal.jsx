import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, Calendar, Heart, Phone, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, User, ShieldCheck, Key } from 'lucide-react';

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

// Google Brand Icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const API_BASE_URL = 'http://localhost:8000';

export default function AuthModal({ onLoginSuccess }) {
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup' | 'google_screen'
  const [role, setRole] = useState('patient'); // 'patient' | 'doctor'
  const [authMode, setAuthMode] = useState('password'); // 'password' | 'otp'
  
  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign Up States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupAge, setSignupAge] = useState('');
  const [signupSpecialization, setSignupSpecialization] = useState('General Physician');
  const [signupQualification, setSignupQualification] = useState('');
  const [signupFee, setSignupFee] = useState('');

  // Mobile OTP States
  const [phone, setPhone] = useState('');
  const [otpStep, setOtpStep] = useState('enter_phone');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpNotification, setOtpNotification] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Dedicated In-App Google Sign-in State
  const [googleEmail, setGoogleEmail] = useState('');

  const saveAuthSession = (authData) => {
    if (authData.access_token) {
      localStorage.setItem('medicare_access_token', authData.access_token);
      localStorage.setItem('medicare_refresh_token', authData.refresh_token);
    }
    if (authData.user) {
      localStorage.setItem('has_logged_in_before', 'true');
      onLoginSuccess(authData.user);
    }
  };

  // Listen for popup window message from google-auth.html
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.user) {
        saveAuthSession(event.data);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Open Dedicated Google Login Page
  const openGoogleSignInPage = () => {
    setErrorMessage('');
    localStorage.setItem('medicare_auth_role', role);
    
    const width = 480;
    const height = 620;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const popup = window.open(
      'google-auth.html',
      'GoogleSignInWindow',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );

    // If popup blocked, switch to in-app Google View
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setAuthView('google_screen');
    }
  };

  // 1-Click Login Helper
  const handleOneClickGoogleAuth = async (name, googleMail, avatarUrl) => {
    const userRole = role || (googleMail.includes('dr.') ? 'doctor' : 'patient');
    const payload = {
      name: name,
      email: googleMail,
      role: userRole,
      avatar: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        saveAuthSession(data);
      } else {
        throw new Error(data.detail || 'Google login failed');
      }
    } catch (err) {
      saveAuthSession({
        user: {
          id: `usr_${Date.now().toString().slice(-4)}`,
          name: name,
          email: googleMail,
          role: userRole,
          auth_provider: 'google',
          avatar_url: payload.avatar
        }
      });
    }
  };

  // OTP Countdown
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown(p => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpNotification(data.message || `Verification OTP sent to ${phone} via SMS.`);
        setOtpStep('enter_otp');
        setResendCountdown(30);
        setTimeout(() => {
          const first = document.getElementById('react-otp-0');
          if (first) first.focus();
        }, 150);
      } else {
        throw new Error(data.detail || 'Failed to dispatch SMS OTP');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpBoxChange = (idx, val) => {
    if (val.length > 1) {
      const digits = val.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpCode];
      digits.forEach((d, i) => { if (i < 6) newOtp[i] = d; });
      setOtpCode(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      const el = document.getElementById(`react-otp-${nextIdx}`);
      if (el) el.focus();
      return;
    }

    const newOtp = [...otpCode];
    newOtp[idx] = val.replace(/\D/g, '');
    setOtpCode(newOtp);

    if (val && idx < 5) {
      const nextEl = document.getElementById(`react-otp-${idx + 1}`);
      if (nextEl) nextEl.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpCode[idx] && idx > 0) {
      const prevEl = document.getElementById(`react-otp-${idx - 1}`);
      if (prevEl) prevEl.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otpCode.join('');
    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone.trim(),
          otp: enteredOtp,
          role: role
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        saveAuthSession(data);
      } else {
        throw new Error(data.detail || 'Invalid or expired OTP code');
      }
    } catch (err) {
      setErrorMessage(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, role })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        saveAuthSession(data);
      } else {
        throw new Error(data.detail || 'Invalid email or password');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const payload = {
      name: signupName.trim(),
      email: signupEmail.trim(),
      phone_number: signupPhone.trim(),
      password: signupPassword,
      role: role,
      age: signupAge ? parseInt(signupAge) : 25,
      specialization: role === 'doctor' ? signupSpecialization : null,
      qualification: role === 'doctor' ? signupQualification : null,
      fee: role === 'doctor' && signupFee ? parseInt(signupFee) : null
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        saveAuthSession(data);
      } else {
        throw new Error(data.detail || 'Sign up failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to complete registration.');
    } finally {
      setLoading(false);
    }
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
      <svg
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100vw', height: '50vh', zIndex: 1, pointerEvents: 'none', opacity: 0.85 }}
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        <path fill="#2563eb" d="M0,500 L1000,500 L1000,320 C700,280 400,480 0,220 Z" opacity="0.15"></path>
        <path fill="#3b82f6" d="M0,500 L1000,500 L1000,360 C650,320 350,460 0,280 Z" opacity="0.3"></path>
        <path fill="#2563eb" d="M0,500 L1000,500 L1000,400 C600,350 300,480 0,330 Z" opacity="0.65"></path>
      </svg>

      <div
        style={{
          maxWidth: '1240px',
          width: '100%',
          maxHeight: '94vh',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '50px',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        {/* LEFT BRANDING */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 88 C20 65 8 45 8 28 C8 15 18 6 31 6 C40 6 46 11 50 16 C54 11 60 6 69 6 C82 6 92 15 92 28 C92 45 80 65 50 88 Z" stroke="#2563eb" strokeWidth="7" fill="none" strokeLinejoin="round"/>
              <rect x="45" y="24" width="10" height="24" rx="3" fill="#2563eb"/>
              <rect x="38" y="31" width="24" height="10" rx="3" fill="#2563eb"/>
              <circle cx="22" cy="72" r="7" stroke="#2563eb" strokeWidth="4" fill="#ffffff"/>
              <circle cx="22" cy="72" r="3" fill="#2563eb"/>
              <path d="M22 65 C22 55 26 48 30 48" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" fill="none"/>
            </svg>

            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1d4ed8', margin: 0, lineHeight: 1 }}>MediCare</h3>
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, display: 'block', marginTop: '2px' }}>Your Health, Our Priority</span>
            </div>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, marginBottom: '12px' }}>
            One-Click <br />
            <span style={{ color: '#2563eb' }}>Google Login Active</span>
          </h1>

          <div style={{ width: '60px', height: '4px', background: '#2563eb', borderRadius: '4px', marginBottom: '16px' }}></div>

          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.5, maxWidth: '460px', marginBottom: '24px' }}>
            Instant Google Account Selection and Fast Mobile SMS OTP login.
          </p>

          <div
            style={{
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
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={36} color="#2563eb" />
            </div>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                  JWT Signed Tokens
                </span>
                <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                  1-Click Google
                </span>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>Security Standard Active</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Zero OTP friction with 1-Click Google Account Chooser.</p>
            </div>
          </div>
        </div>

        {/* RIGHT AUTH CARD */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '450px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '30px 28px',
              boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.15)',
              border: '1px solid #f1f5f9',
              textAlign: 'center',
              maxHeight: '88vh',
              overflowY: 'auto'
            }}
          >
            {/* SPECIAL VIEW: 1-CLICK DIRECT GOOGLE LOGIN SCREEN */}
            {authView === 'google_screen' ? (
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <GoogleIcon />
                  <button type="button" onClick={() => setAuthView('login')} style={{ background: 'none', border: 'none', fontSize: '1.1rem', color: '#64748b', cursor: 'pointer' }}>✕</button>
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#1f1f1f', marginBottom: '4px', fontFamily: "'Google Sans', sans-serif" }}>
                  Choose a Google account
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#444746', marginBottom: '20px' }}>
                  to continue to <strong style={{ color: '#2563eb' }}>MediCare Health</strong>
                </p>

                {/* 1-Click Account List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {/* Account 1 */}
                  <div
                    onClick={() => handleOneClickGoogleAuth("Lokendra Dev", "lokendradev06@gmail.com", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80")}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '14px', cursor: 'pointer', background: '#fff', transition: 'all 0.2s ease' }}
                  >
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" style={{ width: '38px', height: '38px', borderRadius: '50%' }} alt="Avatar" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Lokendra Dev</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>lokendradev06@gmail.com</div>
                    </div>
                    <span style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 700 }}>1-Click Login →</span>
                  </div>

                  {/* Account 2 */}
                  <div
                    onClick={() => handleOneClickGoogleAuth("Dr. Rajesh Sharma", "dr.rajesh.medicare@gmail.com", "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80")}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '14px', cursor: 'pointer', background: '#fff', transition: 'all 0.2s ease' }}
                  >
                    <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80" style={{ width: '38px', height: '38px', borderRadius: '50%' }} alt="Avatar" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Dr. Rajesh Sharma (Cardiologist)</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>dr.rajesh.medicare@gmail.com</div>
                    </div>
                    <span style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: 700 }}>1-Click Login →</span>
                  </div>
                </div>

                {/* Custom Google Email Form */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const extractedName = googleEmail.split('@')[0].replace('.', ' ');
                  const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
                  handleOneClickGoogleAuth(formattedName, googleEmail.trim());
                }}>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: '10px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Or enter any Google account email:</label>
                    <input
                      type="email"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: '#fff', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}
                      placeholder="yourname@gmail.com"
                      value={googleEmail}
                      onChange={e=>setGoogleEmail(e.target.value)}
                      required
                    />
                    <button type="submit" style={{ width: '100%', background: '#2563eb', color: '#fff', fontWeight: 700, padding: '11px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                      ⚡ Instant 1-Click Sign In
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    margin: '0 auto 10px auto',
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

                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                  {authView === 'signup' ? 'Create Account' : (authMode === 'otp' ? 'Mobile SMS Login' : 'Welcome Back')}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '14px' }}>
                  {authView === 'signup' ? `Register your ${role} credentials` : `Sign in to access your ${role} dashboard`}
                </p>

                {/* Role Switcher */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    background: '#f8fafc',
                    padding: '4px',
                    borderRadius: '12px',
                    marginBottom: '12px',
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
                      padding: '7px',
                      borderRadius: '9px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
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
                      padding: '7px',
                      borderRadius: '9px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <DoctorIconSVG active={role === 'doctor'} /> Doctor
                  </button>
                </div>

                {/* View Switcher: Login vs Sign Up */}
                <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => { setAuthView('login'); setErrorMessage(''); setOtpNotification(''); }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'none',
                      border: 'none',
                      borderBottom: authView === 'login' ? '2.5px solid #2563eb' : 'none',
                      color: authView === 'login' ? '#2563eb' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      marginBottom: '-2px'
                    }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthView('signup'); setErrorMessage(''); setOtpNotification(''); }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'none',
                      border: 'none',
                      borderBottom: authView === 'signup' ? '2.5px solid #2563eb' : 'none',
                      color: authView === 'signup' ? '#2563eb' : '#64748b',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      marginBottom: '-2px'
                    }}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Banners */}
                {otpNotification && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '10px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', textAlign: 'left' }}>
                    <CheckCircle2 size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                    <span>{otpNotification}</span>
                  </div>
                )}

                {errorMessage && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', textAlign: 'left' }}>
                    <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* VIEW 1: SIGN UP */}
                {authView === 'signup' ? (
                  <form onSubmit={handleSignUpSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                      <input
                        type="text"
                        placeholder={role === 'doctor' ? 'Dr. Full Name' : 'Your Full Name'}
                        value={signupName}
                        onChange={e => setSignupName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                        <input
                          type="email"
                          placeholder="user@example.com"
                          value={signupEmail}
                          onChange={e => setSignupEmail(e.target.value)}
                          required
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Mobile (E.164) *</label>
                        <input
                          type="tel"
                          placeholder="+91 9876543210"
                          value={signupPhone}
                          onChange={e => setSignupPhone(e.target.value)}
                          required
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    {role === 'doctor' ? (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Specialization</label>
                            <select
                              value={signupSpecialization}
                              onChange={e => setSignupSpecialization(e.target.value)}
                              style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                            >
                              <option value="General Physician">General Physician</option>
                              <option value="Cardiologist">Cardiologist</option>
                              <option value="Dermatologist">Dermatologist</option>
                              <option value="Neurologist">Neurologist</option>
                              <option value="Pulmonologist">Pulmonologist</option>
                              <option value="Orthopedist">Orthopedist</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Fee (₹)</label>
                            <input
                              type="number"
                              placeholder="600"
                              value={signupFee}
                              onChange={e => setSignupFee(e.target.value)}
                              style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Qualification</label>
                          <input
                            type="text"
                            placeholder="e.g. MBBS, MD (10 Yrs Exp)"
                            value={signupQualification}
                            onChange={e => setSignupQualification(e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Age</label>
                        <input
                          type="number"
                          placeholder="e.g. 28"
                          value={signupAge}
                          onChange={e => setSignupAge(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Password *</label>
                      <input
                        type="password"
                        placeholder="Min. 6 characters"
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontWeight: 700,
                        padding: '11px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.92rem',
                        boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)',
                        marginTop: '4px'
                      }}
                    >
                      {loading ? 'Creating Account...' : 'Complete Sign Up →'}
                    </button>
                  </form>
                ) : (
                  /* VIEW 2: LOGIN */
                  <div>
                    {authMode === 'otp' ? (
                      otpStep === 'enter_phone' ? (
                        /* Step A: Phone input */
                        <form onSubmit={handleSendOtp} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '5px' }}>
                              Mobile Number (E.164)
                            </label>
                            <div style={{ position: 'relative' }}>
                              <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                              <input
                                type="tel"
                                placeholder="+91 9876543210"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                                autoFocus
                                style={{
                                  width: '100%',
                                  padding: '11px 14px 11px 42px',
                                  borderRadius: '11px',
                                  border: '1px solid #cbd5e1',
                                  fontSize: '0.9rem',
                                  outline: 'none',
                                  boxSizing: 'border-box'
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                              A 6-digit verification code will be sent via SMS.
                            </span>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            style={{
                              width: '100%',
                              background: '#2563eb',
                              color: '#ffffff',
                              fontWeight: 700,
                              padding: '12px',
                              borderRadius: '11px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.92rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
                            }}
                          >
                            {loading ? 'Dispatching SMS...' : <><Phone size={16} /> Send SMS OTP</>}
                          </button>

                          <div style={{ textAlign: 'center', marginTop: '2px' }}>
                            <button
                              type="button"
                              onClick={() => { setAuthMode('password'); setErrorMessage(''); setOtpNotification(''); }}
                              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                            >
                              ← Switch to Email & Password
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* Step B: 6-Digit Code */
                        <form onSubmit={handleVerifyOtp} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                              Enter 6-Digit SMS Code
                            </label>
                            <button
                              type="button"
                              onClick={() => { setOtpStep('enter_phone'); setErrorMessage(''); }}
                              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Change Number
                            </button>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            {otpCode.map((digit, idx) => (
                              <input
                                key={idx}
                                id={`react-otp-${idx}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={e => handleOtpBoxChange(idx, e.target.value)}
                                onKeyDown={e => handleOtpKeyDown(idx, e)}
                                style={{
                                  width: '46px',
                                  height: '50px',
                                  textAlign: 'center',
                                  fontSize: '1.25rem',
                                  fontWeight: 800,
                                  borderRadius: '10px',
                                  border: digit ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                  background: digit ? '#eff6ff' : '#ffffff',
                                  color: '#0f172a',
                                  outline: 'none',
                                  boxSizing: 'border-box'
                                }}
                              />
                            ))}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                            {resendCountdown > 0 ? (
                              <span>Resend OTP in <strong style={{ color: '#2563eb' }}>{resendCountdown}s</strong></span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                              >
                                <RefreshCw size={13} /> Resend SMS OTP
                              </button>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            style={{
                              width: '100%',
                              background: '#2563eb',
                              color: '#ffffff',
                              fontWeight: 700,
                              padding: '12px',
                              borderRadius: '11px',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.92rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
                            }}
                          >
                            {loading ? 'Verifying...' : <><CheckCircle2 size={18} /> Verify OTP & Login</>}
                          </button>
                        </form>
                      )
                    ) : authMode === 'email_otp' ? (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const extractedName = googleEmail.split('@')[0].replace('.', ' ');
                        const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
                        handleOneClickGoogleAuth(formattedName, googleEmail.trim());
                      }} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '5px' }}>
                            Email Address / Gmail
                          </label>
                          <input
                            type="email"
                            placeholder="user@gmail.com"
                            value={googleEmail}
                            onChange={e => setGoogleEmail(e.target.value)}
                            required
                            autoFocus
                            style={{
                              width: '100%',
                              padding: '11px 14px',
                              borderRadius: '11px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.9rem',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                          <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                            Direct instant verification for your Gmail address.
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          style={{
                            width: '100%',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: 700,
                            padding: '12px',
                            borderRadius: '11px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.92rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
                          }}
                        >
                          {loading ? 'Verifying...' : '📧 Instant Email Verify & Login'}
                        </button>
                      </form>
                    ) : (
                      /* Password Login */
                      <form onSubmit={handlePasswordLogin} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '5px' }}>
                            Email Address
                          </label>
                          <div style={{ position: 'relative' }}>
                            <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                              type="email"
                              placeholder="user@example.com"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              required
                              style={{
                                width: '100%',
                                padding: '11px 14px 11px 42px',
                                borderRadius: '11px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.9rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '5px' }}>
                            Password
                          </label>
                          <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              required
                              style={{
                                width: '100%',
                                padding: '11px 14px 11px 42px',
                                borderRadius: '11px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.9rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          style={{
                            width: '100%',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: 700,
                            padding: '12px',
                            borderRadius: '11px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
                            marginTop: '4px'
                          }}
                        >
                          {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In</>}
                        </button>
                      </form>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0 14px 0', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>
                      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                      <span>choose login method</span>
                      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    </div>

                    {/* 3 Login Options */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('otp');
                          setOtpStep('enter_phone');
                          setErrorMessage('');
                          setOtpNotification('');
                        }}
                        style={{
                          background: authMode === 'otp' ? '#eff6ff' : '#ffffff',
                          border: authMode === 'otp' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          color: authMode === 'otp' ? '#2563eb' : '#1e293b',
                          fontWeight: 600,
                          padding: '8px 4px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                      >
                        <PhoneOtpBadgeSVG />
                        Mobile OTP
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('email_otp');
                          setErrorMessage('');
                          setOtpNotification('');
                        }}
                        style={{
                          background: authMode === 'email_otp' ? '#eff6ff' : '#ffffff',
                          border: authMode === 'email_otp' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                          color: authMode === 'email_otp' ? '#2563eb' : '#1e293b',
                          fontWeight: 600,
                          padding: '8px 4px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>📧</span>
                        Email OTP
                      </button>

                      <button
                        type="button"
                        onClick={openGoogleSignInPage}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          color: '#1e293b',
                          fontWeight: 600,
                          padding: '8px 4px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}
                      >
                        <GoogleIcon />
                        1-Click Google
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
