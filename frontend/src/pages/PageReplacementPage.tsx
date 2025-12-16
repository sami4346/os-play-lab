import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  RotateCcw, 
  Info, 
  Zap,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronLeft,
  Pause,
} from 'lucide-react';
import { 
  fifoPageReplacement, 
  lruPageReplacement, 
  optimalPageReplacement, 
  clockPageReplacement,
  comparePageReplacementAlgorithms 
} from '@/logic/pageReplacement/algorithms';
import { 
  referencePatterns, 
  generateRandomReferenceString,
  generateLocalityReferenceString,
  parseReferenceString,
  getAlgorithmDescription,
  getPageReplacementInsights 
} from '@/logic/pageReplacement/utils';
import { PageReplacementResult, PageReplacementAlgorithm } from '@/types/pageReplacement';
import PageTableVisualizer from '@/components/pageReplacement/PageTableVisualizer';
import PageReplacementStats from '@/components/pageReplacement/PageReplacementStats';
import AlgorithmComparison from '@/components/pageReplacement/AlgorithmComparison';
import AnimationControls from '@/components/pageReplacement/AnimationControls';

const algorithmFunctions = {
  FIFO: fifoPageReplacement,
  LRU: lruPageReplacement,
  Optimal: optimalPageReplacement,
  Clock: clockPageReplacement,
};

const PageReplacementPage = () => {
  // State
  const [referenceString, setReferenceString] = useState<number[]>([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2]);
  const [referenceInput, setReferenceInput] = useState('7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2');
  const [numFrames, setNumFrames] = useState(3);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<PageReplacementAlgorithm>('FIFO');
  const [result, setResult] = useState<PageReplacementResult | null>(null);
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // ms per step

  // Run simulation
  const runSimulation = () => {
    const algorithmFunc = algorithmFunctions[selectedAlgorithm];
    const simResult = algorithmFunc(referenceString, numFrames);
    setResult(simResult);
    setCurrentStep(0);
    setIsAnimating(false);
  };

  // Run comparison
  const runComparison = () => {
    const comparison = comparePageReplacementAlgorithms(referenceString, numFrames);
    setComparisonResults(comparison);
  };

  // Handle reference string input
  const handleReferenceStringChange = (value: string) => {
    setReferenceInput(value);
    const parsed = parseReferenceString(value);
    if (parsed && parsed.length > 0) {
      setReferenceString(parsed);
    }
  };

  // Generate random reference string
  const generateRandom = () => {
    const newRef = generateRandomReferenceString(20, 10);
    setReferenceString(newRef);
    setReferenceInput(newRef.join(', '));
  };

  // Generate locality reference string
  const generateLocality = () => {
    const newRef = generateLocalityReferenceString(20, 10);
    setReferenceString(newRef);
    setReferenceInput(newRef.join(', '));
  };

  // Load predefined pattern
  const loadPattern = (pattern: number[]) => {
    setReferenceString(pattern);
    setReferenceInput(pattern.join(', '));
  };

  // Animation controls
  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStep(0);
  };

  const pauseAnimation = () => {
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const stepForward = () => {
    if (result && currentStep < result.accesses.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Animation loop
  useEffect(() => {
    if (isAnimating && result) {
      if (currentStep < result.accesses.length - 1) {
        const timer = setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, animationSpeed);
        return () => clearTimeout(timer);
      } else {
        setIsAnimating(false);
      }
    }
  }, [isAnimating, currentStep, result, animationSpeed]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-blue-500/10 via-background to-background p-8">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Page Replacement Algorithms
          </h1>
          <p className="text-muted-foreground">
            Simulate and compare FIFO, LRU, Optimal, and Clock page replacement algorithms
          </p>
        </div>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Set up your page replacement simulation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reference String Input */}
          <div className="space-y-2">
            <Label htmlFor="reference-string">Reference String</Label>
            <Input
              id="reference-string"
              value={referenceInput}
              onChange={(e) => handleReferenceStringChange(e.target.value)}
              placeholder="Enter page numbers (comma or space separated)"
              className="font-mono"
            />
            <p className="text-sm text-muted-foreground">
              Current: {referenceString.length} page references, {new Set(referenceString).size} unique pages
            </p>
          </div>

          {/* Quick Generate Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={generateRandom}>
              <Zap className="w-4 h-4 mr-2" />
              Random Pattern
            </Button>
            <Button variant="outline" size="sm" onClick={generateLocality}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Locality Pattern
            </Button>
          </div>

          {/* Predefined Patterns */}
          <div className="space-y-2">
            <Label>Or Select a Predefined Pattern:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {referencePatterns.slice(0, 4).map((pattern) => (
                <Button
                  key={pattern.name}
                  variant="outline"
                  size="sm"
                  onClick={() => loadPattern(pattern.pattern)}
                  className="justify-start text-left h-auto py-2"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{pattern.name}</div>
                    <div className="text-xs text-muted-foreground">{pattern.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Number of Frames */}
          <div className="space-y-2">
            <Label htmlFor="num-frames">
              Number of Page Frames: {numFrames}
            </Label>
            <Input
              id="num-frames"
              type="range"
              min="1"
              max="10"
              value={numFrames}
              onChange={(e) => setNumFrames(parseInt(e.target.value))}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Adjust frames to see how it affects page faults
            </p>
          </div>

          {/* Algorithm Selection */}
          <div className="space-y-2">
            <Label>Select Algorithm</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.keys(algorithmFunctions).map((algo) => (
                <Button
                  key={algo}
                  variant={selectedAlgorithm === algo ? 'default' : 'outline'}
                  onClick={() => setSelectedAlgorithm(algo as PageReplacementAlgorithm)}
                  className="h-auto py-3"
                >
                  {algo}
                </Button>
              ))}
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm">
                <Info className="w-4 h-4 inline mr-1" />
                {getAlgorithmDescription(selectedAlgorithm)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={runSimulation} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </Button>
            <Button onClick={runComparison} variant="outline" className="flex-1">
              <TrendingDown className="w-4 h-4 mr-2" />
              Compare All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Tabs */}
      {result && (
        <Tabs defaultValue="visualization" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          {/* Visualization Tab */}
          <TabsContent value="visualization" className="space-y-4">
            {/* Animation Controls */}
            <AnimationControls
              isAnimating={isAnimating}
              currentStep={currentStep}
              totalSteps={result.accesses.length}
              onPlay={startAnimation}
              onPause={pauseAnimation}
              onReset={resetAnimation}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              animationSpeed={animationSpeed}
              onSpeedChange={setAnimationSpeed}
            />

            {/* Page Table Visualizer */}
            <PageTableVisualizer
              result={result}
              currentStep={currentStep}
              numFrames={numFrames}
            />

            {/* Current Access Info */}
            {result.accesses[currentStep] && (
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Step {currentStep + 1} of {result.accesses.length}</div>
                      <div className="text-2xl font-bold">
                        Page {result.accesses[currentStep].pageNumber}
                      </div>
                    </div>
                    <Badge 
                      variant={result.accesses[currentStep].isPageFault ? 'destructive' : 'default'}
                      className="text-lg px-4 py-2"
                    >
                      {result.accesses[currentStep].isPageFault ? 'Page Fault' : 'Page Hit'}
                    </Badge>
                  </div>
                  {result.accesses[currentStep].isPageFault && result.accesses[currentStep].victimPage !== undefined && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Replaced page {result.accesses[currentStep].victimPage} from frame {result.accesses[currentStep].victimFrameIndex}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <PageReplacementStats result={result} />
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison">
            {comparisonResults ? (
              <AlgorithmComparison comparison={comparisonResults} />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Run a comparison to see how all algorithms perform on this reference string
                  </p>
                  <Button onClick={runComparison}>
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Compare All Algorithms
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Educational Info */}
      <Card className="bg-gradient-to-br from-blue-500/5 to-background border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Understanding Page Replacement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Page Fault:</strong> Occurs when a requested page is not in memory and must be loaded from disk.
          </p>
          <p>
            <strong>Page Hit:</strong> The requested page is already in memory - no disk access needed.
          </p>
          <p>
            <strong>Working Set:</strong> The set of pages a process actively uses. If it doesn't fit in memory, thrashing occurs.
          </p>
          <p>
            <strong>Belady's Anomaly:</strong> With FIFO, increasing frames can sometimes increase page faults!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageReplacementPage;
