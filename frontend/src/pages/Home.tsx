import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

export default function Home() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for mobile menu
  useKeyboardNavigation(mobileMenuOpen, () => setMobileMenuOpen(false), mobileMenuRef);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (isLoading) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [isLoading]);

  // Simulate initial page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  const isVisible = (sectionId: string) => visibleSections.has(sectionId);

  const handleNavigation = async (path: string) => {
    setNavigatingTo(path);
    // Simulate navigation delay for better UX
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "What is RecruitHub?",
      answer: "RecruitHub is a comprehensive SaaS platform that streamlines the recruitment process by connecting companies with qualified candidates. Our secure platform handles everything from job posting to candidate evaluation, ensuring a smooth and efficient hiring experience for both parties."
    },
    {
      question: "How does the recruitment process work?",
      answer: "Companies create job postings with custom application forms. Candidates submit their profiles along with required documents (CV, ID card, military status). Companies review applications securely within the platform and make hiring decisions. All communications happen via email notifications."
    },
    {
      question: "Is my data secure on RecruitHub?",
      answer: "Absolutely. We use enterprise-grade security measures including encrypted file storage with Backblaze B2, IP address logging, and role-based access control. Companies can only view their own applications, and candidate documents are view-only with no download capabilities."
    },
    {
      question: "What documents do candidates need to upload?",
      answer: "Candidates typically need to upload their CV/resume, national ID card, and military situation certificate. Some job postings may require additional documents based on the company's specific requirements."
    },
    {
      question: "Can I edit my application after submission?",
      answer: "No, once you submit your application, it cannot be edited. This ensures the integrity of the recruitment process and maintains a complete audit trail. Make sure all information is accurate before submitting."
    },
    {
      question: "How long does the recruitment process take?",
      answer: "The timeline varies depending on the company and position. Typically, companies review applications within 1-2 weeks and may conduct interviews shortly after. You'll receive email notifications about the status of your application."
    },
    {
      question: "What are the costs for companies?",
      answer: "We offer flexible pricing plans based on your recruitment needs. Contact our sales team for a customized quote. All plans include secure document storage, email notifications, and full platform access."
    },
    {
      question: "How do I get started as a company?",
      answer: "Simply sign up for a company account, complete the verification process, and you'll be guided through setting up your first job posting. Our platform is designed to be intuitive and requires minimal training."
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-primary flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-text-secondary">Loading RecruitHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-primary">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="bg-white shadow-low border-b border-border" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary hover:text-secondary transition-colors duration-300 cursor-pointer transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md">
                  <a href="#hero" aria-label="RecruitHub - Go to homepage">
                    RecruitHub
                  </a>
                </h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8" role="menubar">
                <a
                  href="#features"
                  className="text-text-secondary hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  role="menuitem"
                  aria-label="Navigate to Features section"
                >
                  Features
                </a>
                <a
                  href="#companies"
                  className="text-text-secondary hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  role="menuitem"
                  aria-label="Navigate to For Companies section"
                >
                  For Companies
                </a>
                <a
                  href="#candidates"
                  className="text-text-secondary hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  role="menuitem"
                  aria-label="Navigate to For Candidates section"
                >
                  For Candidates
                </a>
                <a
                  href="#security"
                  className="text-text-secondary hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  role="menuitem"
                  aria-label="Navigate to Security section"
                >
                  Security
                </a>
                <a
                  href="#faq"
                  className="text-text-secondary hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  role="menuitem"
                  aria-label="Navigate to FAQ section"
                >
                  FAQ
                </a>
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('/login')}
                disabled={navigatingTo === '/login'}
                className="text-text-secondary hover:text-primary px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                aria-label={navigatingTo === '/login' ? 'Navigating to login page' : 'Go to login page'}
                aria-disabled={navigatingTo === '/login'}
              >
                {navigatingTo === '/login' ? (
                  <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                ) : null}
                Login
              </button>
              <button
                onClick={() => handleNavigation('/signup')}
                disabled={navigatingTo === '/signup'}
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-low hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={navigatingTo === '/signup' ? 'Navigating to signup page' : 'Get started with RecruitHub'}
                aria-disabled={navigatingTo === '/signup'}
              >
                {navigatingTo === '/signup' ? (
                  <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                ) : null}
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-primary hover:bg-background focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-300 hover:scale-110"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              >
                <span className="sr-only">{mobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                {!mobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu" role="menu" aria-label="Mobile navigation menu" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-border shadow-lg">
              <a
                href="#features"
                className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                role="menuitem"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Navigate to Features section"
              >
                Features
              </a>
              <a
                href="#companies"
                className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                role="menuitem"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Navigate to For Companies section"
              >
                For Companies
              </a>
              <a
                href="#candidates"
                className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                role="menuitem"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Navigate to For Candidates section"
              >
                For Candidates
              </a>
              <a
                href="#security"
                className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                role="menuitem"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Navigate to Security section"
              >
                Security
              </a>
              <a
                href="#faq"
                className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                role="menuitem"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Navigate to FAQ section"
              >
                FAQ
              </a>
            </div>
            <div className="pt-4 pb-3 border-t border-border bg-white">
              <div className="flex items-center px-5 space-x-3">
                <button
                  onClick={() => {
                    handleNavigation('/login');
                    setMobileMenuOpen(false);
                  }}
                  disabled={navigatingTo === '/login'}
                  className="text-text-secondary hover:text-primary block px-3 py-2 text-base font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  role="menuitem"
                  aria-label={navigatingTo === '/login' ? 'Navigating to login page' : 'Go to login page'}
                  aria-disabled={navigatingTo === '/login'}
                >
                  {navigatingTo === '/login' ? (
                    <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                  ) : null}
                  Login
                </button>
                <button
                  onClick={() => {
                    handleNavigation('/signup');
                    setMobileMenuOpen(false);
                  }}
                  disabled={navigatingTo === '/signup'}
                  className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-low hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  role="menuitem"
                  aria-label={navigatingTo === '/signup' ? 'Navigating to signup page' : 'Get started with RecruitHub'}
                  aria-disabled={navigatingTo === '/signup'}
                >
                  {navigatingTo === '/signup' ? (
                    <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                  ) : null}
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main id="main-content" role="main">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-secondary py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" data-animate id="hero" aria-labelledby="hero-heading">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className={`text-center transition-all duration-1000 ${isVisible('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 id="hero-heading" className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Streamline Your
                <span className="text-blue-200 block mt-2">Recruitment Process</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed" aria-describedby="hero-description">
                The complete SaaS platform that connects companies with top talent.
                Secure, efficient, and designed for modern recruitment workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Primary actions">
                <button
                  onClick={() => handleNavigation('/signup/company')}
                  disabled={navigatingTo === '/signup/company'}
                  className="bg-white text-primary hover:bg-blue-50 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                  aria-label={navigatingTo === '/signup/company' ? 'Navigating to company signup page' : 'Start hiring today - create a company account'}
                  aria-describedby="hero-description"
                  aria-disabled={navigatingTo === '/signup/company'}
                >
                  {navigatingTo === '/signup/company' ? (
                    <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                  ) : null}
                  Start Hiring Today
                </button>
                <button
                  onClick={() => handleNavigation('/signup/candidate')}
                  disabled={navigatingTo === '/signup/candidate'}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                  aria-label={navigatingTo === '/signup/candidate' ? 'Navigating to candidate signup page' : 'Find your dream job - create a candidate account'}
                  aria-describedby="hero-description"
                  aria-disabled={navigatingTo === '/signup/candidate'}
                >
                  {navigatingTo === '/signup/candidate' ? (
                    <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                  ) : null}
                  Find Your Dream Job
                </button>
              </div>
            </div>

          {/* Hero Visual */}
          <div className={`mt-20 relative transition-all duration-1000 delay-300 ${isVisible('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20 animate-float">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Dashboard Preview */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-success rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-bold text-text-primary">Company Dashboard</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-primary/20 rounded animate-pulse"></div>
                    <div className="h-2 bg-primary/10 rounded w-3/4 animate-pulse"></div>
                    <div className="h-2 bg-primary/30 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform md:-translate-y-4">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-warning rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-bold text-text-primary">Applications Review</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-2 bg-success/30 rounded w-1/3 animate-pulse"></div>
                      <div className="h-2 bg-warning/30 rounded w-1/4 animate-pulse"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-2 bg-success/30 rounded w-2/3 animate-pulse"></div>
                      <div className="h-2 bg-error/30 rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Candidate Profile */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-info rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-bold text-text-primary">Candidate Profile</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-info/20 rounded animate-pulse"></div>
                    <div className="h-2 bg-info/10 rounded w-4/5 animate-pulse"></div>
                    <div className="h-2 bg-info/30 rounded w-3/5 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50" data-animate aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 id="features-heading" className="text-4xl font-extrabold text-text-primary mb-6">
              Complete Recruitment Solution
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed" id="features-description">
              Our SaaS platform revolutionizes the recruitment process by providing a secure,
              efficient, and user-friendly environment for both companies and candidates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Platform features">
            {/* Feature 1 */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0ms' }} role="listitem">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">Job Management</h3>
              <p className="text-text-secondary leading-relaxed">
                Create customized job postings with dynamic application forms.
                Set deadlines and manage your recruitment pipeline efficiently.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms' }}>
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-success group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7 text-success group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">Secure Document Handling</h3>
              <p className="text-text-secondary leading-relaxed">
                View candidate documents securely without downloads. All files are
                encrypted and stored with enterprise-grade security.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-info group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7 text-info group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">Automated Notifications</h3>
              <p className="text-text-secondary leading-relaxed">
                Stay informed with email notifications for new applications,
                status updates, and important recruitment milestones.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
              <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-warning group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7 text-warning group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">Role-Based Security</h3>
              <p className="text-text-secondary leading-relaxed">
                Advanced access control ensures companies see only their data,
                candidates can only edit their profiles before submission.
              </p>
            </div>

            {/* Feature 5 */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7 text-secondary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">Analytics & Insights</h3>
              <p className="text-text-secondary leading-relaxed">
                Track application metrics, review hiring progress, and gain
                insights into your recruitment effectiveness.
              </p>
            </div>

            {/* Feature 6 */}
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '500ms' }}>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-error group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7 text-error group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">IP Tracking & Audit</h3>
              <p className="text-text-secondary leading-relaxed">
                Complete audit trail with IP address logging for all
                applications and actions, ensuring transparency and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section id="companies" className="py-24 px-4 sm:px-6 lg:px-8 bg-white" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible('companies') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl font-extrabold text-text-primary mb-6">
              For Companies
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Streamline your recruitment process with powerful tools designed specifically for modern HR teams.
              Post jobs, review applications, and make data-driven hiring decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Job Posting with Custom Forms */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Job Posting with Custom Forms</h3>
              <p className="text-text-secondary mb-4">
                Create detailed job descriptions and customize application forms with dynamic questions
                tailored to your specific requirements.
              </p>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Rich text job descriptions
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Custom application questions
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Application deadlines
                </li>
              </ul>
            </div>

            {/* Application Management */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Application Management & Review</h3>
              <p className="text-text-secondary mb-4">
                Efficiently manage and review all applications for your jobs. Filter, sort, and track
                candidates through your entire recruitment pipeline.
              </p>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Centralized application view
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Status tracking (Pending/Accepted/Rejected)
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Candidate comparison tools
                </li>
              </ul>
            </div>

            {/* Secure Document Viewing */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Secure Document Viewing</h3>
              <p className="text-text-secondary mb-4">
                View candidate documents securely within the platform. All files are encrypted
                and protected with enterprise-grade security - no downloads allowed.
              </p>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  View-only PDF and document preview
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Encrypted file storage
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  GDPR compliant data handling
                </li>
              </ul>
            </div>

            {/* Email Notifications */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Automated Email Notifications</h3>
              <p className="text-text-secondary mb-4">
                Stay informed with instant email notifications for new applications and important
                recruitment milestones. Never miss a qualified candidate.
              </p>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Instant new application alerts
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Customizable notification preferences
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Daily/weekly summary reports
                </li>
              </ul>
            </div>

            {/* Account Management & Styling */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Account Management & Branding</h3>
              <p className="text-text-secondary mb-4">
                Customize your company profile and branding. Manage team access, set preferences,
                and maintain your professional presence throughout the platform.
              </p>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Company profile customization
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Custom color schemes
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Team member management
                </li>
              </ul>
            </div>

            {/* Activity Logs & Analytics */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Activity Logs & Analytics</h3>
              <p className="text-text-secondary mb-4">
                Track all recruitment activities with comprehensive audit trails. Gain insights
                into your hiring performance with detailed analytics and reporting.
              </p>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Complete audit trail
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Hiring pipeline analytics
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Performance metrics dashboard
                </li>
              </ul>
            </div>
          </div>

          {/* Companies CTA */}
          <div className="text-center">
            <div className="bg-blue-50 rounded-3xl p-10 border border-blue-100">
              <h3 className="text-3xl font-bold text-text-primary mb-4">
                Ready to Transform Your Recruitment Process?
              </h3>
              <p className="text-text-secondary mb-8 max-w-2xl mx-auto text-lg">
                Join leading companies already using our platform to find and hire top talent efficiently.
                Start with a free trial and experience the difference.
              </p>
              <button
                onClick={() => navigate('/signup/company')}
                className="bg-primary hover:bg-secondary text-white px-10 py-4 rounded-xl text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Free Trial for Companies
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* For Candidates Section */}
      <section id="candidates" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible('candidates') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl font-extrabold text-text-primary mb-6">
              For Candidates
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Build your professional profile, apply to top companies, and track your applications
              all in one secure place.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className={`space-y-8 transition-all duration-1000 delay-200 ${isVisible('candidates') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2">Professional Profile</h3>
                    <p className="text-text-secondary leading-relaxed">
                      Create a comprehensive profile showcasing your skills, experience, and education.
                      Upload your resume and portfolio once and use it for multiple applications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                      <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2">Easy Application Process</h3>
                    <p className="text-text-secondary leading-relaxed">
                      Apply to jobs with just a few clicks. Track the status of your applications
                      in real-time and receive updates directly from employers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                      <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2">Data Privacy Control</h3>
                    <p className="text-text-secondary leading-relaxed">
                      Your data is yours. Control who sees your profile and manage your privacy settings.
                      We ensure your personal information is protected at all times.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`relative transition-all duration-1000 delay-400 ${isVisible('candidates') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl transform rotate-3 opacity-10"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-24 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-24 bg-green-100 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-24 bg-gray-50 rounded-xl border border-gray-100 p-4">
                      <div className="h-8 w-8 bg-blue-100 rounded-lg mb-3"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-24 bg-gray-50 rounded-xl border border-gray-100 p-4">
                      <div className="h-8 w-8 bg-purple-100 rounded-lg mb-3"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/signup/candidate')}
              className="bg-white text-primary border-2 border-primary hover:bg-blue-50 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Create Candidate Profile
            </button>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="lg:text-center mb-16">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Security First</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Enterprise-Grade Security
            </p>
            <p className="mt-4 max-w-2xl text-xl text-text-secondary lg:mx-auto">
              We take security seriously. Your data is protected by industry-leading security measures.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-text-primary">End-to-End Encryption</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-text-secondary">
                  All data is encrypted in transit and at rest using industry-standard encryption protocols.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-text-primary">GDPR Compliance</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-text-secondary">
                  Fully compliant with GDPR regulations ensuring your data privacy rights are respected.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v4m0 4h18" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-text-primary">Secure Infrastructure</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-text-secondary">
                  Hosted on secure, scalable infrastructure with 24/7 monitoring and automated backups.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 8m0 0a8 8 0 00-8 8c0 2.472.345 4.865.99 7.131M8 8a8 8 0 001.946 2.197M8 8a8 8 0 004.164-2.484" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-text-primary">Regular Audits</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-text-secondary">
                  Regular security audits and penetration testing to identify and address potential vulnerabilities.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden" data-animate id="faq" aria-labelledby="faq-heading">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 id="faq-heading" className="text-4xl font-extrabold text-text-primary mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto" id="faq-description">
              Everything you need to know about our platform and how it can help you.
            </p>
          </div>

          <div className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
                  aria-expanded={expandedFaq === index}
                  aria-controls={`faq-answer-${index}`}
                  aria-describedby={`faq-question-${index}`}
                >
                  <span id={`faq-question-${index}`} className="text-lg font-bold text-text-primary pr-8">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${expandedFaq === index ? 'rotate-180 bg-primary text-white' : 'text-primary'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  aria-hidden={expandedFaq !== index}
                >
                  <div className="px-8 pb-8 pt-2 bg-gray-50/50">
                    <p className="text-text-secondary leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`text-center mt-16 transition-all duration-1000 delay-400 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-100">
              <div className="bg-white rounded-xl px-8 py-6">
                <p className="text-text-secondary mb-4 font-medium">
                  Still have questions? We're here to help.
                </p>
                <button
                  onClick={() => handleNavigation('/login')}
                  disabled={navigatingTo === '/login'}
                  className="text-primary font-bold hover:text-secondary transition-colors flex items-center justify-center mx-auto group"
                >
                  Contact Support
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" data-animate id="cta" aria-labelledby="cta-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary"></div>
        
        {/* Decorative Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white opacity-10 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-white opacity-5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 id="cta-heading" className="text-5xl font-extrabold text-white mb-6 tracking-tight">
              Ready to Transform Your Recruitment?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed" id="cta-description">
              Join hundreds of companies already using our platform to find top talent efficiently and securely.
              Start your journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center" role="group" aria-label="Final call-to-action">
              <button
                onClick={() => handleNavigation('/signup/company')}
                disabled={navigatingTo === '/signup/company'}
                className="bg-white text-primary hover:bg-blue-50 px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                aria-label={navigatingTo === '/signup/company' ? 'Navigating to company signup page' : 'Start your free trial - create company account'}
                aria-describedby="cta-description"
                aria-disabled={navigatingTo === '/signup/company'}
              >
                {navigatingTo === '/signup/company' ? (
                  <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                ) : null}
                Start Free Trial
              </button>
              <button
                onClick={() => handleNavigation('/login')}
                disabled={navigatingTo === '/login'}
                className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-200 hover:border-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                aria-label={navigatingTo === '/login' ? 'Navigating to login page' : 'Login to your RecruitHub dashboard'}
                aria-describedby="cta-description"
                aria-disabled={navigatingTo === '/login'}
              >
                {navigatingTo === '/login' ? (
                  <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                ) : null}
                Login
              </button>
            </div>
            
            <p className="mt-8 text-blue-200 text-sm">
              No credit card required for trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-primary text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <h3 className="text-2xl font-bold">RecruitHub</h3>
              </div>
              <p className="text-gray-400 mb-8 max-w-md text-lg leading-relaxed">
                The complete SaaS solution for modern recruitment.
                Connecting companies with top talent through secure, efficient, and intelligent workflows.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>For Companies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>For Candidates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 RecruitHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <span className="text-gray-600 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                System Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
}
