'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function VerifyStories() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.role !== 'doctor') {
      router.push('/verify-stories');
      return;
    }

    fetchStories();
  }, [status, session]);

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories?status=pending');
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

  const handleVerify = async (storyId, status) => {
    try {
      const res = await fetch(`/api/stories/${storyId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to verify story');
      }

      // Update the story's status in the list
      setStories(stories.map(story =>
        story._id === storyId
          ? { ...story, verificationStatus: status === 'approved' ? 'verified' : status }
          : story
      ));
    } catch (error) {
      setError(error.message);
      console.error('Error verifying story:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">Loading stories...</div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Verify Patient Stories</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              {stories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No stories pending verification</p>
              ) : (
                stories.map((story) => (
                  <div key={story._id} className="border-b pb-6 last:border-b-0">
                    <div className="mb-2">
                      <span className="font-semibold">Name: </span>
                      {story.authorName ? story.authorName : 'Anonymous'}
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
                    <div className="text-sm text-gray-500 mb-4">
                      Submitted: {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : ''}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Status: </span>
                      {story.verificationStatus
                        ? story.verificationStatus.charAt(0).toUpperCase() + story.verificationStatus.slice(1)
                        : 'Pending'}
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleVerify(story._id, 'approved')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(story._id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Reject
                      </button>
                    </div>
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