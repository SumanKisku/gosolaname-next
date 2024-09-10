
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { logout } from '@/app/(authentication)/logout/actions'

export default function NavBar({ initialUser }: { initialUser: User }) {
  const [user, setUser] = useState<User | null>(initialUser)

  useEffect(() => {
    const supabase = createClient()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const supabase = createClient()
      // await supabase.auth.signOut()
      // setUser(null)
      logout();

    } catch (err) {
      console.log(err);

    }
  }
  return (
    <nav className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          GoSolanaMe
        </Link>

        {/* Auth Details */}
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Hello, {user.email}</span>
              <Link href="/dashboard" className="text-indigo-600 hover:underline">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
              <Link href="/signup" className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
