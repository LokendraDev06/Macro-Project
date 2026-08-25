import React from 'react';
import { Star, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="doctor-card glass-panel">
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <img src={doctor.avatar} alt={doctor.name} className="doctor-avatar" />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{doctor.name}</h3>
          <span style={{ color: 'var(--primary-accent)', fontSize: '0.85rem', fontWeight: 600 }}>
            {doctor.specialization}
          </span>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
            {doctor.qualification}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fde047' }}>
          <Star size={16} fill="#fde047" /> {doctor.rating}
        </span>
        <span>Consultation Fee: <strong style={{ color: '#f8fafc' }}>₹{doctor.fee}</strong></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <MapPin size={14} color="var(--primary-accent)" /> {doctor.location}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
          Available Slots Today:
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {doctor.available_slots.map((slot, idx) => (
            <span key={idx} style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary-accent)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
              <Clock size={10} style={{ display: 'inline', marginRight: '3px' }} /> {slot}
            </span>
          ))}
        </div>
      </div>

      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onBook(doctor)}>
        <Calendar size={16} /> Book Appointment
      </button>
    </div>
  );
}
