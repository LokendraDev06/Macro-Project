import React from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function PatientDashboard({ appointments }) {
  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Patient <span className="gradient-text">Portal</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your upcoming appointments, medical history, and AI health reports.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="var(--primary-accent)" /> Scheduled Appointments ({appointments.length})
          </h3>

          {appointments.length === 0 ? (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No appointments scheduled yet. Use the 'Find Doctors' tab or AI Chatbot to book one!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {appointments.map((apt, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--primary-accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{apt.doctor_name}</h4>
                      <span style={{ color: 'var(--primary-accent)', fontSize: '0.85rem' }}>{apt.specialization}</span>
                    </div>
                    <span style={{ background: 'rgba(52, 211, 153, 0.15)', color: 'var(--secondary-accent)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                      ✓ {apt.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> {apt.date}</span>
                    <span><Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> {apt.slot}</span>
                  </div>

                  <div style={{ marginTop: '14px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', fontSize: '0.82rem' }}>
                    <strong>Reported Symptoms:</strong> {apt.symptoms}
                    <br />
                    <strong style={{ color: 'var(--primary-accent)' }}>AI Preliminary Note:</strong> {apt.ai_summary}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--secondary-accent)" /> Profile Information
            </h4>
            <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)' }}>
              <div><strong>Name:</strong> Rohan Das</div>
              <div><strong>Age / Gender:</strong> 28 / Male</div>
              <div><strong>Blood Group:</strong> O+ Positive</div>
              <div><strong>Allergies:</strong> None reported</div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '18px 0' }} />

            <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '12px', borderRadius: '10px', fontSize: '0.78rem', color: '#e0f2fe' }}>
              ℹ️ <strong>AI Safety Notice:</strong> AI assessments are for preliminary guidance and scheduling efficiency. Always verify medical decisions with your consulting physician.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
