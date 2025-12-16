import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Gauge } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AnimationControlsProps {
  isAnimating: boolean;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const AnimationControls = ({
  isAnimating,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  animationSpeed,
  onSpeedChange,
}: AnimationControlsProps) => {
  // Convert speed (ms) to a 0-100 scale for the slider
  const speedToSlider = (ms: number) => {
    // 2000ms = 0 (slowest), 1000ms = 50 (medium), 200ms = 100 (fastest)
    return Math.round(100 - ((ms - 200) / 1800) * 100);
  };

  const sliderToSpeed = (value: number) => {
    // 0 = 2000ms, 50 = 1000ms, 100 = 200ms
    return Math.round(2000 - (value / 100) * 1800);
  };

  const getSpeedLabel = () => {
    if (animationSpeed >= 1500) return 'Slow';
    if (animationSpeed >= 800) return 'Medium';
    return 'Fast';
  };

  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-6 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            disabled={currentStep === 0}
            title="Reset to start"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onStepBackward}
            disabled={currentStep === 0 || isAnimating}
            title="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {isAnimating ? (
            <Button
              size="lg"
              onClick={onPause}
              className="w-24"
              title="Pause animation"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={onPlay}
              className="w-24"
              disabled={currentStep >= totalSteps - 1}
              title="Play animation"
            >
              <Play className="w-5 h-5 mr-2" />
              Play
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1 || isAnimating}
            title="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Animation Speed
            </Label>
            <span className="text-sm font-medium text-primary">
              {getSpeedLabel()}
            </span>
          </div>
          <Slider
            value={[speedToSlider(animationSpeed)]}
            onValueChange={(values) => onSpeedChange(sliderToSpeed(values[0]))}
            min={0}
            max={100}
            step={1}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Use step-by-step controls to examine each page access closely, 
          or play the animation to see the overall pattern.
        </div>
      </CardContent>
    </Card>
  );
};

export default AnimationControls;
