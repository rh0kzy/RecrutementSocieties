import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

interface Company {
  id: string;
  companyName: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  jobsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'applications' | 'logs'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Companies state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    totalApplications: 0,
    pendingReviews: 0,
  });

  // Create company modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    paymentStatus: 'PENDING' as 'PAID' | 'PENDING' | 'FAILED',
  });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Fetch companies data
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/companies', {
        params: {
          search: searchTerm,
          status: statusFilter,
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      setCompanies(response.data.companies);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/companies', {
        params: { limit: 1000 }, // Get all for stats
      });
      const allCompanies = response.data.companies;
      setStats({
        totalCompanies: response.data.pagination.total,
        activeCompanies: allCompanies.filter((c: Company) => c.status === 'ACTIVE').length,
        totalApplications: 0, // TODO: Implement
        pendingReviews: 0, // TODO: Implement
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Update company status
  const updateCompanyStatus = async (companyId: string, newStatus: string) => {
    const previousStatus = companies.find(c => c.id === companyId)?.status;
    
    try {
      // Optimistic update
      setCompanies(companies.map(c => 
        c.id === companyId ? { ...c, status: newStatus as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' } : c
      ));

      await axios.patch(`/api/companies/${companyId}/status`, {
        status: newStatus,
      });

      // Show success message
      const statusLabel = newStatus === 'ACTIVE' ? 'activated' : newStatus === 'INACTIVE' ? 'deactivated' : 'suspended';
      showNotification(`Company ${statusLabel} successfully`, 'success');
      
      fetchCompanies(); // Refresh to ensure consistency
      fetchStats(); // Update stats
    } catch (error: any) {
      console.error('Error updating company status:', error);
      
      // Revert optimistic update
      if (previousStatus) {
        setCompanies(companies.map(c => 
          c.id === companyId ? { ...c, status: previousStatus } : c
        ));
      }
      
      showNotification(error.response?.data?.error || 'Failed to update company status', 'error');
    }
  };

  // Notification helper
  const showNotification = (message: string, type: 'success' | 'error') => {
    // Simple alert for now - can be replaced with a toast library later
    if (type === 'success') {
      alert(`✅ ${message}`);
    } else {
      alert(`❌ ${message}`);
    }
  };

  // Delete company
  const deleteCompany = async (companyId: string) => {
    if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`/api/companies/${companyId}`);
      fetchCompanies(); // Refresh the list
      fetchStats(); // Update stats
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company');
    }
  };

  // Create new company
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    // Validation
    if (!createFormData.email || !createFormData.password || !createFormData.companyName) {
      setCreateError('All fields are required');
      setCreateLoading(false);
      return;
    }

    if (createFormData.password.length < 6) {
      setCreateError('Password must be at least 6 characters long');
      setCreateLoading(false);
      return;
    }

    try {
      await axios.post('/api/companies', createFormData);
      
      // Reset form and close modal
      setCreateFormData({
        email: '',
        password: '',
        companyName: '',
        status: 'ACTIVE',
        paymentStatus: 'PENDING',
      });
      setIsCreateModalOpen(false);
      
      // Refresh data
      fetchCompanies();
      fetchStats();
    } catch (error: any) {
      console.error('Error creating company:', error);
      setCreateError(error.response?.data?.error || 'Failed to create company');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateError('');
    setCreateFormData({
      email: '',
      password: '',
      companyName: '',
      status: 'ACTIVE',
      paymentStatus: 'PENDING',
    });
  };

  // Effects
  useEffect(() => {
    if (activeTab === 'companies') {
      fetchCompanies();
    }
  }, [activeTab, searchTerm, statusFilter, pagination.page]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);

  const menuItems = [
    {
      id: 'overview' as const,
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'companies' as const,
      name: 'Companies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'applications' as const,
      name: 'Applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'logs' as const,
      name: 'Activity Logs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2 className="text-2xl font-bold text-[#172B4D] mb-6">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#0052CC]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#5E6C84] text-sm font-medium">Total Companies</p>
                    <p className="text-3xl font-bold text-[#172B4D] mt-2">{stats.totalCompanies}</p>
                  </div>
                  <div className="bg-[#DEEBFF] p-3 rounded-full">
                    <svg className="w-8 h-8 text-[#0052CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#36B37E]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#5E6C84] text-sm font-medium">Active Companies</p>
                    <p className="text-3xl font-bold text-[#172B4D] mt-2">{stats.activeCompanies}</p>
                  </div>
                  <div className="bg-[#E3FCEF] p-3 rounded-full">
                    <svg className="w-8 h-8 text-[#36B37E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#6554C0]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#5E6C84] text-sm font-medium">Total Applications</p>
                    <p className="text-3xl font-bold text-[#172B4D] mt-2">0</p>
                  </div>
                  <div className="bg-[#EAE6FF] p-3 rounded-full">
                    <svg className="w-8 h-8 text-[#6554C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#FFAB00]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#5E6C84] text-sm font-medium">Pending Reviews</p>
                    <p className="text-3xl font-bold text-[#172B4D] mt-2">0</p>
                  </div>
                  <div className="bg-[#FFF0B3] p-3 rounded-full">
                    <svg className="w-8 h-8 text-[#FFAB00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-[#172B4D] mb-4">Recent Activity</h3>
              <div className="text-center py-12 text-[#5E6C84]">
                <svg className="w-16 h-16 mx-auto mb-4 text-[#C1C7D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No recent activity</p>
              </div>
            </div>
          </div>
        );

      case 'companies':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#172B4D]">Companies Management</h2>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#0052CC] hover:bg-[#0747A6] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Company
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by company name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#DFE1E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5E6C84]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-[#DFE1E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Companies Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="text-center py-12 text-[#5E6C84]">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0052CC]"></div>
                  <p className="mt-4">Loading companies...</p>
                </div>
              ) : companies.length === 0 ? (
                <div className="text-center py-12 text-[#5E6C84]">
                  <svg className="w-16 h-16 mx-auto mb-4 text-[#C1C7D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>No companies found</p>
                  <p className="text-sm mt-2">Create your first company to get started</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F4F5F7] border-b border-[#DFE1E6]">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#5E6C84] uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#5E6C84] uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#5E6C84] uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#5E6C84] uppercase tracking-wider">
                            Payment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#5E6C84] uppercase tracking-wider">
                            Jobs
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#5E6C84] uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-[#5E6C84] uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#DFE1E6]">
                        {companies.map((company) => (
                          <tr key={company.id} className="hover:bg-[#F4F5F7] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-[#0052CC] rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {company.companyName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-[#172B4D]">{company.companyName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#5E6C84]">{company.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  company.status === 'ACTIVE'
                                    ? 'bg-[#E3FCEF] text-[#36B37E]'
                                    : company.status === 'SUSPENDED'
                                    ? 'bg-[#FFEBE6] text-[#DE350B]'
                                    : 'bg-[#F4F5F7] text-[#5E6C84]'
                                }`}
                              >
                                {company.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  company.paymentStatus === 'PAID'
                                    ? 'bg-[#E3FCEF] text-[#36B37E]'
                                    : company.paymentStatus === 'FAILED'
                                    ? 'bg-[#FFEBE6] text-[#DE350B]'
                                    : 'bg-[#FFF0B3] text-[#FFAB00]'
                                }`}
                              >
                                {company.paymentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5E6C84]">
                              {company.jobsCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5E6C84]">
                              {new Date(company.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2 items-center">
                                <div className="relative group">
                                  <select
                                    value={company.status}
                                    onChange={(e) => updateCompanyStatus(company.id, e.target.value)}
                                    className={`text-xs px-3 py-1.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC] transition-all cursor-pointer font-medium ${
                                      company.status === 'ACTIVE'
                                        ? 'border-[#36B37E] text-[#36B37E] hover:bg-[#E3FCEF]'
                                        : company.status === 'SUSPENDED'
                                        ? 'border-[#DE350B] text-[#DE350B] hover:bg-[#FFEBE6]'
                                        : 'border-[#5E6C84] text-[#5E6C84] hover:bg-[#F4F5F7]'
                                    }`}
                                    title="Change company status"
                                  >
                                    <option value="ACTIVE">✓ Active</option>
                                    <option value="INACTIVE">○ Inactive</option>
                                    <option value="SUSPENDED">✕ Suspended</option>
                                  </select>
                                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#172B4D] text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                    Click to change status
                                  </div>
                                </div>
                                <button
                                  onClick={() => deleteCompany(company.id)}
                                  className="text-[#DE350B] hover:text-[#BF2600] hover:bg-[#FFEBE6] p-2 rounded-lg transition-all"
                                  title="Delete company permanently"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="bg-[#F4F5F7] px-6 py-4 flex items-center justify-between border-t border-[#DFE1E6]">
                      <div className="text-sm text-[#5E6C84]">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} companies
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                          disabled={pagination.page === 1}
                          className="px-3 py-1 border border-[#DFE1E6] rounded bg-white text-[#172B4D] hover:bg-[#F4F5F7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setPagination({ ...pagination, page })}
                            className={`px-3 py-1 border rounded transition-colors ${
                              page === pagination.page
                                ? 'bg-[#0052CC] text-white border-[#0052CC]'
                                : 'bg-white text-[#172B4D] border-[#DFE1E6] hover:bg-[#F4F5F7]'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                          disabled={pagination.page === pagination.totalPages}
                          className="px-3 py-1 border border-[#DFE1E6] rounded bg-white text-[#172B4D] hover:bg-[#F4F5F7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'applications':
        return (
          <div>
            <h2 className="text-2xl font-bold text-[#172B4D] mb-6">All Applications</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12 text-[#5E6C84]">
                <svg className="w-16 h-16 mx-auto mb-4 text-[#C1C7D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No applications yet</p>
              </div>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div>
            <h2 className="text-2xl font-bold text-[#172B4D] mb-6">Activity Logs</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-12 text-[#5E6C84]">
                <svg className="w-16 h-16 mx-auto mb-4 text-[#C1C7D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p>No activity logs</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F5F7]">
      {/* Sidebar */}
      <aside
        className={`bg-[#172B4D] text-white transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } flex flex-col`}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-[#253858]">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-[#8993A4] mt-1">Recruitment SaaS</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-[#253858] rounded-lg transition-colors"
            >
              <svg
                className={`w-5 h-5 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-[#0052CC] text-white shadow-lg'
                  : 'text-[#8993A4] hover:bg-[#253858] hover:text-white'
              }`}
            >
              {item.icon}
              {!isSidebarCollapsed && <span className="font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-[#253858]">
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 bg-[#0052CC] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold">A</span>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin</p>
                <p className="text-xs text-[#8993A4] truncate">admin@platform.com</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full mt-3 flex items-center gap-3 px-4 py-2 rounded-lg text-[#8993A4] hover:bg-[#DE350B] hover:text-white transition-colors ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-[#DFE1E6] px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#172B4D]">
                {menuItems.find((item) => item.id === activeTab)?.name}
              </h1>
              <p className="text-sm text-[#5E6C84] mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-[#DFE1E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5E6C84]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-[#5E6C84] hover:bg-[#F4F5F7] rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#DE350B] rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      {/* Create Company Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0052CC] to-[#0747A6] px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Create New Company</h3>
                <button
                  onClick={handleCloseCreateModal}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateCompany} className="p-6 space-y-4">
              {/* Error Message */}
              {createError && (
                <div className="bg-red-50 border-l-4 border-[#DE350B] p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-[#DE350B] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#DE350B] text-sm font-medium">{createError}</span>
                  </div>
                </div>
              )}

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-[#172B4D] mb-2">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={createFormData.companyName}
                  onChange={(e) => setCreateFormData({ ...createFormData, companyName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="Acme Corporation"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#172B4D] mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="company@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#172B4D] mb-2">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
                <p className="text-xs text-[#5E6C84] mt-1">Must be at least 6 characters long</p>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-[#172B4D] mb-2">
                  Account Status
                </label>
                <select
                  id="status"
                  value={createFormData.status}
                  onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label htmlFor="paymentStatus" className="block text-sm font-semibold text-[#172B4D] mb-2">
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  value={createFormData.paymentStatus}
                  onChange={(e) => setCreateFormData({ ...createFormData, paymentStatus: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#0052CC] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                >
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-[#5E6C84] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0052CC] hover:bg-[#0747A6] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Company'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
