import { MousePointerClick, Zap, ShieldCheck } from "lucide-react";

export function HowItWorks() {
    return (
        <section className="py-12 border-b border-border bg-card/30">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <MousePointerClick className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold font-display">1. Browse Collection</h3>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Explore our curated library of battle-tested prompts for engineering, design, and content.
                        </p>
                    </div>
                    {/* Step 2 */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold font-display">2. Instant Access</h3>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Secure checkout and immediate download. No waiting, no subscription barriers.
                        </p>
                    </div>
                    {/* Step 3 */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold font-display">3. Deploy & Scale</h3>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Copy, paste, and customize. Shipping production-grade AI features has never been faster.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
