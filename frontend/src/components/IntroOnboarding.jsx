import React, { useState, useEffect } from 'react';
import { Bot, Stethoscope, CalendarCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    badge: "AI HEALTH TRIAGE",
    title: "Instant AI Symptom Assessment",
    subtitle: "Describe your symptoms naturally. Our AI Chatbot analyzes your health complaints 24/7 and provides preliminary medical triage.",
    icon: Bot,
    color: "#0284c7",
    bgGradient: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)"
  },
  {
    id: 2,
    badge: "SPECIALIST MATCHMAKER",
    title: "Verified Doctor Recommendation",
    subtitle: "Never book the wrong doctor again! Our system maps your symptoms to Cardiologists, Dermatologists, Neurologists & specialists.",
    icon: Stethoscope,
    color: "#0d9488",
    bgGradient: "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)"
  },
  {
    id: 3,
    badge: "QUEUE-FREE BOOKING",
    title: "Real-Time Slot Booking & Emergency Triage",
    subtitle: "Book verified doctor slots instantly + real-time red-flag detection for acute cardiac & neurological emergencies.",
    icon: CalendarCheck,
    color: "#059669",
    bgGradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
  }
];

export default function IntroOnboarding({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide advance every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'var(--bg-gradient)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden'
      }}
    >
      {/* Top Bar Skip */}
      <div style={{ position: 'absolute', top: '30px', right: '40px', zIndex: 510 }}>
        <button
          onClick={onComplete}
          style={{
            background: '#ffffff',
            border: '1px solid var(--card-border)',
            color: 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}
        >
          Skip Intro & Login ➔
        </button>
      </div>

      {/* Centered Fullscreen Intro Card */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '48px 40px',
          background: '#ffffff',
          borderRadius: '28px',
          boxShadow: '0 25px 60px -15px rgba(2, 132, 199, 0.2)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Animated Icon Circle */}
        <div
          style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 24px auto',
            borderRadius: '32px',
            background: slide.bgGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 14px 28px rgba(0,0,0,0.06)',
            transition: 'all 0.4s ease'
          }}
        >
          <IconComponent size={56} color={slide.color} />
        </div>

        <span
          style={{
            background: 'rgba(2, 132, 199, 0.1)',
            color: slide.color,
            padding: '6px 18px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '1px',
            display: 'inline-block',
            marginBottom: '14px'
          }}
        >
          {slide.badge}
        </span>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', lineHeight: 1.25 }}>
          {slide.title}
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto 30px auto' }}>
          {slide.subtitle}
        </p>

        {/* Auto Progress Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? '32px' : '10px',
                height: '10px',
                borderRadius: '10px',
                background: currentSlide === idx ? slide.color : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {currentSlide < SLIDES.length - 1 ? (
            <>
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
                onClick={() => setCurrentSlide((currentSlide + 1) % SLIDES.length)}
              >
                Next Feature
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1.2, justifyContent: 'center', padding: '14px', background: slide.color }}
                onClick={onComplete}
              >
                Go to Login <ArrowRight size={18} />
              </button>
            </>
          ) : (
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.08rem', background: 'var(--primary-gradient)' }}
              onClick={onComplete}
            >
              Go to Patient & Doctor Login <CheckCircle2 size={20} />
            </button>
          )}
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px' }}>
          Auto-advancing slides (3.5s) • Click dots to navigate
        </p>

      </div>
    </div>
  );
}
