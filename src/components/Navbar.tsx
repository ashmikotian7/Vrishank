import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Bell, Moon, Sun, LogOut, Plus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { notifications } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
            <span className="text-primary-foreground text-sm">⏳</span>
          </div>
          <span className="text-gradient hidden sm:inline">TimeCapsule</span>
        </Link>

        {user ? (
          <>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">My Capsules</Button>
              </Link>
              <Link to="/create">
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" /> Create
                </Button>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setShowNotif(!showNotif)} className="relative">
                  <Bell className="w-4 h-4" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </Button>
                <AnimatePresence>
                  {showNotif && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 glass-strong rounded-xl shadow-glow p-4 space-y-3"
                    >
                      <h4 className="font-display font-semibold text-sm">Notifications</h4>
                      {notifications.map(n => (
                        <div key={n.id} className={`p-3 rounded-lg text-sm ${n.read ? "bg-muted/50" : "bg-primary/5 border border-primary/10"}`}>
                          <p className="text-foreground">{n.message}</p>
                          <p className="text-muted-foreground text-xs mt-1">{n.time}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }} className="gap-1 text-muted-foreground">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>

            {/* Mobile toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute top-16 left-0 right-0 glass-strong border-b border-border p-4 flex flex-col gap-2 md:hidden"
                >
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">My Capsules</Button>
                  </Link>
                  <Link to="/create" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full justify-start gap-1"><Plus className="w-4 h-4" /> Create</Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={toggleTheme}>
                    {theme === "light" ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
            <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
