
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vote, BarChart3, Users, Shield, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavigationHeader from '@/components/NavigationHeader';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Your Voice, <span className="text-primary">Your Vote</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our modern voting platform where democracy meets technology. 
              Participate in polls, elections, and make your opinion count in a secure, transparent environment.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose VoteHub?</h2>
            <p className="text-lg text-muted-foreground">Experience the future of democratic participation</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Vote className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Easy Voting</CardTitle>
                <CardDescription>Simple, intuitive interface for all users</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Secure & Private</CardTitle>
                <CardDescription>Your vote is protected with advanced security</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Real-time Results</CardTitle>
                <CardDescription>Watch results update as votes come in</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Community Driven</CardTitle>
                <CardDescription>Join thousands of engaged citizens</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Quick Access</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/polls" className="group">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md group-hover:scale-105">
                <CardHeader className="text-center">
                  <Vote className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">Active Polls</CardTitle>
                  <CardDescription>Vote on current community polls</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="w-full justify-center">
                    12 Active
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/elections" className="group">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md group-hover:scale-105">
                <CardHeader className="text-center">
                  <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-xl group-hover:text-green-600 transition-colors">Elections</CardTitle>
                  <CardDescription>Participate in formal elections</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="w-full justify-center">
                    3 Upcoming
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/results" className="group">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md group-hover:scale-105">
                <CardHeader className="text-center">
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">Results</CardTitle>
                  <CardDescription>View live voting results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="w-full justify-center">
                    Live Updates
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin" className="group">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md group-hover:scale-105">
                <CardHeader className="text-center">
                  <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">Admin Panel</CardTitle>
                  <CardDescription>Manage polls and elections</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="w-full justify-center">
                    Admin Only
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">50,000+</h3>
              <p className="text-muted-foreground">Active Voters</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-green-600 mb-2">1,200+</h3>
              <p className="text-muted-foreground">Completed Polls</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-purple-600 mb-2">99.9%</h3>
              <p className="text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Vote className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">VoteHub</span>
              </div>
              <p className="text-muted-foreground">
                Empowering democracy through secure, accessible voting technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/polls" className="hover:text-foreground transition-colors">Polls</Link></li>
                <li><Link to="/elections" className="hover:text-foreground transition-colors">Elections</Link></li>
                <li><Link to="/results" className="hover:text-foreground transition-colors">Results</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 VoteHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
