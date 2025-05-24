import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use agent@example.com / agent123 to login as agent.');
    }
  };

  const handleGuestLogin = () => {
    if (loginAsGuest()) {
      navigate('/');
    } else {
      setError('Guest login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-[#006eff] flex items-center justify-center">
            <MessageCircle size={28} className="text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Intercom Clone</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the agent dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#006eff] focus:border-[#006eff] focus:z-10"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#006eff] focus:border-[#006eff] focus:z-10"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-[#006eff] hover:bg-[#0055cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006eff] transition-colors"
            >
              Sign in as Agent
            </button>
            <button
              type="button"
              onClick={handleGuestLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006eff] transition-colors"
            >
              Start a Conversation
            </button>
          </div>
        </form>
        
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>Demo credentials: agent@example.com / agent123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;