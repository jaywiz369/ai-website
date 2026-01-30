"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  const settings = useQuery(api.settings.getAll);
  const branding = useQuery(api.settings.getBranding);
  const setSetting = useMutation(api.settings.set);
  const updateBranding = useMutation(api.settings.updateBranding);

  // Store settings
  const [storeName, setStoreName] = useState("");
  const [storeTagline, setStoreTagline] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [linkExpiryHours, setLinkExpiryHours] = useState("");
  const [maxDownloads, setMaxDownloads] = useState("");

  // Branding settings
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [ctaHeadline, setCtaHeadline] = useState("");
  const [ctaDescription, setCtaDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (branding) {
      setStoreName(branding.storeName);
      setStoreTagline(branding.storeTagline);
      setHeroHeadline(branding.heroHeadline);
      setHeroDescription(branding.heroDescription);
      setCtaHeadline(branding.ctaHeadline);
      setCtaDescription(branding.ctaDescription);
      setMetaTitle(branding.metaTitle);
      setMetaDescription(branding.metaDescription);
    }
    if (settings) {
      setSupportEmail(settings.supportEmail ?? "support@example.com");
      setLinkExpiryHours(settings.linkExpiryHours ?? "48");
      setMaxDownloads(settings.maxDownloads ?? "5");
    }
  }, [settings, branding]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        updateBranding({
          storeName,
          storeTagline,
          heroHeadline,
          heroDescription,
          ctaHeadline,
          ctaDescription,
          metaTitle,
          metaDescription,
        }),
        setSetting({ key: "supportEmail", value: supportEmail }),
        setSetting({ key: "linkExpiryHours", value: linkExpiryHours }),
        setSetting({ key: "maxDownloads", value: maxDownloads }),
      ]);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (branding === undefined || settings === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your store settings and branding
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Store Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Store Branding</CardTitle>
            <CardDescription>
              Customize your store name and tagline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Store Name</label>
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="AgenticVault"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Displayed in the header, footer, and browser tab
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Store Tagline</label>
              <Input
                value={storeTagline}
                onChange={(e) => setStoreTagline(e.target.value)}
                placeholder="AI Prompts & Automation Tools"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Short description shown in the footer
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Homepage Hero</CardTitle>
            <CardDescription>
              The main headline and description on your landing page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Hero Headline</label>
              <Input
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                placeholder="Premium Prompts for AI Power Users"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hero Description</label>
              <Textarea
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                placeholder="Curated prompt packs and automation tools..."
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Call-to-Action Section</CardTitle>
            <CardDescription>
              The bottom section of your homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">CTA Headline</label>
              <Input
                value={ctaHeadline}
                onChange={(e) => setCtaHeadline(e.target.value)}
                placeholder="Ready to supercharge your AI workflow?"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">CTA Description</label>
              <Textarea
                value={ctaDescription}
                onChange={(e) => setCtaDescription(e.target.value)}
                placeholder="Join thousands of creators..."
                className="mt-1"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Search engine optimization for your homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Meta Title</label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="AgenticVault.dev | AI Agents & Tools"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Displayed in browser tabs and search results
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Meta Description</label>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Premium AI prompt packs and automation tools..."
                className="mt-1"
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Displayed in search engine results (recommended: 150-160 characters)
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Store info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Support contact for your customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Support Email</label>
              <Input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Download settings */}
        <Card>
          <CardHeader>
            <CardTitle>Download Settings</CardTitle>
            <CardDescription>
              Configure digital delivery options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Link Expiry (hours)
              </label>
              <Input
                type="number"
                value={linkExpiryHours}
                onChange={(e) => setLinkExpiryHours(e.target.value)}
                className="mt-1 w-32"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Downloads</label>
              <Input
                type="number"
                value={maxDownloads}
                onChange={(e) => setMaxDownloads(e.target.value)}
                className="mt-1 w-32"
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
