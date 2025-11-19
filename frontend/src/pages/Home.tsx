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
  }, []);

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
      <div className="min-h-screen bg-white font-primary">
        {/* Loading Navigation Skeleton */}
        <nav className="bg-white shadow-low border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <SkeletonLoader className="w-32 h-8" />
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <SkeletonLoader className="w-16 h-8" />
                <SkeletonLoader className="w-20 h-8" />
              </div>
              <div className="md:hidden">
                <SkeletonLoader className="w-8 h-8 rounded" />
              </div>
            </div>
          </div>
        </nav>

        {/* Loading Hero Section */}
        <section className="bg-gradient-to-br from-background to-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <SkeletonLoader className="w-3/4 h-12 mx-auto mb-6" />
              <SkeletonLoader className="w-2/3 h-6 mx-auto mb-8" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <SkeletonLoader className="w-48 h-12 rounded-lg" />
                <SkeletonLoader className="w-32 h-12 rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Loading Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <SkeletonLoader className="w-64 h-8 mx-auto mb-4" />
              <SkeletonLoader className="w-96 h-4 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-low">
                  <SkeletonLoader className="w-12 h-12 rounded-lg mb-4" />
                  <SkeletonLoader className="w-3/4 h-6 mb-2" />
                  <SkeletonLoader lines={2} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Loading Spinner Overlay */}
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-text-secondary">Loading RecruitHub...</p>
          </div>
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
        <section className="bg-gradient-to-br from-background to-white py-20 px-4 sm:px-6 lg:px-8" data-animate id="hero" aria-labelledby="hero-heading">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center transition-all duration-1000 ${isVisible('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 id="hero-heading" className="text-5xl md:text-6xl font-extrabold text-text-primary mb-6 leading-tight">
                Streamline Your
                <span className="text-primary block">Recruitment Process</span>
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed" aria-describedby="hero-description">
                The complete SaaS platform that connects companies with top talent.
                Secure, efficient, and designed for modern recruitment workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Primary actions">
                <button
                  onClick={() => handleNavigation('/signup/company')}
                  disabled={navigatingTo === '/signup/company'}
                  className="bg-primary hover:bg-secondary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-medium hover:shadow-high disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                  className="bg-white hover:bg-background text-primary border-2 border-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-200 shadow-low hover:shadow-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
          <div className={`mt-16 relative transition-all duration-1000 delay-300 ${isVisible('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white rounded-2xl shadow-high p-8 border border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Dashboard Preview */}
                <div className="bg-background rounded-xl p-6 border border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-success rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium text-text-primary">Company Dashboard</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-primary/20 rounded animate-pulse"></div>
                    <div className="h-2 bg-primary/10 rounded w-3/4 animate-pulse"></div>
                    <div className="h-2 bg-primary/30 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="bg-background rounded-xl p-6 border border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-warning rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium text-text-primary">Applications Review</span>
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
                <div className="bg-background rounded-xl p-6 border border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-info rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium text-text-primary">Candidate Profile</span>
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
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background" data-animate aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 id="features-heading" className="text-4xl font-bold text-text-primary mb-4">
              Complete Recruitment Solution
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto" id="features-description">
              Our SaaS platform revolutionizes the recruitment process by providing a secure,
              efficient, and user-friendly environment for both companies and candidates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Platform features">
            {/* Feature 1 */}
            <div className={`bg-white rounded-xl p-6 sm:p-8 shadow-medium border border-border hover:shadow-high transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0ms' }} role="listitem">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300" aria-hidden="true">
                <svg className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Job Management</h3>
              <p className="text-text-secondary">
                Create customized job postings with dynamic application forms.
                Set deadlines and manage your recruitment pipeline efficiently.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`bg-white rounded-xl p-6 sm:p-8 shadow-medium border border-border hover:shadow-high transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms' }}>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors duration-300">
                <svg className="w-6 h-6 text-success group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Secure Document Handling</h3>
              <p className="text-text-secondary">
                View candidate documents securely without downloads. All files are
                encrypted and stored with enterprise-grade security.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`bg-white rounded-xl p-6 sm:p-8 shadow-medium border border-border hover:shadow-high transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
              <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-info/20 transition-colors duration-300">
                <svg className="w-6 h-6 text-info group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Automated Notifications</h3>
              <p className="text-text-secondary">
                Stay informed with email notifications for new applications,
                status updates, and important recruitment milestones.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`bg-white rounded-xl p-6 sm:p-8 shadow-medium border border-border hover:shadow-high transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-warning/20 transition-colors duration-300">
                <svg className="w-6 h-6 text-warning group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Role-Based Security</h3>
              <p className="text-text-secondary">
                Advanced access control ensures companies see only their data,
                candidates can only edit their profiles before submission.
              </p>
            </div>

            {/* Feature 5 */}
            <div className={`bg-white rounded-xl p-6 sm:p-8 shadow-medium border border-border hover:shadow-high transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors duration-300">
                <svg className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Analytics & Insights</h3>
              <p className="text-text-secondary">
                Track application metrics, review hiring progress, and gain
                insights into your recruitment effectiveness.
              </p>
            </div>

            {/* Feature 6 */}
            <div className={`bg-white rounded-xl p-6 sm:p-8 shadow-medium border border-border hover:shadow-high transition-all duration-300 hover:-translate-y-2 group ${isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '500ms' }}>
              <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-error/20 transition-colors duration-300">
                <svg className="w-6 h-6 text-error group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">IP Tracking & Audit</h3>
              <p className="text-text-secondary">
                Complete audit trail with IP address logging for all
                applications and actions, ensuring transparency and security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section id="companies" className="py-20 px-4 sm:px-6 lg:px-8 bg-white" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible('companies') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              For Companies
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Streamline your recruitment process with powerful tools designed specifically for modern HR teams.
              Post jobs, review applications, and make data-driven hiring decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Job Posting with Custom Forms */}
            <div className="bg-background rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Job Posting with Custom Forms</h3>
              <p className="text-text-secondary mb-4">
                Create detailed job descriptions and customize application forms with dynamic questions
                tailored to your specific requirements.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Rich text job descriptions
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom application questions
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Application deadlines
                </li>
              </ul>
            </div>

            {/* Application Management */}
            <div className="bg-background rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Application Management & Review</h3>
              <p className="text-text-secondary mb-4">
                Efficiently manage and review all applications for your jobs. Filter, sort, and track
                candidates through your entire recruitment pipeline.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Centralized application view
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Status tracking (Pending/Accepted/Rejected)
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Candidate comparison tools
                </li>
              </ul>
            </div>

            {/* Secure Document Viewing */}
            <div className="bg-background rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-info/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Secure Document Viewing</h3>
              <p className="text-text-secondary mb-4">
                View candidate documents securely within the platform. All files are encrypted
                and protected with enterprise-grade security - no downloads allowed.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  View-only PDF and document preview
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Encrypted file storage
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  GDPR compliant data handling
                </li>
              </ul>
            </div>

            {/* Email Notifications */}
            <div className="bg-background rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-warning/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Automated Email Notifications</h3>
              <p className="text-text-secondary mb-4">
                Stay informed with instant email notifications for new applications and important
                recruitment milestones. Never miss a qualified candidate.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Instant new application alerts
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Customizable notification preferences
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Daily/weekly summary reports
                </li>
              </ul>
            </div>

            {/* Account Management & Styling */}
            <div className="bg-background rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
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
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Company profile customization
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom color schemes
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Team member management
                </li>
              </ul>
            </div>

            {/* Activity Logs & Analytics */}
            <div className="bg-background rounded-xl p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-error/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Activity Logs & Analytics</h3>
              <p className="text-text-secondary mb-4">
                Track all recruitment activities with comprehensive audit trails. Gain insights
                into your hiring performance with detailed analytics and reporting.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Complete audit trail
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Hiring pipeline analytics
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Performance metrics dashboard
                </li>
              </ul>
            </div>
          </div>

          {/* Companies CTA */}
          <div className="text-center">
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Ready to Transform Your Recruitment Process?
              </h3>
              <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                Join leading companies already using our platform to find and hire top talent efficiently.
                Start with a free trial and experience the difference.
              </p>
              <button
                onClick={() => navigate('/signup/company')}
                className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-medium"
              >
                Start Free Trial for Companies
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* For Candidates Section */}
      <section id="candidates" className="py-20 px-4 sm:px-6 lg:px-8 bg-background" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              For Candidates
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Apply to multiple positions with ease. Create your professional profile once and
              submit applications securely with all your documents in one streamlined process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Easy Application Process */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Easy Application Process</h3>
              <p className="text-text-secondary mb-4">
                Create your comprehensive profile once and apply to multiple positions with just a few clicks.
                No need to fill out lengthy forms repeatedly.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  One-time profile creation
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Apply to multiple companies
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  User-friendly interface
                </li>
              </ul>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Secure File Upload</h3>
              <p className="text-text-secondary mb-4">
                Upload all required documents securely. Your CV, ID card, and military status documents
                are encrypted and stored with enterprise-grade security.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  CV, ID card, military status
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  File validation and size limits
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Encrypted cloud storage
                </li>
              </ul>
            </div>

            {/* Dynamic Questions */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-info/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Dynamic Job-Specific Questions</h3>
              <p className="text-text-secondary mb-4">
                Answer tailored questions based on each job's requirements. Companies can add custom
                questions to better assess your fit for their specific roles.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Job-specific assessments
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom company questions
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Skills and experience validation
                </li>
              </ul>
            </div>

            {/* Secure Submission */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-warning/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Secure Submission & Tracking</h3>
              <p className="text-text-secondary mb-4">
                Submit applications with confidence. All submissions are logged with timestamps and IP addresses
                for security and audit purposes.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  IP address logging
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Timestamp tracking
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Secure data transmission
                </li>
              </ul>
            </div>

            {/* Email Confirmations */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Email Confirmations & Updates</h3>
              <p className="text-text-secondary mb-4">
                Receive instant email confirmations when you submit applications and status updates
                when companies make decisions on your candidacy.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Application confirmation
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Acceptance notifications
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Rejection notifications
                </li>
              </ul>
            </div>

            {/* Profile Locking */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-error/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Profile Security & Integrity</h3>
              <p className="text-text-secondary mb-4">
                Once submitted, your profile is locked to ensure data integrity and prevent modifications.
                This maintains the authenticity of your application throughout the process.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Post-submission locking
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Data integrity protection
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Audit trail preservation
                </li>
              </ul>
            </div>
          </div>

          {/* Candidates CTA */}
          <div className="text-center">
            <div className="bg-success/5 rounded-2xl p-8 border border-success/20">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Ready to Start Your Job Search?
              </h3>
              <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                Create your professional profile and apply to multiple positions with confidence.
                Join thousands of candidates who have found their dream jobs through our platform.
              </p>
              <button
                onClick={() => navigate('/signup/candidate')}
                className="bg-success hover:bg-success/90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-medium"
              >
                Create Your Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* For Admins Section */}
      <section id="admins" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              For Admins
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Maintain complete oversight and control over the entire recruitment ecosystem.
              Manage companies, monitor applications, and ensure platform integrity with powerful administrative tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Company Account Management */}
            <div className="bg-background rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-error/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Company Account Management</h3>
              <p className="text-text-secondary mb-4">
                Full lifecycle management of company accounts with complete control over
                creation, activation, deactivation, and password resets.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Create new company accounts
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Activate/deactivate accounts
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Password reset capabilities
                </li>
              </ul>
            </div>

            {/* Global Application Oversight */}
            <div className="bg-background rounded-xl p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-info/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Global Application Oversight</h3>
              <p className="text-text-secondary mb-4">
                Monitor all applications across all companies with comprehensive visibility
                into the entire recruitment ecosystem and candidate flow.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  View all applications globally
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cross-company analytics
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Platform-wide insights
                </li>
              </ul>
            </div>

            {/* Activity Logs & Audit Trails */}
            <div className="bg-background rounded-xl p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-warning/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Activity Logs & Audit Trails</h3>
              <p className="text-text-secondary mb-4">
                Complete audit trails for all platform activities with detailed logging
                of admin actions, company activities, and system events.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Admin action logging
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Company activity tracking
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  System event monitoring
                </li>
              </ul>
            </div>

            {/* Email Notifications */}
            <div className="bg-background rounded-xl p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Automated Email Notifications</h3>
              <p className="text-text-secondary mb-4">
                Stay informed with comprehensive email alerts for all critical platform events,
                new signups, applications, and system activities.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  New company signups
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  New application alerts
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  System notifications
                </li>
              </ul>
            </div>

            {/* Dashboard Statistics & Reporting */}
            <div className="bg-background rounded-xl p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Dashboard Statistics & Reporting</h3>
              <p className="text-text-secondary mb-4">
                Comprehensive analytics and reporting dashboard with real-time metrics
                on platform usage, company activity, and recruitment trends.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Total companies/applications
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Activity trends
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Performance metrics
                </li>
              </ul>
            </div>
          </div>

          {/* Admins CTA */}
          <div className="text-center">
            <div className="bg-error/5 rounded-2xl p-8 border border-error/20">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Take Control of Your Recruitment Platform
              </h3>
              <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                Access powerful administrative tools to manage companies, monitor applications,
                and maintain platform integrity. Start with admin access today.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="bg-error hover:bg-error/90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-medium"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-background" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Security & Compliance
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Enterprise-grade security measures protect sensitive candidate data and ensure
              compliance with privacy regulations. Your recruitment process is safe and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Secure File Storage */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Secure File Storage with Backblaze B2</h3>
              <p className="text-text-secondary mb-4">
                All candidate documents are stored in Backblaze B2 cloud storage with enterprise-grade
                security, redundancy, and 99.9% uptime guarantee.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Enterprise cloud storage
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  99.9% uptime SLA
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Global CDN delivery
                </li>
              </ul>
            </div>

            {/* IP Address Logging */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-info/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">IP Address Logging</h3>
              <p className="text-text-secondary mb-4">
                Every application submission is logged with IP address and timestamp for security
                auditing and compliance with data protection regulations.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Complete audit trail
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  GDPR compliance
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Timestamp tracking
                </li>
              </ul>
            </div>

            {/* Role-Based Access Control */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-warning/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Role-Based Access Control (RBAC)</h3>
              <p className="text-text-secondary mb-4">
                Strict access controls ensure users only see data they're authorized to view.
                Admin, Company, and Candidate roles have clearly defined permissions.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Admin, Company, Candidate roles
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Data isolation by role
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Permission-based access
                </li>
              </ul>
            </div>

            {/* No Document Downloads */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">View-Only Document Security</h3>
              <p className="text-text-secondary mb-4">
                Documents can only be viewed within the platform - no downloads allowed.
                This prevents unauthorized distribution and maintains data security.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Secure in-platform viewing
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No download capability
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Prevents data leakage
                </li>
              </ul>
            </div>

            {/* Encrypted Data Storage */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-border hover:shadow-high transition-all duration-300">
              <div className="w-14 h-14 bg-error/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Encrypted Data Storage</h3>
              <p className="text-text-secondary mb-4">
                All sensitive data is encrypted at rest using industry-standard encryption protocols.
                Database and file storage are fully encrypted and secure.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  AES-256 encryption
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Database encryption
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-success mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Secure key management
                </li>
              </ul>
            </div>
          </div>

          {/* Security CTA */}
          <div className="text-center">
            <div className="bg-success/5 rounded-2xl p-8 border border-success/20">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Your Data Security is Our Priority
              </h3>
              <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                Rest assured that your recruitment data is protected by enterprise-grade security measures.
                We take compliance and data protection seriously to maintain trust and integrity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleNavigation('/signup/company')}
                  disabled={navigatingTo === '/signup/company'}
                  className="bg-success hover:bg-success/90 text-white px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {navigatingTo === '/signup/company' ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : null}
                  Get Started Securely
                </button>
                <button
                  onClick={() => handleNavigation('/login')}
                  disabled={navigatingTo === '/login'}
                  className="border-2 border-success text-success hover:bg-success hover:text-white px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {navigatingTo === '/login' ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : null}
                  Login to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background" data-animate id="faq" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 id="faq-heading" className="text-4xl font-bold text-text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto" id="faq-description">
              Find answers to common questions about our recruitment platform
            </p>
          </div>

          <div className={`space-y-4 transition-all duration-1000 delay-200 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-low border border-border overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-background/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  aria-expanded={expandedFaq === index}
                  aria-controls={`faq-answer-${index}`}
                  aria-describedby={`faq-question-${index}`}
                >
                  <span id={`faq-question-${index}`} className="text-lg font-semibold text-text-primary pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-primary transform transition-transform duration-200 flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  aria-hidden={expandedFaq !== index}
                >
                  <div className="px-6 pb-4">
                    <p className="text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`text-center mt-12 transition-all duration-1000 delay-400 ${isVisible('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-text-secondary mb-6">
              Still have questions? We're here to help.
            </p>
            <button
              onClick={() => handleNavigation('/login')}
              disabled={navigatingTo === '/login'}
              className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-low hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={navigatingTo === '/login' ? 'Navigating to contact page' : 'Contact our support team'}
              aria-disabled={navigatingTo === '/login'}
            >
              {navigatingTo === '/login' ? (
                <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
              ) : null}
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary" data-animate id="cta" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 id="cta-heading" className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Recruitment?
            </h2>
            <p className="text-xl text-white/90 mb-8" id="cta-description">
              Join hundreds of companies already using our platform to find top talent efficiently and securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Final call-to-action">
              <button
                onClick={() => handleNavigation('/signup/company')}
                disabled={navigatingTo === '/signup/company'}
                className="bg-white text-primary hover:bg-background px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label={navigatingTo === '/signup/company' ? 'Navigating to company signup page' : 'Start your free trial - create company account'}
                aria-describedby="cta-description"
                aria-disabled={navigatingTo === '/signup/company'}
              >
                {navigatingTo === '/signup/company' ? (
                  <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                ) : null}
                Start Your Free Trial
              </button>
              <button
                onClick={() => handleNavigation('/login')}
                disabled={navigatingTo === '/login'}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label={navigatingTo === '/login' ? 'Navigating to login page' : 'Login to your RecruitHub dashboard'}
                aria-describedby="cta-description"
                aria-disabled={navigatingTo === '/login'}
              >
                {navigatingTo === '/login' ? (
                  <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                ) : null}
                Login to Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-primary text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">RecruitHub</h3>
              <p className="text-white/80 mb-4">
                The complete SaaS solution for modern recruitment.
                Connecting companies with top talent through secure, efficient workflows.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">For Companies</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">For Candidates</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/60">
              © 2025 RecruitHub. All rights reserved. Built with modern web technologies for secure recruitment.
            </p>
          </div>
        </div>
      </footer>
      </main>
    </div>
  );
}
