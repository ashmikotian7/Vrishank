import { useEffect, useState } from "react";

interface Props {
  targetDate: string;
  large?: boolean;
}

const CountdownTimer = ({ targetDate, large = false }: Props) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="flex gap-2">
      {units.map(u => (
        <div key={u.label} className={`flex-1 text-center rounded-lg bg-muted/50 border border-border/50 ${large ? "p-3" : "p-2"}`}>
          <div className={`font-display font-bold text-gradient ${large ? "text-2xl" : "text-lg"}`}>
            {String(u.value).padStart(2, "0")}
          </div>
          <div className={`text-muted-foreground ${large ? "text-xs" : "text-[10px]"}`}>{u.label}</div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
