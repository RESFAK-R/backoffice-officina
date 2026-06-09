import { useEffect, useState } from "react";

export function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Initial animation delay
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000); // Show for 2 seconds

        // Remove from DOM after transition
        const removeTimer = setTimeout(() => {
            setShouldRender(false);
        }, 2500); // 2s show + 0.5s fade out

        return () => {
            clearTimeout(timer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            <div className="relative flex flex-col items-center gap-6">
                {/* Logo with pulse and scale animation */}
                <div className="relative animate-pulse-slow">
                    <img
                        src="/logo-nosfondo.png"
                        alt="G&G Auto Logo"
                        className="h-24 md:h-32 w-auto animate-float"
                    />
                    {/* Subtle glow effect behind logo */}
                    <div className="absolute inset-0 bg-secondary/20 blur-2xl -z-10 rounded-full scale-150 animate-pulse-glow"></div>
                </div>

                {/* Loading text/progress bar */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-primary font-bold tracking-[0.2em] text-sm uppercase">
                        Caricamento in corso
                    </span>
                    <div className="w-48 h-[2px] bg-zinc-100 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-secondary animate-loading-bar"></div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1.5); opacity: 0.3; }
          50% { transform: scale(1.8); opacity: 0.5; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite ease-in-out;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s infinite ease-in-out;
        }
        .animate-float {
          animation: float 4s infinite ease-in-out;
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite ease-in-out;
        }
      `}</style>
        </div>
    );
}
