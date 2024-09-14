"use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/WSCuBFv2Ckn
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client"
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { ExtendedCampaign } from "./Campaings";

export default function Component({ campaign }: { campaign: ExtendedCampaign }) {
  const { toast } = useToast()
  const supabase = createClient();
  const handleDelete = async () => {
    await supabase.from('campaigns').delete().eq('id', campaign.id)
    await fetch('/api/revalidate', {
      method: 'GET'
    })
    toast({
      title: "Campaign deleted!",
      description: "Your fundraising campaign has been successfully deleted.",
    })
  }
  return (
    <div className="mt-2 flex items-center space-between space-x-2">
      <Link href={`/dashboard/edit-campaign/${campaign.id}`}>
        <Button variant="outline" size="sm">
          <PencilIcon className="mr-1.5 h-4 w-4" />
          Edit
        </Button>
      </Link>
      <Button onClick={handleDelete} variant="outline" size="sm">
        <TrashIcon className="mr-1.5 h-4 w-4" />
        Delete
      </Button>
      <Toaster />
    </div>
  )
}

function PencilIcon(props: { className: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}


function TrashIcon(props: { className: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}
