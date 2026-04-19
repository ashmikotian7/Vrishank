import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Clock, Heart, Shield, Send } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Clock,
    title: "Future Message Delivery",
    desc: "Write messages today and schedule them to be delivered years later."
  },
  {
    icon: Lock,
    title: "Time-Sealed Capsules",
    desc: "Lock your memories securely until a chosen future date."
  },
  {
    icon: Send,
    title: "Deliver to Loved Ones",
    desc: "Send meaningful messages to friends or family in the future."
  },
  {
    icon: Heart,
    title: "Emotional Moments",
    desc: "Capture feelings, dreams, and memories for your future self."
  },
  {
    icon: Shield,
    title: "All-in-One Capsule",
    desc: "Secure, emotional, time-locked, and shareable — everything in one powerful digital capsule."
  },
];

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.5, ease: "easeOut" },
});

export default function Index() {
  const { pathname } = useLocation();

  // ✅ Scroll to top on refresh or route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-gray-900 dark:text-gray-100 selection:bg-purple-500/30">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 sm:scale-105"
        style={{
          backgroundImage: "url('/time-capsule.jpg')",
        }}
      />

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 via-purple-400/25 to-indigo-500/30 mix-blend-overlay" />

      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent dark:from-black/70 dark:via-purple-900/10 dark:to-black/80 backdrop-blur-[2px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.2),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.2),transparent_40%)]" />

      {/* BLOBS (smaller on mobile) */}
      <div className="absolute top-[-40px] left-[-40px] w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] bg-purple-400/20 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-60px] right-[-40px] w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] bg-pink-400/20 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]" />

      <div className="relative z-10">

        {/* HERO */}
        <section className="py-16 sm:py-20 px-4">
          <motion.div className="max-w-3xl mx-auto text-center">

            <div className="w-full px-4 sm:px-6 py-6 sm:py-8 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-500">

              <motion.h1
                {...fade(0)}
                className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight"
              >
                Send Messages <br />
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Into the Future
                </span>
              </motion.h1>

              <motion.p
                {...fade(0.2)}
                className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300"
              >
                Create digital time capsules and deliver messages, memories, and emotions to your future self or loved ones.
              </motion.p>

              <motion.div
                {...fade(0.4)}
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
              >
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:scale-105 transition">
                    Get Started <ArrowRight className="ml-2" />
                  </Button>
                </Link>

                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto rounded-2xl bg-white/40 dark:bg-white/5 border-white/30 text-gray-900 dark:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            </div>

          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="pb-12 sm:pb-16 max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fade(i * 0.1)}
                className="group p-4 sm:p-5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-3 sm:mb-4">
                  <f.icon className="text-white w-5 h-5" />
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 flex justify-center px-4">
          <motion.div
            {...fade(0)}
            className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white/50 dark:bg-white/5 border border-white/30 backdrop-blur-2xl shadow-lg text-center"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Start Your Time Capsule Journey
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
              Write something today that your future self will thank you for.
            </p>

            <Link to="/signup">
              <Button className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition">
                Create Now
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/20 bg-pink-200/40 dark:bg-pink-500/10 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-5 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            © 2026 TimeCapsule
          </div>
        </footer>

      </div>
    </div>
  );
}
