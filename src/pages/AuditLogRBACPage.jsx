import React, { useState } from 'react';
import {
  Shield,
  Lock,
  UserCheck,
  FileCheck,
  Search,
  Clock,
  KeyRound,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AUDIT_LOGS = [
  { id: 'log_9011', timestamp: '2026-09-25 17:12:04', actor: 'System Admin (admin@bookkeeping.ai)', role: 'admin', action: 'EXPORT_LEDGER', details: 'Exported QBO format CSV bundle containing 15 transactions', ip: '192.168.1.104', status: 'VERIFIED' },
  { id: 'log_9010', timestamp: '2026-09-25 17:08:20', actor: 'Sarah Jenkins (CPA)', role: 'cpa', action: 'APPROVE_TRANSACTION', details: 'Manually verified AWS Cloud hosting categorization (#tx_pdf_12)', ip: '172.56.21.99', status: 'VERIFIED' },
  { id: 'log_9009', timestamp: '2026-09-25 16:55:10', actor: 'Alex Morgan (Owner)', role: 'owner', action: 'PLAID_LINK_CONNECT', details: 'Authorized Silicon Valley Bank Plaid OAuth token feed', ip: '10.0.0.45', status: 'VERIFIED' },
  { id: 'log_9008', timestamp: '2026-09-25 16:30:00', actor: 'AI Bookkeeper Agent', role: 'system', action: 'AUTO_CATEGORIZATION', details: 'Categorized 15 statement lines with average 98.4% confidence score', ip: 'LOCAL_AI_AGENT', status: 'VERIFIED' },
  { id: 'log_9007', timestamp: '2026-09-25 15:44:12', actor: 'System Admin (admin@bookkeeping.ai)', role: 'admin', action: 'RULE_MUTATION', details: 'Updated Tax Genius deduction threshold for software R&D credits', ip: '192.168.1.104', status: 'VERIFIED' }
];

const ROLES_PERMISSIONS = [
  { role: 'admin', name: 'System Admin', badge: 'Super Admin', color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30', accessCount: 'All 8 Permissions' },
  { role: 'owner', name: 'Business Owner', badge: 'Director', color: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30', accessCount: '7 Permissions' },
  { role: 'cpa', name: 'CPA / External Auditor', badge: 'Auditor', color: 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30', accessCount: '6 Permissions' },
  { role: 'viewer', name: 'Financial Viewer', badge: 'Read-Only', color: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300', accessCount: 'Read Only' }
];

export default function AuditLogRBACPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState(AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.actor.toLowerCase().includes(searchTerm.toLowerCase()) || l.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || l.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const handleDownloadAuditPackage = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      const csv = "ID,Timestamp,Actor,Role,Action,Details,IP_Address,Status\n" +
        logs.map(l => `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.details.replace(/"/g, '""')}","${l.ip}","${l.status}"`).join("\n");
      const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csv);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `immutable_cpa_audit_log_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(false);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="saas-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-black">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Immutable CPA Security & Compliance Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Role Access & CPA Audit Trail</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Cryptographically verified audit logs capturing every user login, AI categorization, receipt match, and export action for CPA compliance.
            </p>
          </div>

          <button
            onClick={handleDownloadAuditPackage}
            disabled={downloadSuccess}
            className="px-5 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white font-black text-xs shadow-xl transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CPA Audit Log Bundle</span>
          </button>
        </div>
      </div>

      {/* Role Access Matrix Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Role-Based Access Control (RBAC) Hierarchy
          </h2>
          <span className="text-xs font-bold text-slate-500">Active Role: <span className="text-purple-600 dark:text-purple-400 font-black uppercase">{user.role || 'Admin'}</span></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLES_PERMISSIONS.map((r) => (
            <div key={r.role} className={`saas-card p-5 space-y-3 ${user.role === r.role ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : ''}`}>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${r.color}`}>
                  {r.badge}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{r.accessCount}</span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{r.name}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Assigned to authorized organizational team members.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="saas-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Immutable Activity & Security Log
            </h3>
            <p className="text-xs text-slate-500">Real-time tamper-evident events</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search actor or details..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
            >
              <option value="ALL">All Actions</option>
              <option value="EXPORT_LEDGER">Export Ledger</option>
              <option value="APPROVE_TRANSACTION">Approve Tx</option>
              <option value="PLAID_LINK_CONNECT">Plaid Link</option>
              <option value="AUTO_CATEGORIZATION">AI Agent</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor & User</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Event Details</th>
                <th className="p-3">IP Address</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white">{log.actor}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 font-black text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 max-w-[280px] text-slate-600 dark:text-slate-300">{log.details}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">{log.ip}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-[10px] flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
