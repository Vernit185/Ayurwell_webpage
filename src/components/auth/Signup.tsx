// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, UserPlus, Lock, User, AtSign, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signupUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signupUser({
        email,
        password
      });
      toast.success('Account created successfully!');
      navigate('/app');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayur-950 text-ayur-100 font-sans flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ayur-700/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-ayur-900/50 backdrop-blur-xl border border-ayur-800 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-ayur-700 flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-heading font-bold text-white text-center mb-2">Create Account</h2>
          <p className="text-ayur-400 text-center mb-8">Join AyurWell to start your clinical journey.</p>
          
          <form onSubmit={handleSignup} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-ayur-300 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AtSign className="w-5 h-5 text-ayur-500" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ayur-950/50 border border-ayur-800 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-ayur-600 focus:border-transparent transition-all placeholder:text-ayur-600"
                  placeholder="doctor@ayurwell.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-ayur-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-ayur-500" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ayur-950/50 border border-ayur-800 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-ayur-600 focus:border-transparent transition-all placeholder:text-ayur-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-ayur-700 hover:bg-ayur-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-premium hover:shadow-premium-dark disabled:opacity-70 mt-4"
            >
              {loading ? 'Creating Account...' : (
                <>Sign Up <UserPlus className="w-5 h-5" /></>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-ayur-400">
            Already have an account? <Link to="/login" className="text-ayur-300 font-medium hover:text-white transition-colors">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
