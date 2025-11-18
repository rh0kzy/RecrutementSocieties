import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import supabase from '../lib/supabase';

interface Job {
  id: number;
  title: string;
  description: string;
  deadline: string | null;
  extraQuestions: CustomQuestion[] | null;
  company: {
    companyName: string;
  };
}

interface CustomQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'radio';
  options?: string[];
  required: boolean;
}

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

interface ApplicationData {
  profile: CandidateProfile;
  answers: { [questionId: string]: string };
}

const JobApplication: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [applicationData, setApplicationData] = useState<ApplicationData>({
    profile: {
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
    },
    answers: {}
  });

  useEffect(() => {
    if (jobId) {
      fetchJob();
      fetchProfile();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/api/jobs/public/${jobId}`);
      setJob(response.data);
    } catch (err) {
      console.error('Error fetching job:', err);
      setError('Job not found or no longer available');
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/candidate/profile');
      const data = response.data;
      setApplicationData(prev => ({
        ...prev,
        profile: {
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
        }
      }));
    } catch (err) {
      console.error('Error fetching profile:', err);
      // If no profile, redirect to profile setup
      navigate('/candidate/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: string, value: any) => {
    setApplicationData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));
  };

  const handleFileChange = (field: 'cv' | 'idCard' | 'militaryStatus') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type for ${field}. Allowed: PDF, DOC, DOCX, JPG, PNG`);
      return;
    }
    if (file.size > maxSize) {
      setError(`File too large for ${field}. Maximum size: 5MB`);
      return;
    }

    setError('');
    handleProfileChange(field, file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    setSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!applicationData.profile.firstName || !applicationData.profile.lastName) {
        throw new Error('First name and last name are required');
      }

      // Validate required custom questions
      if (job.extraQuestions) {
        for (const question of job.extraQuestions) {
          if (question.required && !applicationData.answers[question.id]?.trim()) {
            throw new Error(`Question "${question.question}" is required`);
          }
        }
      }

      // Submit application
      const response = await api.post('/api/applications', {
        jobId: job.id,
        companyId: job.companyId,
        profile: applicationData.profile,
        answers: applicationData.answers
      });

      alert('Application submitted successfully!');
      navigate('/candidate/profile');
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError(err.response?.data?.error || err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-text-primary">Loading job application...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl text-error">Job not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-primary">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Job Header */}
        <div className="bg-surface shadow-medium rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2">{job.title}</h1>
          <p className="text-text-secondary mb-4">{job.company.companyName}</p>
          <p className="text-text-primary">{job.description}</p>
          {job.deadline && (
            <p className="text-sm text-text-muted mt-2">
              Application deadline: {new Date(job.deadline).toLocaleDateString()}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Section */}
          <div className="bg-surface shadow-medium rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Your Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={applicationData.profile.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
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
                  value={applicationData.profile.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
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
                  value={applicationData.profile.email}
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
                  value={applicationData.profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  CV *
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange('cv')}
                  className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  required={!applicationData.profile.cvUrl}
                />
                {applicationData.profile.cvUrl && (
                  <p className="text-sm text-text-muted mt-1">
                    Current CV uploaded
                  </p>
                )}
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
                  required={!applicationData.profile.idCardUrl}
                />
                {applicationData.profile.idCardUrl && (
                  <p className="text-sm text-text-muted mt-1">
                    Current ID Card uploaded
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Military Status *
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange('militaryStatus')}
                  className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  required={!applicationData.profile.militaryStatusUrl}
                />
                {applicationData.profile.militaryStatusUrl && (
                  <p className="text-sm text-text-muted mt-1">
                    Current Military Certificate uploaded
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Custom Questions Section */}
          {job.extraQuestions && job.extraQuestions.length > 0 && (
            <div className="bg-surface shadow-medium rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Additional Questions</h2>

              <div className="space-y-6">
                {job.extraQuestions.map((question) => (
                  <div key={question.id}>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      {question.question} {question.required && '*'}
                    </label>

                    {question.type === 'text' && (
                      <input
                        type="text"
                        value={applicationData.answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                        required={question.required}
                      />
                    )}

                    {question.type === 'textarea' && (
                      <textarea
                        value={applicationData.answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                        required={question.required}
                      />
                    )}

                    {question.type === 'select' && question.options && (
                      <select
                        value={applicationData.answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-text-primary"
                        required={question.required}
                      >
                        <option value="">Select an option</option>
                        {question.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {question.type === 'radio' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <label key={index} className="flex items-center">
                            <input
                              type="radio"
                              name={question.id}
                              value={option}
                              checked={applicationData.answers[question.id] === option}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="mr-2"
                              required={question.required}
                            />
                            <span className="text-text-primary">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-success hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl disabled:opacity-50"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplication;