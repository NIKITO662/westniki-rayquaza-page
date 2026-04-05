import { useState } from "react";
import rayquaza from "@/assets/rayquaza.gif";
import StarryBackground from "@/components/StarryBackground";
import { Github, Link } from "lucide-react";

const roarMessages = [
  "RAYYYYY! 🐉⚡",
  "*uses Dragon Ascent* 🌀",
  "WHO SUMMONED ME?!",
  "groudon and kyogre can suck it 😤",
  "*angry sky noodle noises* 🐍",
  "I live in the ozone layer btw",
  "mega evolving... jk lol",
  "*does a barrel roll*",
  "you dare click the sky lord?!",
  "hyper beam go BRRRRR 💥",
];

const Index = () => {
  const [roar, setRoar] = useState<string | null>(null);
  const [clicks, setClicks] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks % 10 === 0) {
      setIsSpinning(true);
      setRoar("🌀 HYPER BEAM ACTIVATED 🌀");
      setTimeout(() => setIsSpinning(false), 2000);
    } else {
      setRoar(roarMessages[Math.floor(Math.random() * roarMessages.length)]);
    }

    setTimeout(() => setRoar(null), 2000);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <StarryBackground />

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="mb-8 animate-fade-in text-4xl font-bold text-primary md:text-5xl">
          hey there.
        </h1>

        <div className="relative mb-10">
          {roar && (
            <div className="absolute -top-10 left-1/2 z-20 -translate-x-1/2 animate-fade-in whitespace-nowrap rounded-full border border-primary/30 bg-muted px-4 py-1.5 text-sm font-bold text-primary">
              {roar}
            </div>
          )}
          <img
            src={rayquaza}
            alt="Rayquaza"
            width={300}
            height={300}
            onClick={handleClick}
            className={`cursor-pointer drop-shadow-[0_0_40px_hsl(145,60%,45%,0.3)] transition-transform ${
              isSpinning ? "animate-spin" : "animate-float"
            } hover:scale-110`}
          />
          {clicks > 0 && (
            <p className="mt-2 text-center font-mono text-xs text-muted-foreground">
              clicked {clicks} time{clicks !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="max-w-2xl space-y-4 text-center text-sm md:text-base">
          <p className="text-foreground">
            currently under construction (more like, trying to come up with good ideas for what to do with this website)
          </p>
          <p className="text-foreground">
            the website will Soon™ at least somewhat change in appearance. how soon? who fuckin knows!
          </p>
          <p className="text-foreground">
            rayquaza is the best pokémon and i will not be taking any criticism on this matter 🐉
          </p>
        </div>

        {/* Socials */}
        <div className="mt-10 flex items-center gap-6">
          <a
            href="https://guns.lol/ItsNiki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Link size={20} />
            <span>guns.lol</span>
          </a>
          <a
            href="https://github.com/NIKITO662"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Github size={20} />
            <span>GitHub</span>
          </a>
        </div>

        {/* Retro visitor counter */}
        <div className="mt-8 rounded border border-border bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
          you are visitor #{Math.floor(Math.random() * 9000 + 1000).toLocaleString()} (totally real)
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          hosted on github as a joke btw
        </p>
      </div>
    </div>
  );
};

export default Index;
