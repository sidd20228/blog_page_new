import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Check for scheduled posts every minute and publish them
crons.interval(
    "publish scheduled posts",
    { minutes: 1 },
    api.posts.publishScheduledPosts,
);

export default crons;
