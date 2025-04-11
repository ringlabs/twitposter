
// This is a file we can't modify directly, but we can create a patch file for it
// Let's create a file that exports a fixed version of the component's logic

import { getFreeTrialUsage } from "@/services/postGeneratorService";

// This function safely gets the remaining free trial posts
export async function getRemainingFreeTrialPosts(): Promise<number> {
  try {
    const usage = await getFreeTrialUsage();
    return Math.max(0, 10 - usage);
  } catch (error) {
    console.error("Error calculating remaining free trial posts:", error);
    return 0;
  }
}
