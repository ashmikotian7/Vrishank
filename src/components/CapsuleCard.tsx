import { Link } from "react-router-dom";
import { Capsule } from "@/lib/data";
import { Clock, Lock, CheckCircle, Image, Users, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";

const statusConfig = {
  scheduled: { icon: Clock, label: "Scheduled", className: "bg-capsule-soft/15 text-capsule-soft border-capsule-soft/20" },
  delivered: { icon: CheckCircle, label: "Delivered", className: "bg-capsule-success/15 text-capsule-success border-capsule-success/20" },
  locked: { icon: Lock, label: "Locked", className: "bg-capsule-locked/15 text-capsule-locked border-capsule-locked/20" },
};

interface Props {
  capsule: Capsule;
  view?: "grid" | "list";
}

const CapsuleCard = ({ capsule, view = "grid" }: Props) => {
  const status = statusConfig[capsule.status];
  const StatusIcon = status.icon;

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 p-4 rounded-xl gradient-card shadow-card hover-lift border border-border/50"
      >
        <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center shrink-0">
          <StatusIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold truncate">{capsule.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{capsule.description}</p>
        </div>
        <Badge variant="outline" className={status.className}>{status.label}</Badge>
        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Image className="w-3 h-3" /> {capsule.mediaCount}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {capsule.recipientCount}</span>
        </div>
        <div className="flex gap-1">
          {capsule.status === "delivered" && (
            <Link to={`/open/${capsule.id}`}>
              <Button size="sm" variant="ghost">Open</Button>
            </Link>
          )}
          <Button size="icon" variant="ghost"><Pencil className="w-3.5 h-3.5" /></Button>
          <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl gradient-card shadow-card hover-lift border border-border/50 overflow-hidden group"
    >
      <div className="h-2 gradient-hero" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg truncate">{capsule.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{capsule.description}</p>
          </div>
          <Badge variant="outline" className={`ml-2 shrink-0 ${status.className}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>

        {capsule.status !== "delivered" && (
          <CountdownTimer targetDate={capsule.unlockDate} />
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5" /> {capsule.mediaCount} files</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {capsule.recipientCount}</span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {capsule.status === "delivered" && (
              <Link to={`/open/${capsule.id}`}>
                <Button size="sm">Open</Button>
              </Link>
            )}
            <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="w-3.5 h-3.5" /></Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CapsuleCard;
