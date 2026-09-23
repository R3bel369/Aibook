import React, { useState } from 'react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { 
  Mic, 
  MicOff, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Image as ImageIcon, 
  X,
  Volume2,
  DollarSign
} from 'lucide-react';

export default function VoiceAndWhatsAppModal({ isOpen, onClose }) {
  const { setStatementData, transactions } = useFinancialData();
  const [activeMode, setActiveMode] = useState('voice'); // 'voice' | 'whatsapp'
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTranscript, setRecordedTranscript] = useState('');
  const [parsedExpense, setParsedExpense] = useState(null);
  const [whatsappImageSent, setWhatsappImageSent] = useState(false);

  if (!isOpen) return null;

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedTranscript('Listening for financial transaction voice note...');
    setParsedExpense(null);

    // Simulate 2.5 second audio speech recognition
    setTimeout(() => {
      setIsRecording(false);
      const sampleText = "Just paid $65.00 for client dinner with Mark at Bistro Grill on Chase card.";
      setRecordedTranscript(sampleText);
      setParsedExpense({
        description: 'Bistro Grill (Client Dinner with Mark)',
        merchant: 'Bistro Grill',
        debit: 65.00,
        credit: 0,
        category: 'Food & Client Dining',
        date: new Date().toISOString().split('T')[0],
        aiConfidence: 98,
        status: 'APPROVED'
      });
    }, 2500);
  };

  const handleCommitVoiceExpense = () => {
    if (parsedExpense) {
      const newTx = {
        id: `voice_tx_${Date.now()}`,
        ...parsedExpense
      };
      setStatementData([newTx, ...transactions]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="saas-card max-w-lg w-full p-6 space-y-5 bg-slate-900 text-white border border-slate-800 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 font-black text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black">AI Voice & WhatsApp Copilot</h3>
              <p className="text-[10px] text-slate-400">Log expenses on the go with zero friction</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-800 border border-slate-700">
          <button
            onClick={() => setActiveMode('voice')}
            className={`flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition-all ${
              activeMode === 'voice'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" /> Voice Memo Logger
          </button>

          <button
            onClick={() => setActiveMode('whatsapp')}
            className={`flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition-all ${
              activeMode === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> WhatsApp / Telegram Bot
          </button>
        </div>

        {/* VOICE MODE */}
        {activeMode === 'voice' && (
          <div className="space-y-5 text-center py-4">
            
            {/* Mic Animation Button */}
            <button
              onClick={handleStartRecording}
              disabled={isRecording}
              className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all shadow-2xl ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/30'
                  : 'bg-purple-600 hover:bg-purple-500 text-white ring-8 ring-purple-500/20'
              }`}
            >
              <Mic className="w-10 h-10" />
            </button>

            <p className="text-xs font-bold text-slate-300">
              {isRecording ? "🔴 Speaking... Analyzing voice audio..." : "Tap microphone & speak expense aloud"}
            </p>

            {/* Transcript Preview Card */}
            {recordedTranscript && (
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left space-y-3 font-sans text-xs">
                <span className="text-[10px] font-black uppercase text-purple-400 block">Voice Transcript:</span>
                <p className="text-slate-200 italic">"{recordedTranscript}"</p>

                {parsedExpense && (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white">{parsedExpense.merchant}</span>
                      <span className="text-emerald-400 font-mono text-sm">${parsedExpense.debit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Category: {parsedExpense.category}</span>
                      <span className="text-purple-300 font-black">98% AI Match</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {parsedExpense && (
              <button
                onClick={handleCommitVoiceExpense}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" /> Add to Ledger Instantly
              </button>
            )}

          </div>
        )}

        {/* WHATSAPP MODE */}
        {activeMode === 'whatsapp' && (
          <div className="space-y-4 font-sans text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="font-black text-emerald-400 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> WhatsApp Receipt Bot (+1 800 555-BOOK)
                </span>
                <span className="text-[10px] text-slate-400">Online</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">
                  📱 Snap a picture of any paper receipt and send it to our WhatsApp Bot.
                </div>

                {whatsappImageSent && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 text-emerald-200 animate-fadeIn">
                    <p className="font-bold">✅ Receipt Processed!</p>
                    <p className="text-[11px] text-slate-300">Extracted $45.00 at Shell Gas Station • Category: Travel & Transport.</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setWhatsappImageSent(true)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <ImageIcon className="w-4 h-4" /> Simulate Sending Receipt Photo
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
