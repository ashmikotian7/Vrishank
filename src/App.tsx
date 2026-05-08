import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Navbar from "@/components/Navbar";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateCapsule from "./pages/CreateCapsule";
import UploadAttachments from "./pages/UploadAttachments";
import CapsuleView from "./pages/CapsuleView";
import OpenCapsule from "./pages/OpenCapsule";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import About from "./pages/About";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <BrowserRouter>
              {/* ✅ All routes */}
              <Routes>
                <Route path="/" element={<><Navbar /><Index /></>} />
                <Route path="/login" element={<><Navbar /><Login /></>} />
                <Route path="/signup" element={<><Navbar /><Signup /></>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create" element={<CreateCapsule />} />
                <Route path="/upload-attachments/:capsuleId" element={<UploadAttachments />} />
                <Route path="/capsule/:id" element={<CapsuleView />} />
                <Route path="/open/:id" element={<OpenCapsule />} />
                <Route path="/about" element={<><Navbar /><About /></>} />
                <Route path="/contact" element={<><Navbar /><Contact /></>} />
                <Route path="*" element={<><Navbar /><NotFound /></>} />
              </Routes>
            </BrowserRouter>

          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;