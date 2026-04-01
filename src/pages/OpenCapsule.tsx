import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { sampleCapsules } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const sampleImages = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
];

const OpenCapsule = () => {
  const { id } = useParams();
  const capsule = sampleCapsules.find(c => c.id === id);
  const [phase, setPhase] = useState<"unlock" | "reveal" | "content">("unlock");
  const [currentImage, setCurrentImage] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const hasConfettied = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 2500);
    const t2 = setTimeout(() => setPhase("content"), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase === "reveal" && !hasConfettied.current) {
      hasConfettied.current = true;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#8b5cf6", "#ec4899", "#f59e0b"] });
    }
  }, [phase]);

  if (!capsule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-display">Capsule not found</p>
          <Link to="/dashboard"><Button variant="outline" className="mt-4">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 gradient-hero opacity-[0.03]" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />

      <AnimatePresence mode="wait">
        {phase === "unlock" && (
          <motion.div
            key="unlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-32 h-32 rounded-full gradient-hero mx-auto flex items-center justify-center shadow-glow animate-unlock-glow"
              >
                <span className="text-5xl">⏳</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 font-display text-xl text-muted-foreground"
              >
                Unsealing your capsule...
              </motion.p>
            </div>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display font-bold text-4xl md:text-6xl text-gradient"
              >
                {capsule.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-muted-foreground text-lg"
              >
                {capsule.description}
              </motion.p>
            </div>
          </motion.div>
        )}

        {phase === "content" && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Top bar */}
            <div className="sticky top-0 z-20 glass border-b border-border/50">
              <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                </Link>
                <h2 className="font-display font-semibold text-sm truncate max-w-[200px]">{capsule.title}</h2>
                <Button variant="ghost" size="icon" onClick={() => setMusicOn(!musicOn)}>
                  {musicOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-3xl p-8 md:p-12 mb-10 shadow-glow"
              >
                <p className="font-display text-2xl md:text-3xl font-semibold text-gradient mb-6">
                  A message from the past...
                </p>
                <div className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {capsule.message || "This capsule contains your precious memories. Every moment captured here was meant to be experienced at just the right time. Welcome to this moment. ✨"}
                </div>
                <div className="mt-8 pt-6 border-t border-border/50 text-sm text-muted-foreground">
                  <p>Created on {new Date(capsule.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </motion.div>

              {/* Media Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-10"
              >
                <h3 className="font-display font-semibold text-lg mb-4">Memories</h3>
                <div className="relative rounded-2xl overflow-hidden shadow-glow">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={sampleImages[currentImage]}
                      alt={`Memory ${currentImage + 1}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-[400px] object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {sampleImages.map((_, i) => (
                      <button
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? "bg-primary-foreground w-6" : "bg-primary-foreground/50"}`}
                        onClick={() => setCurrentImage(i)}
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-foreground/10 hover:bg-foreground/20 text-primary-foreground"
                    onClick={() => setCurrentImage(i => (i - 1 + sampleImages.length) % sampleImages.length)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground/10 hover:bg-foreground/20 text-primary-foreground"
                    onClick={() => setCurrentImage(i => (i + 1) % sampleImages.length)}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <p className="text-muted-foreground mb-4">Inspired to create your own?</p>
                <Link to="/create">
                  <Button size="lg" className="shadow-glow rounded-xl">Create a Capsule</Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpenCapsule;
