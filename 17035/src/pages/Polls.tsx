
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Vote, Users, Clock, TrendingUp, ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  hasVoted: boolean;
  userVote?: string;
}

interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  votes: number | null;
  percentage: number;
}

const Polls = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      
      // Fetch active polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;

      // Fetch options and user votes for each poll
      const pollsWithOptions = await Promise.all(
        (pollsData || []).map(async (poll) => {
          // Get poll options
          const { data: optionsData, error: optionsError } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', poll.id);

          if (optionsError) throw optionsError;

          // Check if user has voted
          let hasVoted = false;
          let userVote = undefined;
          
          if (user) {
            const { data: voteData, error: voteError } = await supabase
              .from('poll_votes')
              .select('option_id')
              .eq('poll_id', poll.id)
              .eq('user_id', user.id)
              .maybeSingle();

            if (!voteError && voteData) {
              hasVoted = true;
              userVote = voteData.option_id;
            }
          }

          const totalVotes = optionsData?.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;
          
          const optionsWithPercentage = (optionsData || []).map(option => ({
            ...option,
            percentage: totalVotes > 0 ? ((option.votes || 0) / totalVotes) * 100 : 0
          }));

          return {
            ...poll,
            options: optionsWithPercentage,
            totalVotes,
            hasVoted,
            userVote
          };
        })
      );

      setPolls(pollsWithOptions);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch polls"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();

    // Set up real-time subscription
    const pollsSubscription = supabase
      .channel('polls-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, () => {
        fetchPolls();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_options' }, () => {
        fetchPolls();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' }, () => {
        fetchPolls();
      })
      .subscribe();

    return () => {
      pollsSubscription.unsubscribe();
    };
  }, [user]);

  const handleVote = async () => {
    if (!selectedOption || !selectedPoll || !user) return;

    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: selectedPoll.id,
          option_id: selectedOption,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your vote has been recorded!"
      });

      // Update the selected poll to show results
      const updatedPoll = { ...selectedPoll, hasVoted: true, userVote: selectedOption };
      setSelectedPoll(updatedPoll);
      
      // Refresh polls data
      fetchPolls();
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit vote. You may have already voted on this poll."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToPolls = () => {
    setSelectedPoll(null);
    setSelectedOption('');
  };

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

  if (selectedPoll) {
    const votingEnded = isVotingPeriodEnded(selectedPoll.end_date);
    const showResults = selectedPoll.hasVoted || votingEnded;

    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={handleBackToPolls}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Polls
            </Button>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {selectedPoll.category}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{getTimeLeft(selectedPoll.end_date)}</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">{selectedPoll.title}</CardTitle>
                <CardDescription className="text-blue-100">
                  {selectedPoll.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                {!showResults && !votingEnded ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
                    <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                      {selectedPoll.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                            {option.option_text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <Button
                      onClick={handleVote}
                      disabled={!selectedOption || submitting}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                    >
                      <Vote className="mr-2 h-4 w-4" />
                      {submitting ? "Submitting..." : "Submit Vote"}
                    </Button>
                  </div>
                ) : (
                  <div>
                    {selectedPoll.hasVoted && (
                      <div className="text-center mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-green-600 font-semibold">✓ Vote Submitted Successfully!</div>
                        <div className="text-green-600 text-sm">Thank you for participating</div>
                      </div>
                    )}
                    
                    {votingEnded && (
                      <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-gray-600 font-semibold">Voting Period Ended</div>
                        <div className="text-gray-600 text-sm">Final results are displayed below</div>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      {votingEnded ? 'Final Results' : 'Current Results'}
                    </h3>
                    
                    <div className="space-y-4">
                      {selectedPoll.options
                        .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                        .map((option, index) => (
                        <div key={option.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Trophy className={`h-4 w-4 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-300'}`} />
                              <span className="font-medium">{option.option_text}</span>
                              {selectedPoll.userVote === option.id && (
                                <Badge variant="outline" className="text-xs">Your vote</Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">{option.percentage.toFixed(1)}%</div>
                              <div className="text-xs text-gray-500">{option.votes || 0} votes</div>
                            </div>
                          </div>
                          <Progress value={option.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200 text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{selectedPoll.totalVotes.toLocaleString()} total votes</span>
                </div>
              </CardContent>
            </Card>
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Active Polls</h1>
          <p className="text-xl text-muted-foreground">Share your opinion on topics that matter to you</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading polls...</p>
            </div>
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No active polls available at the moment.</p>
            <p className="text-muted-foreground mt-2">Check back later or contact an administrator.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => {
              const votingEnded = isVotingPeriodEnded(poll.end_date);
              return (
                <Card key={poll.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md hover:scale-105">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {poll.category}
                      </Badge>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">{getTimeLeft(poll.end_date)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                      {poll.title}
                    </CardTitle>
                    <CardDescription>{poll.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{poll.totalVotes.toLocaleString()} votes</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">{poll.options.length} options</span>
                      </div>
                    </div>
                    
                    {poll.hasVoted && (
                      <div className="mb-4 p-2 bg-green-50 rounded text-center">
                        <span className="text-green-700 text-sm font-medium">✓ You voted on this poll</span>
                      </div>
                    )}
                    
                    {votingEnded && (
                      <div className="mb-4 p-2 bg-gray-50 rounded text-center">
                        <span className="text-gray-700 text-sm font-medium">Voting ended</span>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => setSelectedPoll(poll)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Vote className="mr-2 h-4 w-4" />
                      {poll.hasVoted || votingEnded ? "View Results" : "Vote Now"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

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

export default Polls;
