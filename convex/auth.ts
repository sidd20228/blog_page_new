import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { DataModel } from "./_generated/dataModel";
import type { QueryCtx, MutationCtx } from "./_generated/server";

const CustomPassword = Password<DataModel>({
    profile(params) {
        return {
            email: params.email as string,
            name: (params.name as string) || (params.email as string),
            role: (params.role as string) || "admin",
        };
    },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [CustomPassword],
    callbacks: {
        async createOrUpdateUser(ctx, args) {

            // Default behavior: create or update the user
            if (args.existingUserId) {
                return args.existingUserId;
            }

            // Create new user with profile data
            const userData: Record<string, unknown> = {};
            if (args.profile?.email) userData.email = args.profile.email;
            if (args.profile?.name) userData.name = args.profile.name;
            if (args.profile?.image) userData.image = args.profile.image;
            if (args.profile?.emailVerificationTime)
                userData.emailVerificationTime = args.profile.emailVerificationTime;
            if (args.profile?.role) userData.role = args.profile.role;

            return await ctx.db.insert("users", userData as any);
        },
    },
});

/**
 * Auth guard: verifies the caller is authenticated and has admin role.
 * Throws if not. Returns the userId on success.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
        throw new Error("Not authenticated");
    }
    const user = await ctx.db.get(userId);
    if (!user || (user.role && user.role !== "admin")) {
        throw new Error("Unauthorized: admin role required");
    }
    return userId;
}
