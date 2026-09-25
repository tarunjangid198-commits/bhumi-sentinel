import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Send,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
  CornerDownLeft,
  User,
  ShieldCheck,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const CopilotPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialParcelId = searchParams.get('parcelId') || 'P-1024';

  const { parcels, askAiCopilot } = useApp();
  const [selectedParcelId, setSelectedParcelId] = useState<string>(initialParcelId);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG-01',
      sender: 'assistant',
      content: `Welcome to the BHUMI-SENTINEL AI Decision Support System. I provide grounded decision diagnostics on land acquisition statutory workflows, cadastral discrepancies, and critical-path file movements.

Currently analyzing: **Parcel ${selectedParcelId}** (Khasra 124/3). How can I assist with this acquisition file?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'Why is this case delayed?',
    'What documents are missing or mismatched?',
    'Who currently has the file?',
    'What caused the risk score?',
    'What is the next pending action?',
    'Summarize this case.',
    'Which stage is blocking handover?',
  ];

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `USER-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await askAiCopilot(query, selectedParcelId === 'GLOBAL' ? undefined : selectedParcelId);
      const aiMsg: ChatMessage = {
        id: `AI-${Date.now()}`,
        sender: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMessage: ChatMessage = {
        id: `ERR-${Date.now()}`,
        sender: 'assistant',
        content: 'Unable to retrieve real-time diagnostic. Please ensure case data is loaded.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Case Copilot</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time cadastral extraction analysis, statutory delay diagnostics, and SLA risk mitigation.
          </p>
        </div>

        {/* Parcel selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Case Context:</span>
          <select
            value={selectedParcelId}
            onChange={(e) => {
              setSelectedParcelId(e.target.value);
              const p = parcels.find((x) => x.parcelId === e.target.value);
              setMessages((prev) => [
                ...prev,
                {
                  id: `CTX-${Date.now()}`,
                  sender: 'assistant',
                  content: `Switched contextual analysis to **${p ? `Parcel ${p.parcelId} (${p.currentStage})` : 'All National Projects'}**.`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ]);
            }}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
          >
            <option value="GLOBAL">National Briefing (All Projects)</option>
            {parcels.slice(0, 15).map((p) => (
              <option key={p.parcelId} value={p.parcelId}>
                {p.parcelId} - Khasra {p.khasraNumber} ({p.riskLevel} Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Statutory Disclaimer Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2 shadow-2xs">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-medium">
          <strong>Statutory Compliance Disclaimer:</strong> This system provides automated decision support and risk
          surfacing only. Final administrative, valuation, and legal determinations remain solely with authorized
          competent authorities under the RFCTLARR Act 2013.
        </span>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 text-xs leading-relaxed ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <BrainCircuit className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl p-4 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line'
              }`}
            >
              <div className="flex items-center justify-between mb-1 opacity-70 text-[10px]">
                <span>{msg.sender === 'user' ? 'You' : 'Bhumi-Sentinel AI'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="prose prose-xs max-w-none text-xs">{msg.content}</div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-indigo-600 font-semibold p-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
            <span>Synthesizing cadastral records and legal timeline...</span>
          </div>
        )}
      </div>

      {/* Prompt Suggestions */}
      <div className="flex overflow-x-auto space-x-2 pb-1">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-[11px] font-semibold whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={`Ask about Parcel ${selectedParcelId}, delay causes, or file custodian...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputQuery.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
