import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

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
    experience: []
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
        experience: data.profile?.experience || []
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
      await api.put('/api/candidate/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        profile: {
          phone: profile.phone,
          address: profile.address,
          dateOfBirth: profile.dateOfBirth,
          education: profile.education,
          experience: profile.experience
        }
      });
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
