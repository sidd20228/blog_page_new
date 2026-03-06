import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { DataModel } from "./_generated/dataModel";

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
    providers: [GitHub, Google, CustomPassword],
    callbacks: {
        async createOrUpdateUser(ctx, args) {
            // Enforce OAuth email whitelist (skip for password-based auth)
            if (args.type === "oauth" && args.profile?.email) {
                const allAllowed = await ctx.db
                    .query("allowedEmails")
                    .collect();

                // If there are entries in the whitelist, enforce it
                if (allAllowed.length > 0) {
                    const email = (args.profile.email as string).toLowerCase();
                    const isAllowed = allAllowed.some(
                        (entry) => entry.email === email
                    );
                    if (!isAllowed) {
                        throw new Error(
                            `Email "${email}" is not in the allowed list. Contact an admin.`
                        );
                    }
                }
            }

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
