import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services/announcementService';
import type { Announcement } from '../../types';
import { 
  Bell, Plus, Pencil, Trash2, 
  Send, Eye, EyeOff, Loader2,
  X, AlertCircle, CheckCircle,
  MoreVertical, Calendar, User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await announcementService.getAll();
      setAnnouncements(response.data.data);
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenModal = (announcement?: Announcement) => {
    if (announcement) {
      setCurrentAnnouncement(announcement);
    } else {
      setCurrentAnnouncement({
        title: '',
        content: '',
        target_audience: 'all',
        priority: 'medium',
        is_published: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAnnouncement(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnnouncement?.title || !currentAnnouncement?.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentAnnouncement.id) {
        await announcementService.update(currentAnnouncement.id, currentAnnouncement);
        toast.success('Announcement updated successfully');
      } else {
        await announcementService.create(currentAnnouncement);
        toast.success('Announcement published successfully');
      }
      fetchAnnouncements();
      handleCloseModal();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await announcementService.delete(id);
      toast.success('Announcement deleted');
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const togglePublish = async (announcement: Announcement) => {
    try {
      await announcementService.update(announcement.id, { 
        is_published: !announcement.is_published 
      });
      toast.success(announcement.is_published ? 'Unpublished' : 'Published');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manage Announcements</h1>
          <p className="text-slate-500 mt-2">Create and broadcast information to the school community.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 hover:shadow-primary-300 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Announcement</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Audience</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {announcements.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{a.title}</span>
                        <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <AlertCircle className={`w-3 h-3 ${
                            a.priority === 'urgent' ? 'text-red-500' : 
                            a.priority === 'high' ? 'text-amber-500' : 'text-blue-500'
                          }`} />
                          {a.priority} priority
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {a.target_audience}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => togglePublish(a)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          a.is_published 
                            ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {a.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {a.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(a)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(a.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary-600" />
                  {currentAnnouncement?.id ? 'Edit Announcement' : 'New Announcement'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Title</label>
                  <input
                    type="text"
                    required
                    value={currentAnnouncement?.title || ''}
                    onChange={(e) => setCurrentAnnouncement({...currentAnnouncement!, title: e.target.value})}
                    placeholder="Enter a catchy title..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Target Audience</label>
                    <select
                      value={currentAnnouncement?.target_audience || 'all'}
                      onChange={(e) => setCurrentAnnouncement({...currentAnnouncement!, target_audience: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium"
                    >
                      <option value="all">Everyone</option>
                      <option value="students">Students Only</option>
                      <option value="teachers">Teachers Only</option>
                      <option value="parents">Parents Only</option>
                      <option value="staff">Staff Only</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Priority</label>
                    <select
                      value={currentAnnouncement?.priority || 'medium'}
                      onChange={(e) => setCurrentAnnouncement({...currentAnnouncement!, priority: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Content</label>
                  <textarea
                    required
                    rows={6}
                    value={currentAnnouncement?.content || ''}
                    onChange={(e) => setCurrentAnnouncement({...currentAnnouncement!, content: e.target.value})}
                    placeholder="What do you want to announce?"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-50 focus:border-primary-500 outline-none transition-all font-medium resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={currentAnnouncement?.is_published || false}
                    onChange={(e) => setCurrentAnnouncement({...currentAnnouncement!, is_published: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="is_published" className="text-sm font-bold text-slate-700">
                    Publish immediately
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 hover:shadow-primary-300 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {currentAnnouncement?.id ? 'Update Announcement' : 'Publish Announcement'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementManagement;
