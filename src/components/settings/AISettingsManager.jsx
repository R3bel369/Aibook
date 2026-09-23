import React, { useState, useEffect } from 'react';
import { Sparkles, Key, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, Zap, Bot, Eye, EyeOff, Check, Lock, ArrowUpRight } from 'lucide-react';
import { getAiApiConfig, saveAiApiConfig, testAiApiConnection, AI_PROVIDERS } from '../../utils/aiApiService';
import { useNotifications } from '../../context/NotificationContext';

export default function AISettingsManager() {
  const { addNotification } = useNotifications();
  const [config, setConfig] = useState(getAiApiConfig());
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setConfig(getAiApiConfig());
  }, []);

  const selectedProvider = AI_PROVIDERS.find(p => p.id === config.provider) || AI_PROVIDERS[0];

  const getCurrentKey = () => {
    if (config.provider === 'gemini') return config.geminiApiKey;
    if (config.provider === 'claude') return config.claudeApiKey;
    if (config.provider === 'openai') return config.openaiApiKey;
    return '';
  };

  const setCurrentKey = (val) => {
    if (config.provider === 'gemini') {
      setConfig(prev => ({ ...prev, geminiApiKey: val }));
    } else if (config.provider === 'claude') {
      setConfig(prev => ({ ...prev, claudeApiKey: val }));
    } else if (config.provider === 'openai') {
      setConfig(prev => ({ ...prev, openaiApiKey: val }));
    }
  };

  const getCurrentModel = () => {
    if (config.provider === 'gemini') return config.geminiModel;
    if (config.provider === 'claude') return config.claudeModel;
    if (config.provider === 'openai') return config.openaiModel;
    return selectedProvider.defaultModel;
  };

  const setCurrentModel = (modelId) => {
    if (config.provider === 'gemini') {
      setConfig(prev => ({ ...prev, geminiModel: modelId }));
    } else if (config.provider === 'claude') {
      setConfig(prev => ({ ...prev, claudeModel: modelId }));
    } else if (config.provider === 'openai') {
      setConfig(prev => ({ ...prev, openaiModel: modelId }));
    }
  };

  const handleSave = () => {
    saveAiApiConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);

    addNotification({
      title: "⚡ AI Settings Saved",
      message: `Active model set to ${selectedProvider.name} (${getCurrentModel()}).`,
      type: "success"
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const apiKey = getCurrentKey();
    const model = getCurrentModel();

    const res = await testAiApiConnection(config.provider, apiKey, model);
    setIsTesting(false);
    setTestResult(res);

    addNotification({
      title: res.success ? "✅ Connection Verified" : "❌ Connection Failed",
      message: res.message,
      type: res.success ? "success" : "error"
    });
  };

  const hasKey = Boolean(getCurrentKey().trim());

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Hero Header Card */}
      <div className="saas-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-purple-600">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-ai text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous AI Financial Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            AI Provider & Key Management
          </h2>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed">
            Connect OpenAI GPT-4o, Google Gemini, or Anthropic Claude for statement extraction & bookkeeping.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-300 dark:border-slate-700">
          <div className="text-right space-y-0.5">
            <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 justify-end">
              <span className={`w-2.5 h-2.5 rounded-full ${config.enableAiApi && hasKey ? "bg-sky-500 animate-pulse" : "bg-amber-500"}`}></span>
              <span>{config.enableAiApi && hasKey ? "Live AI Active" : "Rule Engine Fallback"}</span>
            </div>
            <div className="text-xs font-black text-slate-600 dark:text-slate-400 font-mono">
              {selectedProvider.name} • {getCurrentModel()}
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableAiApi}
              onChange={(e) => setConfig(prev => ({ ...prev, enableAiApi: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Select AI Provider
          </label>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Click to select active model provider</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_PROVIDERS.map((provider) => {
            const isSelected = config.provider === provider.id;
            return (
              <div
                key={provider.id}
                onClick={() => {
                  setConfig(prev => ({ ...prev, provider: provider.id }));
                  setTestResult(null);
                }}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'border-purple-600 bg-purple-500/15 text-slate-900 dark:text-white shadow-md ring-2 ring-purple-500/40'
                    : 'saas-card hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-extrabold">
                      {provider.id === 'openai' && <Zap className="w-4 h-4 text-sky-500" />}
                      {provider.id === 'gemini' && <Sparkles className="w-4 h-4 text-purple-500" />}
                      {provider.id === 'claude' && <Bot className="w-4 h-4 text-amber-500" />}
                    </div>

                    {isSelected ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Selected
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        {provider.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {provider.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                    {provider.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 font-mono font-bold">
                  <span>Default:</span>
                  <span className="text-purple-600 dark:text-purple-400 font-black">{provider.defaultModel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Credentials Config Box */}
      <div className="saas-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {selectedProvider.name} Credentials & Model Variant
              </h3>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Keys are stored locally in your browser (`localStorage`) and used for client-side API requests.
              </p>
            </div>
          </div>

          <a
            href={selectedProvider.keyDocsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-purple-500 text-xs font-black text-purple-600 dark:text-purple-400 transition-all inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Get {selectedProvider.name} Key</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Active Model Variant
            </label>
            <select
              value={getCurrentModel()}
              onChange={(e) => setCurrentModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            >
              {selectedProvider.models.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {selectedProvider.name} API Key
              </label>
              {hasKey ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full badge-ai flex items-center gap-1">
                  <Check className="w-3 h-3" /> Key Detected
                </span>
              ) : (
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  Key Missing
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={getCurrentKey()}
                onChange={(e) => setCurrentKey(e.target.value)}
                placeholder={`Paste your ${selectedProvider.name} API Key...`}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
            testResult.success 
              ? 'badge-income'
              : 'badge-expense'
          }`}>
            {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || !hasKey}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-black transition-all flex items-center gap-2 disabled:opacity-40 border border-slate-300 dark:border-slate-700"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-500" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
            <span>{isTesting ? "Testing..." : "Test Connection"}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-2"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{isSaved ? "Saved!" : "Save Configuration"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
