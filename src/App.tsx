import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthComponent from './components/Auth';
import JourneyTracker from './screens/Trajets';
import History from './screens/History';

const App = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return <AuthComponent />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
        <header className="w-full p-4 bg-white shadow flex justify-between items-center">
          <nav className="flex gap-4">
            <Link to="/" className="cursor-pointer hover:underline">
              Track Journey
            </Link>
            <Link to="/history" className="cursor-pointer hover:underline">
              History
            </Link>
          </nav>
          <button
            onClick={signOut}
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign Out
          </button>
        </header>
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<JourneyTracker />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="p-2 text-center bg-gray-200">
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="cursor-pointer text-sm text-gray-700">
            Made on ZAPT
          </a>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;