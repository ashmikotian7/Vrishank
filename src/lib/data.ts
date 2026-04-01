export interface Capsule {
  id: string;
  title: string;
  description: string;
  status: "scheduled" | "delivered" | "locked";
  unlockDate: string;
  createdAt: string;
  mediaCount: number;
  recipientCount: number;
  isPrivate: boolean;
  message?: string;
}

export const sampleCapsules: Capsule[] = [
  {
    id: "1",
    title: "Our First Anniversary",
    description: "A collection of our favorite memories from the first year together.",
    status: "scheduled",
    unlockDate: "2026-06-15T10:00:00Z",
    createdAt: "2025-12-01T08:00:00Z",
    mediaCount: 12,
    recipientCount: 2,
    isPrivate: true,
    message: "Happy anniversary, my love! Remember the day we first met at that coffee shop? I knew from that moment that something magical was about to begin. Here are all the little moments I've collected just for us. Every photo, every note — they all tell our story. I can't wait to make a million more memories with you. 💕"
  },
  {
    id: "2",
    title: "Graduation Memories 🎓",
    description: "Messages from classmates and teachers for the class of 2026.",
    status: "delivered",
    unlockDate: "2026-01-15T12:00:00Z",
    createdAt: "2025-09-20T14:30:00Z",
    mediaCount: 28,
    recipientCount: 15,
    isPrivate: false,
    message: "Congratulations, Class of 2026! We did it! This capsule contains messages from everyone — your friends, your teachers, and even a few surprises. Remember that all-nighter before finals? Or the time we accidentally set off the fire alarm? These are the moments that made our journey unforgettable."
  },
  {
    id: "3",
    title: "Letter to Future Me",
    description: "Goals, dreams, and reflections to open on my 30th birthday.",
    status: "locked",
    unlockDate: "2028-03-22T00:00:00Z",
    createdAt: "2026-03-22T09:15:00Z",
    mediaCount: 5,
    recipientCount: 1,
    isPrivate: true,
  },
  {
    id: "4",
    title: "Family Reunion 2025",
    description: "Photos and videos from our summer reunion at Grandma's house.",
    status: "delivered",
    unlockDate: "2026-01-01T00:00:00Z",
    createdAt: "2025-08-10T16:00:00Z",
    mediaCount: 45,
    recipientCount: 8,
    isPrivate: false,
  },
  {
    id: "5",
    title: "New Year Resolutions",
    description: "Our team's goals and predictions for the coming year.",
    status: "scheduled",
    unlockDate: "2027-01-01T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z",
    mediaCount: 3,
    recipientCount: 6,
    isPrivate: false,
  },
  {
    id: "6",
    title: "Baby's First Year 👶",
    description: "Monthly milestones and precious moments captured forever.",
    status: "locked",
    unlockDate: "2027-07-15T00:00:00Z",
    createdAt: "2026-02-15T11:00:00Z",
    mediaCount: 60,
    recipientCount: 1,
    isPrivate: true,
  },
];

export const notifications = [
  { id: "1", type: "unlock" as const, message: "Your capsule 'Graduation Memories' has been delivered!", time: "2 hours ago", read: false },
  { id: "2", type: "reminder" as const, message: "Capsule 'Our First Anniversary' unlocks in 30 days", time: "1 day ago", read: false },
  { id: "3", type: "recipient" as const, message: "Sarah accepted your capsule invitation", time: "3 days ago", read: true },
  { id: "4", type: "system" as const, message: "Your capsule draft was auto-saved", time: "5 days ago", read: true },
];
