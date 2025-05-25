'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function DoctorApplications() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      fetchApplications();
    }
  }, [session]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/doctor-applications', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch applications');
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (applicationId, isApproved) => {
    try {
      const response = await fetch('/api/admin/doctor-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          applicationId,
          status: isApproved ? 'approved' : 'rejected'
        }),
      });

      if (!response.ok) throw new Error('Failed to update application');

      // Refresh the applications list
      fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Doctor Applications</h1>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white shadow rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-3 mt-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error: {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Doctor Applications</h1>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-8">
              {applications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending applications</p>
              ) : (
                applications.map((application) => (
                  <div key={application._id} className="border-b pb-8 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Dr. {application.name}
                        </h3>
                        <div className="mt-2 space-y-2">
                          <p className="text-gray-600">
                            <span className="font-medium">Email:</span> {application.email}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Specialization:</span> {application.specialization}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Experience:</span> {application.experience} years
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Status:</span>{' '}
                            <span className={`
                              ${application.status === 'pending' && 'text-yellow-600'}
                              ${application.status === 'approved' && 'text-green-600'}
                              ${application.status === 'rejected' && 'text-red-600'}
                            `}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </p>
                        </div>
                      </div>
                      {application.status === 'pending' && (
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleApproval(application._id, true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(application._id, false)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    {application.documentUrl && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Documents</h4>
                        <a
                          href={application.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View Documents
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}