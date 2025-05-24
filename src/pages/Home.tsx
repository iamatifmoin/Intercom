import React from "react";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Intercom
              </h1>
            </div>
            <div>
              {auth.isLoggedIn ? (
                <span className="text-sm text-gray-600 font-medium">
                  Logged in as {auth.currentUser?.email}
                </span>
              ) : (
                <a
                  href="/login"
                  className="text-sm font-medium text-[#006eff] hover:text-[#0055cc] transition-colors"
                >
                  Log in
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Welcome to Intercom
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Experience seamless customer communication.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#006eff]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                User Chat Widget
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Click the chat bubble in the bottom-right corner to start a
                conversation with our agents. If not visible, click on 'Access
                Dashboard' and start a conversation.
              </p>
              <div className="text-sm text-[#006eff] font-medium">
                Active on this page
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#006eff]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Agent Dashboard
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access our powerful agent dashboard to manage conversations,
                view customer information, and provide excellent support.
              </p>
              <a
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#006eff] hover:bg-[#0055cc] transition-colors duration-300"
              >
                Access Dashboard
              </a>
            </div>
          </div>

          <div className="mt-16 bg-blue-50 rounded-2xl p-8 max-w-3xl mx-auto border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              Demo Access
            </h3>
            <div className="space-y-2 text-blue-800">
              <p className="font-medium">Agent Dashboard Credentials:</p>
              <div className="bg-white rounded-lg p-4 font-mono text-sm">
                <div>
                  Email: <span className="font-bold">agent@example.com</span>
                </div>
                <div>
                  Password: <span className="font-bold">agent123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
