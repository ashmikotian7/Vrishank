import { Mail, User, MessageSquare, Phone } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row text-gray-900 dark:text-gray-100">

      {/* LEFT SIDE - IMAGE */}
      <div className="relative md:w-1/2 h-64 md:h-auto">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/time-capsule.jpg')" }}
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />

        {/* branding */}
        <div className="relative z-10 flex items-center justify-center h-full text-white px-6 text-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Get in Touch 📩
            </h1>
            <p className="text-sm md:text-base text-gray-200">
              We’d love to hear from you anytime
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex items-center justify-center md:w-1/2 p-6 sm:p-10 bg-gradient-to-br from-white to-purple-50 dark:from-black dark:to-black">

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >

          {/* CARD */}
          <div className="p-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">

            <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 shadow-xl">

              {/* HEADER */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-sm">📩</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Contact Us
                </h2>

                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  We'd love to hear from you ✨
                </p>
              </div>

              {/* FORM */}
              <form className="space-y-4">

                {/* ROW */}
                <div className="grid md:grid-cols-2 gap-4">

                  {/* NAME */}
                  <div>
                    <label className="text-sm">Full Name</label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-10 h-11 rounded-xl bg-white/70 dark:bg-white/10 border border-white/30 focus:ring-2 focus:ring-purple-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="text-sm">Email</label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full pl-10 h-11 rounded-xl bg-white/70 dark:bg-white/10 border border-white/30 focus:ring-2 focus:ring-purple-400 outline-none"
                      />
                    </div>
                  </div>

                </div>

                {/* PHONE */}
                <div>
                  <label className="text-sm">Phone Number</label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      className="w-full pl-10 h-11 rounded-xl bg-white/70 dark:bg-white/10 border border-white/30 focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                  </div>
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="text-sm">Message</label>
                  <div className="relative mt-1">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <textarea
                      rows={4}
                      placeholder="Write your message..."
                      className="w-full pl-10 pt-3 rounded-xl bg-white/70 dark:bg-white/10 border border-white/30 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition"
                >
                  Send Message
                </button>

              </form>

              {/* FOOTER */}
              <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-4">
                We usually respond within 24 hours 🚀
              </p>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;