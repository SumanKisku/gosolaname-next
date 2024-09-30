'use client'
import { campaignSchema } from "@/schemas";
import { createClient } from "@/utils/supabase/client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);
type Campaign = z.infer<typeof campaignSchema>

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
        console.log(data?.data);
        setCampaign(data?.data[0])
        setRecipient(data?.data[0].walletAddress);
        console.log("MY address", data?.data[0].walletAddress);

      }
    }

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
      // Convert recipient input to a public key and amount to lamports
      const recipientPubKey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      // Create the transaction for transferring SOL
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      );

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      // Fetch the current campaign data from the database
      const { data: campaign, error: fetchError } = await supabase
        .from('campaigns')
        .select('raisedSol')
        .eq('id', params.id)
        .single();
      console.log("Raised solana", typeof campaign?.raisedSol);


      if (fetchError || !campaign) {
        console.error("Error fetching campaign data:", fetchError);
        return;
      }

      // Calculate the new raisedSol amount (make sure to handle NaN)
      const updatedRaisedSol = Number(campaign.raisedSol) + Number(amount);

      if (isNaN(updatedRaisedSol)) {
        setStatus('Invalid amount. Please enter a valid number.');
        return;
      }

      // Update the campaign's raisedSol in the database
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ 'raisedSol': updatedRaisedSol })
        .eq('id', params.id);

      if (updateError) {
        console.error("Error updating campaign data:", updateError);
        return;
      }

      // Set success status
      setStatus(`Transfer successful! Signature: ${signature}`);
    } catch (error) {
      console.log("Error processing transfer:", error);
      setStatus('Error processing the transaction.');
    }
  };

  if (!campaign) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  return <>
    <nav className="flex justify-end p-2">
      <WalletMultiButton style={{}} />
    </nav>
    {campaign &&
      // write a beautiful here styling with tailwind css

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-20">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2 h-64 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={campaign.coverImage as string}
              alt={campaign.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          {/* Campaign Details Section */}
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{campaign.title}</h1>
            <p className="text-lg text-gray-600">{campaign.description}</p>
            <p className="text-lg font-semibold text-indigo-600">
              Goal: {campaign.fundingGoal} SOL
            </p>
            <p className="text-lg font-semibold text-indigo-600">
              Raised: {campaign.raisedSol} SOL
            </p>
            <p className="text-lg font-semibold text-indigo-600">
              Reciepent Wallet: <span className="text-sm text-black">{campaign.walletAddress}
              </span>
            </p>

            {/* Button to donate or support */}

            <form onSubmit={handleTransfer}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
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
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">Send Support</button>
            </form>
          </div>
        </div>
        {status && (
          <div className="mt-4">
            <div>{status}</div>
          </div>
        )}
      </div>
    }
  </>
}
