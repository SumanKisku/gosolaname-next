import CampaignCard from "@/components/CampaignCard";
import { createClient } from "@/utils/supabase/server"

export default async function DashboardPage() {
  const supabase = createClient();
  const { data, error } = await supabase.from('campaigns').select();
  if (error) {
    console.log(error);

  }
  const campaigns = data;
  return (
    <div className="w-screen p-4 mx-auto">
      <div className="flex flex-wrap m-4 gap-4">
        {campaigns?.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
      </div>
    </div>
  )
}
