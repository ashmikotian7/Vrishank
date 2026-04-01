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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display font-bold text-3xl">My Capsules</h1>
            <p className="text-muted-foreground mt-1">{sampleCapsules.length} capsules created</p>
          </div>
          <Link to="/create">
            <Button className="gap-2 shadow-glow">
              <Plus className="w-4 h-4" /> New Capsule
            </Button>
          </Link>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 overflow-x-auto pb-4"
        >
          <div className="flex gap-4 min-w-max">
            {sampleCapsules.slice(0, 5).map((c, i) => {
              const date = new Date(c.unlockDate);
              return (
                <div key={c.id} className="flex flex-col items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${c.status === "delivered" ? "bg-capsule-success" : c.status === "locked" ? "bg-capsule-locked" : "bg-primary"}`} />
                  {i < 4 && <div className="w-24 h-0.5 bg-border absolute" style={{ display: "none" }} />}
                  <div className="glass rounded-xl p-3 text-center min-w-[140px] hover-lift">
                    <p className="text-xs font-medium truncate max-w-[120px]">{c.title}</p>
                    <p className="text-[10px] text-muted-foreground">{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search capsules..." className="pl-10 h-10 rounded-xl" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-10 rounded-xl">
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
            <div className="flex rounded-xl border border-border overflow-hidden">
              <Button size="icon" variant={view === "grid" ? "default" : "ghost"} className="rounded-none h-10 w-10" onClick={() => setView("grid")}>
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button size="icon" variant={view === "list" ? "default" : "ghost"} className="rounded-none h-10 w-10" onClick={() => setView("list")}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Capsule Grid/List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No capsules found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => <CapsuleCard key={c.id} capsule={c} view="grid" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => <CapsuleCard key={c.id} capsule={c} view="list" />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
