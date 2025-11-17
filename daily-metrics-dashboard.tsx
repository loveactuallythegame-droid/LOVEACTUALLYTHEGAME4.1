'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Heart, TrendingUp, TrendingDown, Minus, Star, Target, Award, Calendar, AlertTriangle, CheckCircle, Brain, Activity, Zap, Users, Clock, BarChart3, TrendingDown as TrendingDownIcon } from 'lucide-react';
import { EnhancedDrMarcieAvatar } from './enhanced-dr-marcie-avatar';
import { DrMarcieVoiceService } from './dr-marcie-voice-service';

interface DailyMetric {
  id: string;
  date: string;
  trustLevel: number;
  loveLevel: number;
  connectionLevel: number;
  trustContext?: string;
  loveContext?: string;
  connectionContext?: string;
  significantMoments: string[];
  wordsOfAffirmation: number;
  actsOfService: number;
  receivingGifts: number;
  qualityTime: number;
  physicalTouch: number;
  communicationQuality: number;
  intimacyLevel: number;
  conflictResolution: number;
}

interface MetricAnalytics {
  averages: {
    trust: number;
    love: number;
    connection: number;
  };
  trends: {
    trust: 'improving' | 'declining' | 'stable';
    love: 'improving' | 'declining' | 'stable';
    connection: 'improving' | 'declining' | 'stable';
  };
  streaks: {
    current: number;
    longest: number;
  };
  insights: string[];
  predictivePatterns: {
    trustPrediction: number;
    lovePrediction: number;
    connectionPrediction: number;
    confidenceScore: number;
  };
  earlyWarnings: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    warningIndicators: string[];
    recommendedActions: string[];
  };
  correlationAnalysis: {
    activityCorrelations: any;
    loveLanguageEffectiveness: any;
    communicationPatterns: any;
  };
  partnerComparison: {
    discrepancies: {
      trust: number;
      love: number;
      connection: number;
    };
    synchronizationRate: number;
    discussionTopics: string[];
  };
  celebrationTriggers: {
    improvements: string[];
    milestones: string[];
    recommendations: string[];
  };
}

interface DailyMetricsDashboardProps {
  userId: string;
  coupleId: string;
  userName: string;
}

export function DailyMetricsDashboard({ userId, coupleId, userName }: DailyMetricsDashboardProps) {
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);
  const [analytics, setAnalytics] = useState<MetricAnalytics | null>(null);
  const [todaysMetric, setTodaysMetric] = useState<DailyMetric | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [partnerMetrics, setPartnerMetrics] = useState<DailyMetric[]>([]);
  const [discrepancyAnalysis, setDiscrepancyAnalysis] = useState<any>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<any>(null);
  const [viewPeriod, setViewPeriod] = useState('30');

  // Form state for today's metrics
  const [trustLevel, setTrustLevel] = useState(5);
  const [loveLevel, setLoveLevel] = useState(5);
  const [connectionLevel, setConnectionLevel] = useState(5);
  const [trustContext, setTrustContext] = useState('');
  const [loveContext, setLoveContext] = useState('');
  const [connectionContext, setConnectionContext] = useState('');
  const [significantMoments, setSignificantMoments] = useState('');
  const [loveLanguageScores, setLoveLanguageScores] = useState({
    wordsOfAffirmation: 0,
    actsOfService: 0,
    receivingGifts: 0,
    qualityTime: 0,
    physicalTouch: 0,
  });
  const [qualityScores, setQualityScores] = useState({
    communicationQuality: 5,
    intimacyLevel: 5,
    conflictResolution: 5,
  });

  useEffect(() => {
    fetchMetrics();
    checkTodaysMetric();
  }, [userId, viewPeriod]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/daily-metrics?userId=${userId}&period=${viewPeriod}`);
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.metrics);
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const checkTodaysMetric = async () => {
    const today = new Date().toISOString().split('T')[0];
    const existingMetric = metrics.find(m => m.date === today);
    
    if (existingMetric) {
      setTodaysMetric(existingMetric);
      setTrustLevel(existingMetric.trustLevel);
      setLoveLevel(existingMetric.loveLevel);
      setConnectionLevel(existingMetric.connectionLevel);
      setTrustContext(existingMetric.trustContext || '');
      setLoveContext(existingMetric.loveContext || '');
      setConnectionContext(existingMetric.connectionContext || '');
      setSignificantMoments(existingMetric.significantMoments.join('\n'));
    }
  };

  const submitDailyMetric = async () => {
    setIsSubmitting(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch('/api/daily-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          coupleId,
          date: today,
          trustLevel,
          loveLevel,
          connectionLevel,
          trustContext: trustContext.trim(),
          loveContext: loveContext.trim(),
          connectionContext: connectionContext.trim(),
          significantMoments: significantMoments.split('\n').filter(m => m.trim()),
          loveLanguageBreakdown: loveLanguageScores,
          qualityAssessments: qualityScores,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setTodaysMetric(data.metric);
        await fetchMetrics();
        
        // Generate Dr. Marcie response based on metrics
        generateMetricsResponse();
      }
    } catch (error) {
      console.error('Failed to submit daily metric:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateMetricsResponse = () => {
    const avgScore = (trustLevel + loveLevel + connectionLevel) / 3;
    let message = "";

    if (avgScore >= 8) {
      message = `Outstanding day, ${userName}! These metrics are showing some serious relationship strength. Trust at ${trustLevel}, love at ${loveLevel}, and connection at ${connectionLevel}? That's what I call relationship goals! Keep this energy going! 🌟`;
    } else if (avgScore >= 6) {
      message = `Solid day, ${userName}! Your trust, love, and connection levels are looking healthy. There's always room for improvement, but you're definitely on the right track. What can we do to push those numbers even higher? 💪`;
    } else {
      message = `Hmm, ${userName}, today's numbers are telling a story we need to address. With trust at ${trustLevel}, love at ${loveLevel}, and connection at ${connectionLevel}, it looks like there's some work to be done. But hey, recognizing it is the first step! Let's turn this around! 💕`;
    }

    // Play Dr. Marcie's voice response
    DrMarcieVoiceService.speak(message, 'daily_metrics');
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatChartData = () => {
    return metrics.slice().reverse().map(metric => ({
      date: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      trust: metric.trustLevel,
      love: metric.loveLevel,
      connection: metric.connectionLevel,
      average: Math.round((metric.trustLevel + metric.loveLevel + metric.connectionLevel) / 3),
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Dr. Marcie Header */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4">
            <EnhancedDrMarcieAvatar expression="happy" />
            <div>
              <CardTitle className="text-2xl text-purple-800">Daily Love Dashboard</CardTitle>
              <CardDescription className="text-lg text-purple-600">
                Track your relationship health with Dr. Marcie's guidance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Today's Check-in
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="partner-sync" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Partner Sync
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Trust Level */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trust Level</CardTitle>
                  {getTrendIcon(analytics.trends.trust)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.averages.trust}/10</div>
                  <p className={`text-xs ${getTrendColor(analytics.trends.trust)}`}>
                    {analytics.trends.trust === 'stable' ? 'Stable' : 
                     analytics.trends.trust === 'improving' ? '+0.5 from last period' : 
                     '-0.5 from last period'}
                  </p>
                  <Progress value={analytics.averages.trust * 10} className="mt-2" />
                </CardContent>
              </Card>

              {/* Love Level */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Love Level</CardTitle>
                  {getTrendIcon(analytics.trends.love)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.averages.love}/10</div>
                  <p className={`text-xs ${getTrendColor(analytics.trends.love)}`}>
                    {analytics.trends.love === 'stable' ? 'Stable' : 
                     analytics.trends.love === 'improving' ? '+0.5 from last period' : 
                     '-0.5 from last period'}
                  </p>
                  <Progress value={analytics.averages.love * 10} className="mt-2" />
                </CardContent>
              </Card>

              {/* Connection Level */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Connection Level</CardTitle>
                  {getTrendIcon(analytics.trends.connection)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.averages.connection}/10</div>
                  <p className={`text-xs ${getTrendColor(analytics.trends.connection)}`}>
                    {analytics.trends.connection === 'stable' ? 'Stable' : 
                     analytics.trends.connection === 'improving' ? '+0.5 from last period' : 
                     '-0.5 from last period'}
                  </p>
                  <Progress value={analytics.averages.connection * 10} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Relationship Metrics Over Time</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={viewPeriod === '7' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewPeriod('7')}
                >
                  7 Days
                </Button>
                <Button
                  variant={viewPeriod === '30' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewPeriod('30')}
                >
                  30 Days
                </Button>
                <Button
                  variant={viewPeriod === '90' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewPeriod('90')}
                >
                  90 Days
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="trust" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="love" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="connection" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Streaks */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{analytics.streaks.current}</div>
                  <p className="text-sm text-gray-600">consecutive days of good metrics (≥7 in all categories)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Longest Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{analytics.streaks.longest}</div>
                  <p className="text-sm text-gray-600">your personal best</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Today's Check-in Tab */}
        <TabsContent value="today" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>
                Rate your relationship experience on a scale of 1-10
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trust Level */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Trust Level ({trustLevel}/10)</Label>
                <Slider
                  value={[trustLevel]}
                  onValueChange={(value) => setTrustLevel(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <Textarea
                  placeholder="What influenced your trust level today? (optional)"
                  value={trustContext}
                  onChange={(e) => setTrustContext(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Love Level */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Love Level ({loveLevel}/10)</Label>
                <Slider
                  value={[loveLevel]}
                  onValueChange={(value) => setLoveLevel(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <Textarea
                  placeholder="How loved did you feel today? What contributed to this feeling? (optional)"
                  value={loveContext}
                  onChange={(e) => setLoveContext(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Connection Level */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Connection Level ({connectionLevel}/10)</Label>
                <Slider
                  value={[connectionLevel]}
                  onValueChange={(value) => setConnectionLevel(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <Textarea
                  placeholder="How emotionally close did you feel to your partner today? (optional)"
                  value={connectionContext}
                  onChange={(e) => setConnectionContext(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Significant Moments */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Significant Moments</Label>
                <Textarea
                  placeholder="List any special moments, conversations, or experiences from today (one per line)"
                  value={significantMoments}
                  onChange={(e) => setSignificantMoments(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={submitDailyMetric}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {isSubmitting ? 'Saving...' : todaysMetric ? 'Update Today\'s Metrics' : 'Submit Today\'s Metrics'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relationship Health Trends</CardTitle>
              <CardDescription>
                Analyze your relationship patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={formatChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="trust" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="love" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="connection" stackId="3" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {analytics && analytics.insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Dr. Marcie's Insights
                </CardTitle>
                <CardDescription>
                  Personalized relationship guidance based on your metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="text-purple-600 font-semibold">💡</div>
                      <p className="text-sm text-purple-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weekly Goals */}
          <Card>
            <CardHeader>
              <CardTitle>This Week's Relationship Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span>Maintain daily metric tracking streak</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 flex-shrink-0"></div>
                  <span>Complete at least 2 romance redemption games</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-purple-500 flex-shrink-0"></div>
                  <span>Have 3 meaningful conversations (15+ minutes each)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}