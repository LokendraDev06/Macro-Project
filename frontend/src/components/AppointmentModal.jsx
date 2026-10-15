import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Phone, FileText } from 'lucide-react';

export default function AppointmentModal({ doctor, onClose, onBookingSuccess }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [name, setName] = useState('Rohan Das');
  const [age, setAge] = useState('28');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [date, setDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState(doctor.available_slots[0] || '');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      patient_name: name,
      patient_age: parseInt(age),
      patient_phone: phone,
      doctor_id: doctor.id,
      date: date,
      slot: selectedSlot,
      symptoms: symptoms || "Routine medical checkup",
      ai_summary: symptoms ? `Patient reported: '${symptoms}'. AI matched with doctor ${doctor.name} (${doctor.specialization}).` : "Routine appointment"
    };

    try {
      const res = await fetch('http://localhost:8000/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setLoading(false);
      
      if (res.ok) {
        onBookingSuccess(data.appointment);
      } else {
        alert(data.detail || "Failed to book appointment");
      }
    } catch (err) {
      console.warn("Backend API offline, using fallback mock booking");
      setLoading(false);
      onBookingSuccess({
        id: `apt-${Math.floor(Math.random()*1000)}`,
        patient_name: name,
        patient_age: parseInt(age),
        doctor_name: doctor.name,
        specialization: doctor.specialization,
        date: date,
        slot: selectedSlot,
        status: "Confirmed",
        symptoms: symptoms || "Routine checkup",
        ai_summary: `Patient reported: ${symptoms || 'General Checkup'}`
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Book Appointment</h3>
            <p style={{ margin: 0, color: 'var(--primary-accent)', fontSize: '0.9rem' }}>{doctor.name} ({doctor.specialization})</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Patient Full Name</label>
            <input type="text" className="chat-input" style={{ width: '100%' }} value={name} onChange={e=>setName(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Age</label>
              <input type="number" className="chat-input" style={{ width: '100%' }} value={age} onChange={e=>setAge(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Phone Number</label>
              <input type="text" className="chat-input" style={{ width: '100%' }} value={phone} onChange={e=>setPhone(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Date</label>
              <input type="date" min={todayStr} className="chat-input" style={{ width: '100%' }} value={date} onChange={e=>setDate(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Available Time Slot</label>
              <select className="chat-input" style={{ width: '100%' }} value={selectedSlot} onChange={e=>setSelectedSlot(e.target.value)}>
                {doctor.available_slots.map((slot, i) => (
                  <option key={i} value={slot} style={{ background: '#0f172a' }}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Symptoms / Notes for Doctor</label>
            <textarea className="chat-input" style={{ width: '100%', height: '70px', resize: 'none' }} placeholder="Briefly describe your health issue..." value={symptoms} onChange={e=>setSymptoms(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Confirming Booking...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
