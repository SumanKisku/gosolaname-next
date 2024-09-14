import { createClient } from "@/utils/supabase/server"
import { Campaign } from "@/app/dashboard/create-campaign/page";
import CampaignCard from "./CampaignCard";

export type ExtendedCampaign = Campaign & {
  id: string;
  created_at: string;
  updated_at: string;
}

export default async function Campaigns() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    throw error
  }
  const { data } = await supabase.from("campaigns").select("*").eq('user_id', user?.id)
  return <div className="mx-5 flex gap-2 w-full flex-wrap">
    {data?.map((campaign: ExtendedCampaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
  </div>

}
