'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import PatientNav from './PatientNav';
import DoctorNav from './DoctorNav';
import AdminNav from './AdminNav';
import NavLink from './NavLink';

const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debug session state
  useEffect(() => {
    console.log('Session Status:', status);
    console.log('Session Data:', session);
  }, [session, status]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Hide navbar on sign-in and register pages, or while loading session
  if (
    status === 'loading' ||
    pathname === '/auth/login' ||
    pathname === '/auth/signin' ||
    pathname === '/auth/register'
  ) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Render navigation based on user role
  const renderNavigation = (isMobile = false) => {
    if (status === 'loading') return null;
    if (!session) return null;

    switch (session.user.role) {
      case 'patient':
        return <PatientNav isMobile={isMobile} onLinkClick={handleLinkClick} />;
      case 'doctor':
        return <DoctorNav isMobile={isMobile} onLinkClick={handleLinkClick} />;
      case 'admin':
        return <AdminNav isMobile={isMobile} onLinkClick={handleLinkClick} />;
      default:
        console.log('Unknown role:', session.user.role);
        return null;
    }
  };

  // Render auth buttons for non-authenticated users
  const renderAuthButtons = (isMobile = false) => {
    if (status === 'loading') return null;
    if (session) return null;

    return (
      <>
        <Link 
          href="/auth/login" 
          className={`${
            isMobile 
              ? "block py-2 text-gray-600 hover:text-blue-600"
              : "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
          onClick={handleLinkClick}
        >
          Login
        </Link>
        <Link 
          href="/auth/register" 
          className={`${
            isMobile 
              ? "block py-2 text-gray-600 hover:text-blue-600"
              : "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          }`}
          onClick={handleLinkClick}
        >
          Register
        </Link>
        <Link 
          href="/doctor-apply" 
          className={`${
            isMobile 
              ? "block py-2 text-gray-600 hover:text-blue-600"
              : "text-blue-600 hover:text-blue-800"
          }`}
          onClick={handleLinkClick}
        >
          Doctor?
        </Link>
      </>
    );
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              CureLink
            </Link>
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            CureLink
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {renderNavigation(false)}
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{session.user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {renderAuthButtons(false)}
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>

            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-white shadow-lg p-4 space-y-4 z-50">
                {renderNavigation(true)}
                {session ? (
                  <>
                    <div className="pt-2 border-t border-gray-200">
                      <span className="block text-gray-600 py-2">{session.user.name}</span>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left py-2 text-gray-600 hover:text-blue-600"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    {renderAuthButtons(true)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
