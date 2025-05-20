import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/index.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'multiply'
        }}
      />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full">
        <nav className="flex justify-between items-center px-6 py-4">
          <Link href="/" className="text-white text-2xl font-bold">
            CureLink
          </Link>
          <div className="flex gap-4">
            <Link href="/auth/login" className="text-white hover:text-gray-200">
              Login
            </Link>
            <Link href="/auth/register" className="text-white hover:text-gray-200">
              Register
            </Link>
            <Link href="/doctor-apply" className="text-white hover:text-gray-200">
              Doctor?
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex items-center justify-start h-screen px-6">
        <div className="max-w-2xl">
          <h1 className="text-white text-5xl md:text-7xl font-bold mb-6">
            Your health, your stories,<br />our guidance.
          </h1>
          <p className="text-white text-xl mb-8 opacity-90">
            Connect with healthcare professionals, share your journey, and find the support you need.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/auth/login"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
