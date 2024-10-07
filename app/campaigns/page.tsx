import CampaignCard from "@/components/CampaignCardForViewer";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data, error } = await supabase.from("campaigns").select();
  if (error) {
    console.log(error);
  }
  const campaigns = data;

  return (
    <div className="w-screen p-6 mx-auto bg-gradient-to-br from-gray-800 to-gray-900 text-white min-h-screen">
      <div className="flex flex-wrap m-4 gap-6 justify-center">
        {campaigns?.map((campaign) => (
          <div
            key={campaign.id}
            className="w-full md:w-1/3 p-4 bg-gradient-to-tr from-gray-700 to-gray-800 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <CampaignCard campaign={campaign} />
          </div>
        ))}
      </div>
    </div>
  );
}
