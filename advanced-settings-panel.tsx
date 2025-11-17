'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Brain, 
  Volume2, 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Clock,
  Heart,
  Zap,
  TrendingUp,
  Calendar,
  Award,
  FileText,
  BarChart3,
  Users,
  MessageSquare,
  AlertTriangle,
  Star,
  RefreshCw,
  Save,
  Link,
  CheckCircle,
  XCircle,
  Plus,
  Edit3,
  Filter,
  Search,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Target,
  Sparkles,
  Gift,
  Crown,
  Trophy,
  Medal,
  Activity,
  Gauge
} from 'lucide-react';
import { EnhancedDrMarcieAvatar } from '@/components/enhanced-dr-marcie-avatar';
import { DrMarciePersonality } from '@/lib/dr-marcie-ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AdvancedSettingsPanelProps {
  userEmail: string;
  userName: string;
  personalityLevel: DrMarciePersonality;
  coupleBackstory?: string;
  onPersonalityChange: (level: DrMarciePersonality) => void;
  onSettingsChange: (settings: UserSettings) => void;
}

interface UserSettings {
  drMarcieLevel: number;
  drMarcieCustomization: {
    voicePace: number; // 0.5-2.0
    responseTone: 'gentle' | 'balanced' | 'direct';
    humorLevel: number; // 1-5
    professionalMode: boolean;
  };
  notificationsEnabled: boolean;
  privacySettings: {
    shareProgressWithPartner: boolean;
    allowDataExport: boolean;
    anonymizeInsights: boolean;
  };
  voicePacePreference: number;
}

interface EmotionalDossierEntry {
  id: string;
  createdAt: string;
  entryType: string;
  title: string;
  description: string;
  tags: string[];
  frequency: number;
  severity: number;
  drMarcieNotes?: string;
  recommendations: string[];
  resolved: boolean;
  followUpDate?: string;
  progressNotes: string[];
}

interface RelationshipInsights {
  totalActivitiesCompleted: number;
  averageScore: number;
  strongestCategories: string[];
  growthAreas: string[];
  conflictPatterns: string[];
  progressTrend: 'improving' | 'stable' | 'declining';
  milestoneStats: {
    total: number;
    thisMonth: number;
    categories: { [key: string]: number };
  };
  drMarcieInteractionStats: {
    totalInteractions: number;
    averageRating: number;
    mostHelpfulContexts: string[];
  };
}

const AdvancedSettingsPanel: React.FC<AdvancedSettingsPanelProps> = ({
  userEmail,
  userName,
  personalityLevel,
  coupleBackstory,
  onPersonalityChange,
  onSettingsChange
}) => {
  const [currentTab, setCurrentTab] = useState<string>('personality');
  const [settings, setSettings] = useState<UserSettings>({
    drMarcieLevel: personalityLevel,
    drMarcieCustomization: {
      voicePace: 1.0,
      responseTone: 'balanced',
      humorLevel: 3,
      professionalMode: false
    },
    notificationsEnabled: true,
    privacySettings: {
      shareProgressWithPartner: true,
      allowDataExport: true,
      anonymizeInsights: false
    },
    voicePacePreference: 1.0
  });
  
  const [emotionalDossier, setEmotionalDossier] = useState<EmotionalDossierEntry[]>([]);
  const [relationshipInsights, setRelationshipInsights] = useState<RelationshipInsights | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [partnerLinkStatus, setPartnerLinkStatus] = useState<{
    isLinked: boolean;
    partnerName?: string;
    linkCode?: string;
    pendingInvite?: boolean;
  }>({ isLinked: false });
  const [dossierFilter, setDossierFilter] = useState<string>('all');
  const [dossierSearch, setDossierSearch] = useState<string>('');
  const [previewPersonality, setPreviewPersonality] = useState<number>(personalityLevel);
  const [showMilestoneDetails, setShowMilestoneDetails] = useState<boolean>(false);

  useEffect(() => {
    fetchUserSettings();
    fetchEmotionalDossier();
    fetchRelationshipInsights();
    fetchPartnerLinkStatus();
  }, [userEmail]);

  const fetchPartnerLinkStatus = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/partner-status?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      if (data.success) {
        setPartnerLinkStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching partner link status:', error);
    }
  };

  const fetchUserSettings = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/user-settings?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const fetchEmotionalDossier = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/emotional-dossier?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      if (data.success) {
        setEmotionalDossier(data.entries);
      }
    } catch (error) {
      console.error('Error fetching emotional dossier:', error);
    }
  };

  const fetchRelationshipInsights = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/relationship-insights?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      if (data.success) {
        setRelationshipInsights(data.insights);
      }
    } catch (error) {
      console.error('Error fetching relationship insights:', error);
    }
  };

  const saveSettings = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          settings
        }),
      });

      const data = await response.json();
      if (data.success) {
        setHasUnsavedChanges(false);
        onSettingsChange(settings);
        onPersonalityChange(settings.drMarcieLevel as DrMarciePersonality);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/data-export?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (data.success) {
        // Create downloadable file
        const blob = new Blob([JSON.stringify(data.exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relationship-data-${userName}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleSettingChange = (key: string, value: any): void => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleCustomizationChange = (key: string, value: any): void => {
    setSettings(prev => ({
      ...prev,
      drMarcieCustomization: {
        ...prev.drMarcieCustomization,
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handlePrivacyChange = (key: string, value: any): void => {
    setSettings(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const getPersonalityDescription = (level: number): { title: string; description: string; color: string } => {
    switch (level) {
      case 1:
        return {
          title: 'Tough Love Rookie',
          description: 'Warm but blunt, with mild sarcasm and gentle guidance. Like having a caring but no-nonsense friend.',
          color: 'text-green-600'
        };
      case 2:
        return {
          title: 'Reality Check Specialist',
          description: 'Clinical and analytical with strategic sarcasm. Professional detachment with emotional intelligence.',
          color: 'text-yellow-600'
        };
      case 3:
        return {
          title: 'Radical Truth Wizard',
          description: 'Deep, powerful insights with poetic weight. Cuts to the core with profound, uncomfortable truths.',
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Balanced Therapist',
          description: 'Professional and engaging approach.',
          color: 'text-blue-600'
        };
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSeverityColor = (severity: number): string => {
    if (severity <= 2) return 'bg-green-500';
    if (severity <= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getEntryTypeIcon = (entryType: string): React.ReactNode => {
    switch (entryType) {
      case 'conflict_pattern':
        return <AlertTriangle className="w-4 h-4" />;
      case 'growth_observation':
        return <TrendingUp className="w-4 h-4" />;
      case 'strength_noted':
        return <Star className="w-4 h-4" />;
      case 'concern_raised':
        return <Eye className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const personalityInfo = getPersonalityDescription(settings.drMarcieLevel);
  const previewPersonalityInfo = getPersonalityDescription(previewPersonality);

  // Filter dossier entries
  const filteredDossier = emotionalDossier.filter(entry => {
    const matchesFilter = dossierFilter === 'all' || entry.entryType === dossierFilter;
    const matchesSearch = dossierSearch === '' || 
      entry.title.toLowerCase().includes(dossierSearch.toLowerCase()) ||
      entry.description.toLowerCase().includes(dossierSearch.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(dossierSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const generateLinkCode = async (): Promise<void> => {
    try {
      const response = await fetch('/api/generate-link-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail })
      });
      const data = await response.json();
      if (data.success) {
        setPartnerLinkStatus({ ...partnerLinkStatus, linkCode: data.linkCode });
      }
    } catch (error) {
      console.error('Error generating link code:', error);
    }
  };

  const markDossierEntryResolved = async (entryId: string): Promise<void> => {
    try {
      const response = await fetch('/api/emotional-dossier', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId, resolved: true })
      });
      const data = await response.json();
      if (data.success) {
        setEmotionalDossier(prev => 
          prev.map(entry => 
            entry.id === entryId ? { ...entry, resolved: true } : entry
          )
        );
      }
    } catch (error) {
      console.error('Error marking entry as resolved:', error);
    }
  };

  const testPersonalityVoice = async (level: number): Promise<void> => {
    try {
      const testMessage = `Hi there! This is Dr. Marcie speaking at personality level ${level}. ${getPersonalityDescription(level).description} How does this feel for your relationship journey?`;
      
      // Create a test interaction for voice generation
      const voiceResponse = await fetch('/api/omnipresent-hosting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          contextType: 'personality_test',
          personalityLevel: level,
          message: testMessage,
          voiceSettings: {
            pace: settings.drMarcieCustomization.voicePace,
            tone: settings.drMarcieCustomization.responseTone,
            professionalMode: settings.drMarcieCustomization.professionalMode
          }
        })
      });

      const voiceData = await voiceResponse.json();
      
      if (voiceData.success && voiceData.voiceUrl) {
        // Play the generated voice
        const audio = new Audio(voiceData.voiceUrl);
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          // Fallback: show text instead
          alert(`Dr. Marcie (Level ${level}): ${testMessage}`);
        });
      } else {
        // Fallback: show text
        alert(`Dr. Marcie (Level ${level}): ${testMessage}`);
      }
    } catch (error) {
      console.error('Error testing voice:', error);
      // Fallback: show text
      const testMessage = `Hi there! This is Dr. Marcie speaking at personality level ${level}. ${getPersonalityDescription(level).description} How does this feel for your relationship journey?`;
      alert(`Dr. Marcie (Level ${level}): ${testMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-500 text-white rounded-full">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                    Advanced Settings & Memory
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    Customize Dr. Marcie and access your relationship insights
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="text-orange-600">
                    Unsaved Changes
                  </Badge>
                )}
                <Button
                  onClick={saveSettings}
                  disabled={isLoading || !hasUnsavedChanges}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Settings Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 dark:bg-gray-800/50">
            <TabsTrigger value="personality" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Dr. Marcie</span>
            </TabsTrigger>
            <TabsTrigger value="partner" className="flex items-center space-x-2">
              <Link className="w-4 h-4" />
              <span>Partner</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="dossier" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Memory</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          {/* Dr. Marcie Personality Tab */}
          <TabsContent value="personality" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Personality Level Control */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                    <Brain className="w-5 h-5 mr-2" />
                    Dr. Marcie Personality Level
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Current Level Display */}
                  <div className="text-center space-y-3">
                    <div className="text-6xl">🎭</div>
                    <h3 className={`text-xl font-bold ${personalityInfo.color}`}>
                      Level {settings.drMarcieLevel}: {personalityInfo.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {personalityInfo.description}
                    </p>
                  </div>

                  {/* Level Selector */}
                  <div className="space-y-4">
                    <Label className="text-gray-700 dark:text-gray-300">Choose Your Dr. Marcie Style</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {[1, 2, 3].map((level) => {
                        const info = getPersonalityDescription(level);
                        return (
                          <Button
                            key={level}
                            variant={settings.drMarcieLevel === level ? "default" : "outline"}
                            className={`p-4 h-auto text-left justify-start ${
                              settings.drMarcieLevel === level ? 'ring-2 ring-purple-400' : ''
                            }`}
                            onClick={() => handleSettingChange('drMarcieLevel', level)}
                          >
                            <div className="space-y-1">
                              <div className={`font-semibold ${info.color}`}>
                                Level {level}: {info.title}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {info.description}
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Preview */}
              <div className="space-y-6">
                <EnhancedDrMarcieAvatar
                  personalityLevel={settings.drMarcieLevel as DrMarciePersonality}
                  coupleBackstory={coupleBackstory}
                  className="animate__animated animate__fadeIn"
                  hostingContext="general"
                  autoGreeting={true}
                  initialMessage={`Hey there! This is your Level ${settings.drMarcieLevel} Dr. Marcie speaking. How does this personality style feel for your relationship journey?`}
                />
              </div>
            </div>

            {/* Voice & Response Customization */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Voice & Response Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Voice Pace */}
                  <div className="space-y-3">
                    <Label className="text-gray-700 dark:text-gray-300">
                      Voice Pace: {settings.drMarcieCustomization.voicePace}x
                    </Label>
                    <Slider
                      value={[settings.drMarcieCustomization.voicePace]}
                      onValueChange={(values) => handleCustomizationChange('voicePace', values[0])}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Slower</span>
                      <span>Normal</span>
                      <span>Faster</span>
                    </div>
                  </div>

                  {/* Response Tone */}
                  <div className="space-y-3">
                    <Label className="text-gray-700 dark:text-gray-300">Response Tone</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['gentle', 'balanced', 'direct'] as const).map((tone) => (
                        <Button
                          key={tone}
                          variant={settings.drMarcieCustomization.responseTone === tone ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCustomizationChange('responseTone', tone)}
                          className="capitalize"
                        >
                          {tone}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Humor Level */}
                  <div className="space-y-3">
                    <Label className="text-gray-700 dark:text-gray-300">
                      Humor Level: {settings.drMarcieCustomization.humorLevel}/5
                    </Label>
                    <Slider
                      value={[settings.drMarcieCustomization.humorLevel]}
                      onValueChange={(values) => handleCustomizationChange('humorLevel', values[0])}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Serious</span>
                      <span>Playful</span>
                      <span>Comedy</span>
                    </div>
                  </div>

                  {/* Professional Mode */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-700 dark:text-gray-300">Professional Mode</Label>
                      <Switch
                        checked={settings.drMarcieCustomization.professionalMode}
                        onCheckedChange={(checked) => handleCustomizationChange('professionalMode', checked)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Reduces casual language and increases clinical terminology
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partner Linking Tab */}
          <TabsContent value="partner" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Partner Link Status */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                    <Link className="w-5 h-5 mr-2" />
                    Partner Connection Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Current Status */}
                  <div className="text-center space-y-4">
                    {partnerLinkStatus.isLinked ? (
                      <>
                        <div className="text-6xl">💑</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                              Connected to {partnerLinkStatus.partnerName}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            You're both on this relationship journey together!
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-6xl">💕</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <XCircle className="w-5 h-5 text-orange-500" />
                            <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                              No Partner Connected
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Invite your partner to join your relationship journey
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Link Actions */}
                  {!partnerLinkStatus.isLinked && (
                    <div className="space-y-4">
                      {partnerLinkStatus.linkCode ? (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Share This Code with Your Partner:
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={partnerLinkStatus.linkCode}
                              readOnly
                              className="bg-white dark:bg-gray-800 font-mono text-center text-lg"
                            />
                            <Button
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(partnerLinkStatus.linkCode || '');
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                            They can enter this code during signup to connect with you
                          </p>
                        </div>
                      ) : (
                        <Button
                          onClick={generateLinkCode}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Generate Partner Link Code
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Partner Journey Progress */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                    <Activity className="w-5 h-5 mr-2" />
                    Shared Journey Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {partnerLinkStatus.isLinked ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Relationship Activities</span>
                          <span>12/50</span>
                        </div>
                        <Progress value={24} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Trust Thermometer</span>
                          <span>78/100</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Communication Score</span>
                          <span>85/100</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">15</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Conflicts Resolved</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Connect with your partner to see shared progress and achievements together.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy & Data Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Privacy Settings */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                    <Shield className="w-5 h-5 mr-2" />
                    Privacy Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Notification Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Notifications Enabled</Label>
                        <p className="text-xs text-gray-500">Receive reminders and updates</p>
                      </div>
                      <Switch
                        checked={settings.notificationsEnabled}
                        onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Share Progress with Partner</Label>
                        <p className="text-xs text-gray-500">Allow partner to see your activity completion</p>
                      </div>
                      <Switch
                        checked={settings.privacySettings.shareProgressWithPartner}
                        onCheckedChange={(checked) => handlePrivacyChange('shareProgressWithPartner', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Allow Data Export</Label>
                        <p className="text-xs text-gray-500">Enable downloading your relationship data</p>
                      </div>
                      <Switch
                        checked={settings.privacySettings.allowDataExport}
                        onCheckedChange={(checked) => handlePrivacyChange('allowDataExport', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Anonymize Insights</Label>
                        <p className="text-xs text-gray-500">Remove identifying information from exported data</p>
                      </div>
                      <Switch
                        checked={settings.privacySettings.anonymizeInsights}
                        onCheckedChange={(checked) => handlePrivacyChange('anonymizeInsights', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                    <Download className="w-5 h-5 mr-2" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="space-y-4">
                    <Button
                      onClick={exportData}
                      disabled={!settings.privacySettings.allowDataExport}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export My Relationship Data
                    </Button>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Export Includes:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• All game sessions and scores</li>
                        <li>• Dr. Marcie interaction history</li>
                        <li>• Relationship progress timeline</li>
                        <li>• Milestone achievements</li>
                        <li>• Fight solver session summaries</li>
                        <li>• Emotional dossier entries</li>
                      </ul>
                    </div>

                    <div className="border-t pt-4">
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
                            // In real app, would call delete API
                            console.log('Data deletion requested');
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete All My Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Emotional Dossier Tab */}
          <TabsContent value="dossier" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                  <FileText className="w-5 h-5 mr-2" />
                  Dr. Marcie's Emotional Dossier
                  <Badge className="ml-3 bg-purple-500 text-white">
                    {emotionalDossier.length} Entries
                  </Badge>
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Dr. Marcie's professional observations, pattern recognition, and relationship insights
                </p>
              </CardHeader>
              <CardContent>
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search dossier entries..."
                        value={dossierSearch}
                        onChange={(e) => setDossierSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Select value={dossierFilter} onValueChange={setDossierFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Entries</SelectItem>
                        <SelectItem value="conflict_pattern">Conflict Patterns</SelectItem>
                        <SelectItem value="growth_observation">Growth Observations</SelectItem>
                        <SelectItem value="strength_noted">Strengths Noted</SelectItem>
                        <SelectItem value="concern_raised">Concerns Raised</SelectItem>
                        <SelectItem value="breakthrough">Breakthroughs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredDossier.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        {emotionalDossier.length === 0 
                          ? "No dossier entries yet. Dr. Marcie will start building your relationship profile as you interact with the platform."
                          : "No entries match your current filter criteria."
                        }
                      </p>
                    </div>
                  ) : (
                    filteredDossier.map((entry) => (
                      <Card key={entry.id} className="border-2 border-gray-200 dark:border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {getEntryTypeIcon(entry.entryType)}
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                {entry.title}
                              </h4>
                              <Badge className={`${getSeverityColor(entry.severity)} text-white text-xs`}>
                                Severity {entry.severity}
                              </Badge>
                              {entry.frequency > 1 && (
                                <Badge variant="outline" className="text-xs">
                                  {entry.frequency}x Pattern
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">{formatDate(entry.createdAt)}</div>
                              {entry.resolved && (
                                <Badge className="bg-green-500 text-white text-xs mt-1">Resolved</Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-700 dark:text-gray-300 mb-3">{entry.description}</p>

                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {entry.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {entry.drMarcieNotes && (
                            <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800 mb-3">
                              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                Dr. Marcie's Notes:
                              </h5>
                              <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                                "{entry.drMarcieNotes}"
                              </p>
                            </div>
                          )}

                          {entry.recommendations.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="font-semibold text-gray-900 dark:text-gray-100">Recommendations:</h5>
                              <ul className="space-y-1">
                                {entry.recommendations.map((rec, index) => (
                                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                                    <span className="text-purple-500 mr-2">•</span>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {entry.progressNotes.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Progress Updates:</h5>
                              <div className="space-y-1">
                                {entry.progressNotes.map((note, index) => (
                                  <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
                                    {note}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          {!entry.resolved && (
                            <div className="mt-4 pt-3 border-t flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markDossierEntryResolved(entry.id)}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Mark Resolved
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                              >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Add Progress Note
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relationship Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {relationshipInsights ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Overview Stats */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Relationship Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                          {relationshipInsights.totalActivitiesCompleted}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Activities Completed</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {Math.round(relationshipInsights.averageScore)}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Average Score</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {relationshipInsights.milestoneStats.total}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Milestones</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 capitalize">
                          {relationshipInsights.progressTrend}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Trend</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths & Growth */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Strengths & Growth Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">💪 Your Strengths:</h4>
                      <div className="space-y-1">
                        {relationshipInsights.strongestCategories.map((category, index) => (
                          <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                            • {category}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">🎯 Growth Opportunities:</h4>
                      <div className="space-y-1">
                        {relationshipInsights.growthAreas.map((area, index) => (
                          <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                            • {area}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dr. Marcie Interaction Stats */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-gray-900 dark:text-gray-100">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Dr. Marcie Interaction Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {relationshipInsights.drMarcieInteractionStats.totalInteractions}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Interactions</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {relationshipInsights.drMarcieInteractionStats.averageRating.toFixed(1)}/5
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {relationshipInsights.drMarcieInteractionStats.mostHelpfulContexts.join(', ')}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Most Helpful Contexts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading your relationship insights...
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedSettingsPanel;