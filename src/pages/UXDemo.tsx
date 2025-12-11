import { useState } from 'react';
import { 
  EnhancedCard, 
  EnhancedButton, 
  LoadingState, 
  SkeletonLoader 
} from '@/components/enhanced';
import { Play, Sparkles, Zap, Heart, Star, Settings } from 'lucide-react';

/**
 * UX Components Demo Page
 * 
 * This page demonstrates all the new enhanced components
 * and serves as a visual reference for their usage.
 */

const UXDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const toggleSkeleton = () => {
    setShowSkeleton(!showSkeleton);
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Enhanced UX Components Demo
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the new enhanced components with modern design patterns, smooth animations, and better user feedback.
        </p>
      </div>

      {/* Card Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Enhanced Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EnhancedCard variant="default" hover className="p-6">
            <h3 className="font-bold mb-2">Default Card</h3>
            <p className="text-sm text-muted-foreground">
              Standard card with subtle shadows and hover effect.
            </p>
          </EnhancedCard>

          <EnhancedCard variant="glass" hover className="p-6">
            <h3 className="font-bold mb-2">Glass Card</h3>
            <p className="text-sm text-muted-foreground">
              Glassmorphism effect with backdrop blur.
            </p>
          </EnhancedCard>

          <EnhancedCard variant="gradient" hover className="p-6">
            <h3 className="font-bold mb-2">Gradient Card</h3>
            <p className="text-sm text-muted-foreground">
              Subtle gradient background for emphasis.
            </p>
          </EnhancedCard>

          <EnhancedCard variant="elevated" hover className="p-6">
            <h3 className="font-bold mb-2">Elevated Card</h3>
            <p className="text-sm text-muted-foreground">
              Multi-layer shadows for premium depth.
            </p>
          </EnhancedCard>
        </div>
      </section>

      {/* Button Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Enhanced Buttons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EnhancedButton variant="default" icon={<Play />}>
            Default
          </EnhancedButton>
          <EnhancedButton variant="gradient" icon={<Sparkles />}>
            Gradient
          </EnhancedButton>
          <EnhancedButton variant="outline" icon={<Settings />}>
            Outline
          </EnhancedButton>
          <EnhancedButton variant="ghost" icon={<Heart />}>
            Ghost
          </EnhancedButton>
          <EnhancedButton variant="success" icon={<Zap />}>
            Success
          </EnhancedButton>
          <EnhancedButton variant="warning" icon={<Star />}>
            Warning
          </EnhancedButton>
          <EnhancedButton variant="danger">
            Danger
          </EnhancedButton>
          <EnhancedButton variant="default" loading>
            Loading
          </EnhancedButton>
        </div>
        
        {/* Button sizes */}
        <div className="flex gap-4 items-center">
          <EnhancedButton size="sm">Small</EnhancedButton>
          <EnhancedButton size="md">Medium</EnhancedButton>
          <EnhancedButton size="lg">Large</EnhancedButton>
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading States</h2>
        <EnhancedCard className="p-6">
          <div className="space-y-4">
            <EnhancedButton onClick={simulateLoading} disabled={isLoading}>
              Trigger Loading Demo
            </EnhancedButton>
            
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Spinner</p>
                  <LoadingState type="spinner" size="md" text="Processing..." />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Pulse</p>
                  <LoadingState type="pulse" size="sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Skeleton</p>
                  <LoadingState type="skeleton" />
                </div>
              </div>
            )}
          </div>
        </EnhancedCard>
      </section>

      {/* Skeleton Loaders */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Skeleton Loaders</h2>
        <EnhancedCard className="p-6">
          <div className="space-y-4">
            <EnhancedButton onClick={toggleSkeleton}>
              {showSkeleton ? 'Hide' : 'Show'} Skeleton Demo
            </EnhancedButton>
            
            {showSkeleton && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold mb-2">Card Skeleton</p>
                  <SkeletonLoader variant="card" count={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Table Skeleton</p>
                  <SkeletonLoader variant="table" count={3} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Text Skeleton</p>
                  <SkeletonLoader variant="text" count={5} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Chart Skeleton</p>
                  <SkeletonLoader variant="chart" />
                </div>
              </div>
            )}
          </div>
        </EnhancedCard>
      </section>

      {/* Interactive Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interactive Selection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Option 1', 'Option 2', 'Option 3'].map((option) => (
            <EnhancedCard
              key={option}
              variant={selectedCard === option ? 'elevated' : 'default'}
              hover
              onClick={() => setSelectedCard(option)}
              className={`p-6 cursor-pointer transition-all ${
                selectedCard === option ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{option}</h3>
                {selectedCard === option && (
                  <div className="w-3 h-3 bg-primary rounded-full" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Click to select this option
              </p>
            </EnhancedCard>
          ))}
        </div>
      </section>

      {/* Animation Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Animation Classes</h2>
        <EnhancedCard className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg animate-fadeIn">
              <p className="text-sm font-semibold">Fade In</p>
              <p className="text-xs text-muted-foreground">animate-fadeIn</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg animate-slideUp">
              <p className="text-sm font-semibold">Slide Up</p>
              <p className="text-xs text-muted-foreground">animate-slideUp</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg animate-scaleIn">
              <p className="text-sm font-semibold">Scale In</p>
              <p className="text-xs text-muted-foreground">animate-scaleIn</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg animate-float">
              <p className="text-sm font-semibold">Float</p>
              <p className="text-xs text-muted-foreground">animate-float</p>
            </div>
          </div>
        </EnhancedCard>
      </section>

      {/* Full-width button example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Full-Width Buttons</h2>
        <EnhancedButton variant="gradient" size="lg" fullWidth icon={<Play />}>
          Start Your Journey
        </EnhancedButton>
      </section>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8">
        <p>These components are ready to use in your OS Simulator application!</p>
      </div>
    </div>
  );
};

export default UXDemo;
