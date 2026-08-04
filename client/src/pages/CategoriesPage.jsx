import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AdminLayout from '../components/layout/AdminLayout';
import { Tag, Plus, Trash2, Layers, Sparkles, Check, X } from 'lucide-react';

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory } = useApp();
  const [newCatName, setNewCatName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName('');
    setModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-white">Poster Template Categories</h1>
            <p className="text-xs text-slate-400 mt-1">
              Organize poster templates by occasion, academic level, and business promotion domain.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Add New Category
          </button>
        </div>

        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                    <Tag className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                    {cat.count || 0} Templates
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono uppercase">{cat.id}</span>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL ADD CATEGORY */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-white">Add New Category</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Political Campaign, Obituary, Festival"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
