'use client';

import Navbar from '@/components/Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About CureLink</h1>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600">
                  CureLink is dedicated to transforming healthcare accessibility in Bhutan by connecting patients 
                  with healthcare providers through a user-friendly digital platform. We aim to make quality 
                  healthcare information and services available to everyone, regardless of their location.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Easy access to healthcare information and resources</li>
                  <li>Direct connection with qualified healthcare professionals</li>
                  <li>Online appointment booking system</li>
                  <li>Community support through shared experiences</li>
                  <li>Verified medical information and articles</li>
                  <li>Medicine information and availability</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Accessibility</h3>
                    <p className="text-gray-600">Making healthcare services available to all Bhutanese citizens</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Quality</h3>
                    <p className="text-gray-600">Ensuring high standards in healthcare information and services</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Community</h3>
                    <p className="text-gray-600">Building a supportive healthcare community</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600">
                  Have questions or suggestions? We'd love to hear from you. Reach out to us at:
                </p>
                <div className="mt-4 space-y-2 text-gray-600">
                  <p>Email: support@curelink.bt</p>
                  <p>Phone: +975 XX XXXXXX</p>
                  <p>Address: Thimphu, Bhutan</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 