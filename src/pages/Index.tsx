import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Clock, Heart, Shield, Sparkles, Send } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Lock, title: "Time-Locked", desc: "Set a future date — your capsule stays sealed until then." },
  { icon: Shield, title: "Private & Secure", desc: "PIN protection, encryption, and privacy controls." },
  { icon: Send, title: "Share with Loved Ones", desc: "Invite recipients to experience your capsule together." },
  { icon: Heart, title: "Emotionally Rich", desc: "Text, photos, videos — an immersive memory experience." },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5 },
});

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div {...fade(0)}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> Preserve Your Most Precious Moments
            </div>
          </motion.div>

          <motion.h1 {...fade(0.1)} className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-tight">
            Your Memories,{" "}
            <span className="text-gradient">Delivered to the Future</span>
          </motion.h1>

          <motion.p {...fade(0.2)} className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Create digital time capsules filled with messages, photos, and videos.
            Lock them until the perfect moment — then relive every memory.
          </motion.p>

          <motion.div {...fade(0.3)} className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2 shadow-glow text-base px-8">
                Start Creating <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-base px-8">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Floating capsule preview */}
          <motion.div {...fade(0.5)} className="mt-16 mx-auto max-w-md">
            <div className="glass rounded-2xl p-6 shadow-glow animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-display font-semibold text-sm">Our First Anniversary</p>
                  <p className="text-xs text-muted-foreground">Unlocks in 75 days</p>
                </div>
              </div>
              <div className="flex gap-2">
                {["Days", "Hours", "Min", "Sec"].map((l, i) => (
                  <div key={l} className="flex-1 bg-muted/50 rounded-lg p-2 text-center">
                    <div className="font-display font-bold text-gradient">{[75, 14, 32, 8][i]}</div>
                    <div className="text-[10px] text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 gradient-warm">
        <div className="container mx-auto px-4">
          <motion.div {...fade(0)} className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Why TimeCapsule?</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">Every feature is designed to make your memories more meaningful.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fade(i * 0.1)} className="glass rounded-2xl p-6 hover-lift text-center">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fade(0)} className="max-w-lg mx-auto glass rounded-3xl p-10 shadow-glow">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-4">Ready to Capture a Moment?</h2>
            <p className="text-muted-foreground mb-6">Start your first time capsule today — it's free.</p>
            <Link to="/signup">
              <Button size="lg" className="gap-2 shadow-glow">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 TimeCapsule. Built with love for cherished memories.
        </div>
      </footer>
    </div>
  );
};

export default Index;
