import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Brain, Layers, Shield, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type LearningResource = {
  title: string;
  summary: string;
  link: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  readTime: string;
};

const learningResources: LearningResource[] = [
  {
    title: 'Process Scheduling 101',
    summary: 'Understand FCFS, SJF, Priority, and Round Robin with real-world analogies and visual timelines.',
    link: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/',
    level: 'Beginner',
    topics: ['CPU Scheduling', 'Dispatching', 'Preemption'],
    readTime: '8 min',
  },
  {
    title: 'Deep Dive: Virtual Memory & Paging',
    summary: 'How paging, segmentation, and the MMU collaborate to provide isolation and fast address translation.',
    link: 'https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf',
    level: 'Intermediate',
    topics: ['Memory', 'Paging', 'Segmentation'],
    readTime: '15 min',
  },
  {
    title: 'Deadlocks: Prevention, Avoidance, Detection',
    summary: 'Banker’s algorithm, resource ordering, and recovery strategies with practical scenarios.',
    link: 'https://www.studytonight.com/operating-system/deadlock-handling',
    level: 'Intermediate',
    topics: ['Deadlocks', 'Resources', 'Recovery'],
    readTime: '10 min',
  },
  {
    title: 'File Systems Internals',
    summary: 'Inodes, journaling, and consistency guarantees explained with diagrams and checkpoints.',
    link: 'https://www.usenix.org/legacy/event/fast11/tech/slides/rosenblum.pdf',
    level: 'Advanced',
    topics: ['File Systems', 'Journaling', 'Consistency'],
    readTime: '18 min',
  },
  {
    title: 'Concurrency & Synchronization',
    summary: 'Mutexes, semaphores, monitors, and lock-free approaches with pros/cons and pitfalls.',
    link: 'https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf',
    level: 'Advanced',
    topics: ['Concurrency', 'Synchronization', 'Locks'],
    readTime: '20 min',
  },
  {
    title: 'CPU Scheduling: Choosing the Right Algorithm',
    summary: 'A comparison of scheduling strategies under different workloads with metrics interpretation.',
    link: 'https://www.javatpoint.com/os-cpu-scheduling',
    level: 'Beginner',
    topics: ['Scheduling', 'Metrics', 'Performance'],
    readTime: '9 min',
  },
];

const levelColors: Record<LearningResource['level'], string> = {
  Beginner: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100',
  Intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100',
  Advanced: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-100',
};

const LearningPage = () => {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-6 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Curated OS Learning Path
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Learn core Operating System concepts with guided reading.
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground">
              Each article is hand-picked for clarity and depth. Start with fundamentals, then dive into memory, concurrency, and file systems. Pair these reads with the simulator and the AI assistant for active learning.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/chat">
                <Button variant="secondary" className="gap-2">
                  <Brain className="h-4 w-4" />
                  Ask the assistant
                </Button>
              </Link>
              <a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noreferrer">
                <Button className="gap-2" variant="default">
                  <BookOpen className="h-4 w-4" />
                  OSTEP (full book)
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
          <div className="grid gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Layers className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Structured journey</p>
                <p className="text-lg font-semibold text-foreground">Beginner → Advanced</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Battle-tested sources</p>
                <p className="text-lg font-semibold text-foreground">University-grade material</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Learn by doing</p>
                <p className="text-lg font-semibold text-foreground">Use the simulator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Featured reading list</h2>
            <p className="text-sm text-muted-foreground">Short, focused posts you can finish in under 20 minutes.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-1 ${levelColors.Beginner}`}>Beginner</span>
              <span className={`rounded-full px-2 py-1 ${levelColors.Intermediate}`}>Intermediate</span>
              <span className={`rounded-full px-2 py-1 ${levelColors.Advanced}`}>Advanced</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {learningResources.map((resource) => (
            <Card key={resource.title} className="group relative overflow-hidden border-border/80">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={levelColors[resource.level]}>{resource.level}</Badge>
                  <span className="text-xs text-muted-foreground">{resource.readTime}</span>
                </div>
                <CardTitle className="text-xl leading-snug text-foreground group-hover:text-primary transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {resource.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {resource.topics.map((topic) => (
                  <Badge key={topic} variant="outline" className="bg-muted text-xs">
                    {topic}
                  </Badge>
                ))}
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1"
                >
                  Read article
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <Link to="/chat" className="text-xs text-muted-foreground hover:text-foreground">
                  Discuss with AI →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LearningPage;

