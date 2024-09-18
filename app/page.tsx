import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (!error && data?.user) {
    redirect('/dashboard')
  }

  return (
    <main>
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Empower Your Cause with Solana Donations</h1>
          <p className="mt-4 text-lg md:text-xl">Accept fast, secure, and low-fee donations with the power of Solana blockchain.</p>
          <div className="flex flex-row gap-4 justify-center">
            <Link href="/signup" className="mt-8 inline-block bg-white text-indigo-600 py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 hover:bg-gray-100">Get Started</Link>
            <Link href="/campaigns" className="mt-8 inline-block bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 hover:bg-white hover:text-indigo-600">See Campaigns</Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22.029c-5.522 0-10.029-4.508-10.029-10.029S6.478 1.971 12 1.971 22.029 6.478 22.029 12 17.522 22.029 12 22.029zm0-18.058C7.729 3.971 3.971 7.729 3.971 12S7.729 20.029 12 20.029 20.029 16.271 20.029 12 16.271 3.971 12 3.971z" /><path d="M15.172 8.828a4 4 0 11-5.656 5.656 4 4 0 015.656-5.656z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure Transactions</h3>
              <p>Utilize the power of Solana to ensure every donation is safe and transparent.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22.029c-5.522 0-10.029-4.508-10.029-10.029S6.478 1.971 12 1.971 22.029 6.478 22.029 12 17.522 22.029 12 22.029zm0-18.058C7.729 3.971 3.971 7.729 3.971 12S7.729 20.029 12 20.029 20.029 16.271 20.029 12 16.271 3.971 12 3.971z" /><path d="M16.657 11.414a2 2 0 11-2.828-2.828 2 2 0 012.828 2.828z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Low Fees</h3>
              <p>Maximize the impact of every donation with Solana&apos;s minimal transaction fees.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22.029c-5.522 0-10.029-4.508-10.029-10.029S6.478 1.971 12 1.971 22.029 6.478 22.029 12 17.522 22.029 12 22.029zm0-18.058C7.729 3.971 3.971 7.729 3.971 12S7.729 20.029 12 20.029 20.029 16.271 20.029 12 16.271 3.971 12 3.971z" /><path d="M18.071 9.172a6 6 0 11-8.485 8.485 6 6 0 018.485-8.485z" /></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Global Reach</h3>
              <p>Receive donations from supporters around the world with ease.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Create an Account</h3>
              <p>Sign up and create your fundraising profile in just a few easy steps.</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Share Your Cause</h3>
              <p>Share your unique donation link with your community and start receiving donations.</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Receive Solana Donations</h3>
              <p>Track and manage your donations directly on our platform with ease.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="get-started" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Fundraising Today</h2>
          <p className="text-lg md:text-xl mb-8">Join hundreds of causes already leveraging the power of Solana to raise funds.</p>
          <Link href="/signup" className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 hover:bg-indigo-700">Sign Up Now</Link>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 Solana Fundraising Service. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a> |
            <a href="#" className="text-gray-400 hover:text-white mx-2">Terms of Service</a> |
            <a href="#" className="text-gray-400 hover:text-white mx-2">Contact Us</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
