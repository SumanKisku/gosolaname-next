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
import { revalidatePath } from 'next/cache'
const campaignSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters.",
  }),
  fundingGoal: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Funding goal must be a positive number.",
  }),
  walletAddress: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, {
    message: "Please enter a valid Solana wallet address.",
  }),
})

export type Campaign = z.infer<typeof campaignSchema>

export default function FundraisingForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<null | User>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter()

  const form = useForm<Campaign>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "Red Team",
      description: "Solana supports only one address or public key format (pubkey). Address is a base58-encoded string of 32-44 characters. Basic verification of the Solana address can be done via regular expression: [1-9A-HJ-NP-Za-km-z]{32,44}.",
      fundingGoal: "5",
      walletAddress: "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV",
    },
  })

  const supabase = createClient()
  async function onSubmit(values: Campaign) {
    setIsSubmitting(true)
    // Simulate API call
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("campaigns").insert({
        user_id: user.id,
        title: values.title,
        description: values.description,
        fundingGoal: values.fundingGoal,
        walletAddress: values.walletAddress
      });

      if (!error) {
        toast({
          title: "Campaign Created!",
          description: "Your fundraising campaign has been successfully created.",
        })
      }
    }
    setIsSubmitting(false)
    form.reset()
    revalidatePath("/dashboard")
    router.push('/dashboard')
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

    fetchData();
  }, [supabase.auth]);

  return (
    <>
      {loaded ?
        <NavBar initialUser={user} /> : <Skeleton className="h-16 w-full"></Skeleton>
      }
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Start a Fundraising Campaign</h1>
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
