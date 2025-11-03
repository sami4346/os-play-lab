import { Trophy } from 'lucide-react';

interface ScoreboardProps {
  score: number;
}

const Scoreboard = ({ score }: ScoreboardProps) => {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-gradient-success rounded-lg shadow-elegant">
      <Trophy className="w-6 h-6 text-success-foreground" />
      <div>
        <div className="text-xs text-success-foreground/80 font-medium">Total Score</div>
        <div className="text-2xl font-bold text-success-foreground">{score}</div>
      </div>
    </div>
  );
};

export default Scoreboard;
