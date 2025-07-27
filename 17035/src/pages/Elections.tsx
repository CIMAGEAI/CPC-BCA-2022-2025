
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Vote, Users, Clock, Award, ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Elections = () => {
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  const elections = [
    {
      id: 1,
      title: "Student Council President",
      description: "Choose your next student body leader for the academic year 2024-2025",
      category: "Education",
      totalVotes: 3421,
      timeLeft: "3 days left",
      status: "Active",
      candidates: [
        {
          id: 'sarah',
          name: 'Sarah Johnson',
          party: 'Progressive Student Alliance',
          votes: 1368,
          percentage: 40.0,
          avatar: '/placeholder.svg',
          slogan: 'Innovation for Every Student'
        },
        {
          id: 'mike',
          name: 'Michael Chen',
          party: 'Unity Coalition',
          votes: 1025,
          percentage: 30.0,
          avatar: '/placeholder.svg',
          slogan: 'Building Bridges, Creating Opportunities'
        },
        {
          id: 'emily',
          name: 'Emily Rodriguez',
          party: 'Student Voice Movement',
          votes: 855,
          percentage: 25.0,
          avatar: '/placeholder.svg',
          slogan: 'Your Voice, Our Future'
        },
        {
          id: 'david',
          name: 'David Kim',
          party: 'Independent',
          votes: 171,
          percentage: 5.0,
          avatar: '/placeholder.svg',
          slogan: 'Fresh Ideas, Real Change'
        }
      ]
    },
    {
      id: 2,
      title: "Community Board Election",
      description: "Select your neighborhood representatives for local governance",
      category: "Government",
      totalVotes: 1876,
      timeLeft: "1 week left",
      status: "Active",
      candidates: [
        {
          id: 'jennifer',
          name: 'Jennifer Walsh',
          party: 'Community First',
          votes: 751,
          percentage: 40.0,
          avatar: '/placeholder.svg',
          slogan: 'Stronger Communities Together'
        },
        {
          id: 'robert',
          name: 'Robert Martinez',
          party: 'Progressive Neighbors',
          votes: 563,
          percentage: 30.0,
          avatar: '/placeholder.svg',
          slogan: 'Progress Through Partnership'
        },
        {
          id: 'lisa',
          name: 'Lisa Thompson',
          party: 'Independent Coalition',
          votes: 469,
          percentage: 25.0,
          avatar: '/placeholder.svg',
          slogan: 'Independent Voices, United Action'
        },
        {
          id: 'james',
          name: 'James Anderson',
          party: 'Local Action Party',
          votes: 94,
          percentage: 5.0,
          avatar: '/placeholder.svg',
          slogan: 'Local Solutions for Local Problems'
        }
      ]
    }
  ];

  const handleVote = () => {
    if (selectedCandidate) {
      setHasVoted(true);
      console.log(`Voted for candidate: ${selectedCandidate} in election: ${selectedElection.id}`);
    }
  };

  const handleBackToElections = () => {
    setSelectedElection(null);
    setSelectedCandidate('');
    setHasVoted(false);
  };

  if (selectedElection) {
    return (
      <div className="min-h-screen  from-purple-50 via-white to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={handleBackToElections}
              className="mb-6 hover:bg-purple-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Elections
            </Button>

            <Card className="border-0 shadow-lg mb-6">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {selectedElection.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/20 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      {selectedElection.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{selectedElection.timeLeft}</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">{selectedElection.title}</CardTitle>
                <CardDescription className="text-purple-100">
                  {selectedElection.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <Shield className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="text-amber-800 font-medium">
                    This is an official election. Your vote will be securely recorded and counted.
                  </span>
                </div>

                {!hasVoted ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Select Your Candidate</h3>
                    <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                      {selectedElection.candidates.map((candidate) => (
                        <div key={candidate.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={candidate.id} id={candidate.id} />
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Label htmlFor={candidate.id} className="cursor-pointer">
                                <div className="font-semibold">{candidate.name}</div>
                                <div className="text-sm text-gray-600">{candidate.party}</div>
                                <div className="text-sm text-blue-600 italic">"{candidate.slogan}"</div>
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <Button
                      onClick={handleVote}
                      disabled={!selectedCandidate}
                      className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                    >
                      <Vote className="mr-2 h-4 w-4" />
                      Cast Official Vote
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-600 font-semibold text-lg">✓ Vote Cast Successfully!</div>
                      <div className="text-green-600 text-sm">Your vote has been securely recorded</div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-6 flex items-center">
                      <Award className="mr-2 h-5 w-5" />
                      Current Results
                    </h3>
                    
                    <div className="space-y-6">
                      {selectedElection.candidates
                        .sort((a, b) => b.percentage - a.percentage)
                        .map((candidate, index) => (
                        <div key={candidate.id} className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-lg font-bold text-gray-400 w-6">
                              #{index + 1}
                            </div>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-semibold">{candidate.name}</div>
                              <div className="text-sm text-gray-600">{candidate.party}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">{candidate.percentage}%</div>
                              <div className="text-xs text-gray-500">{candidate.votes} votes</div>
                            </div>
                          </div>
                          <Progress value={candidate.percentage} className="h-3" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200 text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{selectedElection.totalVotes.toLocaleString()} total votes cast</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  from-purple-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-4">Official Elections</h1>
          <p className="text-xl text-gray-600">Participate in democratic processes that shape our communities</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {elections.map((election) => (
            <Card key={election.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg hover:scale-105">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {election.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/20 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      {election.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-white">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{election.timeLeft}</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{election.title}</CardTitle>
                <CardDescription className="text-purple-100">
                  {election.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="text-sm text-gray-600 font-medium">Leading Candidates:</div>
                  {election.candidates.slice(0, 3).map((candidate, index) => (
                    <div key={candidate.id} className="flex items-center space-x-3">
                      <div className="text-sm font-bold text-gray-400 w-4">
                        #{index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback className="text-xs">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{candidate.name}</div>
                        <div className="text-xs text-gray-500">{candidate.party}</div>
                      </div>
                      <div className="text-sm font-semibold text-purple-600">
                        {candidate.percentage}%
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{election.totalVotes.toLocaleString()} votes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">{election.candidates.length} candidates</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => setSelectedElection(election)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Vote className="mr-2 h-4 w-4" />
                  Vote in Election
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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

export default Elections;
