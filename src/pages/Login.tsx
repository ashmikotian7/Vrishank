import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import GoogleButton from "@/components/GoogleButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Scroll to top on refresh / route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Minimum 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGoogleLogin = async (response: any) => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle(response);
      if (success) {
        toast.success("Welcome back with Google!");
        navigate("/dashboard");
      } else {
        toast.error("Google login failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during Google login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ❌ HIDDEN ON MOBILE */}
      <div className="hidden md:block relative md:w-1/2 h-64 md:h-auto">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/time-capsule.jpg')" }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />

        <div className="relative z-10 flex items-center justify-center h-full text-white px-6 text-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome Back ⏳
            </h1>
            <p className="text-sm md:text-base text-gray-200">
              Continue your journey with TimeCapsule
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-4 sm:p-6 md:p-10 bg-gradient-to-br from-white to-purple-50 dark:from-black dark:to-black">

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >

          <div className="p-[1px] rounded-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">

            <div className="rounded-3xl p-5 sm:p-6 md:p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 shadow-xl">

              {/* HEADER */}
              <div className="text-center mb-6 sm:mb-8">
                <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl sm:text-2xl mb-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-sm">⏳</span>
                  </div>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    TimeCapsule
                  </span>
                </Link>

                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  Sign in to your account
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* EMAIL */}
                <div>
                  <Label>Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-10 sm:h-11 rounded-xl bg-white/70 dark:bg-white/10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>

                {/* PASSWORD */}
                <div>
                  <Label>Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-10 sm:h-11 rounded-xl bg-white/70 dark:bg-white/10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                </div>

                {/* FORGOT */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setRecoveryOpen(true)}
                    className="text-xs text-purple-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* BUTTON */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 sm:h-11 rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* SOCIAL */}
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="flex-1 h-px bg-gray-300" />
                  <span className="px-3 text-xs text-gray-500">
                    Or continue with
                  </span>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>

                <div className="flex justify-center mt-4">
                  <GoogleButton onSuccess={handleGoogleLogin} />
                </div>
              </div>

              {/* SIGNUP */}
              <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-6">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-purple-500 font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>

            </div>
          </div>
        </motion.div>
      </div>

      {/* MODAL */}
      <Dialog open={recoveryOpen} onOpenChange={setRecoveryOpen}>
        <DialogContent className="backdrop-blur-xl bg-white/80 dark:bg-[#111]/80 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email to receive a reset link.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="you@example.com"
              className="h-11 rounded-xl"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
            />
            <Button
              className="w-full rounded-xl"
              onClick={() => {
                toast.success("Reset link sent!");
                setRecoveryOpen(false);
              }}
            >
              Send Reset Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Login;