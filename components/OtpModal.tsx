"use client";
import React, { useState, useEffect, useRef } from 'react';

interface OtpModalProps {
  isOpen: boolean;
  email: string;
  onVerified: () => void;
  onClose: () => void;
}

const OtpModal = ({ isOpen, email, onVerified, onClose }: OtpModalProps) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      sendOtp();
    }
  }, [isOpen]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const sendOtp = async () => {
    try {
      setSending(true);
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to send OTP');
      setTimer(60);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      onVerified();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-[420px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-red-600 mb-2 text-center">Email Verification</h3>
        <p className="text-sm text-gray-500 text-center mb-1">We've sent a 6-digit code to</p>
        <p className="text-sm font-semibold text-red-600 text-center mb-5">{email}</p>

        {sending && <p className="text-sm text-blue-500 text-center mb-3">Sending OTP...</p>}

        <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-[45px] h-[50px] text-center text-xl font-bold border-2 rounded-lg outline-none focus:border-red-600 transition-colors"
              style={{ borderColor: digit ? '#dc2626' : '#d1d5db' , color: 'black'}}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-red-600 text-red-600 rounded-full h-[42px] font-semibold text-[14px] cursor-pointer hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full h-[42px] font-semibold text-[14px] cursor-pointer disabled:opacity-50 transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>

        <button
          type="button"
          onClick={sendOtp}
          disabled={timer > 0 || sending}
          className="w-full text-red-600 text-sm underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center block"
        >
          {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
