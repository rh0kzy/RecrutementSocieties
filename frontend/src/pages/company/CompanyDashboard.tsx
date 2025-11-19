import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

interface CompanyProfile {
  id: string;
  companyName: string;
  email: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  styling?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
}

interface Job {
  id: number;
  title: string;
  description: string;
  deadline: string | null;
  extraQuestions: CustomQuestion[] | null;
  createdAt: string;
  _count: {
    applications: number;
  };
}

interface CustomQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'radio';
  options?: string[];
  required: boolean;
}

interface Application {
  id: number;
  candidate: {
    firstName: string;
    lastName: string;
    user: {
      email: string;
    };
  };
  job: {
    title: string;
    deadline: string | null;
  };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'settings'>('overview');
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    extraQuestions: [] as CustomQuestion[]
  });
  const [jobError, setJobError] = useState('');
  const [jobSubmitting, setJobSubmitting] = useState(false);

  // Styling state
  const [styling, setStyling] = useState({
    primaryColor: '#0052CC',
    secondaryColor: '#36B37E',
    fontFamily: 'Inter'
  });
  const [stylingLoading, setStylingLoading] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingReview: 0,
    hired: 0
  });

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState('');

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    } else if (activeTab === 'jobs') {
      fetchJobs();
    } else if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/companies/profile');
      setCompanyProfile(response.data);
      if (response.data.styling) {
        setStyling(response.data.styling);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      // For now, use mock data if profile endpoint doesn't exist
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setCompanyProfile({
        id: user.id || '1',
        companyName: user.companyName || 'Demo Company',
        email: user.email || 'company@example.com',
        status: 'ACTIVE',
        paymentStatus: 'PAID',
        createdAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const response = await axios.get('/api/jobs/my-jobs');
      setJobs(response.data);
      setStats(prev => ({ ...prev, activeJobs: response.data.length }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch jobs for active jobs count
      const jobsResponse = await axios.get('/api/jobs/my-jobs');
      const jobsList = jobsResponse.data;
      const totalApps = jobsList.reduce((sum: number, job: Job) => sum + job._count.applications, 0);

      // Fetch applications for status counts
      const appsResponse = await axios.get('/api/applications/company');
      const applications = appsResponse.data.applications;
      const pendingReview = applications.filter((app: Application) => app.status === 'PENDING').length;
      const hired = applications.filter((app: Application) => app.status === 'ACCEPTED').length;
      
      setStats({
        activeJobs: jobsList.length,
        totalApplications: totalApps,
        pendingReview,
        hired
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to basic stats if applications endpoint fails
      try {
        const jobsResponse = await axios.get('/api/jobs/my-jobs');
        const jobsList = jobsResponse.data;
        const totalApps = jobsList.reduce((sum: number, job: Job) => sum + job._count.applications, 0);
        
        setStats({
          activeJobs: jobsList.length,
          totalApplications: totalApps,
          pendingReview: 0,
          hired: 0
        });
      } catch (jobsError) {
        console.error('Error fetching jobs for stats:', jobsError);
      }
    }
  };

  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      setApplicationsError('');
      const response = await axios.get('/api/applications/company');
      setApplications(response.data.applications);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setApplicationsError(error.response?.data?.error || 'Failed to fetch applications');
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openJobModal = (job: Job | null = null) => {
    if (job) {
      setEditingJob(job);
      setJobFormData({
        title: job.title,
        description: job.description,
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
        extraQuestions: job.extraQuestions || []
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        title: '',
        description: '',
        deadline: '',
        extraQuestions: []
      });
    }
    setJobError('');
    setIsJobModalOpen(true);
  };

  const closeJobModal = () => {
    setIsJobModalOpen(false);
    setEditingJob(null);
    setJobFormData({
      title: '',
      description: '',
      deadline: '',
      extraQuestions: []
    });
    setJobError('');
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobError('');
    setJobSubmitting(true);

    try {
      if (editingJob) {
        await axios.put(`/api/jobs/${editingJob.id}`, {
          ...jobFormData,
          deadline: jobFormData.deadline || null,
          extraQuestions: jobFormData.extraQuestions.length > 0 ? jobFormData.extraQuestions : null
        });
      } else {
        await axios.post('/api/jobs', {
          ...jobFormData,
          deadline: jobFormData.deadline || null,
          extraQuestions: jobFormData.extraQuestions.length > 0 ? jobFormData.extraQuestions : null
        });
      }
      
      await fetchJobs();
      closeJobModal();
    } catch (error: any) {
      setJobError(error.response?.data?.message || 'Error saving job');
    } finally {
      setJobSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!window.confirm('Are you sure you want to delete this job? All applications will be lost.')) {
      return;
    }

    try {
      await axios.delete(`/api/jobs/${jobId}`);
      await fetchJobs();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error deleting job');
    }
  };

  const addCustomQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'text',
      required: false
    };
    setJobFormData(prev => ({
      ...prev,
      extraQuestions: [...prev.extraQuestions, newQuestion]
    }));
  };

  const updateCustomQuestion = (id: string, field: keyof CustomQuestion, value: any) => {
    setJobFormData(prev => ({
      ...prev,
      extraQuestions: prev.extraQuestions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeCustomQuestion = (id: string) => {
    setJobFormData(prev => ({
      ...prev,
      extraQuestions: prev.extraQuestions.filter(q => q.id !== id)
    }));
  };

  const handleSaveStyling = async () => {
    setStylingLoading(true);
    try {
      // TODO: Implement API endpoint to save styling
      await axios.patch('/api/companies/styling', { styling });
      alert('Styling saved successfully');
    } catch (error) {
      console.error('Error saving styling:', error);
      alert('Error saving styling. Feature coming soon!');
    } finally {
      setStylingLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'jobs':
        return renderJobs();
      case 'applications':
        return renderApplications();
      case 'settings':
        return renderSettings();
      default:
        return null;
    }
  };

  const renderOverview = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6">Dashboard Overview</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface rounded-xl shadow-medium p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Active Jobs</p>
                <p className="text-3xl font-bold text-text-primary mt-2">{stats.activeJobs}</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-medium p-6 border-l-4 border-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-text-primary mt-2">{stats.totalApplications}</p>
              </div>
              <div className="bg-success/10 rounded-xl p-3">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-medium p-6 border-l-4 border-warning">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-text-primary mt-2">{stats.pendingReview}</p>
              </div>
              <div className="bg-warning/10 rounded-xl p-3">
                <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-medium p-6 border-l-4 border-info">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Hired</p>
                <p className="text-3xl font-bold text-text-primary mt-2">{stats.hired}</p>
              </div>
              <div className="bg-info/10 rounded-xl p-3">
                <svg className="w-8 h-8 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-surface rounded-xl shadow-medium p-6 mb-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Welcome back, {companyProfile?.companyName || 'Company'}!
          </h3>
          <p className="text-gray-600 mb-4">
            Manage your job postings, review applications, and track your recruitment progress all in one place.
          </p>
          <button
            onClick={() => setActiveTab('jobs')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Post a New Job
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="text-gray-500 text-center py-8">
            No recent activity to display
          </div>
        </div>
      </div>
    );
  };

  const renderJobs = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Job Postings</h2>
          <button
            onClick={() => openJobModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Job</span>
          </button>
        </div>

        {jobsLoading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-500 text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No jobs posted yet</p>
              <p className="text-sm mt-2">Create your first job posting to start receiving applications</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{job.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {job.deadline ? (
                        <span className="text-sm text-gray-900">
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">No deadline</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {job._count.applications}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {job.extraQuestions?.length || 0} custom
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openJobModal(job)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Job Modal */}
        {isJobModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingJob ? 'Edit Job' : 'Create New Job'}
                  </h3>
                  <button
                    onClick={closeJobModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {jobError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {jobError}
                  </div>
                )}

                <form onSubmit={handleJobSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={jobFormData.description}
                      onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the role, responsibilities, and requirements..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                    <input
                      type="date"
                      value={jobFormData.deadline}
                      onChange={(e) => setJobFormData({ ...jobFormData, deadline: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">Custom Questions</h4>
                      <button
                        type="button"
                        onClick={addCustomQuestion}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Question
                      </button>
                    </div>

                    {jobFormData.extraQuestions.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No custom questions added</p>
                    ) : (
                      <div className="space-y-3">
                        {jobFormData.extraQuestions.map((question, index) => (
                          <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeCustomQuestion(question.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <input
                              type="text"
                              value={question.question}
                              onChange={(e) => updateCustomQuestion(question.id, 'question', e.target.value)}
                              placeholder="Enter your question..."
                              className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                            />
                            <div className="flex space-x-2">
                              <select
                                value={question.type}
                                onChange={(e) => updateCustomQuestion(question.id, 'type', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded"
                              >
                                <option value="text">Short Text</option>
                                <option value="textarea">Long Text</option>
                                <option value="select">Dropdown</option>
                                <option value="radio">Multiple Choice</option>
                              </select>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={question.required}
                                  onChange={(e) => updateCustomQuestion(question.id, 'required', e.target.checked)}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700">Required</span>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeJobModal}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={jobSubmitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {jobSubmitting ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderApplications = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6">Applications</h2>

        <div className="bg-surface rounded-xl shadow-medium p-6">
          {applicationsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-text-secondary mt-4">Loading applications...</p>
            </div>
          ) : applicationsError ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-error mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-error font-medium">Error loading applications</p>
              <p className="text-text-secondary text-sm mt-2">{applicationsError}</p>
              <button
                onClick={fetchApplications}
                className="mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-text-secondary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium text-text-primary">No applications yet</p>
              <p className="text-text-secondary text-sm mt-2">Applications will appear here once candidates start applying to your jobs</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {application.candidate.firstName} {application.candidate.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.candidate.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.job.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          application.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyProfile?.companyName || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={companyProfile?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  companyProfile?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {companyProfile?.status || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
            <div className="space-y-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Change Password
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                Two-Factor Authentication
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Application Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Styling Customization */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Styling</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={styling.primaryColor}
                    onChange={(e) => setStyling({ ...styling, primaryColor: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={styling.primaryColor}
                    onChange={(e) => setStyling({ ...styling, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="#0052CC"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={styling.secondaryColor}
                    onChange={(e) => setStyling({ ...styling, secondaryColor: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={styling.secondaryColor}
                    onChange={(e) => setStyling({ ...styling, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="#36B37E"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <select
                  value={styling.fontFamily}
                  onChange={(e) => setStyling({ ...styling, fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
              <button
                onClick={handleSaveStyling}
                disabled={stylingLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {stylingLoading ? 'Saving...' : 'Save Styling'}
              </button>
              <p className="text-xs text-gray-500 italic">
                Styling will be applied to your public application pages
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once you deactivate your account, you will lose access to all job postings and applications.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-primary">
      {/* Top Navigation Bar */}
      <nav className="bg-surface shadow-low border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">RecruitmentSaaS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">{companyProfile?.companyName}</span>
              <button
                onClick={handleLogout}
                className="bg-error hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-surface shadow-medium min-h-screen">
          <div className="p-6">
            <div className="mb-8">
              <div className="bg-primary/10 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-center text-sm font-medium text-text-primary">{companyProfile?.companyName}</p>
              <p className="text-center text-xs text-text-muted">{companyProfile?.email}</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('jobs')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'jobs'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Jobs</span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'applications'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Applications</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;
