'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Array<{
    id: number;
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
    opacity: number;
  }>>([]);
  const [floatingParticles, setFloatingParticles] = useState<Array<{
    id: number;
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
    color: string;
  }>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Generate stars only on client side
    const generatedStars = [...Array(100)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
      opacity: Math.random() * 0.8 + 0.2
    }));

    // Generate floating particles only on client side
    const generatedParticles = [...Array(30)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
      color: i % 3 === 0 ? 'bg-blue-400' : 
             i % 3 === 1 ? 'bg-purple-400' : 'bg-cyan-400'
    }));

    setStars(generatedStars);
    setFloatingParticles(generatedParticles);

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setMessage('Welcome! You\'ve been added to the waitlist.');
        setEmail('');
        setTimeout(() => {
          setIsSubscribed(false);
          setMessage('');
        }, 5000);
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Space Background */}
      <div className="absolute inset-0">
        {/* Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration,
              opacity: star.opacity
            }}
          />
        ))}
        
        {/* Nebula Effect */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #1e40af 0%, #3b82f6 30%, #8b5cf6 60%, transparent 100%)',
            left: `${mousePosition.x * 0.1}px`,
            top: `${mousePosition.y * 0.1}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        {/* Black Hole */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-32 bg-gradient-to-b from-transparent via-blue-900/30 to-black rounded-full blur-sm animate-black-hole">
            <div className="w-full h-full bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent rounded-full animate-pulse" />
          </div>
        </div>

        {/* Nebula Clouds */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl animate-nebula-shift" />
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-xl animate-space-float" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl w-full mx-auto text-center">
          {/* Coming Soon Text */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-8xl font-bold text-white mb-4 tracking-widest animate-pulse relative">
              COMING SOON
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-xl animate-pulse"></div>
            </h1>
            <h2 className="text-2xl sm:text-4xl font-light text-blue-400 tracking-wider animate-neon-pulse">
              Focus0xbot
            </h2>
            <div className="mt-4 text-sm text-gray-400 tracking-wider">
            </div>
          </div>


          {/* Email Subscription */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for early access"
                  className="w-full px-6 py-4 bg-gray-900/50 border border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-gray-800/50 transition-all duration-300 backdrop-blur-sm"
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Joining...' : isSubscribed ? '✓ Subscribed!' : 'Join the Waitlist'}
              </button>
              
              {message && (
                <div className={`text-center text-sm ${
                  isSubscribed ? 'text-green-400' : 'text-red-400'
                }`}>
                  {message}
                </div>
              )}
            </form>
          </div>

          {/* Progress Bar */}
          <div className="mt-12 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>Development Progress</span>
              <span className="text-blue-400 font-bold">25%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: '25%' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-12 flex justify-center">
            <a
              href="https://x.com/focus0xbot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gradient-to-br from-black-200 to-slate-800 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingParticles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-1 h-1 rounded-full animate-star-twinkle ${particle.color}`}
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration
            }}
          />
        ))}
      </div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none"></div>
    </div>
  );
}
