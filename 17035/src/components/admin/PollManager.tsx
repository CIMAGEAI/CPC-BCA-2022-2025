
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BarChart3, 
  Play,
  Pause,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Poll {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  options?: PollOption[];
  totalVotes?: number;
}

interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  votes: number | null;
  created_at: string;
}

const PollManager = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    category: '',
    end_date: '',
    options: ['', '']
  });

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;

      // Fetch options for each poll
      const pollsWithOptions = await Promise.all(
        (pollsData || []).map(async (poll) => {
          const { data: optionsData, error: optionsError } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', poll.id);

          if (optionsError) throw optionsError;

          const totalVotes = optionsData?.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;

          return {
            ...poll,
            options: optionsData || [],
            totalVotes
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
      .channel('polls-changes')
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
  }, []);

  const handleCreatePoll = async () => {
    if (!newPoll.title || !newPoll.category || !newPoll.end_date || !user) return;
    
    try {
      const validOptions = newPoll.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please provide at least 2 options"
        });
        return;
      }

      // Create poll
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert({
          title: newPoll.title,
          description: newPoll.description || null,
          category: newPoll.category,
          end_date: newPoll.end_date,
          created_by: user.id
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Create poll options
      const optionsToInsert = validOptions.map(option => ({
        poll_id: pollData.id,
        option_text: option
      }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;

      setNewPoll({ title: '', description: '', category: '', end_date: '', options: ['', ''] });
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: "Poll created successfully!"
      });
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create poll"
      });
    }
  };

  const handleUpdatePoll = async () => {
    if (!editingPoll) return;
    
    try {
      const { error: pollError } = await supabase
        .from('polls')
        .update({
          title: editingPoll.title,
          description: editingPoll.description,
          category: editingPoll.category,
          end_date: editingPoll.end_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPoll.id);

      if (pollError) throw pollError;

      setEditingPoll(null);
      toast({
        title: "Success",
        description: "Poll updated successfully!"
      });
    } catch (error) {
      console.error('Error updating poll:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update poll"
      });
    }
  };

  const handleDeletePoll = async (id: string) => {
    try {
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Poll deleted successfully!"
      });
    } catch (error) {
      console.error('Error deleting poll:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete poll"
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const { error } = await supabase
        .from('polls')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Poll ${newStatus === 'active' ? 'activated' : 'paused'} successfully!`
      });
    } catch (error) {
      console.error('Error toggling poll status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update poll status"
      });
    }
  };

  const addOption = (isEdit = false) => {
    if (isEdit && editingPoll) {
      setEditingPoll({ ...editingPoll, options: [...(editingPoll.options || []), { id: '', poll_id: editingPoll.id, option_text: '', votes: 0, created_at: '' }] });
    } else {
      setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
    }
  };

  const updateOption = (index: number, value: string, isEdit = false) => {
    if (isEdit && editingPoll) {
      const newOptions = [...(editingPoll.options || [])];
      newOptions[index] = { ...newOptions[index], option_text: value };
      setEditingPoll({ ...editingPoll, options: newOptions });
    } else {
      const newOptions = [...newPoll.options];
      newOptions[index] = value;
      setNewPoll({ ...newPoll, options: newOptions });
    }
  };

  const removeOption = (index: number, isEdit = false) => {
    if (isEdit && editingPoll) {
      const newOptions = (editingPoll.options || []).filter((_, i) => i !== index);
      setEditingPoll({ ...editingPoll, options: newOptions });
    } else {
      setNewPoll({ ...newPoll, options: newPoll.options.filter((_, i) => i !== index) });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading polls...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Polls Management</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Poll</DialogTitle>
              <DialogDescription>
                Create a new poll for users to vote on
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="poll-title">Poll Title</Label>
                <Input 
                  id="poll-title" 
                  placeholder="Enter poll title"
                  value={newPoll.title}
                  onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="poll-description">Description</Label>
                <Textarea 
                  id="poll-description" 
                  placeholder="Enter poll description"
                  value={newPoll.description}
                  onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="poll-category">Category</Label>
                <Select value={newPoll.category} onValueChange={(value) => setNewPoll({ ...newPoll, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Politics">Politics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="poll-end-date">End Date</Label>
                <Input 
                  id="poll-end-date" 
                  type="date"
                  value={newPoll.end_date}
                  onChange={(e) => setNewPoll({ ...newPoll, end_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Poll Options</Label>
                <div className="space-y-2">
                  {newPoll.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                      />
                      {newPoll.options.length > 2 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => addOption()} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePoll}>
                  Create Poll
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {polls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{poll.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary">{poll.category}</Badge>
                    <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>
                      {poll.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Ends: {new Date(poll.end_date).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleStatus(poll.id, poll.status)}
                  >
                    {poll.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingPoll(poll)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Poll</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{poll.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeletePoll(poll.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{poll.description}</p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{poll.totalVotes?.toLocaleString() || 0} votes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span>{poll.options?.length || 0} options</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created {new Date(poll.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Poll Dialog */}
      <Dialog open={!!editingPoll} onOpenChange={() => setEditingPoll(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Poll</DialogTitle>
            <DialogDescription>
              Update poll details
            </DialogDescription>
          </DialogHeader>
          {editingPoll && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-poll-title">Poll Title</Label>
                <Input 
                  id="edit-poll-title" 
                  value={editingPoll.title}
                  onChange={(e) => setEditingPoll({ ...editingPoll, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-poll-description">Description</Label>
                <Textarea 
                  id="edit-poll-description" 
                  value={editingPoll.description || ''}
                  onChange={(e) => setEditingPoll({ ...editingPoll, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-poll-category">Category</Label>
                <Select 
                  value={editingPoll.category} 
                  onValueChange={(value) => setEditingPoll({ ...editingPoll, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Politics">Politics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-poll-end-date">End Date</Label>
                <Input 
                  id="edit-poll-end-date" 
                  type="date"
                  value={editingPoll.end_date}
                  onChange={(e) => setEditingPoll({ ...editingPoll, end_date: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingPoll(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePoll}>
                  Update Poll
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PollManager;
