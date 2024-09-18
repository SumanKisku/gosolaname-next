"use client"

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/NavBar";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { campaignSchema } from "@/schemas";
import UploadBox from "@/app/upload/UploadBox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEdgeStore } from "@/lib/edgestore";
import Image from "next/image";

export type Campaign = z.infer<typeof campaignSchema>;

export default function FundraisingForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<null | User>(null);
  const [loaded, setLoaded] = useState(false);
  const [coverImgUrl, setCoverImgUrl] = useState("");
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const setImgUrl = (url: string) => {
    setCoverImgUrl(url)
  }

  const form = useForm<Campaign>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      description: "",
      fundingGoal: 0,
      walletAddress: "",
      coverImage: "",
    },
  });

  const supabase = createClient();

  async function onSubmit(values: Campaign) {
    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from("campaigns").insert({
        user_id: user.id,
        title: values.title,
        description: values.description,
        fundingGoal: values.fundingGoal,
        walletAddress: values.walletAddress,
        coverImage: coverImgUrl, // Use the uploaded image URL
      });

      if (!error) {
        await edgestore.publicFiles.confirmUpload({
          url: coverImgUrl,
        });
        toast({
          title: "Campaign Created!",
          description: "Your fundraising campaign has been successfully created.",
        });
        form.reset();
        router.push("/dashboard");
      }
    }
    setIsSubmitting(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          redirect("/login");
        }
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoaded(true);
      }
    };

    fetchData();
  }, [supabase.auth]);

  useEffect(() => {
    form.setValue("coverImage", coverImgUrl);
  }, [coverImgUrl, form]);

  return (
    <>
      {loaded ? (
        <NavBar initialUser={user} />
      ) : (
        <Skeleton className="h-16 w-full"></Skeleton>
      )}
      <div className="max-w-md mt-20 mx-auto p-6 bg-white rounded-lg shadow-md">
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
                    <Textarea placeholder="Describe your campaign" {...field} />
                  </FormControl>
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
                    <Input type="number" {...field} />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {coverImgUrl && (
              <div className="my-4">
                <Image
                  width={320}
                  height={240}
                  src={coverImgUrl}
                  alt="Cover Image Preview"
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Upload Image</Button>
              </PopoverTrigger>
              <PopoverContent className="w-full">
                <UploadBox setImgUrl={setImgUrl} />
              </PopoverContent>
            </Popover>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </form>
        </Form>
        <Toaster />
      </div>
    </>
  );
}
