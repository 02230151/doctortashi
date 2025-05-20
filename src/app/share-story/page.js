'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function ShareStory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    symptoms: '',
    remedies: '',
    healingProcess: '',
    prescriptionProof: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        prescriptionProof: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('authorName', formData.authorName);
      formDataToSend.append('symptoms', formData.symptoms);
      formDataToSend.append('remedies', formData.remedies);
      formDataToSend.append('healingProcess', formData.healingProcess);
      if (formData.prescriptionProof) {
        formDataToSend.append('prescriptionProof', formData.prescriptionProof);
      }

      const res = await fetch('/api/stories', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit story');
      }

      setSuccess(true);
      setFormData({
        authorName: '',
        symptoms: '',
        remedies: '',
        healingProcess: '',
        prescriptionProof: null
      });

      // Do NOT redirect to the story page or any other page
      // router.push(`/stories/${data._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Share Your Health Story</h1>
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">
                  Name (Optional):
                </label>
                <input
                  type="text"
                  id="authorName"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-700 font-normal"
                  placeholder="Enter your name (optional)"
                />
              </div>

              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                  Symptoms:
                </label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-700 font-normal"
                  placeholder="Describe your symptoms"
                  required
                />
              </div>

              <div>
                <label htmlFor="remedies" className="block text-sm font-medium text-gray-700">
                  Remedies and Treatments:
                </label>
                <textarea
                  id="remedies"
                  name="remedies"
                  value={formData.remedies}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-700 font-normal"
                  placeholder="Share the remedies or treatments you used"
                  required
                />
              </div>

              <div>
                <label htmlFor="healingProcess" className="block text-sm font-medium text-gray-700">
                  How You Healed or Got Better:
                </label>
                <textarea
                  id="healingProcess"
                  name="healingProcess"
                  value={formData.healingProcess}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-700 font-normal"
                  placeholder="Share how you healed or tips that helped you"
                  required
                />
              </div>

              <div>
                <label htmlFor="prescriptionProof" className="block text-sm font-medium text-gray-700">
                  Prescription or Proof:
                </label>
                <input
                  type="file"
                  id="prescriptionProof"
                  name="prescriptionProof"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload prescription, medical report, or any proof (PDF, JPG, PNG)
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              {success && (
                <div className="text-green-600 text-sm">Story submitted successfully!</div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  onClick={() => router.push('/')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 