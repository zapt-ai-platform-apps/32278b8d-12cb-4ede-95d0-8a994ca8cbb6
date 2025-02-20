import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../supabaseClient';

const AuthComponent = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      <h2 className="text-2xl font-bold mb-2">Sign in with ZAPT</h2>
      <a
        href="https://www.zapt.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 text-blue-500 underline cursor-pointer"
      >
        Visit ZAPT
      </a>
      <Auth
        supabaseClient={supabase}
        providers={['google', 'facebook', 'apple']}
        magicLink={true}
        view="magic_link"
      />
    </div>
  );
};

export default AuthComponent;