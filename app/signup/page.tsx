import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { signup } from './actions'
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign Up | GoSolanaMe",
  description: "Sign up into GoSolanaMe.com",
}

export default async function SignupPage() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser()
  if (!error && data?.user) {
    redirect('/dashboard')
  }
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h2>
        <p className="text-gray-600 text-center mb-6">Create a brand new account or already have an account?
          <Link className="text-indigo-600 pl-2" href={'/login'}>Log In</Link>
        </p>


        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter your password"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            formAction={signup}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-300 hover:bg-indigo-700"
          >Sign Up</button>

        </div>
      </form>
    </div>
  )
}
