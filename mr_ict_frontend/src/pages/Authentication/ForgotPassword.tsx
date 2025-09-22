import React, { useState } from 'react';
import api from '../../services/apiClient';
import backCover from '../../images/cover/ges.jpg';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.post('accounts/forgot-user-password/', { email });
      setMessage('OTP sent to your email. Check your inbox.');
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        const msgs = Object.values(data.errors).flat() as string[];
        setError(msgs.join('\n'));
      } else {
        setError('Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${backCover})` }}
      ></div>
      <div className="relative w-full max-w-md px-6">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Forgot Password</h2>
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
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

