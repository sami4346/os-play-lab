import { Trophy } from 'lucide-react';
interface ScoreboardProps {
  score: number;
}

const Scoreboard = ({ score }: ScoreboardProps) => {
  return (
    <div className="flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Trophy className="w-5 h-5 sm:w-6 sm:h-6  text-white" />
      </div>
      <div>
        <div className="text-xs font-semibold font-bold text-white text-muted-foreground uppercase tracking-wider">Score</div>
        <div className="text-xl sm:text-2xl font-bold text-white">{score}</div>
      </div>
    </div>
  );
};

export default Scoreboard;
