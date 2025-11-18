import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import supabase from '../../lib/supabase';

interface Education {
  id: string;
  degree: string;
  institution: string;
  graduationYear: string;
  gpa?: string;
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface CandidateProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  education: Education[];
  experience: Experience[];
  cv?: File | null;
  idCard?: File | null;
  militaryStatus?: File | null;
  cvUrl?: string;
  idCardUrl?: string;
  militaryStatusUrl?: string;
}

const CandidateProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CandidateProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    education: [],
    experience: [],
    cv: null,
    idCard: null,
    militaryStatus: null,
    cvUrl: '',
    idCardUrl: '',
    militaryStatusUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/candidate/profile');
      const data = response.data;
      setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.profile?.phone || '',
        address: data.profile?.address || '',
        dateOfBirth: data.profile?.dateOfBirth || '',
        education: data.profile?.education || [],
        experience: data.profile?.experience || [],
        cv: null,
        idCard: null,
        militaryStatus: null,
        cvUrl: data.profile?.cvUrl || '',
        idCardUrl: data.profile?.idCardUrl || '',
        militaryStatusUrl: data.profile?.militaryStatusUrl || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Upload files if they exist
      let cvUrl = profile.cvUrl;
      let idCardUrl = profile.idCardUrl;
      let militaryStatusUrl = profile.militaryStatusUrl;

      if (profile.cv) {
        cvUrl = await uploadFile(profile.cv, 'cv');
      }
      if (profile.idCard) {
        idCardUrl = await uploadFile(profile.idCard, 'id-card');
      }
      if (profile.militaryStatus) {
        militaryStatusUrl = await uploadFile(profile.militaryStatus, 'military-status');
      }

      await api.put('/api/candidate/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        profile: {
          phone: profile.phone,
          address: profile.address,
          dateOfBirth: profile.dateOfBirth,
          education: profile.education,
          experience: profile.experience,
          cvUrl,
          idCardUrl,
          militaryStatusUrl
        }
      });

      // Update local state with new URLs
      setProfile(prev => ({
        ...prev,
        cvUrl,
        idCardUrl,
        militaryStatusUrl,
        cv: null,
        idCard: null,
        militaryStatus: null
      }));

      alert('Profile saved successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      graduationYear: '',
      gpa: ''
    };
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false
    };
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const validateFile = (file: File, allowedTypes: string[], maxSize: number): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }
    if (file.size > maxSize) {
      return `File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`;
    }
    return null;
  };

  const handleFileChange = (field: 'cv' | 'idCard' | 'militaryStatus') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const error = validateFile(file, allowedTypes, maxSize);
    if (error) {
      setError(error);
      return;
    }

    setError('');
    setProfile(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const uploadFile = async (file: File, fileName: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `candidates/${Date.now()}-${fileName}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-text-primary">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-primary">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-error hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-surface shadow-medium rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                className="w-full px-3 py-2 border border-border rounded-xl bg-surface-hover text-text-primary"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Address
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface shadow-medium rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Education</h2>
            <button
              onClick={addEducation}
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-xl text-sm"
            >
              Add Education
            </button>
          </div>
          {profile.education.length === 0 ? (
            <p className="text-text-muted text-center py-4">No education added yet.</p>
          ) : (
            <div className="space-y-4">
              {profile.education.map((edu) => (
                <div key={edu.id} className="border border-border rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Degree *
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                        placeholder="e.g., Bachelor's in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Institution *
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                        placeholder="e.g., University of Example"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                        placeholder="e.g., 2024"
                        min="1950"
                        max="2030"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        GPA (optional)
                      </label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                        placeholder="e.g., 3.8"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="bg-error hover:bg-red-700 text-white px-3 py-1 rounded-xl text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface shadow-medium rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Work Experience</h2>
            <button
              onClick={addExperience}
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-xl text-sm"
            >
              Add Experience
            </button>
          </div>
          {profile.experience.length === 0 ? (
            <p className="text-text-muted text-center py-4">No work experience added yet.</p>
          ) : (
            <div className="space-y-4">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="border border-border rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                        placeholder="e.g., Software Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Company *
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                        placeholder="e.g., Tech Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        End Date {!exp.current && '*'}
                      </label>
                      <input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary disabled:bg-surface-hover"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-text-secondary">I currently work here</span>
                    </label>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="bg-error hover:bg-red-700 text-white px-3 py-1 rounded-xl text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface shadow-medium rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Required Documents</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                CV/Resume *
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange('cv')}
                className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {profile.cvUrl && (
                <p className="text-sm text-text-muted mt-1">
                  Current file: <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary">View CV</a>
                </p>
              )}
              <p className="text-xs text-text-muted mt-1">Accepted formats: PDF, DOC, DOCX. Max size: 5MB</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                ID Card *
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange('idCard')}
                className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {profile.idCardUrl && (
                <p className="text-sm text-text-muted mt-1">
                  Current file: <a href={profile.idCardUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary">View ID Card</a>
                </p>
              )}
              <p className="text-xs text-text-muted mt-1">Accepted formats: PDF, JPG, PNG. Max size: 5MB</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Military Situation Certificate *
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange('militaryStatus')}
                className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {profile.militaryStatusUrl && (
                <p className="text-sm text-text-muted mt-1">
                  Current file: <a href={profile.militaryStatusUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary">View Military Certificate</a>
                </p>
              )}
              <p className="text-xs text-text-muted mt-1">Accepted formats: PDF, JPG, PNG. Max size: 5MB</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-success hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
