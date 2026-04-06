import { useState, useEffect } from "react";
import rayquaza from "@/assets/rayquaza.gif"; 
import shinyMegaRayquaza from "@/assets/image_5.png"; 
import StarryBackground from "@/components/StarryBackground";
import { Github, Link, Sparkles, Trophy } from "lucide-react";

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

  // Easter Egg State: 0 = off, 1 = mega evolving flash, 2 = show achievement, 3 = hide achievement, 4 = fade out screen
  const [easterEggStep, setEasterEggStep] = useState(0);

  const DISCORD_ID = "1297495492019621929";
  const MINECRAFT_USERNAME = "WestNiki"; 
  const MINECRAFT_UUID = "3220d4c1-8192-449e-8b0f-b52a8b686fce";

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

    // 1000 Clicks Animation Sequence
    if (newClicks === 1000) {
      setEasterEggStep(1); // Step 1: Mega Evolve flash

      setTimeout(() => {
        setEasterEggStep(2); // Step 2: Show Rayquaza and slide up achievement
        const audio = new Audio("https://www.myinstants.com/media/sounds/xbox-achievement.mp3");
        audio.play().catch((e) => console.error("Audio play failed:", e));
      }, 1500);

      setTimeout(() => {
        setEasterEggStep(3); // Step 3: Slide achievement back down after 9 seconds
      }, 10500); // 1.5s delay + 9s wait

      setTimeout(() => {
        setEasterEggStep(4); // Step 4: Fade the whole screen out
      }, 11000); // After achievement is down

      setTimeout(() => {
        setEasterEggStep(0); // Step 0: Fully reset site back to normal
      }, 12000); // After fade out is complete

      return; // Stop normal roar logic while Easter egg is happening
    }

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

      {/* 1000 Clicks Easter Egg Fullscreen Sequence */}
      {easterEggStep > 0 && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${easterEggStep === 4 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          
          {/* Background shifts from White (mega evolve) to Black */}
          <div className={`absolute inset-0 transition-colors duration-1000 ${easterEggStep === 1 ? "bg-white" : "bg-black/95"}`} />

          {/* Mega Evolve Text */}
          {easterEggStep === 1 && (
            <div className="relative z-10 text-4xl font-bold text-black animate-pulse font-mono tracking-widest">
              MEGA EVOLVING...
            </div>
          )}

          {/* Full Screen Rayquaza */}
          {easterEggStep >= 2 && (
            <img
              src={isShiny ? "https://files.catbox.moe/ar1fe3.gif" : rayquaza}
              alt="Full Screen Rayquaza"
              className="relative z-10 h-full w-full object-contain animate-pulse"
            />
          )}
          
          {/* Xbox Achievement Popup */}
          {easterEggStep >= 2 && (
            <div 
              className={`fixed bottom-12 left-1/2 z-[60] flex w-full max-w-md -translate-x-1/2 items-center gap-4 rounded-full border border-green-500/30 bg-[#1A1A1A] px-6 py-4 shadow-[0_0_30px_rgba(16,124,16,0.4)] transition-all duration-500 ease-in-out ${
                easterEggStep === 2 ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#107C10]">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">Achievement unlocked</span>
                <span className="text-xs text-gray-300">
                  Why did you have to click 1,000 times to get here to see an animated photo take your screen it's just a waste of time
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="mb-8 animate-fade-in text-4xl font-bold text-primary md:text-5xl">
          hey ^_^
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
            currently under construction (trying to come up with good idea for what to do with this site!!!)
          </p>
          <p className="text-foreground">
            the website will Soon™ at least some changes will appear. how soon? who fucking knows!!
          </p>
          <p className="text-foreground">
            I made this site as a joke at 2:00 in the morning and I don't know what to do with it, but it's a cool site, right? I FREAKING LOVE RAYQUAZA 😍🐉
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

          {/* Minecraft 3D Skin Card - ALWAYS VISIBLE */}
          <div className="w-full md:w-auto rounded-2xl border border-primary/20 bg-muted/30 p-6 flex flex-col items-center justify-center min-w-[160px]">
            <img
              src={`https://visage.surgeplay.com/full/256/${MINECRAFT_UUID}`}
              alt="Minecraft Skin"
              className="h-24 object-contain animate-float drop-shadow-[0_0_15px_hsl(145,60%,45%,0.2)]"
            />
            <span className="mt-4 font-mono text-xs text-muted-foreground text-center">
              mc: {MINECRAFT_USERNAME}
            </span>
            
            {isPlayingMinecraft ? (
              <>
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
              </>
            ) : (
              <span className="mt-1 font-mono text-[10px] text-muted-foreground/60 text-center">
                offline
              </span>
            )}
          </div>

        </div>

        {/* Contact Form */}
        <div className="mt-16 w-full flex flex-col items-center relative z-10">
          <p className="mb-4 font-mono text-xs text-[#60a5fa]">if you have any idea what to add to this site, send me a message : 3</p>
          <form onSubmit={handleSubmitForm} className="space-y-6 flex flex-col items-center w-full px-4">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
              required
              placeholder="your name (max 32 chars)"
              className="w-[280px] text-center rounded-full border border-[#1d4ed8] bg-[#232433] px-4 py-2 font-mono text-sm text-[#60a5fa] placeholder:text-[#475569] outline-none"
            />

            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1024}
              required
              placeholder="your message (max 1024 chars)"
              rows={4}
              className="w-full max-w-3xl text-center rounded-[2rem] border border-[#1d4ed8] bg-[#232433] px-6 py-10 font-mono text-sm text-[#60a5fa] placeholder:text-[#475569] outline-none resize-none"
            />

            <button
              type="submit"
              disabled={formStatus === "submitting"}
              className="rounded-full border border-[#1d4ed8] bg-[#1e3a8a] px-8 py-1.5 text-sm text-[#93c5fd] transition-all hover:bg-[#1e40af] disabled:opacity-50"
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

        <p className="mt-12 text-xs text-muted-foreground text-center">
          hosted as a joke btw owner and creator of this cool website somewhereniki/WestNiki --ME HEHEHE
        </p>
      </div>
    </div>
  );
};

export default Index;
