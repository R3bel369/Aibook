import React, { useState } from 'react';
import { Bot, ArrowRight, CheckCircle2, ShieldCheck, Mail, Lock, Building, Globe, DollarSign, Eye, EyeOff, AlertCircle, Loader2, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ onComplete }) {
  const { login, loginDemo, loginWithGoogle, signup, resetPassword, loading, authError } = useAuth();
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'

  // Form states
  const [email, setEmail] = useState('alex@apexinnovations.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [name, setName] = useState('Alex Morgan');
  const [businessName, setBusinessName] = useState('Apex Innovations Pvt Ltd');
  const [businessType, setBusinessType] = useState('Software & Technology Startup');
  const [currency, setCurrency] = useState('INR');
  const [country, setCountry] = useState('India');
  const [financialYear, setFinancialYear] = useState('April - March (FY 2026-27)');

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          if (res.isDemo) {
            setMessage('Signed in via Instant Demo Mode');
          }
          setTimeout(() => onComplete(), 300);
        } else {
          setErrorMessage(res.error || 'Invalid login credentials.');
        }
      } else if (mode === 'signup') {
        const res = await signup({
          name,
          email,
          password,
          businessName,
          businessType,
          currency,
          country,
          financialYear
        });
        if (res.success) {
          if (res.requiresConfirmation) {
            setMessage(`Account registered! Please check ${email} for confirmation link, or continue to dashboard.`);
          } else {
            setMessage('Account created successfully!');
          }
          setTimeout(() => onComplete(), 600);
        } else {
          setErrorMessage(res.error || 'Failed to create account.');
        }
      } else if (mode === 'forgot') {
        const res = await resetPassword(email);
        if (res.success) {
          setMessage(res.message || `Password reset link sent to ${email}`);
        } else {
          setErrorMessage(res.error || 'Unable to send reset email.');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    setIsSubmitting(false);
    if (res?.success && !res?.redirecting) {
      onComplete();
    }
  };

  const handleDemoPreset = (role) => {
    loginDemo(role);
    onComplete();
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-700/80 shadow-2xl space-y-7">
        
        {/* Quick Demo Login Preset Bar */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Instant Demo Mode:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDemoPreset('owner')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow transition-all flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" />
              <span>Owner Demo</span>
            </button>
            <button
              onClick={() => handleDemoPreset('accountant')}
              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] shadow transition-all flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" />
              <span>CPA Demo</span>
            </button>
          </div>
        </div>

        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 p-0.5 shadow-lg shadow-emerald-500/20 mx-auto">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Business Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login' && 'Access your AI financial dashboard & automated statement analyzer.'}
            {mode === 'signup' && 'Set up your financial profile to start categorizing bank statements.'}
            {mode === 'forgot' && 'Enter your registered email to receive password recovery instructions.'}
          </p>
        </div>

        {/* Tab Switcher */}
        {mode !== 'forgot' && (
          <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); setMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(''); setMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Google SSO Button */}
        {mode !== 'forgot' && (
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl glass-card text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {mode !== 'forgot' && (
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="absolute bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400">Or credentials</span>
          </div>
        )}

        {/* Error Banners */}
        {(errorMessage || authError) && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage || authError}</span>
          </div>
        )}

        {/* Success Banners */}
        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{message}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Apex Innovations"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Software & Technology Startup">Startup</option>
                    <option value="Freelancer / Consultant">Freelancer</option>
                    <option value="Small Business">Small Business</option>
                    <option value="Retail & Shop Owner">Shop Owner</option>
                    <option value="Accounting & Audit Firm">Accountant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Base Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500 font-bold text-emerald-600"
                  >
                    <option value="INR">₹ INR (Indian Rupee)</option>
                    <option value="USD">$ USD (US Dollar)</option>
                    <option value="EUR">€ EUR (Euro)</option>
                    <option value="GBP">£ GBP (British Pound)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMessage(''); setMessage(''); }}
                    className="text-[11px] font-semibold text-emerald-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span>Remember me on this device</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting || loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In to Dashboard'}
                  {mode === 'signup' && 'Create Account & Access App'}
                  {mode === 'forgot' && 'Send Password Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {mode === 'forgot' && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); setMessage(''); }}
              className="text-xs font-bold text-emerald-500 hover:underline"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

