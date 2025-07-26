
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Shield, 
  Bell, 
  Mail, 
  Database,
  Users,
  FileText,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    general: {
      platformName: 'VoteHub',
      adminEmail: 'admin@votehub.com',
      supportEmail: 'support@votehub.com',
      maxPollDuration: 30,
      enableRegistration: true,
      enableGuestVoting: false,
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      passwordMinLength: 8,
      sessionTimeout: 24,
      enableAuditLog: true,
      restrictAdminAccess: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      notifyOnNewPoll: true,
      notifyOnElectionStart: true,
      notifyOnHighActivity: false,
    },
    performance: {
      enableCaching: true,
      cacheTimeout: 300,
      maxConcurrentVotes: 1000,
      enableRateLimit: true,
      rateLimitPerMinute: 60,
    }
  });

  const handleSaveSettings = (section: string) => {
    // In a real app, this would save to backend
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  const updateSetting = (section: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Settings</h2>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Activity className="h-3 w-3" />
          <span>System Online</span>
        </Badge>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
          <CardDescription>
            Configure basic platform settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input 
                id="platform-name" 
                value={settings.general.platformName}
                onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input 
                id="admin-email" 
                type="email" 
                value={settings.general.adminEmail}
                onChange={(e) => updateSetting('general', 'adminEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="support-email">Support Email</Label>
              <Input 
                id="support-email" 
                type="email" 
                value={settings.general.supportEmail}
                onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="max-poll-duration">Max Poll Duration (days)</Label>
              <Input 
                id="max-poll-duration" 
                type="number" 
                value={settings.general.maxPollDuration}
                onChange={(e) => updateSetting('general', 'maxPollDuration', parseInt(e.target.value))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable User Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
              </div>
              <Switch 
                checked={settings.general.enableRegistration}
                onCheckedChange={(checked) => updateSetting('general', 'enableRegistration', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Guest Voting</Label>
                <p className="text-sm text-muted-foreground">Allow non-registered users to vote</p>
              </div>
              <Switch 
                checked={settings.general.enableGuestVoting}
                onCheckedChange={(checked) => updateSetting('general', 'enableGuestVoting', checked)}
              />
            </div>
          </div>

          <Button onClick={() => handleSaveSettings('General')}>
            Save General Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>
            Configure security policies and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password-length">Minimum Password Length</Label>
              <Input 
                id="password-length" 
                type="number" 
                value={settings.security.passwordMinLength}
                onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
              <Input 
                id="session-timeout" 
                type="number" 
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Users must verify email before voting</p>
              </div>
              <Switch 
                checked={settings.security.requireEmailVerification}
                onCheckedChange={(checked) => updateSetting('security', 'requireEmailVerification', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Switch 
                checked={settings.security.enableTwoFactor}
                onCheckedChange={(checked) => updateSetting('security', 'enableTwoFactor', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Log all admin actions and votes</p>
              </div>
              <Switch 
                checked={settings.security.enableAuditLog}
                onCheckedChange={(checked) => updateSetting('security', 'enableAuditLog', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Restrict Admin Access</Label>
                <p className="text-sm text-muted-foreground">Limit admin panel to specific IPs</p>
              </div>
              <Switch 
                checked={settings.security.restrictAdminAccess}
                onCheckedChange={(checked) => updateSetting('security', 'restrictAdminAccess', checked)}
              />
            </div>
          </div>

          <Button onClick={() => handleSaveSettings('Security')}>
            Save Security Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Settings</span>
          </CardTitle>
          <CardDescription>
            Configure notification preferences and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via email</p>
              </div>
              <Switch 
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
              </div>
              <Switch 
                checked={settings.notifications.smsNotifications}
                onCheckedChange={(checked) => updateSetting('notifications', 'smsNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Send browser push notifications</p>
              </div>
              <Switch 
                checked={settings.notifications.pushNotifications}
                onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Notify on New Polls</Label>
                <p className="text-sm text-muted-foreground">Alert users when new polls are created</p>
              </div>
              <Switch 
                checked={settings.notifications.notifyOnNewPoll}
                onCheckedChange={(checked) => updateSetting('notifications', 'notifyOnNewPoll', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Notify on Election Start</Label>
                <p className="text-sm text-muted-foreground">Alert users when elections begin</p>
              </div>
              <Switch 
                checked={settings.notifications.notifyOnElectionStart}
                onCheckedChange={(checked) => updateSetting('notifications', 'notifyOnElectionStart', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>High Activity Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify admins of unusual voting activity</p>
              </div>
              <Switch 
                checked={settings.notifications.notifyOnHighActivity}
                onCheckedChange={(checked) => updateSetting('notifications', 'notifyOnHighActivity', checked)}
              />
            </div>
          </div>

          <Button onClick={() => handleSaveSettings('Notifications')}>
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Performance Settings</span>
          </CardTitle>
          <CardDescription>
            Configure system performance and resource limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cache-timeout">Cache Timeout (seconds)</Label>
              <Input 
                id="cache-timeout" 
                type="number" 
                value={settings.performance.cacheTimeout}
                onChange={(e) => updateSetting('performance', 'cacheTimeout', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="max-concurrent">Max Concurrent Votes</Label>
              <Input 
                id="max-concurrent" 
                type="number" 
                value={settings.performance.maxConcurrentVotes}
                onChange={(e) => updateSetting('performance', 'maxConcurrentVotes', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="rate-limit">Rate Limit (per minute)</Label>
              <Input 
                id="rate-limit" 
                type="number" 
                value={settings.performance.rateLimitPerMinute}
                onChange={(e) => updateSetting('performance', 'rateLimitPerMinute', parseInt(e.target.value))}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Caching</Label>
                <p className="text-sm text-muted-foreground">Cache frequently accessed data</p>
              </div>
              <Switch 
                checked={settings.performance.enableCaching}
                onCheckedChange={(checked) => updateSetting('performance', 'enableCaching', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Rate Limiting</Label>
                <p className="text-sm text-muted-foreground">Limit API requests per user</p>
              </div>
              <Switch 
                checked={settings.performance.enableRateLimit}
                onCheckedChange={(checked) => updateSetting('performance', 'enableRateLimit', checked)}
              />
            </div>
          </div>

          <Button onClick={() => handleSaveSettings('Performance')}>
            Save Performance Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
