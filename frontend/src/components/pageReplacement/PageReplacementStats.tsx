import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageReplacementResult } from '@/types/pageReplacement';
import { getPageReplacementInsights } from '@/logic/pageReplacement/utils';
import { Activity, Target, TrendingDown, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PageReplacementStatsProps {
  result: PageReplacementResult;
}

const PageReplacementStats = ({ result }: PageReplacementStatsProps) => {
  const insights = getPageReplacementInsights(
    result.pageFaults,
    result.pageHits,
    result.algorithm,
    result.numFrames
  );

  // Data for charts
  const hitFaultData = [
    { name: 'Page Hits', value: result.pageHits, color: '#22c55e' },
    { name: 'Page Faults', value: result.pageFaults, color: '#ef4444' },
  ];

  const stepByStepData = result.accesses.map((access, index) => ({
    step: index + 1,
    faults: result.accesses.slice(0, index + 1).filter(a => a.isPageFault).length,
    hits: result.accesses.slice(0, index + 1).filter(a => !a.isPageFault).length,
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Page Faults
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{result.pageFaults}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {result.pageFaultRate.toFixed(1)}% of accesses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Page Hits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{result.pageHits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {result.pageHitRate.toFixed(1)}% of accesses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Total Accesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{result.totalAccesses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Reference string length
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Frames Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{result.numFrames}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available page frames
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hit/Fault Ratio Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Page Hits vs Page Faults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hitFaultData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => 
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {hitFaultData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Statistics */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                <span className="font-medium">Page Hit Rate</span>
                <Badge variant="default" className="bg-green-500">
                  {result.pageHitRate.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
                <span className="font-medium">Page Fault Rate</span>
                <Badge variant="destructive">
                  {result.pageFaultRate.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                <span className="font-medium">Algorithm</span>
                <Badge variant="secondary">
                  {result.algorithm}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cumulative Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Page Faults Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepByStepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="step" 
                  label={{ value: 'Access Step', position: 'insideBottom', offset: -5 }}
                />
                <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="faults" fill="#ef4444" name="Page Faults" />
                <Bar dataKey="hits" fill="#22c55e" name="Page Hits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-background rounded-lg border"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-500" />
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Access Log */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Access Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Step</th>
                  <th className="text-left p-2">Page</th>
                  <th className="text-left p-2">Result</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {result.accesses.map((access, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 font-mono font-bold">{access.pageNumber}</td>
                    <td className="p-2">
                      <Badge variant={access.isPageFault ? 'destructive' : 'default'}>
                        {access.isPageFault ? 'Fault' : 'Hit'}
                      </Badge>
                    </td>
                    <td className="p-2 text-muted-foreground">
                      {access.isPageFault ? (
                        access.victimPage !== undefined ? (
                          `Replaced page ${access.victimPage} in frame ${access.victimFrameIndex}`
                        ) : (
                          `Loaded into empty frame`
                        )
                      ) : (
                        'Already in memory'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageReplacementStats;
