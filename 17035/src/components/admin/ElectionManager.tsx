
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Shield, 
  Play,
  Pause,
  Calendar,
  UserPlus
} from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  description: string;
  party?: string;
}

interface Election {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'Active' | 'Paused' | 'Ended';
  votes: number;
  endDate: string;
  candidates: Candidate[];
  createdAt: string;
}

const ElectionManager = () => {
  const [elections, setElections] = useState<Election[]>([
    {
      id: 1,
      title: "Student Council President",
      description: "Election for the next student council president",
      category: "Education",
      status: "Active",
      votes: 3421,
      endDate: "2024-07-08",
      candidates: [
        { id: 1, name: "John Smith", description: "Experienced leader with vision for change", party: "Progressive Party" },
        { id: 2, name: "Sarah Johnson", description: "Advocate for student rights and campus improvement", party: "Student First" },
        { id: 3, name: "Mike Chen", description: "Technology-focused candidate with innovative ideas", party: "Innovation Alliance" },
        { id: 4, name: "Emma Davis", description: "Environmental sustainability and wellness advocate", party: "Green Future" }
      ],
      createdAt: "2024-06-15"
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    category: '',
    endDate: '',
    candidates: [{ name: '', description: '', party: '' }]
  });

  const handleCreateElection = () => {
    if (!newElection.title || !newElection.category || !newElection.endDate) return;
    
    const election: Election = {
      id: Math.max(...elections.map(e => e.id)) + 1,
      title: newElection.title,
      description: newElection.description,
      category: newElection.category,
      status: 'Active',
      votes: 0,
      endDate: newElection.endDate,
      candidates: newElection.candidates
        .filter(candidate => candidate.name.trim() !== '')
        .map((candidate, index) => ({
          id: index + 1,
          name: candidate.name,
          description: candidate.description,
          party: candidate.party
        })),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setElections([...elections, election]);
    setNewElection({ title: '', description: '', category: '', endDate: '', candidates: [{ name: '', description: '', party: '' }] });
    setShowCreateDialog(false);
  };

  const handleUpdateElection = () => {
    if (!editingElection) return;
    
    setElections(elections.map(election => 
      election.id === editingElection.id ? editingElection : election
    ));
    setEditingElection(null);
  };

  const handleDeleteElection = (id: number) => {
    setElections(elections.filter(election => election.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setElections(elections.map(election => 
      election.id === id 
        ? { ...election, status: election.status === 'Active' ? 'Paused' : 'Active' as 'Active' | 'Paused' }
        : election
    ));
  };

  const addCandidate = (isEdit = false) => {
    if (isEdit && editingElection) {
      setEditingElection({ 
        ...editingElection, 
        candidates: [...editingElection.candidates, { id: editingElection.candidates.length + 1, name: '', description: '', party: '' }] 
      });
    } else {
      setNewElection({ ...newElection, candidates: [...newElection.candidates, { name: '', description: '', party: '' }] });
    }
  };

  const updateCandidate = (index: number, field: string, value: string, isEdit = false) => {
    if (isEdit && editingElection) {
      const newCandidates = [...editingElection.candidates];
      newCandidates[index] = { ...newCandidates[index], [field]: value };
      setEditingElection({ ...editingElection, candidates: newCandidates });
    } else {
      const newCandidates = [...newElection.candidates];
      newCandidates[index] = { ...newCandidates[index], [field]: value };
      setNewElection({ ...newElection, candidates: newCandidates });
    }
  };

  const removeCandidate = (index: number, isEdit = false) => {
    if (isEdit && editingElection) {
      setEditingElection({ ...editingElection, candidates: editingElection.candidates.filter((_, i) => i !== index) });
    } else {
      setNewElection({ ...newElection, candidates: newElection.candidates.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Elections Management</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Election
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Election</DialogTitle>
              <DialogDescription>
                Create a new election with candidates
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="election-title">Election Title</Label>
                  <Input 
                    id="election-title" 
                    placeholder="Enter election title"
                    value={newElection.title}
                    onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="election-category">Category</Label>
                  <Select value={newElection.category} onValueChange={(value) => setNewElection({ ...newElection, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="election-description">Description</Label>
                <Textarea 
                  id="election-description" 
                  placeholder="Enter election description"
                  value={newElection.description}
                  onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="election-end-date">End Date</Label>
                <Input 
                  id="election-end-date" 
                  type="date"
                  value={newElection.endDate}
                  onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Candidates</Label>
                <div className="space-y-4">
                  {newElection.candidates.map((candidate, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Candidate {index + 1}</h4>
                          {newElection.candidates.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeCandidate(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Name</Label>
                            <Input
                              placeholder="Candidate name"
                              value={candidate.name}
                              onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Party/Affiliation</Label>
                            <Input
                              placeholder="Party or affiliation (optional)"
                              value={candidate.party}
                              onChange={(e) => updateCandidate(index, 'party', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Candidate description"
                            value={candidate.description}
                            onChange={(e) => updateCandidate(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={() => addCandidate()} className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Candidate
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateElection}>
                  Create Election
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {elections.map((election) => (
          <Card key={election.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{election.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary">{election.category}</Badge>
                    <Badge variant={election.status === 'Active' ? 'default' : 'secondary'}>
                      <Shield className="w-3 h-3 mr-1" />
                      {election.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Ends: {new Date(election.endDate).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleStatus(election.id)}
                  >
                    {election.status === 'Active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingElection(election)}
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
                        <AlertDialogTitle>Delete Election</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{election.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteElection(election.id)}
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
              <p className="text-sm text-muted-foreground mb-4">{election.description}</p>
              <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{election.votes.toLocaleString()} votes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>{election.candidates.length} candidates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created {new Date(election.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Candidates:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {election.candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center space-x-2 text-sm">
                      <Badge variant="outline">{candidate.name}</Badge>
                      {candidate.party && <span className="text-muted-foreground">({candidate.party})</span>}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Election Dialog */}
      <Dialog open={!!editingElection} onOpenChange={() => setEditingElection(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Election</DialogTitle>
            <DialogDescription>
              Update election details and candidates
            </DialogDescription>
          </DialogHeader>
          {editingElection && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-election-title">Election Title</Label>
                  <Input 
                    id="edit-election-title" 
                    value={editingElection.title}
                    onChange={(e) => setEditingElection({ ...editingElection, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-election-category">Category</Label>
                  <Select 
                    value={editingElection.category} 
                    onValueChange={(value) => setEditingElection({ ...editingElection, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-election-description">Description</Label>
                <Textarea 
                  id="edit-election-description" 
                  value={editingElection.description}
                  onChange={(e) => setEditingElection({ ...editingElection, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-election-end-date">End Date</Label>
                <Input 
                  id="edit-election-end-date" 
                  type="date"
                  value={editingElection.endDate}
                  onChange={(e) => setEditingElection({ ...editingElection, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Candidates</Label>
                <div className="space-y-4">
                  {editingElection.candidates.map((candidate, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Candidate {index + 1}</h4>
                          {editingElection.candidates.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeCandidate(index, true)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Name</Label>
                            <Input
                              placeholder="Candidate name"
                              value={candidate.name}
                              onChange={(e) => updateCandidate(index, 'name', e.target.value, true)}
                            />
                          </div>
                          <div>
                            <Label>Party/Affiliation</Label>
                            <Input
                              placeholder="Party or affiliation (optional)"
                              value={candidate.party || ''}
                              onChange={(e) => updateCandidate(index, 'party', e.target.value, true)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Candidate description"
                            value={candidate.description}
                            onChange={(e) => updateCandidate(index, 'description', e.target.value, true)}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={() => addCandidate(true)} className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Candidate
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingElection(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateElection}>
                  Update Election
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ElectionManager;
