"use client";

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogIn, PenSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="glass sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        CloudBlog
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link 
              href="/create" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/80 hover:bg-blue-500 transition-colors text-white text-sm font-medium"
            >
              <PenSquare size={16} />
              Write
            </Link>
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg glass-panel hover:bg-white/10 transition-colors text-sm font-medium"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link 
            href="/auth" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
          >
            <LogIn size={16} />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
