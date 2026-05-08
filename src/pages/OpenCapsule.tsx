import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { capsuleApi } from "@/lib/capsuleApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Volume2, VolumeX, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Use actual capsule attachments instead of sample images

const OpenCapsule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"locked" | "unlock" | "reveal" | "content">("locked");
  const [pin, setPin] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const hasConfettied = useRef(false);

  useEffect(() => {
    const loadCapsule = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // First try to get capsule data without auth (for public access)
        try {
          const capsuleData = await capsuleApi.unlockCapsule(parseInt(id), '');
          setCapsule(capsuleData);
          setPhase("unlock");
        } catch (unlockErr) {
          // If unlock fails, try authenticated endpoint
          try {
            const capsuleData = await capsuleApi.getCapsule(id);
            setCapsule(capsuleData);
            
            // Check if capsule is unlocked
            if (capsuleData.is_unlocked) {
              setPhase("unlock");
            } else {
              setPhase("locked");
            }
          } catch (authErr) {
            throw new Error("Capsule not found or access denied");
          }
        }
        
        setError(null);
      } catch (err) {
        setError("Failed to load capsule");
        console.error("Error loading capsule:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCapsule();
  }, [id]);

  useEffect(() => {
    if (phase === "unlock") {
      const t1 = setTimeout(() => setPhase("reveal"), 2500);
      const t2 = setTimeout(() => setPhase("content"), 4500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "reveal" && !hasConfettied.current) {
      hasConfettied.current = true;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#8b5cf6", "#ec4899", "#f59e0b"] });
    }
  }, [phase]);

  const handleUnlock = async () => {
    if (!capsule || !id) return;
    
    try {
      const unlockedCapsule = await capsuleApi.unlockCapsule(parseInt(id), pin);
      setCapsule(unlockedCapsule);
      setPhase("unlock");
      setError(null);
    } catch (err) {
      console.error("Unlock error:", err);
      setError("Failed to unlock capsule. Please check the PIN and try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-display">Loading capsule...</p>
        </div>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-display text-red-600">{error || "Capsule not found"}</p>
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
        {phase === "locked" && (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="text-center max-w-md mx-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full gradient-hero mx-auto flex items-center justify-center shadow-glow mb-8"
              >
                <Lock className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold mb-4">{capsule.title}</h2>
              {capsule.description && (
                <p className="text-muted-foreground mb-4">{capsule.description}</p>
              )}
              <p className="text-muted-foreground mb-6">This capsule is still sealed and cannot be opened yet.</p>
              
              {capsule.pin_lock && (
                <div className="space-y-4 mb-6">
                  <Input
                    type="password"
                    placeholder="Enter 4-digit PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="max-w-xs mx-auto"
                    maxLength={4}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Button onClick={handleUnlock} disabled={!capsule.is_unlocked} className="w-full">
                  {capsule.is_unlocked ? "Open Capsule" : "Still Locked"}
                </Button>
                {!capsule.is_unlocked && (
                  <p className="text-sm text-muted-foreground">
                    Available on: {new Date(capsule.unlock_date).toLocaleString()}
                  </p>
                )}
              </div>
              
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
          </motion.div>
        )}

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
                  <p>Created on {new Date(capsule.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </motion.div>

              {/* Media Carousel - Show actual attachments */}
              {capsule.attachments && capsule.attachments.length > 0 && (
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
                        src={capsule.attachments[currentImage]?.file_url}
                        alt={capsule.attachments[currentImage]?.file_name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-[400px] object-cover"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {capsule.attachments.map((_: any, i: number) => (
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
                      onClick={() => setCurrentImage(i => (i - 1 + capsule.attachments.length) % capsule.attachments.length)}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground/10 hover:bg-foreground/20 text-primary-foreground"
                      onClick={() => setCurrentImage(i => (i + 1) % capsule.attachments.length)}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

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
