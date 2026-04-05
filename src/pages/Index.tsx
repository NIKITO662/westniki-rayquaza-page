import { useState } from "react";
import rayquaza from "@/assets/rayquaza.gif"; 
import shinyMegaRayquaza from "@/assets/image_5.png"; 
import StarryBackground from "@/components/StarryBackground";
import { Github, Link, Sparkles } from "lucide-react";

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
  const [berries, setBerries] = useState(0);
  const [isShiny, setIsShiny] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");

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

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xvzvdzdq", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus("submitted");
        setName("");
        setMessage("");
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        setFormStatus("error");
        setTimeout(() => setFormStatus("idle"), 5000);
      }
    } catch (error) {
      setFormStatus("error");
      console.error("Form submission error:", error);
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <StarryBackground />

      <div className="relative z-10 flex flex-col items-center w-full">
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
            src={isShiny ? "https://files.catbox.moe/ar1fe3.gif" : rayquaza}
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
          {clicks > 15 && (
            <p className="animate-pulse font-bold text-red-500 text-foreground">
              OKAY STOP CLICKING ME I SWEAR TO GOD I WILL DESTROY THE HOENN REGION
            </p>
          )}
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

        {/* Contact Form */}
        <div className="mt-16 w-full max-w-lg rounded-2xl border border-primary/20 bg-muted/30 p-8 shadow-inner relative z-10">
          <form onSubmit={handleSubmitForm} className="space-y-6 flex flex-col items-center">
            <div className="w-full relative">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={32}
                required
                placeholder="your name (max 32 chars)"
                className="w-full text-center rounded-full border border-primary/40 bg-muted/80 px-6 py-2.5 font-mono text-sm text-primary placeholder:text-primary/60 placeholder:text-center focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>

            <div className="w-full relative">
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1024}
                required
                placeholder="your message (max 1024 chars)"
                rows={5}
                className="w-full text-center rounded-2xl border border-primary/40 bg-muted/80 px-6 py-4 font-mono text-sm text-primary placeholder:text-primary/60 placeholder:text-center focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === "submitting"}
              className="mt-6 rounded-full border-2 border-primary bg-primary px-10 py-2.5 text-sm font-bold text-black transition-all hover:bg-black hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formStatus === "submitting" ? "Sending..." : "Send"}
            </button>
          </form>

          {/* Status Messages */}
          {formStatus === "submitted" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4 z-20 animate-fade-in whitespace-nowrap rounded-full bg-green-900 border border-green-700 px-4 py-1.5 text-xs font-bold text-green-300">
              message sent! i'll check it Soon™
            </div>
          )}
          {formStatus === "error" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4 z-20 animate-fade-in whitespace-nowrap rounded-full bg-red-900 border border-red-700 px-4 py-1.5 text-xs font-bold text-red-300">
              error sending message. please try again.
            </div>
          )}
        </div>

        {/* Socials & Shiny Button */}
        <div className="mt-16 flex items-center gap-6">
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
          <button
            onClick={() => setIsShiny(!isShiny)}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Sparkles size={20} />
            <span>{isShiny ? "revert form" : "shiny mode"}</span>
          </button>
        </div>

        {/* Retro visitor counter */}
        <div className="mt-8 rounded border border-border bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
          you are visitor #{Math.floor(Math.random() * 9000 + 1000).toLocaleString()} (totally real)
        </div>

        {/* Berry feeder */}
        <div
          onClick={() => setBerries((b) => b + 1)}
          className="mt-4 cursor-pointer rounded border border-border bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          feed a sitrus berry 🫐 (fed: {berries})
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          hosted on as a joke btw
        </p>
      </div>
    </div>
  );
};

export default Index;
