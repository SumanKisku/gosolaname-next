import { z } from "zod";

export const campaignSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  fundingGoal: z.coerce.number(),
  raisedSol: z.coerce.number(),
  walletAddress: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, {
    message: "Please enter a valid Solana wallet address.",
  }),
  coverImage: z.string().url().optional(),
})


