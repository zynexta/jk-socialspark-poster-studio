import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdminLayout from '../components/layout/AdminLayout';
import { 
  Layers, Download, Users, TrendingUp, Plus, Share2, Tag, 
  Sparkles, ArrowUpRight, Clock, Eye, CheckCircle2, Award
} from 'lucide-react';

export default function AdminDashboard() {
  const { templates, generatedPosters, categories } = useApp();

  const totalTemplates = templates.length;
  const totalGenerations = generatedPosters.reduce((acc, p) => acc + (p.downloads || 1), 0);
  const totalShops = 48;
  const totalDownloads = totalGenerations;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Banner Welcome */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">Zynexta Software Solutions</span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              Zynexta Poster SaaS Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Create master templates, share dynamic link portals with shop owners, and analyze real-time poster generation metrics across all regional branches.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/admin/templates/builder/new"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Build Poster Template
              </Link>
              <Link
                to="/admin/templates"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                Manage All Templates
              </Link>
            </div>
          </div>
        </div>

        {/* KPI STATS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Total Templates</span>
              <h3 className="text-3xl font-bold font-heading text-white mt-1">{totalTemplates}</h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" /> +12% this month
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Posters Generated</span>
              <h3 className="text-3xl font-bold font-heading text-white mt-1">{totalGenerations}</h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" /> +34% active shop usage
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Active Shop Owners</span>
              <h3 className="text-3xl font-bold font-heading text-white mt-1">{totalShops}</h3>
              <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1 mt-2">
                <Users className="w-3 h-3" /> Across 8 districts
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Stat 4 */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Total Downloads</span>
              <h3 className="text-3xl font-bold font-heading text-white mt-1">{totalDownloads}</h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" /> High-DPI PNGs
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* RECENT TEMPLATES & POSTER LOG GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Templates Grid */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold font-heading text-white">Active Templates</h2>
                <p className="text-xs text-slate-400">Master templates available for shop owner links</p>
              </div>
              <Link to="/admin/templates" className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1">
                View All ({templates.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {templates.slice(0, 3).map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={tmpl.bgImage}
                      alt={tmpl.title}
                      className="w-16 h-20 object-cover rounded-xl border border-slate-800 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-0.5">
                        {tmpl.category}
                      </span>
                      <h4 className="font-bold text-sm text-white truncate max-w-[240px]">{tmpl.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>Placeholders: <strong className="text-slate-200">{tmpl.placeholders?.length || 0}</strong></span>
                        <span>•</span>
                        <span>Generated: <strong className="text-slate-200">{tmpl.generatedCount || 0} times</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/templates/builder/${tmpl.id}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/template/${tmpl.shareToken}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold text-xs rounded-xl border border-blue-500/30 transition-colors"
                    >
                      Share Link
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Generation Logs */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold font-heading text-white">Recent Poster Activity</h2>
                  <p className="text-xs text-slate-400">Live feed from regional shop owners</p>
                </div>
                <Clock className="w-4 h-4 text-slate-500" />
              </div>

              <div className="space-y-4">
                {generatedPosters.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60">
                    <img
                      src={p.previewUrl}
                      alt="Generated"
                      className="w-12 h-14 object-cover rounded-lg border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs text-white block truncate">{p.customerName}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{p.generatedBy}</span>
                      <span className="text-[10px] text-cyan-400 font-medium block mt-0.5">{p.date}</span>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/admin/posters"
              className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl text-center block transition-colors border border-slate-700"
            >
              View Full History Logs
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
