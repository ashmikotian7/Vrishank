import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Bold, Italic, Smile, Upload, X, CalendarIcon, Clock, Globe, Lock, Shield, Eye, HelpCircle,
  Image, FileText, Save, Send, Gift, Heart, GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import CountdownTimer from "@/components/CountdownTimer";

const timezones = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney",
];

const suggestions = [
  { icon: Gift, label: "Birthday", date: "Next birthday" },
  { icon: Heart, label: "Anniversary", date: "Your anniversary" },
  { icon: GraduationCap, label: "Graduation", date: "Graduation day" },
];

const CreateCapsule = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const [timezone, setTimezone] = useState("UTC");
  const [files, setFiles] = useState<{ name: string; type: string; size: number; progress: number }[]>([]);
  const [isPrivate, setIsPrivate] = useState(true);
  const [pinLocked, setPinLocked] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [autoSaved, setAutoSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Auto-save simulation
  useState(() => {
    const t = setTimeout(() => setAutoSaved(true), 5000);
    return () => clearTimeout(t);
  });

  const addRecipient = () => {
    if (recipientInput && /\S+@\S+\.\S+/.test(recipientInput) && !recipients.includes(recipientInput)) {
      setRecipients([...recipients, recipientInput]);
      setRecipientInput("");
    }
  };

  const simulateUpload = (name: string, type: string, size: number) => {
    const file = { name, type, size, progress: 0 };
    setFiles(prev => [...prev, file]);
    const interval = setInterval(() => {
      setFiles(prev => prev.map(f =>
        f.name === name ? { ...f, progress: Math.min(f.progress + 20, 100) } : f
      ));
    }, 300);
    setTimeout(() => clearInterval(interval), 1800);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const items = Array.from(e.dataTransfer.files);
    items.forEach(f => simulateUpload(f.name, f.type, f.size));
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const items = Array.from(e.target.files || []);
    items.forEach(f => simulateUpload(f.name, f.type, f.size));
  };

  const handleSubmit = () => {
    if (!title || !date) {
      toast.error("Please fill in the title and select a date");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmCreate = () => {
    setConfirmOpen(false);
    toast.success("Capsule created successfully! ✨");
    navigate("/dashboard");
  };

  const unlockDate = date ? new Date(`${format(date, "yyyy-MM-dd")}T${time}:00Z`).toISOString() : null;

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* 🌌 BACKGROUND IMAGE — same as Login */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url('/time-capsule.jpg')" }}
      />

      {/* 🌈 OVERLAY */}
      <div className="absolute inset-0
        bg-gradient-to-br
        from-white/30 via-purple-200/20 to-pink-200/20
        dark:from-black/80 dark:via-black/60 dark:to-black/90
        backdrop-blur-[3px]"
      />

      {/* ✨ GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.35),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.35),transparent_40%)]" />

      {/* FLOATING BLOBS */}
      <div className="absolute top-[-80px] left-[-80px] w-[260px] md:w-[400px] h-[260px] md:h-[400px] bg-purple-500/30 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[260px] md:w-[400px] h-[260px] md:h-[400px] bg-pink-500/30 rounded-full blur-3xl animate-[float_14s_ease-in-out_infinite]" />

      {/* CONTENT */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white">Create a Capsule</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1">Fill it with memories and seal it for the future</p>
          </div>
          {autoSaved && (
            <div className="flex items-center gap-2 text-sm text-capsule-success bg-white/20 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <Save className="w-4 h-4" /> Draft saved
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Editor Panel ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Title & Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              {/* 💎 OUTER BORDER */}
              <div className="p-[1px] rounded-2xl bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30">
                <div className="relative rounded-2xl p-6 space-y-4
                  bg-white/30 dark:bg-white/5
                  backdrop-blur-2xl
                  border border-white/30 dark:border-white/10
                  shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="space-y-2">
                    <Label className="text-gray-800 dark:text-gray-200">Title</Label>
                    <Input
                      placeholder="Our First Anniversary..."
                      className="h-11 rounded-xl text-lg font-display bg-white/20 border border-white/20 placeholder:text-gray-500"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-800 dark:text-gray-200">Description</Label>
                    <Input
                      placeholder="A short description of this capsule..."
                      className="h-11 rounded-xl bg-white/20 border border-white/20 placeholder:text-gray-500"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rich Text Editor */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-[1px] rounded-2xl bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30">
                <div className="relative rounded-2xl p-6 space-y-3
                  bg-white/30 dark:bg-white/5
                  backdrop-blur-2xl
                  border border-white/30 dark:border-white/10
                  shadow-lg hover:shadow-xl transition-all duration-500">
                  <Label className="text-gray-800 dark:text-gray-200">Message</Label>
                  <div className="flex items-center gap-1 p-1 bg-white/20 rounded-lg w-fit border border-white/20">
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Bold className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Italic className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8"><Smile className="w-4 h-4" /></Button>
                  </div>
                  <Textarea
                    placeholder="Write your heartfelt message here..."
                    className="min-h-[180px] rounded-xl resize-none bg-white/20 border border-white/20 placeholder:text-gray-500"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>

            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="p-[1px] rounded-2xl bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30">
                <div className="relative rounded-2xl p-6 space-y-4
                  bg-white/30 dark:bg-white/5
                  backdrop-blur-2xl
                  border border-white/30 dark:border-white/10
                  shadow-lg hover:shadow-xl transition-all duration-500">
                  <Label className="text-gray-800 dark:text-gray-200">Attachments</Label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      dragOver
                        ? "border-purple-400 bg-purple-500/10"
                        : "border-white/30 hover:border-purple-400/50"
                    }`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Drag & drop files here, or</p>
                    <label>
                      <Button variant="outline" size="sm" className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30" asChild>
                        <span>Browse Files</span>
                      </Button>
                      <input type="file" multiple className="hidden" onChange={handleFileInput} />
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map(f => (
                        <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/20 border border-white/20">
                          {f.type.startsWith("image") ? <Image className="w-5 h-5 text-purple-500" /> : <FileText className="w-5 h-5 text-purple-500" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate text-gray-800 dark:text-gray-200">{f.name}</p>
                            <div className="h-1.5 bg-white/30 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300" style={{ width: `${f.progress}%` }} />
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{f.progress}%</span>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setFiles(prev => prev.filter(x => x.name !== f.name))}>
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Privacy & Security */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-[1px] rounded-2xl bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30">
                <div className="relative rounded-2xl p-6 space-y-5
                  bg-white/30 dark:bg-white/5
                  backdrop-blur-2xl
                  border border-white/30 dark:border-white/10
                  shadow-lg hover:shadow-xl transition-all duration-500">
                  <h3 className="font-display font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Shield className="w-5 h-5 text-purple-500" /> Privacy & Security
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Private Capsule</span>
                      <Tooltip>
                        <TooltipTrigger><HelpCircle className="w-3.5 h-3.5 text-gray-500" /></TooltipTrigger>
                        <TooltipContent>Only you and recipients can view this capsule</TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">PIN Lock</span>
                      <Tooltip>
                        <TooltipTrigger><HelpCircle className="w-3.5 h-3.5 text-gray-500" /></TooltipTrigger>
                        <TooltipContent>Require a PIN to open this capsule</TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch checked={pinLocked} onCheckedChange={setPinLocked} />
                  </div>

                  {/* Recipients */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                      Recipients
                      <Tooltip>
                        <TooltipTrigger><HelpCircle className="w-3.5 h-3.5 text-gray-500" /></TooltipTrigger>
                        <TooltipContent>People who will receive this capsule when it unlocks</TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="email@example.com"
                        className="h-10 rounded-xl bg-white/20 border border-white/20 placeholder:text-gray-500"
                        value={recipientInput}
                        onChange={e => setRecipientInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addRecipient())}
                      />
                      <Button
                        variant="outline"
                        className="rounded-xl bg-white/20 border-white/20 hover:bg-white/30"
                        onClick={addRecipient}
                      >
                        Add
                      </Button>
                    </div>
                    {recipients.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {recipients.map(r => (
                          <Badge key={r} variant="secondary" className="rounded-full px-3 py-1 gap-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-400/30">
                            {r}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => setRecipients(prev => prev.filter(x => x !== r))} />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Preview / Schedule Panel ── */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24"
            >
              <div className="p-[1px] rounded-2xl bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30">
                <div className="relative rounded-2xl p-6 space-y-4
                  bg-white/30 dark:bg-white/5
                  backdrop-blur-2xl
                  border border-white/30 dark:border-white/10
                  shadow-lg hover:shadow-xl transition-all duration-500">

                  <h3 className="font-display font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <Clock className="w-5 h-5 text-purple-500" /> Schedule
                  </h3>

                  <div className="space-y-2">
                    <Label className="text-gray-800 dark:text-gray-200">Unlock Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start h-11 rounded-xl gap-2 bg-white/20 border-white/20 hover:bg-white/30 text-gray-700 dark:text-gray-300">
                          <CalendarIcon className="w-4 h-4" />
                          {date ? format(date, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl backdrop-blur-xl bg-white/80 dark:bg-black/80 border-white/20" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} disabled={d => d < new Date()} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-gray-800 dark:text-gray-200">Time</Label>
                      <Input
                        type="time"
                        className="h-10 rounded-xl bg-white/20 border border-white/20"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-800 dark:text-gray-200">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="h-10 rounded-xl bg-white/20 border border-white/20">
                          <Globe className="w-4 h-4 mr-1" /><SelectValue />
                        </SelectTrigger>
                        <SelectContent className="backdrop-blur-xl bg-white/80 dark:bg-black/80">
                          {timezones.map(tz => <SelectItem key={tz} value={tz}>{tz.replace(/_/g, " ")}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Countdown Preview */}
                  {unlockDate && (
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Unlocks in:</Label>
                      <CountdownTimer targetDate={unlockDate} large />
                    </div>
                  )}

                  {/* Smart Suggestions */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Quick picks</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {suggestions.map(s => (
                        <button
                          key={s.label}
                          className="p-3 rounded-xl bg-white/20 border border-white/20 hover:bg-white/30 text-center transition-colors"
                          onClick={() => {
                            const d = new Date();
                            d.setMonth(d.getMonth() + 3);
                            setDate(d);
                          }}
                        >
                          <s.icon className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                          <p className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{s.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview Card */}
                  <div className="rounded-xl bg-white/20 border border-white/20 p-4 space-y-3 mt-4">
                    <h4 className="font-display font-semibold text-sm text-gray-800 dark:text-gray-200">Preview</h4>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{title || "Untitled Capsule"}</p>
                      <p className="text-xs text-gray-500">{description || "No description"}</p>
                    </div>
                    {message && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{message}</p>}
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>{files.length} files</span>
                      <span>•</span>
                      <span>{recipients.length} recipients</span>
                      <span>•</span>
                      <span>{isPrivate ? "Private" : "Public"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl bg-white/20 border-white/20 hover:bg-white/30"
                      onClick={() => { toast.info("Draft saved"); }}
                    >
                      <Save className="w-4 h-4 mr-2" /> Save Draft
                    </Button>
                    <Button
                      className="flex-1 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition shadow-lg"
                      onClick={handleSubmit}
                    >
                      <Send className="w-4 h-4 mr-2" /> Create
                    </Button>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="backdrop-blur-xl bg-white/80 dark:bg-[#111]/80 rounded-2xl border border-white/20">
          <DialogHeader>
            <DialogTitle className="font-display">Seal this Capsule?</DialogTitle>
            <DialogDescription>Once created, the unlock date cannot be changed. Are you sure?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              className="rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.02] transition"
              onClick={confirmCreate}
            >
              Seal & Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default CreateCapsule;
