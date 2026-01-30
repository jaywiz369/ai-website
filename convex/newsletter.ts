"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

export const subscribe = action({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const resendApiKey = process.env.RESEND_API_KEY;
        const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

        if (!resendApiKey) {
            throw new Error("Resend API key is not configured");
        }

        if (!resendAudienceId) {
            throw new Error("Resend Audience ID is not configured");
        }

        const resend = new Resend(resendApiKey);

        try {
            // Create contact in Resend Audience
            const { data, error } = await resend.contacts.create({
                email: args.email,
                audienceId: resendAudienceId,
            });

            if (error) {
                console.error("Resend error:", error);
                throw new Error(error.message);
            }

            return { success: true, data };
        } catch (error) {
            console.error("Failed to subscribe:", error);
            throw new Error("Failed to subscribe to newsletter");
        }
    },
});
