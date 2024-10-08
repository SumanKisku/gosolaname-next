import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming you're using Shadcn's Card component
import { Campaign } from '@/app/dashboard/create-campaign/page';
import Image from 'next/image';
import Link from 'next/link';
type ExtendedCampaign = Campaign & {
  id: string;
  created_at: string;
  updated_at: string;  // Optional field
};
interface CampaignCardProps {
  campaign: ExtendedCampaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <Card className="max-w-md my-4 bg-gray-950 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
      <CardHeader className='w-full flex flex-row space-between'>
        <Link href={`/campaigns/${campaign.id}`}>
          <CardTitle className="text-xl font-bold text-slate-100">{campaign.title}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-2">{campaign.description}</p>
        <p className="text-sm text-gray-600"><span className='font-bold text-slate-100'>Solana Address:</span> {campaign.walletAddress}</p>
        <p className="text-sm text-gray-600"><span className='font-bold text-slate-100'>Target: </span>{campaign.fundingGoal} SOL</p>
        <p className="text-sm text-gray-600"><span className='font-bold text-slate-100'>Raised: </span>{`${(campaign.fundingGoal / 1.5).toFixed(2)}`} SOL</p>
        <p className="text-xs text-gray-500"><span className='font-bold text-slate-100'>Created at: </span>{new Date(campaign.created_at).toLocaleDateString()}</p>
        <div className="flex justify-center p-2">
          <Image src={`${campaign.coverImage}`} alt="Image" width="320" height="240" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
