import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection';
import SecuritySection from '../components/landing/SecuritySection';
import { Bot, ArrowRight, Sparkles, Heart } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Top Navbar */}
      <Navbar onNavigate={onNavigate} />

      {/* Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* Features Grid */}
      <FeaturesSection onNavigate={onNavigate} />

      {/* 5-Step How It Works Workflow */}
      <HowItWorksSection onNavigate={onNavigate} />

      {/* Live Dashboard Preview */}
      <DashboardPreviewSection onNavigate={onNavigate} />

      {/* Security & Privacy */}
      <SecuritySection />

      {/* CTA Footer Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative glass-card rounded-3xl p-8 sm:p-12 text-center border border-emerald-500/40 glow-green space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 text-white flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
            <Bot className="w-8 h-8" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Ready to Automate Your Bookkeeping?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Join thousands of small businesses, freelancers, startups, and accountants managing finances intelligently.
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white font-extrabold text-base shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Launch Platform Demo</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
            <Bot className="w-4 h-4 text-emerald-500" />
            <span>AI Bookkeeping – Intelligent Financial SaaS Platform</span>
          </div>
          <div>
            © 2026 AI Bookkeeping Inc. Enterprise Data Security & Encryption Certified.
          </div>
        </div>
      </footer>

    </div>
  );
}
