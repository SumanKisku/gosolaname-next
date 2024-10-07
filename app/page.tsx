
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!error && data?.user) {
    redirect('/dashboard');
  }

  return (
    <main className="bg-black text-white min-h-screen">
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold transition-all duration-500 hover:scale-105">
            Empower Your Cause with Solana Donations
          </h1>
          <p className="mt-4 text-lg md:text-xl transition-opacity duration-500 opacity-80 hover:opacity-100">
            Accept fast, secure, and low-fee donations with the power of Solana blockchain.
          </p>
          <div className="flex flex-row gap-4 justify-center">
            <Link href="/signup">
              <div className="mt-8 inline-block bg-white text-black py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 hover:bg-gray-200 hover:scale-105">
                Get Started
              </div>
            </Link>
            <Link href="/campaigns">
              <div className="mt-8 inline-block bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg border border-white transition duration-300 hover:bg-gray-700 hover:scale-105">
                See Campaigns
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {['Secure Transactions', 'Low Fees', 'Global Reach'].map((title, idx) => (
              <div key={idx} className="bg-black bg-opacity-20 p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22.029c-5.522 0-10.029-4.508-10.029-10.029S6.478 1.971 12 1.971 22.029 6.478 22.029 12 17.522 22.029 12 22.029zm0-18.058C7.729 3.971 3.971 7.729 3.971 12S7.729 20.029 12 20.029 20.029 16.271 20.029 12 16.271 3.971 12 3.971z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">{title}</h3>
                <p className="opacity-80 hover:opacity-100">Utilize the power of Solana to ensure every donation is safe and transparent.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="get-started" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 transition-all duration-500 hover:scale-105">
            Start Fundraising Today
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-80 hover:opacity-100">
            Join hundreds of causes already leveraging the power of Solana to raise funds.
          </p>
          <Link href="/signup">
            <div className="inline-block bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg border border-white transition duration-300 hover:bg-gray-700 hover:scale-105">
              Sign Up Now
            </div>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
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
