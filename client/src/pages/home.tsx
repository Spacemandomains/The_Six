import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWaitlistSchema, type InsertWaitlist } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Rocket,
  ArrowRight,
  Check,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Wallet,
  PiggyBank,
  ExternalLink,
} from "lucide-react";

const STRIPE_URL = "https://buy.stripe.com/dRm00jfX893dcoA7F59MY04";

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertWaitlist>({
    resolver: zodResolver(insertWaitlistSchema),
    defaultValues: {
      email: "",
      source: "WAITLIST",
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: InsertWaitlist) => {
      const res = await apiRequest("POST", "/api/waitlist", { email: data.email.trim().toLowerCase() });
      return res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
      toast({
        title: "You're on the list!",
        description: "We'll be in touch when it's your turn.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Oops",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertWaitlist) => {
    waitlistMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card/70 backdrop-blur-[10px] border border-primary/10 px-6 py-3 rounded-full flex items-center gap-8 shadow-sm flex-wrap"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-foreground" data-testid="text-brand-name">THE SIX</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <a
            href={STRIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            data-testid="link-purchase"
          >
            Purchase
          </a>
        </motion.div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40">
          <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[10%] w-80 h-80 bg-blue-400/10 rounded-full blur-[80px]" />
        </div>

        {/* Hero Text */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-bold tracking-widest uppercase border-primary/20 text-primary">
              Early Access
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
            data-testid="text-hero-title"
          >
            The Six: <span className="text-primary">Founding Access</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed"
            data-testid="text-hero-description"
          >
            An AI C-Suite for day-one founders. Join the waitlist or lock in founding access today.
          </motion.p>
        </div>

        {/* Two-Column Layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-10 py-4"
          >
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2" data-testid="text-benefit-title-1">Priority Early Access</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Founding users get first access and help shape the product from day one.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2" data-testid="text-benefit-title-2">Direct Roadmap Influence</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get a direct line to the build — your feedback prioritizes what ships next.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2" data-testid="text-benefit-title-3">Founding Status</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your founding access is recorded — early supporters get recognized and remembered.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground font-medium">
                Founding users shape the product. Stripe checkout opens in a new tab.
              </p>
            </div>
          </motion.div>

          {/* Right - Purchase / Waitlist Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-md blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

            <Card className="relative p-8 shadow-2xl" data-testid="card-purchase">
              {/* Header with price */}
              <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                <div>
                  <Badge className="mb-2 text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                    Founding Access
                  </Badge>
                  <h2 className="text-2xl font-bold text-foreground" data-testid="text-card-title">Purchase or Join Waitlist</h2>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-extrabold text-foreground tracking-tight" data-testid="text-price">$1,000</span>
                  <span className="text-xs text-muted-foreground font-medium">Founding Access</span>
                </div>
              </div>

              {/* Purchase Button */}
              <Button asChild size="lg" className="w-full py-6 text-base font-bold shadow-lg shadow-primary/30" data-testid="button-purchase">
                <a href={STRIPE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  Purchase Now — $1,000
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>

              {/* Divider */}
              <div className="my-8 border-t border-border" />

              {/* Waitlist Form */}
              {isSubmitted ? (
                <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-md bg-primary/10 border border-primary/20 flex-wrap">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground" data-testid="text-waitlist-success">You're on the waitlist. We'll be in touch!</span>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-waitlist">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">
                        Email Address
                      </label>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="name@company.com"
                                className="w-full bg-muted/50 border-border"
                                data-testid="input-email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="secondary"
                      size="lg"
                      className="w-full py-6 text-base font-bold"
                      disabled={waitlistMutation.isPending}
                      data-testid="button-join-waitlist"
                    >
                      {waitlistMutation.isPending ? "Submitting..." : "Join Waitlist"}
                      {!waitlistMutation.isPending && <ArrowRight className="w-4 h-4 ml-1.5" />}
                    </Button>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      We only use your email for updates about The Six.
                    </p>
                  </form>
                </Form>
              )}

              {/* Secure checkout icons */}
              <div className="mt-6 flex items-center justify-center gap-4 opacity-60">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <Wallet className="w-5 h-5 text-muted-foreground" />
                <PiggyBank className="w-5 h-5 text-muted-foreground" />
                <p className="text-[10px] font-medium text-muted-foreground">Secure checkout</p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-6xl mx-auto mt-24"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground" data-testid="text-videos-title">
              See It In Action
            </h2>
            <p className="mt-2 text-muted-foreground">
              Learn more about what The Six can do for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="grid-videos">
            <Card className="overflow-visible p-0" data-testid="card-video-1">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full rounded-md"
                  src="https://www.youtube.com/embed/8dVa9vH4BbM?si=IIUrPcdBW_sOxprs"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </Card>

            <Card className="overflow-visible p-0" data-testid="card-video-2">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full rounded-md"
                  src="https://www.youtube.com/embed/8adviQrRa1w?si=VfAwsztFjemAkIbX"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </Card>

            <Card className="overflow-visible p-0" data-testid="card-video-3">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full rounded-md"
                  src="https://www.youtube.com/embed/qWO7eXUQ4Rc?si=hOge5HTKpyXhA77T"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-24 border-t border-border pt-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 flex-wrap">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest" data-testid="text-tagline">Built for day-one founders</p>
            <p className="text-xs text-muted-foreground" data-testid="text-copyright">
              {new Date().getFullYear()} The Six. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
