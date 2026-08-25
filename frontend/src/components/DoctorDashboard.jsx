import React from 'react';
import { UserCheck, Clock, FileText, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export default function DoctorDashboard({ appointments }) {
  return (
    <div className="container">
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Doctor <span className="gradient-text">Portal</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Welcome Dr. Rajesh Sharma (Cardiology Department)</p>
        </div>
        <div className="glass-panel" style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--secondary-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: 'var(--secondary-accent)' }}></span>
          Clinic Status: Accepting Patients
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="var(--primary-accent)" /> Today's Patient Appointments ({appointments.length})
          </h3>

          {appointments.length === 0 ? (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No booked appointments in your queue for today.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {appointments.map((apt, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{apt.patient_name} ({apt.patient_age} Yrs)</h4>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Slot: <strong style={{ color: 'var(--primary-accent)' }}>{apt.slot}</strong> | Date: {apt.date}
                      </span>
                    </div>
                    <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      <CheckCircle2 size={14} /> Start Consultation
                    </button>
                  </div>

                  <div style={{ marginTop: '16px', background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '14px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-accent)', marginBottom: '6px' }}>
                      <Sparkles size={16} /> AI-Generated Pre-Consultation Summary:
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#e0f2fe', margin: 0, lineHeight: 1.5 }}>
                      {apt.ai_summary}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      <strong>Patient Reported Symptoms:</strong> {apt.symptoms}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '14px' }}>Queue Overview</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Patients Today</span>
                <strong>{appointments.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Completed</span>
                <strong style={{ color: 'var(--secondary-accent)' }}>0</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending Queue</span>
                <strong style={{ color: 'var(--primary-accent)' }}>{appointments.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
