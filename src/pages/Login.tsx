import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      await loginUser(params);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Activity className="h-12 w-12 text-ayur-600 mb-2" />
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Sign in to AyurWell Clinical Assistant</p>
        </div>
        {error && <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ayur-500 focus:border-ayur-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ayur-500 focus:border-ayur-500" />
          </div>
          <button type="submit" className="mt-2 w-full bg-ayur-600 hover:bg-ayur-700 text-white font-medium py-2.5 rounded-lg transition-colors">Sign In</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account? <Link to="/signup" className="text-ayur-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
