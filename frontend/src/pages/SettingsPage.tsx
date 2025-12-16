import { useEffect, useMemo, useState } from "react";
import { Moon, Sun, Laptop, Check, Sparkles, Zap, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ThemeChoice = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "os-play-lab-theme";
const REDUCED_MOTION_KEY = "os-play-lab-reduced-motion";
const TIPS_KEY = "os-play-lab-tips";

const SettingsPage = () => {
  const [theme, setTheme] = useState<ThemeChoice>("system");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [notifTips, setNotifTips] = useState(true);

  const systemPrefersDark = useMemo(
    () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
    []
  );

  const applyTheme = (choice: ThemeChoice) => {
    const root = document.documentElement;
    const resolved = choice === "system" ? (systemPrefersDark ? "dark" : "light") : choice;

    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    localStorage.setItem(THEME_STORAGE_KEY, choice);
  };

  const applyReducedMotion = (enabled: boolean) => {
    document.documentElement.dataset.reducedMotion = enabled ? "true" : "false";
    localStorage.setItem(REDUCED_MOTION_KEY, JSON.stringify(enabled));
  };

  const applyTips = (enabled: boolean) => {
    document.documentElement.dataset.tips = enabled ? "true" : "false";
    localStorage.setItem(TIPS_KEY, JSON.stringify(enabled));
  };

  useEffect(() => {
    const storedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeChoice | null) || "system";
    const storedMotion = localStorage.getItem(REDUCED_MOTION_KEY);
    const storedTips = localStorage.getItem(TIPS_KEY);

    const motionEnabled = storedMotion ? JSON.parse(storedMotion) : false;
    const tipsEnabled = storedTips ? JSON.parse(storedTips) : true;

    setTheme(storedTheme);
    setReducedMotion(motionEnabled);
    setNotifTips(tipsEnabled);

    applyTheme(storedTheme);
    applyReducedMotion(motionEnabled);
    applyTips(tipsEnabled);
  }, [systemPrefersDark]);

  const handleThemeChange = (choice: ThemeChoice) => {
    setTheme(choice);
    applyTheme(choice);
  };

  const handleReset = () => {
    handleThemeChange("system");
    setReducedMotion(false);
    setNotifTips(true);
    applyReducedMotion(false);
    applyTips(true);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Personalize your experience. Your choices are stored locally on this device.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>Choose how the interface looks on this device.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <ThemeOption
            label="Light"
            description="Bright, high contrast for well-lit rooms."
            icon={<Sun className="h-5 w-5" />}
            active={theme === "light"}
            onClick={() => handleThemeChange("light")}
          />
          <ThemeOption
            label="Dark"
            description="Dimmed surfaces for low-light or night-time."
            icon={<Moon className="h-5 w-5" />}
            active={theme === "dark"}
            onClick={() => handleThemeChange("dark")}
          />
          <ThemeOption
            label="System"
            description="Follow your OS preference automatically."
            icon={<Laptop className="h-5 w-5" />}
            active={theme === "system"}
            onClick={() => handleThemeChange("system")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Focus & Accessibility
          </CardTitle>
          <CardDescription>Reduce distractions and improve legibility.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
            <div className="space-y-1">
              <Label htmlFor="reduce-motion">Reduce motion</Label>
              <p className="text-sm text-muted-foreground">Limit animations and transitions.</p>
            </div>
            <Switch
              id="reduce-motion"
              checked={reducedMotion}
              onCheckedChange={(val) => {
                setReducedMotion(val);
                applyReducedMotion(val);
              }}
              aria-label="Toggle reduced motion"
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
            <div className="space-y-1">
              <Label htmlFor="tips">Show contextual tips</Label>
              <p className="text-sm text-muted-foreground">Surface quick hints in simulations and chat.</p>
            </div>
            <Switch
              id="tips"
              checked={notifTips}
              onCheckedChange={(val) => {
                setNotifTips(val);
                applyTips(val);
              }}
              aria-label="Toggle contextual tips"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications (local)
          </CardTitle>
          <CardDescription>Control helper toasts and updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Toasts stay enabled for critical events (errors, completed simulations). Optional tips can be toggled above.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Apply and refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset to defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

type ThemeOptionProps = {
  label: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

const ThemeOption = ({ label, description, icon, active, onClick }: ThemeOptionProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-full flex-col gap-3 rounded-xl border p-4 text-left transition-all ${
        active
          ? "border-primary/70 bg-primary/5 ring-2 ring-primary/30"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
      aria-pressed={active}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          {icon}
          <span className="font-semibold">{label}</span>
        </div>
        {active && <Check className="h-5 w-5 text-primary" />}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
};

export default SettingsPage;

