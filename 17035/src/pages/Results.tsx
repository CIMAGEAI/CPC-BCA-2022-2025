
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, ArrowLeft, Download, Share, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import NavigationHeader from '@/components/NavigationHeader';

interface Poll {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  end_date: string;
  created_at: string;
  options: PollOption[];
  totalVotes: number;
}

interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  votes: number | null;
  percentage: number;
  color?: string;
}

const Results = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      // Fetch all polls (active and ended)
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .in('status', ['active', 'ended'])
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;

      // Fetch options for each poll
      const pollsWithResults = await Promise.all(
        (pollsData || []).map(async (poll) => {
          const { data: optionsData, error: optionsError } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', poll.id)
            .order('votes', { ascending: false });

          if (optionsError) throw optionsError;

          const totalVotes = optionsData?.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;
          
          const optionsWithPercentage = (optionsData || []).map((option, index) => ({
            ...option,
            percentage: totalVotes > 0 ? ((option.votes || 0) / totalVotes) * 100 : 0,
            color: COLORS[index % COLORS.length]
          }));

          return {
            ...poll,
            options: optionsWithPercentage,
            totalVotes
          };
        })
      );

      setPolls(pollsWithResults);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();

    // Set up real-time subscription
    const resultsSubscription = supabase
      .channel('results-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, () => {
        fetchResults();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_options' }, () => {
        fetchResults();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' }, () => {
        fetchResults();
      })
      .subscribe();

    return () => {
      resultsSubscription.unsubscribe();
    };
  }, []);

  const isVotingPeriodEnded = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Voting ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return "Less than 1 hour left";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Voting Results</h1>
          <p className="text-xl text-muted-foreground">Real-time results and comprehensive analytics</p>
        </div>

        <Tabs defaultValue="polls" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-1 mb-8">
            <TabsTrigger value="polls" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Poll Results</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="polls">
            {polls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No poll results available yet.</p>
                <p className="text-muted-foreground mt-2">Polls will appear here once voting begins.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {polls.map((poll) => {
                  const votingEnded = isVotingPeriodEnded(poll.end_date);
                  
                  return (
                    <Card key={poll.id} className="border-0 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {poll.category}
                            </Badge>
                            <Badge variant="secondary" className={`${votingEnded ? 'bg-gray-500/20' : 'bg-green-500/20'} text-white`}>
                              {votingEnded ? 'Ended' : 'Active'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">{getTimeLeft(poll.end_date)}</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{poll.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-blue-100">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">{poll.totalVotes.toLocaleString()} votes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm">{poll.options.length} options</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-6">
                        {poll.totalVotes === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No votes have been cast yet.</p>
                            <p className="text-sm text-muted-foreground">Results will appear as people vote.</p>
                          </div>
                        ) : (
                          <>
                            <div className="grid lg:grid-cols-2 gap-8">
                              {/* Bar Chart */}
                              <div>
                                <h3 className="text-lg font-semibold mb-4">Vote Distribution</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                  <BarChart data={poll.options.map(option => ({ 
                                    name: option.option_text, 
                                    votes: option.votes || 0 
                                  }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="votes" fill="#3B82F6" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>

                              {/* Pie Chart */}
                              <div>
                                <h3 className="text-lg font-semibold mb-4">Percentage Breakdown</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                  <PieChart>
                                    <Pie
                                      data={poll.options.map(option => ({
                                        name: option.option_text,
                                        value: option.votes || 0,
                                        percentage: option.percentage
                                      }))}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={false}
                                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                      outerRadius={60}
                                      fill="#8884d8"
                                      dataKey="value"
                                    >
                                      {poll.options.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Detailed Results */}
                            <div className="mt-8">
                              <h3 className="text-lg font-semibold mb-4">Detailed Results</h3>
                              <div className="space-y-4">
                                {poll.options.map((result, index) => (
                                  <div key={result.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                          <Trophy className={`h-4 w-4 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-300'}`} />
                                          <span className="font-medium">{result.option_text}</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold">{result.percentage.toFixed(1)}%</div>
                                        <div className="text-sm text-muted-foreground">{result.votes || 0} votes</div>
                                      </div>
                                    </div>
                                    <Progress value={result.percentage} className="h-3" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border">
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Link to="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
