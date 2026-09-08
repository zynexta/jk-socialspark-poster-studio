import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { BarChart3, TrendingUp, Download, Users, Layers, Award, Sparkles, RefreshCw, Share2, Tag } from 'lucide-react';
import apiService from '../services/api';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to calculate analytics metrics from MongoDB Atlas database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalPosters = analyticsData?.totalGeneratedPosters || 0;
  const totalTemplates = analyticsData?.totalTemplates || 0;
  const totalCategories = analyticsData?.totalCategories || 0;
  const totalShareLinks = analyticsData?.totalShareLinks || 0;
  const monthlyTrends = analyticsData?.monthlyTrends || [];
  const categoryPerformance = analyticsData?.categoryPerformance || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black font-heading text-[#0A0A0A]">Analytics & Performance Reports</h1>
            <p className="text-xs text-[#555555] font-medium mt-1">
              Real-time MongoDB Atlas metrics on poster generations, template engagement, and category performance.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F5F5F3] text-[#555555] rounded-xl border border-[#E5E5E5] transition-colors flex items-center gap-2 text-xs font-bold shrink-0 self-start sm:self-auto disabled:opacity-50"
            title="Refresh Analytics from Database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-[#C1121F] text-xs font-bold">
            {error}
          </div>
        )}

        {/* METRICS CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#555555] uppercase tracking-wider block mb-1">Total Posters Generated</span>
                <h3 className="text-3xl font-black text-[#C1121F] font-heading">{totalPosters}</h3>
                <span className="text-[11px] text-[#555555] font-medium mt-1 block">Live DB generation count</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-red-200 flex items-center justify-center text-[#C1121F]">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#555555] uppercase tracking-wider block mb-1">Total Master Templates</span>
                <h3 className="text-3xl font-black text-[#0A0A0A] font-heading">{totalTemplates}</h3>
                <span className="text-[11px] text-[#555555] font-medium mt-1 block">Active design blueprints</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center text-[#0A0A0A]">
                <Layers className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#555555] uppercase tracking-wider block mb-1">Categories</span>
                <h3 className="text-3xl font-black text-[#0A0A0A] font-heading">{totalCategories}</h3>
                <span className="text-[11px] text-[#555555] font-medium mt-1 block">Organized domains</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-red-200 flex items-center justify-center text-[#C1121F]">
                <Tag className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#555555] uppercase tracking-wider block mb-1">Total Share Links</span>
                <h3 className="text-3xl font-black text-[#0A0A0A] font-heading">{totalShareLinks}</h3>
                <span className="text-[11px] text-[#555555] font-medium mt-1 block">Active shop links</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#F5F5F3] border border-[#E5E5E5] flex items-center justify-center text-[#0A0A0A]">
                <Share2 className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Generation Stats */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 shadow-xs">
            <h3 className="font-heading font-bold text-base text-[#0A0A0A] mb-6">Monthly Generation Trends (Real Database Aggregation)</h3>
            {monthlyTrends.length === 0 ? (
              <div className="p-8 text-center text-[#777777] bg-[#F8F8F6] rounded-2xl border border-[#E5E5E5]">
                <p className="text-xs font-bold text-[#0A0A0A]">No Generation Trends Data Available Yet</p>
                <p className="text-[11px] text-[#555555] mt-1">Posters generated by shop owners will populate real monthly chart trends dynamically.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyTrends.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#0A0A0A]">{item.month}</span>
                      <span className="text-[#C1121F]">{item.count} Posters</span>
                    </div>
                    <div className="h-3 bg-[#F8F8F6] rounded-full overflow-hidden border border-[#E5E5E5]">
                      <div
                        className="h-full bg-[#C1121F] rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max(item.pct, 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Performance */}
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-6 shadow-xs">
            <h3 className="font-heading font-bold text-base text-[#0A0A0A] mb-6">Top Template Categories Performance</h3>
            {categoryPerformance.length === 0 ? (
              <div className="p-8 text-center text-[#777777] bg-[#F8F8F6] rounded-2xl border border-[#E5E5E5]">
                <p className="text-xs font-bold text-[#0A0A0A]">No Category Performance Data Available Yet</p>
                <p className="text-[11px] text-[#555555] mt-1">Generate posters across templates to see live category performance ratios.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryPerformance.map((c, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#0A0A0A]">{c.category}</span>
                      <span className="text-[#555555]">{c.count} posters ({c.percentage}%)</span>
                    </div>
                    <div className="h-3 bg-[#F8F8F6] rounded-full overflow-hidden border border-[#E5E5E5]">
                      <div
                        className={`h-full ${c.color} rounded-full`}
                        style={{ width: `${Math.max(c.percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
