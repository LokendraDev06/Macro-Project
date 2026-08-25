import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ChatbotDrawer from './components/ChatbotDrawer';
import DoctorCard from './components/DoctorCard';
import AppointmentModal from './components/AppointmentModal';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import { Bot, Search, Sparkles, ShieldCheck } from 'lucide-react';

const MOCK_DOCTORS = [
  {
    id: "doc-101",
    name: "Dr. Rajesh Sharma",
    specialization: "Cardiologist",
    qualification: "MD, DM (Cardiology) - 15 Yrs Exp",
    rating: 4.9,
    fee: 800,
    location: "Central Heart Hospital, Metro City",
    available_slots: ["09:00 AM", "11:30 AM", "04:00 PM", "06:30 PM"],
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-102",
    name: "Dr. Ananya Verma",
    specialization: "Dermatologist",
    qualification: "MD (Dermatology) - 10 Yrs Exp",
    rating: 4.8,
    fee: 650,
    location: "Skin & Glow Clinic, Sector 18",
    available_slots: ["10:00 AM", "01:00 PM", "03:30 PM", "05:00 PM"],
    avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78c4a?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-103",
    name: "Dr. Vikram Sethi",
    specialization: "Neurologist",
    qualification: "DM (Neurology), AIIMS - 18 Yrs Exp",
    rating: 4.95,
    fee: 1000,
    location: "Brain Care Institute, Tech Park",
    available_slots: ["11:00 AM", "02:00 PM", "05:30 PM"],
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-104",
    name: "Dr. Sunita Patel",
    specialization: "Pulmonologist",
    qualification: "MD (Pulmonary Medicine) - 12 Yrs Exp",
    rating: 4.7,
    fee: 700,
    location: "Breathe Easy Respiratory Care",
    available_slots: ["09:30 AM", "12:30 PM", "04:30 PM"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-105",
    name: "Dr. Arvind Mehta",
    specialization: "Orthopedist",
    qualification: "MS (Orthopedics) - 14 Yrs Exp",
    rating: 4.85,
    fee: 750,
    location: "Joint & Bone Care Clinic",
    available_slots: ["10:30 AM", "02:30 PM", "06:00 PM"],
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-106",
    name: "Dr. Priya Roy",
    specialization: "General Physician",
    qualification: "MBBS, MD (General Medicine) - 8 Yrs Exp",
    rating: 4.75,
    fee: 500,
    location: "City Care Family Clinic",
    available_slots: ["09:00 AM", "11:00 AM", "03:00 PM", "07:00 PM"],
    avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78c4a?w=150&auto=format&fit=crop&q=80"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // App User & View States (Starts directly with Login page if not authenticated)
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [doctors, setDoctors] = useState(MOCK_DOCTORS);
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  const [appointments, setAppointments] = useState([
    {
      id: "apt-901",
      patient_id: "pat-001",
      patient_name: "Rohan Das",
      patient_age: 28,
      doctor_id: "doc-101",
      doctor_name: "Dr. Rajesh Sharma",
      specialization: "Cardiologist",
      date: "2026-08-28",
      slot: "11:30 AM",
      status: "Confirmed",
      symptoms: "Chest tightness and occasional palpitations",
      ai_summary: "Patient reports chest tightness & palpitations. Preliminary Assessment: Angina/Arrhythmia. Recommended Cardiologist."
    }
  ]);

  useEffect(() => {
    fetch('http://localhost:8000/api/doctors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        }
      })
      .catch(err => console.log("Backend offline, rendering client mock database."));
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    if (user.role === 'doctor') {
      setActiveTab('doctor');
    } else {
      setActiveTab('patient');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('home');
  };

  const handleRecommendSpecialist = (spec) => {
    setSelectedSpecialist(spec);
    setActiveTab('home');
  };

  const handleBookingSuccess = (newAppointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
    setSelectedDoctorForBooking(null);
    setActiveTab('patient');
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpec = selectedSpecialist ? doc.specialization.toLowerCase().includes(selectedSpecialist.toLowerCase()) : true;
    const matchesSearch = searchTerm ? (
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    return matchesSpec && matchesSearch;
  });

  // SCREEN 1: DIRECT 1:1 MEDICARE LOGIN PAGE (WHEN NOT LOGGED IN)
  if (!isLoggedIn || !currentUser) {
    return <AuthModal onLoginSuccess={handleLoginSuccess} />;
  }

  // SCREEN 2: LOGGED IN APPLICATION PORTAL
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenChat={() => setIsChatOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsLoggedIn(false)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      {activeTab === 'home' && (
        <div className="container" style={{ flex: 1 }}>
          <div className="hero">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', color: '#2563eb', marginBottom: '16px', fontWeight: 600 }}>
                <Sparkles size={14} /> AI-Powered Health Triage & Doctor Matching
              </div>
              <h1 className="hero-title">
                Smart Healthcare <br /><span style={{ color: '#2563eb' }}>Instant Doctor Booking</span>
              </h1>
              <p className="hero-subtitle">
                Describe your symptoms to our 24/7 AI Chatbot. Get matched with top verified specialists and book real-time appointments without waiting in queues.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => setIsChatOpen(true)}>
                  <Bot size={18} /> Start AI Symptom Check
                </button>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '30px', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb' }}>
                <ShieldCheck color="#2563eb" size={20} /> MediCare Dual Portals
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#2563eb', fontWeight: 800 }}>👤</span>
                  <div><strong>Patient Portal:</strong> Mobile OTP / Google Login, AI Symptom Chat, instant appointment booking.</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#2563eb', fontWeight: 800 }}>👨‍⚕️</span>
                  <div><strong>Doctor Dashboard:</strong> View queue, manage slots, and review AI Pre-Consultation Summaries.</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#2563eb', fontWeight: 800 }}>🚨</span>
                  <div><strong>Emergency Filter:</strong> Real-time detection of high-risk medical emergencies.</div>
                </div>
              </div>
            </div>
          </div>

          <div id="doctors-section" style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Find Verified <span style={{ color: '#2563eb' }}>Doctors</span></h2>
                {selectedSpecialist && (
                  <span style={{ fontSize: '0.88rem', color: 'var(--secondary-accent)' }}>
                    Filtered for recommended specialist: <strong>{selectedSpecialist}</strong> {' '}
                    <button onClick={() => setSelectedSpecialist('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem' }}>(Clear Filter)</button>
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="chat-input"
                    style={{ paddingLeft: '36px', width: '240px' }}
                    placeholder="Search doctor or specialty..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="doctors-grid">
              {filteredDoctors.map(doc => (
                <DoctorCard key={doc.id} doctor={doc} onBook={d => setSelectedDoctorForBooking(d)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patient' && <PatientDashboard appointments={appointments} />}
      {activeTab === 'doctor' && <DoctorDashboard appointments={appointments} />}

      {/* Floating AI Chat Launcher */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="btn-primary"
          style={{ position: 'fixed', bottom: '30px', right: '30px', borderRadius: '30px', padding: '14px 22px', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)', zIndex: 150 }}
        >
          <Bot size={22} /> Ask AI Health Assistant
        </button>
      )}

      {/* Chat Drawer */}
      {isChatOpen && (
        <ChatbotDrawer onClose={() => setIsChatOpen(false)} onRecommendSpecialist={handleRecommendSpecialist} />
      )}

      {/* Booking Modal */}
      {selectedDoctorForBooking && (
        <AppointmentModal doctor={selectedDoctorForBooking} onClose={() => setSelectedDoctorForBooking(null)} onBookingSuccess={handleBookingSuccess} />
      )}

      <footer style={{ marginTop: 'auto', padding: '24px 40px', borderTop: '1px solid var(--card-border)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', background: '#ffffff' }}>
        © 2026 MediCare. All rights reserved.
      </footer>
    </div>
  );
}
