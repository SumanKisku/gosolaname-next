'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import NavBar from '@/components/NavBar'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { campaignSchema } from '@/schemas'

type Campaign = z.infer<typeof campaignSchema>

export default function FundraisingForm({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<null | User>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<Campaign>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      description: "",
      fundingGoal: 0,
      walletAddress: "",
    },
  })

  async function onSubmit(values: Campaign) {
    setIsSubmitting(true)
    // Simulate API call
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("campaigns").update({
        title: values.title,
        description: values.description,
        fundingGoal: values.fundingGoal,
        walletAddress: values.walletAddress
      }).eq('id', params.id);

      if (!error) {
        toast({
          title: "Campaign updated!",
          description: "Your fundraising campaign has been successfully updated.",
        })
      }
    }
    setIsSubmitting(false)
    form.reset()
    router.push('/dashboard')
    await fetch('/api/revalidate', {
      method: 'GET'
    })
  }

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
        form.reset(data?.data[0])
      }
    }

    fetchData();
    fetchCampaign(params.id);
  }, [supabase.auth, form, params.id, supabase]);

  return (
    <>
      {loaded ?
        <NavBar initialUser={user} /> : <Skeleton className="h-16 w-full"></Skeleton>
      }
      <div className="max-w-md mt-20 mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Edit your campaign {params.id}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campaign title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your campaign a catchy and descriptive title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your campaign and its goals"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about your campaign to attract supporters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fundingGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Goal (SOL)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="Enter funding goal in SOL" {...field} />
                  </FormControl>
                  <FormDescription>
                    Set your fundraising target in Solana (SOL).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solana Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Solana wallet address" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide the Solana wallet address where donations will be received.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </form>
        </Form>
        <Toaster />
      </div>
    </>
  )
}
// fetch user
// if user logged in
// fetch campaign using id
// render form according to the fetced campaign with useState hook
// change necessary fields
// send it to supabase
//
