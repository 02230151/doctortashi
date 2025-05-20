'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Feeds() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [feeds, setFeeds] = useState({
    factsSheet: [],
    bhutanNews: [],
    worldNews: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/feeds');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch feeds');
      }

      // Group feeds by category
      const grouped = data.feeds.reduce((acc, feed) => {
        switch (feed.category) {
          case 'Facts Sheet':
            acc.factsSheet.push(feed);
            break;
          case 'Bhutan News':
            acc.bhutanNews.push(feed);
            break;
          case 'World News':
            acc.worldNews.push(feed);
            break;
        }
        return acc;
      }, { factsSheet: [], bhutanNews: [], worldNews: [] });

      setFeeds(grouped);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect admin to dashboard
  if (status === 'authenticated' && session?.user?.role === 'admin') {
    if (typeof window !== 'undefined') {
      router.replace('/dashboard');
    }
    return null;
  }

  const FeedCard = ({ feed }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {feed.image && (
        <div className="relative h-48">
          <Image
            src={feed.image}
            alt={feed.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-sm text-gray-500">
          {new Date(feed.createdAt).toLocaleDateString()}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-gray-900">
          {feed.title}
        </h3>
        <p className="mt-2 text-gray-600 line-clamp-3">{feed.content}</p>
        <div className="mt-4 flex justify-between items-center">
          <Link
            href={`/feeds/${feed._id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Read more →
          </Link>
          {session?.user?.role === 'doctor' && (
            <Link
              href={`/feeds/${feed._id}/edit`}
              className="text-gray-600 hover:text-gray-800"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  const FeedSection = ({ title, feeds }) => (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      {feeds.length === 0 ? (
        <p className="text-gray-500">No feeds available in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feeds.map((feed) => (
            <FeedCard key={feed._id} feed={feed} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-4">
                    <div className="h-48 bg-gray-200 rounded"></div>
                    <div className="mt-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to CureLink Feeds
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Your personalized health updates will appear here.
          </p>

          <FeedSection title="Facts Sheet" feeds={feeds.factsSheet} />
          <FeedSection title="Bhutan News" feeds={feeds.bhutanNews} />
          <FeedSection title="World News" feeds={feeds.worldNews} />

          {session?.user?.role === 'doctor' && (
            <div className="mt-8">
              <Link
                href="/feeds/create"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create New Feed
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 