import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AdminLayout from '../components/layout/AdminLayout';
import { Tag, Plus, Trash2, Layers, Sparkles, Check, X, RefreshCw } from 'lucide-react';

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory, fetchCategories } = useApp();
  const [newCatName, setNewCatName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory(newCatName.trim());
    setNewCatName('');
    setModalOpen(false);
  };

  const handleDelete = async (cat) => {
    const catId = cat.id || cat._id || cat.code;
    if (window.confirm(`Are you sure you want to delete category "${cat.name}" from MongoDB Atlas?`)) {
      setDeletingId(catId);
      await deleteCategory(catId);
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black font-heading text-[#0A0A0A]">Poster Template Categories</h1>
            <p className="text-xs text-[#555555] font-medium mt-1">
              Organize poster templates by occasion, academic level, and business promotion domain. Persisted live in MongoDB Atlas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchCategories()}
              className="p-3 bg-[#FFFFFF] hover:bg-[#F5F5F3] text-[#555555] rounded-xl border border-[#E5E5E5] transition-colors"
              title="Refresh Categories from Database"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-3 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-extrabold rounded-xl text-xs shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              Add New Category
            </button>
          </div>
        </div>

        {/* CATEGORIES GRID */}
        {categories.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl p-12 text-center text-[#555555]">
            <Tag className="w-12 h-12 text-[#C1121F] mx-auto mb-3 opacity-40" />
            <h3 className="font-heading font-bold text-base text-[#0A0A0A]">No Categories Found</h3>
            <p className="text-xs text-[#777777] mt-1">Click "Add New Category" above to create your first MongoDB category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const catId = cat.id || cat._id || cat.code;
              return (
                <div
                  key={catId}
                  className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E5E5] hover:border-[#111111] flex flex-col justify-between group hover:-translate-y-0.5 transition-all shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] border border-red-200 flex items-center justify-center text-[#C1121F] font-bold">
                        <Tag className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black text-[#C1121F] bg-[#FFF1F2] px-2.5 py-1 rounded-full border border-red-200">
                        {cat.count || 0} Templates
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#0A0A0A] group-hover:text-[#C1121F] transition-colors">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                    <span className="text-[10px] text-[#777777] font-mono uppercase truncate max-w-[140px]">
                      {cat.code || cat.id || cat._id}
                    </span>
                    <button
                      onClick={() => handleDelete(cat)}
                      disabled={deletingId === catId}
                      className="p-1.5 hover:bg-[#FFF1F2] text-[#777777] hover:text-[#C1121F] rounded-lg transition-colors disabled:opacity-50"
                      title="Delete Category from Database"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL ADD CATEGORY */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-[#111111]">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-[#0A0A0A]">Add New Category</h3>
                <button onClick={() => setModalOpen(false)} className="text-[#555555] hover:text-[#0A0A0A]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-[#0A0A0A] block mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Political Campaign, Obituary, Festival"
                    className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#C1121F] px-3.5 py-2.5 rounded-xl text-xs text-[#0A0A0A] outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-[#F5F5F3] hover:bg-[#E5E5E5] text-[#555555] font-bold text-xs rounded-xl border border-[#E5E5E5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#C1121F] hover:bg-[#8B0E16] text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Save Category to Database
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
