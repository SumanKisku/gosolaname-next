'use client'
import { campaignSchema } from "@/schemas";
import { createClient } from "@/utils/supabase/client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";
import Confetti from 'react-confetti'

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
type Campaign = z.infer<typeof campaignSchema>;

export default function IndividualCampaignPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const fetchCampaign = async (id: string) => {
      const data = await supabase.from("campaigns").select().eq('id', id);
      if (data && data.data) {
        setCampaign(data.data[0]);
        setRecipient(data.data[0].walletAddress);
      }
    };
    fetchCampaign(params.id);
  }, [supabase.auth, params.id, supabase]);

  const handleTransfer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');

    if (!publicKey) {
      setStatus('Please connect your wallet first.');
      return;
    }

    try {
      const recipientPubKey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      const { data: campaignData, error: fetchError } = await supabase
        .from('campaigns')
        .select('raisedSol')
        .eq('id', params.id)
        .single();

      if (fetchError || !campaignData) {
        console.error("Error fetching campaign data:", fetchError);
        return;
      }

      const updatedRaisedSol = Number(campaignData.raisedSol) + Number(amount);
      if (isNaN(updatedRaisedSol)) {
        setStatus('Invalid amount. Please enter a valid number.');
        return;
      }

      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ 'raisedSol': updatedRaisedSol })
        .eq('id', params.id);

      if (updateError) {
        console.error("Error updating campaign data:", updateError);
        return;
      }

      setStatus(`Transfer successful! Signature: ${signature}`);
      // setIsExploding(true);
    } catch (error) {
      console.log("Error processing transfer:", error);
      setStatus('Error processing the transaction.');
    }
  };

  if (!campaign) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }
  return (
    <>
      <nav className="flex justify-end p-2 bg-gradient-to-r from-gray-900 to-gray-700">
        <WalletMultiButton />
      </nav>
      {campaign && (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-800 to-gray-900 shadow-md rounded-lg mt-20 text-white">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 animate-fade-in">
            <div className="relative w-full md:w-1/2 h-64 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={campaign.coverImage as string}
                alt={campaign.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h1 className="text-3xl font-bold text-gray-100">{campaign.title}</h1>
              <p className="text-lg text-gray-300">{campaign.description}</p>
              <p className="text-lg font-semibold text-white">
                Goal: {campaign.fundingGoal} SOL
              </p>
              <p className="text-lg font-semibold text-white">
                Raised: {campaign.raisedSol} SOL
              </p>
              <p className="text-lg font-semibold text-white">
                Recipient Wallet: <span className="text-sm text-gray-400">{campaign.walletAddress}</span>
              </p>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-400">
                    Amount (SOL)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in SOL"
                    step="0.000000001"
                    min="0"
                    required
                    className="mt-2 w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-200"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                >
                  Send Support
                </button>
              </form>
            </div>
          </div>
          {status && (
            <div className="mt-4 text-center text-sm font-medium bg-gray-700 p-2 rounded-lg animate-pulse">
              {status}
              <Confetti
                numberOfPieces={100}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
