import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageReplacementComparison } from '@/types/pageReplacement';
import { Trophy, Award, TrendingDown, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface AlgorithmComparisonProps {
  comparison: PageReplacementComparison;
}

const AlgorithmComparison = ({ comparison }: AlgorithmComparisonProps) => {
  // Prepare data for bar chart
  const comparisonData = comparison.results.map(result => ({
    algorithm: result.algorithm,
    'Page Faults': result.pageFaults,
    'Page Hits': result.pageHits,
    'Fault Rate': parseFloat(result.pageFaultRate.toFixed(1)),
  }));

  // Prepare data for radar chart (inverted - lower is better for faults)
  const radarData = comparison.results.map(result => ({
    algorithm: result.algorithm,
    'Hit Rate': parseFloat(result.pageHitRate.toFixed(1)),
    'Efficiency': 100 - parseFloat(result.pageFaultRate.toFixed(1)),
  }));

  const bestResult = comparison.results.find(r => r.algorithm === comparison.bestAlgorithm);
  const worstResult = comparison.results.find(r => r.algorithm === comparison.worstAlgorithm);

  return (
    <div className="space-y-6">
      {/* Winner Banner */}
      <Card className="border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 via-background to-background">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <div>
                <div className="text-sm text-muted-foreground">Best Algorithm</div>
                <div className="text-3xl font-bold">{comparison.bestAlgorithm}</div>
                {bestResult && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {bestResult.pageFaults} page faults ({bestResult.pageFaultRate.toFixed(1)}%)
                  </div>
                )}
              </div>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2 bg-yellow-500">
              Winner
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Algorithm</th>
                  <th className="text-center p-3">Page Faults</th>
                  <th className="text-center p-3">Page Hits</th>
                  <th className="text-center p-3">Fault Rate</th>
                  <th className="text-center p-3">Hit Rate</th>
                  <th className="text-center p-3">Rank</th>
                </tr>
              </thead>
              <tbody>
                {comparison.results
                  .sort((a, b) => a.pageFaults - b.pageFaults)
                  .map((result, index) => (
                    <tr 
                      key={result.algorithm} 
                      className={`border-b hover:bg-muted/50 ${
                        result.algorithm === comparison.bestAlgorithm ? 'bg-yellow-500/5' : ''
                      }`}
                    >
                      <td className="p-3 font-medium flex items-center gap-2">
                        {result.algorithm}
                        {result.algorithm === comparison.bestAlgorithm && (
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="destructive" className="font-mono">
                          {result.pageFaults}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="default" className="font-mono bg-green-500">
                          {result.pageHits}
                        </Badge>
                      </td>
                      <td className="p-3 text-center font-mono">
                        {result.pageFaultRate.toFixed(1)}%
                      </td>
                      <td className="p-3 text-center font-mono">
                        {result.pageHitRate.toFixed(1)}%
                      </td>
                      <td className="p-3 text-center">
                        {index === 0 ? (
                          <Award className="w-5 h-5 text-yellow-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">#{index + 1}</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Page Faults Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="algorithm" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Page Faults" fill="#ef4444" />
                <Bar dataKey="Page Hits" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={comparison.results}>
                <PolarGrid />
                <PolarAngleAxis dataKey="algorithm" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar 
                  name="Hit Rate %" 
                  dataKey="pageHitRate" 
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.6} 
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Larger area indicates better performance (higher hit rate)
          </p>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Comparison Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bestResult && worstResult && (
            <>
              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm">
                  <strong className="text-green-500">Best:</strong> {comparison.bestAlgorithm} with {bestResult.pageFaults} page faults 
                  ({bestResult.pageFaultRate.toFixed(1)}% fault rate)
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm">
                  <strong className="text-red-500">Worst:</strong> {comparison.worstAlgorithm} with {worstResult.pageFaults} page faults 
                  ({worstResult.pageFaultRate.toFixed(1)}% fault rate)
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm">
                  <strong>Improvement:</strong> {comparison.bestAlgorithm} performed {
                    ((worstResult.pageFaults - bestResult.pageFaults) / worstResult.pageFaults * 100).toFixed(1)
                  }% better than {comparison.worstAlgorithm}
                </p>
              </div>
            </>
          )}
          
          {comparison.results.find(r => r.algorithm === 'Optimal') && (
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm">
                💡 <strong>Note:</strong> Optimal algorithm shows the theoretical minimum page faults possible. 
                It requires future knowledge and is not implementable in practice.
              </p>
            </div>
          )}

          {comparison.results.find(r => r.algorithm === 'LRU') && 
           comparison.results.find(r => r.algorithm === 'FIFO') && (
            <div className="p-3 bg-background rounded-lg border">
              <p className="text-sm">
                📊 LRU typically performs better than FIFO for workloads with locality of reference, 
                as it better approximates the optimal algorithm.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlgorithmComparison;
