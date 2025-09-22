import React, { useState } from 'react';
import api from '../../services/apiClient';
import backCover from '../../images/cover/ges.jpg';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      // Confirm OTP first
      await api.post('accounts/confirm-password-otp/', { email, otp_code: otp });
      // Then reset password
      await api.post('accounts/new-password-reset/', { email, new_password: newPassword, new_password2: newPassword2 });
      setMessage('Password reset successfully. You can now sign in.');
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        const msgs = Object.values(data.errors).flat() as string[];
        setError(msgs.join('\n'));
      } else {
        setError('Failed to reset password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    try {
      await api.post('accounts/resend-password-otp/', { email });
      setMessage('OTP resent to your email.');
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        const msgs = Object.values(data.errors).flat() as string[];
        setError(msgs.join('\n'));
      } else {
        setError('Failed to resend OTP');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${backCover})` }}
      ></div>
      <div className="relative w-full max-w-md px-6">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Reset Password</h2>
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}
        <div className="relative bg-white p-8 rounded-2xl w-full border border-white/20 z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="4-digit code"
                className="w-full p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={handleResend} className="mt-2 text-blue-600 underline">Resend OTP</button>
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8+ chars, uppercase, lowercase, digit, symbol"
                className="w-full p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                placeholder="Re-type password"
                className="w-full p-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

