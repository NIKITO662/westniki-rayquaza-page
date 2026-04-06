import { useState, useEffect } from "react";
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

// Types for the Lanyard Discord API
interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    display_name: string;
    avatar: string;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: { 
    type: number; 
    name: string; 
    state?: string; 
    details?: string; 
    emoji?: { name: string; id: string; animated: boolean } 
  }[];
}

const Index = () => {
  const [roar, setRoar] = useState<string | null>(null);
  const [clicks, setClicks] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isShiny, setIsShiny] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [discordData, setDiscordData] = useState<LanyardData | null>(null);

  const DISCORD_ID = "1297495492019621929";
  const MINECRAFT_USERNAME = "WestNiki"; // <--- PUT YOUR MC NAME HERE

  // Fetch Discord data on load and poll every 10 seconds
  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (json.success) {
          setDiscordData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch Discord data", error);
      }
    };

    fetchDiscordData();
    const interval = setInterval(fetchDiscordData, 10000);
    return () => clearInterval(interval);
  }, []);

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

  // Helper function to color the Discord status dot
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "idle": return "bg-yellow-500";
      case "dnd": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Find the custom status and any game currently being played
  const customStatus = discordData?.activities.find((a) => a.type === 4);
  const playingActivity = discordData?.activities.find((a) => a.type === 0);
  
  // Check if the game being played is Minecraft
  const isPlayingMinecraft = playingActivity?.name.toLowerCase().includes("minecraft");

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

        {/* Profile Cards Container (Discord + Minecraft) */}
        <div className="mt-12 flex flex-col md:flex-row items-stretch gap-6 relative z-10 w-full max-w-2xl justify-center">
          
          {/* Discord Profile Card */}
          <div className="w-full md:w-auto flex-1 rounded-2xl border border-primary/20 bg-muted/30 p-6 flex flex-col">
            {discordData ? (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={`https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png`}
                    alt="Discord Avatar"
                    className="w-16 h-16 rounded-full border-2 border-primary/30"
                  />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#232433] ${getStatusColor(discordData.discord_status)}`}></div>
                </div>

                <div className="flex flex-col text-left">
                  <span className="font-bold text-lg text-primary leading-tight">{discordData.discord_user.display_name}</span>
                  <span className="font-mono text-xs text-muted-foreground">@{discordData.discord_user.username}</span>

                  {customStatus && (
                    <div className="mt-1 text-sm text-foreground flex items-center gap-1.5">
                      {customStatus.emoji && customStatus.emoji.id ? (
                        <img src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}`} className="w-4 h-4" alt="emoji" />
                      ) : customStatus.emoji ? (
                        <span>{customStatus.emoji.name}</span>
                      ) : null}
                      <span>{customStatus.state}</span>
                    </div>
                  )}

                  {playingActivity && !isPlayingMinecraft && (
                    <div className="mt-1 font-mono text-xs text-primary/80">
                      playing: {playingActivity.name}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center font-mono text-xs text-muted-foreground py-4 flex items-center justify-center h-full">
                Loading Discord Profile...
              </div>
            )}
          </div>

          {/* Minecraft 3D Skin Card - ONLY VISIBLE WHEN PLAYING MINECRAFT */}
          {isPlayingMinecraft && (
            <div className="w-full md:w-auto rounded-2xl border border-primary/20 bg-muted/30 p-6 flex flex-col items-center justify-center min-w-[160px]">
              <img
                src={`https://visage.surgeplay.com/full/256/${MINECRAFT_USERNAME}`}
                alt="Minecraft Skin"
                className="h-24 object-contain animate-float drop-shadow-[0_0_15px_hsl(145,60%,45%,0.2)]"
              />
              <span className="mt-4 font-mono text-xs text-muted-foreground text-center">
                mc: {MINECRAFT_USERNAME}
              </span>
              {/* Shows the server IP and state (e.g. Hypixel, Bedwars) if Discord provides it */}
              {playingActivity.details && (
                <span className="mt-1 font-mono text-[10px] text-primary/80 text-center max-w-[140px] truncate">
                  {playingActivity.details}
                </span>
              )}
              {playingActivity.state && (
                <span className="font-mono text-[10px] text-primary/80 text-center max-w-[140px] truncate">
                  {playingActivity.state}
                </span>
              )}
            </div>
          )}

        </div>

        {/* Contact Form */}
        <div className="mt-16 w-full max-w-lg flex flex-col items-center relative z-10">
          <p className="mb-4 font-mono text-xs text-muted-foreground">send a message to the sky lord</p>
          
          <form onSubmit={handleSubmitForm} className="space-y-4 flex flex-col w-full">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
              required
              placeholder="your name"
              className="w-full rounded border border-border bg-muted/50 px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/50 text-center"
            />

            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1024}
              required
              placeholder="your message"
              rows={4}
              className="w-full resize-none rounded border border-border bg-muted/50 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/50 text-center"
            />

            <button
              type="submit"
              disabled={formStatus === "submitting"}
              className="w-full cursor-pointer rounded border border-border bg-muted/50 px-4 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formStatus === "submitting" ? "sending..." : "submit message"}
            </button>
          </form>

          {/* Status Messages */}
          {formStatus === "submitted" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[120%] mb-4 z-20 animate-fade-in whitespace-nowrap rounded-full border border-primary/30 bg-muted px-4 py-1.5 text-sm font-bold text-primary">
              message sent! i'll check it Soon™
            </div>
          )}
          {formStatus === "error" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[120%] mb-4 z-20 animate-fade-in whitespace-nowrap rounded-full border border-red-500/30 bg-muted px-4 py-1.5 text-sm font-bold text-red-500">
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

        <p className="mt-12 text-xs text-muted-foreground">
          hosted on as a joke btw
        </p>
      </div>
    </div>
  );
};

export default Index;
