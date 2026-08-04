import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { BarChart3, TrendingUp, Download, Users, Layers, Award, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Analytics & Performance Reports</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time metrics on template engagement, shop owner generation frequency, and download distributions.
          </p>
        </div>

        {/* Visual Progress Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Generation Stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="font-heading font-bold text-base text-white mb-6">Monthly Generation Trends (2026)</h3>
            <div className="space-y-4">
              {[
                { month: 'March 2026', count: 120, pct: 45 },
                { month: 'April 2026', count: 210, pct: 65 },
                { month: 'May 2026 (SSLC Exam Results)', count: 480, pct: 100 },
                { month: 'June 2026 (Plus Two Admissions)', count: 390, pct: 85 },
                { month: 'July 2026 (Current)', count: 320, pct: 70 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{item.month}</span>
                    <span className="text-cyan-400">{item.count} Posters</span>
                  </div>
                  <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="font-heading font-bold text-base text-white mb-6">Top Template Categories</h3>
            <div className="space-y-4">
              {[
                { category: 'SSLC Exam Results', percentage: 42, color: 'bg-blue-500' },
                { category: 'Plus Two Star Achievers', percentage: 28, color: 'bg-indigo-500' },
                { category: 'Grand Opening Ceremony', percentage: 15, color: 'bg-purple-500' },
                { category: 'Festival & Offer Posters', percentage: 10, color: 'bg-amber-500' },
                { category: 'Custom Promos', percentage: 5, color: 'bg-emerald-500' },
              ].map((c, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{c.category}</span>
                    <span className="text-slate-400">{c.percentage}% share</span>
                  </div>
                  <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${c.color} rounded-full`}
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
