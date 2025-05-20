'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function Stories() {
  const { data: session } = useSession();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('verified');

  useEffect(() => {
    fetchStories();
  }, [statusFilter]);

  const fetchStories = async () => {
    try {
      const res = await fetch(`/api/stories?status=${statusFilter}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch stories');
      }

      setStories(data.stories);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Stories</h1>
              <p className="mt-2 text-gray-600">
                Real experiences shared by our community
              </p>
            </div>
            <Link
              href="/share-story"
              className="btn-primary"
            >
              Share Your Story
            </Link>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {session?.user?.role === 'admin' && (
            <div className="mb-6">
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600">Loading stories...</div>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No stories have been shared yet.</p>
              <Link
                href="/share-story"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Be the first to share your story
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {stories.map((story) => (
                <div
                  key={story._id}
                  className="bg-white rounded-lg shadow-sm p-6 transition hover:shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {story.authorName ? story.authorName : 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Submitted: {story.createdAt ? formatDate(story.createdAt) : ''}
                      </div>
                    </div>
                    {session?.user?.role === 'admin' && (
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(story.verificationStatus)}
                        <span className="text-sm text-gray-500">
                          {formatDate(story.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-2">
                    <span className="font-semibold">Symptoms: </span>
                    {story.symptoms}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Remedies and Treatments: </span>
                    {story.remedies}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">How You Healed or Got Better: </span>
                    {story.healingProcess}
                  </div>
                  {story.prescriptionProof && (
                    <div className="mb-2">
                      <span className="font-semibold">Prescription or Proof: </span>
                      <a href={story.prescriptionProof} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Document</a>
                    </div>
                  )}
                  <div className="mt-4">
                    <Link href={`/stories/${story._id}`} className="text-blue-600 hover:underline">
                      Read Full Story
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 