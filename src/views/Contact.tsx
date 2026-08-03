import { useState, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Github, Linkedin, Send, CheckCircle, Terminal, AlertCircle, FileText } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

export default function Contact() {
  const { data, loading } = usePortfolio();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [recordId, setRecordId] = useState('');
  const [queued, setQueued] = useState(false);
  const [submissionLogs, setSubmissionLogs] = useState<string[]>([]);

  const settings = data?.settings;
  const email = settings?.email || 'azanalam7@gmail.com';
  const githubUrl = settings?.socialLinks?.github || 'https://github.com/Azanalam';
  const linkedinUrl = settings?.socialLinks?.linkedin || '';
  const resumeUrl = data?.resumeUrl || '';

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!form.name.trim()) tempErrors.name = 'Name field is required.';
    if (!form.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = 'Provide a valid email address format.';
    }
    if (!form.subject.trim()) tempErrors.subject = 'Subject selection is required.';
    if (!form.message.trim()) {
      tempErrors.message = 'Message payload cannot be empty.';
    } else if (form.message.length < 10) {
      tempErrors.message = 'Please provide a message with at least 10 characters.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');
    setRecordId('');
    setSubmissionLogs(['Validating payload structure...', 'Opening secure channel to /api/contact...']);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || `Request failed (HTTP ${res.status})`);
      }
      setRecordId(body.recordId || '');
      setQueued(!!body.queued);
      setSubmissionLogs((prev) => [
        ...prev,
        `ACK ${body.queued ? '202 QUEUED' : '200 DELIVERED'} — RECORD ${body.recordId || 'N/A'}`,
        'Server acknowledgment received.',
      ]);
      setSubmitSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to transmit message.';
      setSubmissionLogs((prev) => [...prev, `ERROR: ${message}`]);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center font-mono text-xs text-[#71717A] gap-2">
        <svg className="animate-spin h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Loading communication node...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-12 md:py-16 max-w-4xl">
      
      {/* Title Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-500">
          <Mail className="h-4 w-4" />
          <span>CONTACT INTERFACE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-[#FAFAFA]">
          Initialize a Professional Connection
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1AA] max-w-2xl font-sans">
          Fill out the secure communication protocol below, or utilize direct digital channels. I typically respond to vetted inquiries under 24 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Contact Form Block */}
        <div className="md:col-span-8 p-6 sm:p-8 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] shadow-lg">
          
          <AnimatePresence mode="wait">
            {!submitSuccess && !isSubmitting && !submitError ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full px-3.5 py-2.5 bg-[#050505] border rounded-lg text-sm text-white transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#1A1A1A] focus:border-emerald-500'
                      }`}
                      placeholder="e.g. Alexis Carter"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 font-mono flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email address */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 bg-[#050505] border rounded-lg text-sm text-white transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#1A1A1A] focus:border-emerald-500'
                      }`}
                      placeholder="e.g. alexis@company.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 font-mono flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject selection */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider">
                    Inquiry Topic
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-[#050505] border rounded-lg text-sm text-white transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      errors.subject ? 'border-red-500 focus:border-red-500' : 'border-[#1A1A1A] focus:border-emerald-500'
                    }`}
                  >
                    <option value="" className="bg-[#0A0A0A]">Select a structured subject...</option>
                    <option value="Hiring" className="bg-[#0A0A0A]">Full-Time / Contract Position Employment</option>
                    <option value="Consulting" className="bg-[#0A0A0A]">Consulting Advisory & Architecture Review</option>
                    <option value="Open Source" className="bg-[#0A0A0A]">Open-Source Collaboration</option>
                    <option value="Other" className="bg-[#0A0A0A]">General Technical Handshake</option>
                  </select>
                  {errors.subject && (
                    <p className="text-xs text-red-400 font-mono flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.subject}</span>
                    </p>
                  )}
                </div>

                {/* Message Payload */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider">
                    Message Payload
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`w-full px-3.5 py-2.5 bg-[#050505] border rounded-lg text-sm text-white transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      errors.message ? 'border-red-500 focus:border-red-500' : 'border-[#1A1A1A] focus:border-emerald-500'
                    }`}
                    placeholder="Provide details about the engineering scope, timelines, or role spec..."
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400 font-mono flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#FAFAFA] hover:bg-white text-black font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-lg transition cursor-pointer border-none"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Transmit Connection Packet</span>
                </button>

              </motion.form>
            ) : isSubmitting ? (
              <motion.div
                key="submission-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col justify-center min-h-[350px] space-y-6"
              >
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1A1A1A] border-t-emerald-500" />
                </div>
                
                <div className="space-y-2 text-center">
                  <h3 className="font-bold text-white text-sm font-mono tracking-widest">TRANSMITTING TELEMETRY DATA</h3>
                  <p className="text-xs text-[#71717A]">Processing transactional handshake...</p>
                </div>

                {/* Real Submission Log Feed */}
                <div className="mx-auto w-full max-w-md p-4 rounded-lg bg-black text-[#A1A1AA] font-mono text-[10px] space-y-1 shadow-lg border border-[#1A1A1A]">
                  {submissionLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-emerald-500 shrink-0">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : submitError ? (
              <motion.div
                key="submission-error"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center space-y-6 min-h-[350px] flex flex-col justify-center items-center"
              >
                <div className="p-3 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
                  <AlertCircle className="h-10 w-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tighter">Transmission Failed</h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                    {submitError}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#1A1A1A] bg-[#050505] font-mono text-[9px] text-[#71717A] space-y-1">
                  {submissionLogs.slice(-3).map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>

                <button
                  onClick={() => { setSubmitError(''); setSubmissionLogs([]); }}
                  className="text-xs font-bold uppercase tracking-widest text-emerald-500 font-mono hover:underline cursor-pointer bg-transparent border-none"
                >
                  Retry transmission
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="success-banner"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6 min-h-[350px] flex flex-col justify-center items-center"
              >
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 animate-pulse">
                  <CheckCircle className="h-10 w-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tighter">Message Successfully Transmitted</h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                    {queued
                      ? 'Your message was received and queued. Email delivery will activate once SMTP credentials are configured.'
                      : 'Your message was delivered. I will review your payload and connect shortly.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#1A1A1A] bg-[#050505] font-mono text-[9px] text-[#71717A] space-y-1">
                  <div>RECORD ID: {recordId || 'N/A'}</div>
                  <div>UTC EPOCH: {new Date().toISOString()}</div>
                  <div>ACK STATUS: {queued ? '202 QUEUED' : '200 DELIVERED'}</div>
                </div>

                <button
                  onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSubmitSuccess(false); }}
                  className="text-xs font-bold uppercase tracking-widest text-emerald-500 font-mono hover:underline cursor-pointer bg-transparent border-none"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Channels Information Panel */}
        <div className="md:col-span-4 space-y-6">
          
          <div className="p-5 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] space-y-5">
            <h3 className="font-bold text-[10px] text-white font-mono uppercase tracking-widest border-b border-[#1A1A1A] pb-2">
              Structured Channels
            </h3>

            <div className="space-y-4 text-xs font-mono">
              {email && (
                <a 
                  href={`mailto:${email}`} 
                  className="flex items-center gap-3 text-[#A1A1AA] hover:text-white transition"
                >
                  <div className="p-2 rounded-md bg-[#111] border border-[#1A1A1A] text-emerald-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[#71717A] block uppercase text-[8px] tracking-wider">DIRECT MAIL</span>
                    <span className="font-semibold text-[10px] select-all">{email}</span>
                  </div>
                </a>
              )}

              {resumeUrl && (
                <a 
                  href={resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-[#A1A1AA] hover:text-white transition"
                >
                  <div className="p-2 rounded-md bg-[#111] border border-[#1A1A1A] text-emerald-500">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[#71717A] block uppercase text-[8px] tracking-wider">CURRICULUM VITAE</span>
                    <span className="font-semibold text-[10px]">Download résumé</span>
                  </div>
                </a>
              )}

              {githubUrl && (
                <a 
                  href={githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-[#A1A1AA] hover:text-white transition"
                >
                  <div className="p-2 rounded-md bg-[#111] border border-[#1A1A1A] text-emerald-500">
                    <Github className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[#71717A] block uppercase text-[8px] tracking-wider">SOURCE HOST</span>
                    <span className="font-semibold text-[10px] truncate max-w-[150px] inline-block">{githubUrl.replace(/^https?:\/\/(www\.)?/i, '')}</span>
                  </div>
                </a>
              )}

              {linkedinUrl && (
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-[#A1A1AA] hover:text-white transition"
                >
                  <div className="p-2 rounded-md bg-[#111] border border-[#1A1A1A] text-emerald-500">
                    <Linkedin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[#71717A] block uppercase text-[8px] tracking-wider">NETWORK NODES</span>
                    <span className="font-semibold text-[10px] truncate max-w-[150px] inline-block">{linkedinUrl.replace(/^https?:\/\/(www\.)?/i, '')}</span>
                  </div>
                </a>
              )}
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] space-y-3 font-mono text-[10px] text-[#71717A] leading-relaxed">
            <div className="flex items-center gap-2 text-white font-bold border-b border-[#1A1A1A] pb-2">
              <Terminal className="h-4 w-4 text-emerald-500" />
              <span>TLS ENVELOPE STRUCT</span>
            </div>
            <p>Every submission triggers a dual-handshake vector timestamp negotiation. Your payload is securely routed using structured data tunnels, bypassing typical third-party tracking scrapers.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
