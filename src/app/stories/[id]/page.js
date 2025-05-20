'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function StoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      const res = await fetch(`/api/stories/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch story');
      }

      setStory(data);
      setHelpfulCount(data.helpful?.length || 0);
      setHasMarkedHelpful(data.helpful?.includes(session?.user?.id));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    try {
      const res = await fetch(`/api/stories/${id}/helpful`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to mark story as helpful');
      }

      setHelpfulCount((prev) => prev + 1);
      setHasMarkedHelpful(true);
    } catch (error) {
      console.error('Error marking story as helpful:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            Loading story...
          </div>
        </div>
      </>
    );
  }

  if (error || !story) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error || 'Story not found'}
            </div>
            <Link href="/stories" className="mt-4 text-blue-600 hover:underline">
              Back to stories
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/stories" className="text-blue-600 hover:underline">
              ← Back to stories
            </Link>
          </div>

          <article className="bg-white rounded-lg shadow-sm p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {story.title || 'Health Story'}
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {story.author && story.author.image && (
                    <img
                      src={story.author.image}
                      alt={story.author.name || 'User'}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <div className="text-gray-900">
                      {story.authorName
                        ? story.authorName
                        : story.author && story.author.name
                        ? story.author.name
                        : 'Anonymous'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {story.createdAt ? formatDate(story.createdAt) : ''}
                    </div>
                  </div>
                </div>
                {story.disease && story.disease._id && story.disease.name && (
                  <Link
                    href={`/diseases/${story.disease._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {story.disease.name}
                  </Link>
                )}
              </div>
            </header>

            <div className="prose max-w-none">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Symptoms</h3>
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{story.symptoms}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Remedies and Treatments</h3>
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{story.remedies}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">How You Healed or Got Better</h3>
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{story.healingProcess}</p>
              </div>
              {story.prescriptionProof && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Prescription or Proof</h3>
                  <div className="mt-2">
                    <a
                      href={story.prescriptionProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-8">
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-2">
                  {helpfulCount} {helpfulCount === 1 ? 'person' : 'people'} found this helpful
                </div>
                <button
                  onClick={handleMarkHelpful}
                  disabled={hasMarkedHelpful}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    hasMarkedHelpful
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  {hasMarkedHelpful ? 'Marked as Helpful' : 'Mark as Helpful'}
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
} 