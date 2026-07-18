import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Zap, BookOpen, Stethoscope, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import HoverFooter from '../ui/demo';

const fadeIn: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-ayur-950 text-ayur-100 font-sans selection:bg-ayur-700 selection:text-white overflow-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-ayur-950/80 backdrop-blur-md border-b border-ayur-900/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-8 h-8 rounded-full bg-ayur-700 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-semibold text-xl tracking-tight text-white">AyurWell</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ayur-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-white hover:text-ayur-300 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 bg-white text-ayur-950 rounded-full text-sm font-semibold hover:bg-ayur-50 transition-colors shadow-premium"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ayur-700/20 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ayur-900/50 border border-ayur-800 text-xs font-medium text-ayur-300 mb-8">
            <ShieldCheck className="w-4 h-4" />
            <span>Deterministic Ayurvedic Intelligence</span>
          </motion.div>

          <motion.h1 variants={fadeIn} className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Ancient Wisdom.<br />Modern Intelligence.
          </motion.h1>

          <motion.p variants={fadeIn} className="text-lg md:text-xl text-ayur-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AyurWell is a deterministic clinical reasoning engine that bridges traditional Ayurvedic knowledge with modern artificial intelligence.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-8 py-4 bg-ayur-700 hover:bg-ayur-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-premium hover:shadow-premium-dark"
            >
              Start Consultation <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-ayur-900 hover:bg-ayur-800 text-white rounded-full font-semibold transition-colors"
            >
              Explore Features
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-ayur-900/20 border-t border-ayur-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Precision without hallucination.</h2>
            <p className="text-ayur-400 max-w-2xl mx-auto">Our reasoning engine strictly maps to official Government of India Ayurvedic datasets under official Ministry of Ayush PDFs and websites. No generative guesses, just clinical certainty.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Deterministic Reasoning", desc: "Mathematical graphs rank diseases purely on symptom fingerprints." },
              { icon: BookOpen, title: "Evidence Grounded", desc: "Direct citations from CCRAS and Ministry of AYUSH publications." },
              { icon: ShieldCheck, title: "Emergency Protocols", desc: "Hardcoded safety engines catch clinical red-flags immediately." }
            ].map((feat, i) => (
              <div key={i} className="p-8 rounded-3xl bg-ayur-950 border border-ayur-800/50 hover:border-ayur-700 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-ayur-900 flex items-center justify-center mb-6 group-hover:bg-ayur-800 transition-colors">
                  <feat.icon className="w-6 h-6 text-ayur-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feat.title}</h3>
                <p className="text-ayur-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative mt-20 pb-[50px]">
        <HoverFooter />
      </div>
    </div>
  );
}
