import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const About = () => {

  const { pathname } = useLocation();

  // ✅ Scroll to top on refresh / route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen relative overflow-hidden text-gray-900 dark:text-gray-100">

      {/* 🌌 BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/time-capsule.jpg')" }}
      />

      {/* 🎨 PINK + PURPLE TINT */}
      <div className="absolute inset-0 
        bg-gradient-to-br 
        from-pink-400/30 via-purple-400/25 to-indigo-500/30 
        mix-blend-overlay" 
      />

      {/* 🌗 LIGHT/DARK OVERLAY */}
      <div className="absolute inset-0 
        bg-gradient-to-br 
        from-white/60 via-white/10 to-transparent 
        dark:from-black/70 dark:via-purple-900/10 dark:to-black/80 
        backdrop-blur-[2px]" 
      />

      {/* ✨ COLOR GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.2),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.2),transparent_40%)]" />

      {/* BLOBS */}
      <div className="absolute top-[-60px] left-[-60px] w-[300px] h-[300px] bg-purple-400/20 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-80px] right-[-60px] w-[300px] h-[300px] bg-pink-400/20 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">

        {/* 🧾 ABOUT CARD */}
        <div className="mb-16 flex justify-center">
          <div className="
            w-full max-w-3xl p-8 md:p-10 rounded-3xl
            bg-white/40 dark:bg-white/5
            backdrop-blur-2xl
            border border-white/30 dark:border-white/10
            shadow-lg hover:shadow-xl
            transition-all duration-500
            text-center
          ">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                TimeCapsule
              </span>
            </h1>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm md:text-lg">
              Our Digital Time Capsule platform helps you preserve meaningful moments,
              thoughts, and emotions for the future. In a fast-moving world, we help you
              pause and capture what truly matters.
            </p>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Whether it's a message to your future self or a surprise for someone
              special, your memories are safely stored and delivered exactly when intended.
            </p>
          </div>
        </div>

        {/* ✨ FEATURE CARDS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* 🎯 Mission */}
          <div className="
            p-6 rounded-2xl
            bg-white/40 dark:bg-white/5
            backdrop-blur-xl
            border border-white/30 dark:border-white/10
            shadow-md hover:shadow-xl
            transition-all duration-300 hover:-translate-y-1
          ">
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-purple-600">
              🎯 Our Mission
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
              We empower people to preserve memories and emotions in a meaningful way,
              helping them rediscover their past with joy and nostalgia.
            </p>
          </div>

          {/* 👁️ Vision */}
          <div className="
            p-6 rounded-2xl
            bg-white/40 dark:bg-white/5
            backdrop-blur-xl
            border border-white/30 dark:border-white/10
            shadow-md hover:shadow-xl
            transition-all duration-300 hover:-translate-y-1
          ">
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-indigo-600">
              👁️ Our Vision
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
              We envision a world where technology connects people with their past,
              present, and future selves in meaningful ways.
            </p>
          </div>

          {/* ⚙️ What We Do */}
          <div className="
            p-6 rounded-2xl
            bg-white/40 dark:bg-white/5
            backdrop-blur-xl
            border border-white/30 dark:border-white/10
            shadow-md hover:shadow-xl
            transition-all duration-300 hover:-translate-y-1
          ">
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-pink-600">
              ⚙️ What We Do
            </h2>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
              We let you create digital capsules with messages, media, and memories
              that unlock at a future date.
            </p>
          </div>

          {/* 🔐 Why Choose Us */}
          <div className="
            p-6 rounded-2xl
            bg-white/40 dark:bg-white/5
            backdrop-blur-xl
            border border-white/30 dark:border-white/10
            shadow-md hover:shadow-xl
            transition-all duration-300 hover:-translate-y-1
          ">
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-green-600">
              🔐 Why Choose Us
            </h2>
            <ul className="text-sm md:text-base text-gray-700 dark:text-gray-300 space-y-1">
              <li>✔️ Secure storage</li>
              <li>✔️ Simple UI</li>
              <li>✔️ Time-based delivery</li>
              <li>✔️ Emotional experience</li>
            </ul>
          </div>

        </div>

        {/* 📌 CLOSING CARD */}
        <div className="mt-16 flex justify-center">
          <div className="
            w-full max-w-2xl p-6 md:p-8 rounded-3xl
            bg-white/40 dark:bg-white/5
            backdrop-blur-2xl
            border border-white/30 dark:border-white/10
            shadow-lg hover:shadow-xl
            transition-all duration-300
            text-center
          ">
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-lg">
              Every moment has value. Preserve your memories today and turn them
              into timeless treasures for tomorrow.
            </p>
          </div>
        </div>

      </div>

      {/* ✅ FOOTER ADDED (outside content, always bottom) */}
      <footer className="relative z-10 border-t border-white/20 bg-pink-200/30 dark:bg-pink-500/10 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-5 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2026 TimeCapsule
        </div>
      </footer>
    </div>
  );
};

export default About;