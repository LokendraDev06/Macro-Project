import React, { useState } from 'react';
import { Bot, Send, X, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function ChatbotDrawer({ onClose, onRecommendSpecialist }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your MediAI Health Assistant. 👋\nDescribing your symptoms (e.g., 'chest pain', 'severe headache', 'skin rash') helps me assess your health condition and recommend the right specialist.",
      isEmergency: false
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Call backend API
      const res = await fetch('http://localhost:8000/api/chat/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: userMsg })
      });

      const data = await res.json();
      setLoading(false);
      setAssessmentResult(data);

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: data.bot_reply,
          isEmergency: data.is_emergency,
          data: data
        }
      ]);
    } catch (err) {
      console.warn("Backend offline, using fallback logic", err);
      setLoading(false);
      
      // Local fallback logic
      const isEmerg = /chest pain|shortness of breath|stroke|slurred speech/i.test(userMsg);
      const botText = isEmerg
        ? "⚠️ CRITICAL ALERT: Your reported symptoms indicate a potential medical emergency. Please visit the nearest Emergency Room (ER) immediately!"
        : `Thank you for describing your symptoms ('${userMsg}'). Based on preliminary evaluation, we recommend consulting a General Physician or Specialist.`;
      
      const resultObj = {
        is_emergency: isEmerg,
        recommended_specialist: isEmerg ? "Cardiologist" : "General Physician",
        bot_reply: botText
      };
      
      setAssessmentResult(resultObj);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: botText, isEmergency: isEmerg, data: resultObj }
      ]);
    }
  };

  return (
    <div className="chat-drawer glass-panel">
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Bot size={18} color="#0f172a" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>AI Symptom Triage Assistant</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-accent)' }}>● Active & Monitoring</span>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.sender} ${msg.isEmergency ? 'emergency' : ''}`}>
            {msg.isEmergency && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontWeight: 700 }}>
                <AlertTriangle size={16} /> EMERGENCY ALERT
              </div>
            )}
            <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
            
            {msg.data && !msg.isEmergency && msg.data.recommended_specialist && (
              <button
                onClick={() => {
                  onRecommendSpecialist(msg.data.recommended_specialist);
                  onClose();
                }}
                className="btn-primary"
                style={{ marginTop: '10px', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                <Sparkles size={14} /> Find {msg.data.recommended_specialist} Doctors <ArrowRight size={14} />
              </button>
            )}
          </div>
        ))}
        {loading && <div className="chat-msg bot">AI is analyzing your symptoms...</div>}
      </div>

      <div className="chat-footer">
        <input
          type="text"
          className="chat-input"
          placeholder="Describe your symptoms (e.g. skin rash, chest pain)..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button className="btn-primary" style={{ padding: '10px 14px' }} onClick={handleSend}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
