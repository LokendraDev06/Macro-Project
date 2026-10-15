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
    id: "doc-gw-101",
    name: "Dr. Deepankar Lahariya",
    specialization: "General Physician",
    qualification: "MBBS, MD (Internal Medicine) - 12 Yrs Exp",
    clinic: "Lahariya Health Clinic",
    rating: 4.8,
    fee: 200,
    location: "A-21, Basant Vihar Colony, Lashkar, Gwalior",
    schedule: "Mon-Sat 9:30 AM - 8:00 PM, Sun 9:00 AM - 2:00 PM",
    phone: "+91 77730 08203",
    available_slots: ["09:30 AM", "11:30 AM", "04:30 PM", "07:00 PM"],
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-102",
    name: "Dr. Manish Sharma",
    specialization: "General Physician",
    qualification: "MBBS, MD (General Medicine) - 14 Yrs Exp",
    clinic: "Shree Shyam Clinic",
    rating: 4.85,
    fee: 350,
    location: "G.K. Tower, opp. Chandakya Hospital, Hospital Road, Gwalior",
    schedule: "Afternoon 2:00 - 4:00 PM, Evening 7:00 - 8:30 PM",
    phone: "+91 93417 27332",
    available_slots: ["02:00 PM", "03:15 PM", "07:00 PM", "08:00 PM"],
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-103",
    name: "Dr. Aditya Jain",
    specialization: "Cardiologist",
    qualification: "MD, DM (Cardiology) - Senior Interventional Cardiologist",
    clinic: "Aditya Jain Heart Clinic",
    rating: 4.9,
    fee: 500,
    location: "Hospital Road, opp. old Pariwar Hospital, Geeta Colony, Lashkar, Gwalior",
    schedule: "Mon-Sat 9:00 AM - 8:00 PM, Sun 11:00 AM - 8:00 PM",
    phone: "+91 82260 21010",
    available_slots: ["09:30 AM", "11:30 AM", "04:00 PM", "06:30 PM"],
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-104",
    name: "Dr. Gaurav Kavi Bhargava",
    specialization: "Cardiologist",
    qualification: "MD, DNB (Cardiology) - Heart Care Specialist",
    clinic: "Gaurav Heart Care Centre",
    rating: 4.9,
    fee: 600,
    location: "Hospital Road, opp. Nariyo Mandir, near Madhav Dispensary, Lashkar, Gwalior",
    schedule: "Daily 8:30 AM - 10:00 PM",
    phone: "+91 91799 83355",
    available_slots: ["09:00 AM", "12:00 PM", "05:00 PM", "07:30 PM"],
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-105",
    name: "Dr. Kamal Bhadoria",
    specialization: "Dermatologist",
    qualification: "MD, DVD (Dermatology & Cosmetology) - Skin Specialist",
    clinic: "Foreman Skin Clinic",
    rating: 4.75,
    fee: 500,
    location: "2nd Floor, Parimal Complex, opp. Indian Oil Petrol Pump, Chetakpuri, Gwalior",
    schedule: "Mon-Sat 3:00 - 8:00 PM, Sun 11:00 AM - 4:00 PM",
    phone: "+91 84510 73004",
    available_slots: ["03:00 PM", "04:30 PM", "06:00 PM", "07:30 PM"],
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-106",
    name: "Dr. Charul Agrawal",
    specialization: "Dermatologist",
    qualification: "MD (Dermatology & Aesthetic Medicine) - Skin & Hair Specialist",
    clinic: "Sidra Derma Solutions",
    rating: 4.85,
    fee: 500,
    location: "Near Sanskar Garden, Chetakpuri, Lashkar, Gwalior",
    schedule: "Mon-Sat 10:00 AM - 2:00 PM & 5:00 - 8:00 PM, Sun 12:00 - 7:00 PM",
    phone: "+91 99700 46403",
    available_slots: ["10:30 AM", "01:00 PM", "05:30 PM", "07:15 PM"],
    avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78c4a?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-107",
    name: "Dr. Archana Gupta",
    specialization: "Pediatrician",
    qualification: "MBBS, DCH, MD (Pediatrics) - Child Specialist",
    clinic: "Archana Health Care",
    rating: 4.8,
    fee: 350,
    location: "Gwalior City, Gwalior",
    schedule: "Listed OPD: 9:00 AM - 12:30 PM",
    phone: "+91 75124 56789",
    available_slots: ["09:00 AM", "10:15 AM", "11:30 AM", "12:15 PM"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-108",
    name: "Dr. Manoj Bansal",
    specialization: "Pediatrician",
    qualification: "MBBS, MD (Pediatrics) - Newborn & Child Care",
    clinic: "Samarth Women and Child Health Center",
    rating: 4.75,
    fee: 200,
    location: "Gwalior City, Gwalior",
    schedule: "Evening OPD: 6:00 - 9:00 PM",
    phone: "+91 75123 45678",
    available_slots: ["06:00 PM", "07:00 PM", "08:00 PM", "08:45 PM"],
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-109",
    name: "Dr. Vijay Gupta",
    specialization: "Pediatrician",
    qualification: "MD (Pediatrics), Fellowship in Neonatology - Child Specialist",
    clinic: "Shri Narayanam Child Care",
    rating: 4.9,
    fee: 400,
    location: "Behind Roshni Ghar Rd, near Ved Mantra Hotel, Jayendraganj, Lashkar, Gwalior",
    schedule: "Mon-Wed, Fri-Sat 12:30 - 2:45 PM & 5:00 - 6:15 PM, Sun 1:00 - 3:00 PM",
    phone: "+91 75126 12345",
    available_slots: ["12:45 PM", "02:00 PM", "05:15 PM", "06:00 PM"],
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-110",
    name: "Dr. Navneet Dhakar",
    specialization: "Urologist",
    qualification: "MS (General Surgery), MCh (Urology) - Kidney & Uro Specialist",
    clinic: "Dhakar Hospital & Urology Centre",
    rating: 4.8,
    fee: 400,
    location: "Madhav Ganj, Gwalior",
    schedule: "Mon-Sat 10:00 AM - 4:00 PM (Hospital 24x7)",
    phone: "+91 75128 90123",
    available_slots: ["10:30 AM", "12:00 PM", "02:30 PM", "03:45 PM"],
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-111",
    name: "Dr. Pritesh Jain",
    specialization: "Urologist",
    qualification: "MS, MCh (Urology) - Senior Urosurgeon",
    clinic: "Kailash Superspeciality Hospital",
    rating: 4.95,
    fee: 1000,
    location: "Rampua / Lashkar, Gwalior",
    schedule: "Morning OPD: 11:00 AM - 1:00 PM",
    phone: "+91 75129 87654",
    available_slots: ["11:00 AM", "11:45 AM", "12:30 PM", "01:00 PM"],
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-112",
    name: "Dr. Sanjay Goyal",
    specialization: "Orthopedist",
    qualification: "MS (Orthopedics), Joint Replacement Specialist",
    clinic: "Apollo Spectra Hospitals (On Call)",
    rating: 4.85,
    fee: 450,
    location: "Vikas Nagar, Gwalior",
    schedule: "Appointment Window: 10:00 AM - 5:00 PM",
    phone: "+91 75124 11223",
    available_slots: ["10:00 AM", "12:30 PM", "02:30 PM", "04:30 PM"],
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-113",
    name: "Dr. Himanshu Kushwah",
    specialization: "Orthopedist",
    qualification: "MBBS, MS (Orthopedics) - Spine & Joint Care",
    clinic: "Kushwah Hospital",
    rating: 4.75,
    fee: 300,
    location: "Deen Dayal Nagar, Gwalior",
    schedule: "Listed Clinic Window: 9:00 AM - 9:00 PM",
    phone: "+91 75125 33445",
    available_slots: ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"],
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-114",
    name: "Dr. Swati Agrawal",
    specialization: "Gynecologist",
    qualification: "MBBS, MS (Obstetrics & Gynecology) - Women Health Specialist",
    clinic: "Diabetes, Obesity and Thyroid Centre",
    rating: 4.8,
    fee: 200,
    location: "Lalitpur Colony, Gwalior",
    schedule: "Clinic Window: 9:00 AM - 2:00 PM",
    phone: "+91 75127 55667",
    available_slots: ["09:30 AM", "11:00 AM", "12:30 PM", "01:30 PM"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-115",
    name: "Dr. Rita Johri",
    specialization: "Gynecologist",
    qualification: "MBBS, DGO, MD (Gynecology & Obstetrics)",
    clinic: "Deepak Johri Nursing Home",
    rating: 4.7,
    fee: 300,
    location: "Naya Bazar, Gwalior",
    schedule: "Mon-Sat 10:00 AM - 2:00 PM & 5:00 - 8:00 PM",
    phone: "+91 75123 66778",
    available_slots: ["10:30 AM", "01:00 PM", "05:30 PM", "07:30 PM"],
    avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78c4a?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-gw-116",
    name: "Hansraj Memorial Hospital OPD",
    specialization: "General Physician",
    qualification: "Multispecialty Senior Consultants & Emergency Physicians",
    clinic: "Hansraj Memorial Hospital",
    rating: 4.75,
    fee: 250,
    location: "37-38, Sector 2, Vinay Nagar, Gwalior",
    schedule: "Mon-Sat: 9:00 AM - 1:00 PM & 5:00 - 9:00 PM (Sunday Closed)",
    phone: "0751-2481102, 0751-2480979",
    available_slots: ["09:30 AM", "11:30 AM", "05:30 PM", "08:00 PM"],
    avatar: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&auto=format&fit=crop&q=80"
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
      doctor_id: "doc-gw-101",
      doctor_name: "Dr. Deepankar Lahariya",
      specialization: "General Physician",
      date: new Date().toISOString().split('T')[0],
      slot: "11:30 AM",
      status: "Confirmed",
      symptoms: "Seasonal viral fever, body ache and fatigue",
      ai_summary: "Patient reports fever & fatigue. Preliminary Assessment: Viral Infection. Recommended General Physician."
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
