'use client'
import NavBar from "@/components/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { campaignSchema } from "@/schemas";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

type Campaign = z.infer<typeof campaignSchema>

export default function IndividualCampaignPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [user, setUser] = useState<null | User>(null);
  const [loaded, setLoaded] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
          redirect('/login')
        }
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoaded(true); // Data has finished loading
      }
    };
    const fetchCampaign = async (id: string) => {
      const data = await supabase.from("campaigns").select().eq('id', id);
      if (data && data.data) {
        console.log(data?.data);
        setCampaign(data?.data[0])
      }
    }

    fetchData();
    fetchCampaign(params.id);
  }, [supabase.auth, params.id, supabase]);

  if (!campaign) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  return <>
    {loaded ?
      <NavBar initialUser={user} /> : <Skeleton className="h-16 w-full"></Skeleton>
    }
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
            {/* Button to donate or support */}
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
              Support this campaign
            </button>
          </div>
        </div>
      </div>
    }
  </>
}
