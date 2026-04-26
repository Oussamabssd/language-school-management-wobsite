import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  User as UserIcon, FileText, Upload, 
  CheckCircle, AlertCircle, Loader2,
  Mail, Phone, MapPin, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const TeacherProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/teacher/profile');
      setProfile(response.data.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('cv', file);

    setUploading(true);
    try {
      await api.post('/teacher/cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('CV uploaded successfully');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-3xl bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{user?.first_name} {user?.last_name}</h1>
              <p className="text-primary-600 font-medium">{profile?.teacher_profile?.specialization || 'Teacher'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                {user?.email}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                {user?.phone || 'No phone'}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                {user?.city || 'No address'}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {profile?.teacher_profile?.contract_type}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CV Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Curriculum Vitae (CV)
          </h2>
          
          {profile?.teacher_profile?.cv_path ? (
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">CV is uploaded</p>
                  <a 
                    href={profile.teacher_profile.cv_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 font-bold hover:underline"
                  >
                    View Current CV
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800">No CV uploaded</p>
                <p className="text-xs text-slate-500">Please upload your CV in PDF format.</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">Update CV</label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="cv-upload"
              />
              <label
                htmlFor="cv-upload"
                className={`flex items-center justify-center gap-3 w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-primary-300 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-400" />
                )}
                <span className="font-bold text-slate-600">
                  {uploading ? 'Uploading...' : 'Click to upload PDF'}
                </span>
              </label>
            </div>
            <p className="text-[10px] text-slate-400 text-center">Max size: 5MB. Format: PDF only.</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary-600" />
            Biography & Specialization
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Specialization</p>
              <p className="text-slate-700 font-medium">{profile?.teacher_profile?.specialization || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bio</p>
              <p className="text-slate-600 leading-relaxed italic">
                "{profile?.teacher_profile?.bio || 'No bio provided yet.'}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
