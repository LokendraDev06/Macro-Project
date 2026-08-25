import React from 'react';
import { Stethoscope, Bot, User, UserCheck, LogOut, LogIn } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenChat, currentUser, onOpenAuth, onLogout }) {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
        <div style={{ background: 'var(--primary-gradient)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
          <Stethoscope size={24} color="#0f172a" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Medi<span className="gradient-text">AI</span></h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smart Patient Care</p>
        </div>
      </div>

      <div className="nav-links">
        <span className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          Find Doctors
        </span>
        <span className={`nav-link ${activeTab === 'patient' ? 'active' : ''}`} onClick={() => setActiveTab('patient')}>
          <User size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Patient Portal
        </span>
        <span className={`nav-link ${activeTab === 'doctor' ? 'active' : ''}`} onClick={() => setActiveTab('doctor')}>
          <UserCheck size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Doctor Dashboard
        </span>

        <button className="btn-primary" onClick={onOpenChat}>
          <Bot size={18} /> AI Health Assistant
        </button>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-gradient)', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentUser.role === 'doctor' ? '👨‍⚕️' : '👤'}
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <strong style={{ display: 'block', lineHeight: 1.2 }}>{currentUser.name}</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--secondary-accent)', textTransform: 'capitalize' }}>
                  ● {currentUser.role} Account
                </span>
              </div>
            </div>

            <button onClick={onLogout} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }} title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button className="btn-secondary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={onOpenAuth}>
            <LogIn size={16} /> Login / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
}
