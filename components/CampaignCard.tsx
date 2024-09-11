
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming you're using Shadcn's Card component
import { Campaign } from '@/app/dashboard/create-campaign/page';

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
    <Card className="w-full max-w-md mx-auto my-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{campaign.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-2">{campaign.description}</p>
        <p className="text-sm text-gray-600">Solana Address: {campaign.walletAddress}</p>
        <p className="text-sm text-gray-600">Target: {campaign.fundingGoal} SOL</p>
        <p className="text-xs text-gray-500">Created at: {new Date(campaign.created_at).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
