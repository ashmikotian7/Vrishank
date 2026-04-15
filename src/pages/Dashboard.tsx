import { useState } from "react";
import { Link } from "react-router-dom";
import { sampleCapsules } from "@/lib/data";
import CapsuleCard from "@/components/CapsuleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, LayoutGrid, List, Filter } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = sampleCapsules.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen relative overflow-hidden text-gray-900 dark:text-gray-100">

      {/* 🌌 BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/time-capsule.jpg')" }}
      />

      {/* 🎨 GRADIENT OVERLAY */}
      <div className="absolute inset-0 
        bg-gradient-to-br 
        from-purple-400/30 via-pink-400/20 to-indigo-500/30 
        mix-blend-overlay"
      />

      {/* 🌗 LIGHT/DARK OVERLAY */}
      <div className="absolute inset-0 
        bg-gradient-to-br 
        from-white/50 via-white/10 to-transparent 
        dark:from-black/70 dark:via-black/40 dark:to-black/80 
        backdrop-blur-[2px]"
      />

      {/* ✨ GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.25),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.25),transparent_40%)]" />

      {/* FLOATING BLOBS */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-400/20 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-400/20 rounded-full blur-3xl animate-[float_14s_ease-in-out_infinite]" />

      {/* CONTENT */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-bold text-3xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              My Capsules
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {sampleCapsules.length} capsules created
            </p>
          </div>

          <Link to="/create">
            <Button className="gap-2 h-11 rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-md hover:scale-105 transition">
              <Plus className="w-4 h-4" /> New Capsule
            </Button>
          </Link>
        </motion.div>

        {/* TIMELINE (GLASS STYLE) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 overflow-x-auto pb-4"
        >
          <div className="flex gap-4 min-w-max">
            {sampleCapsules.slice(0, 5).map((c) => {
              const date = new Date(c.unlockDate);
              return (
                <div key={c.id} className="flex flex-col items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${
                    c.status === "delivered"
                      ? "bg-green-400"
                      : c.status === "locked"
                      ? "bg-gray-400"
                      : "bg-purple-400"
                  }`} />

                  <div className="rounded-xl p-3 text-center min-w-[140px]
                    bg-white/30 dark:bg-white/5
                    backdrop-blur-xl
                    border border-white/30
                    hover:scale-105 transition"
                  >
                    <p className="text-xs font-medium truncate max-w-[120px]">
                      {c.title}
                    </p>
                    <p className="text-[10px] text-gray-600 dark:text-gray-300">
                      {date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search capsules..."
              className="pl-10 h-11 rounded-xl bg-white/30 dark:bg-white/10 border border-white/30"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-11 rounded-xl bg-white/30 dark:bg-white/10 border border-white/30">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex rounded-xl border border-white/30 overflow-hidden">
              <Button size="icon" variant={view === "grid" ? "default" : "ghost"} className="rounded-none h-11 w-11">
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button size="icon" variant={view === "list" ? "default" : "ghost"} className="rounded-none h-11 w-11">
                <List className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </motion.div>

        {/* CAPSULE LIST */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600 dark:text-gray-300">
            <p className="text-lg">No capsules found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => (
              <CapsuleCard key={c.id} capsule={c} view="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => (
              <CapsuleCard key={c.id} capsule={c} view="list" />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;