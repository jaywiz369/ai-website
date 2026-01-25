"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your store settings
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Store info */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>
              Basic information about your store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Store Name</label>
              <Input defaultValue="PropTemplates" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Support Email</label>
              <Input
                type="email"
                defaultValue="support@proptemplates.com"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>
              Configure Stripe payment integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Stripe Publishable Key
              </label>
              <Input
                placeholder="pk_test_..."
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Stripe Secret Key</label>
              <Input
                type="password"
                placeholder="sk_test_..."
                className="mt-1 font-mono text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Set these in your environment variables for production.
            </p>
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
              <Input type="number" defaultValue="48" className="mt-1 w-32" />
            </div>
            <div>
              <label className="text-sm font-medium">Max Downloads</label>
              <Input type="number" defaultValue="5" className="mt-1 w-32" />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
