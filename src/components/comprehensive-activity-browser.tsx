'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Clock, 
  Star, 
  Brain, 
  Heart, 
  Gamepad2,
  FileText,
  Target,
  Trophy,
  Play,
  CheckCircle
} from 'lucide-react';
import { EnhancedDrMarcieAvatar } from '@/components/enhanced-dr-marcie-avatar';
import { COMPREHENSIVE_ACTIVITY_SYSTEM, ComprehensiveActivityManager } from '@/lib/comprehensive-activity-system';
import type { ActivityCategory, ActivitySubcategory, ActivityTemplate } from '@/lib/comprehensive-activity-system';
import type { DrMarciePersonality } from '@/lib/dr-marcie-ai';

interface ComprehensiveActivityBrowserProps {
  personalityLevel: DrMarciePersonality;
  coupleBackstory?: string;
  onActivitySelect: (activity: ActivityTemplate, category: string, subcategory: string) => void;
}

const ComprehensiveActivityBrowser: React.FC<ComprehensiveActivityBrowserProps> = ({
  personalityLevel,
  coupleBackstory,
  onActivitySelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredActivities, setFilteredActivities] = useState<ActivityTemplate[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [drMarcieMessage, setDrMarcieMessage] = useState<string>('');

  useEffect(() => {
    generateDrMarcieWelcome();
    updateFilteredActivities();
  }, [selectedCategory, selectedSubcategory, searchTerm, filterType, filterDifficulty]);

  const generateDrMarcieWelcome = (): void => {
    const messages = [
      "Welcome to the activity vault! I've got 1,400 relationship-strengthening exercises ready for you. What kind of growth are you in the mood for today?",
      "Look at all these beautiful ways to connect! Each category offers a different path to deeper love. Where shall we start your journey?",
      "Time to choose your relationship adventure! From emotional connection to creative chaos - every path leads to stronger love.",
      "Welcome to relationship boot camp! Don't worry, it's the fun kind where everyone wins and love gets stronger. Pick your challenge!",
      "Ah, the activity library! Seven categories of relationship magic await. Each one designed to bring you closer together in different ways."
    ];
    setDrMarcieMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  const updateFilteredActivities = (): void => {
    let activities: ActivityTemplate[] = [];

    if (selectedCategory && selectedSubcategory) {
      const subcategory = ComprehensiveActivityManager.getSubcategoryById(selectedCategory, selectedSubcategory);
      activities = subcategory?.activities || [];
    } else if (selectedCategory) {
      const category = ComprehensiveActivityManager.getCategoryById(selectedCategory);
      category?.subcategories.forEach(sub => {
        activities.push(...sub.activities);
      });
    } else {
      // Get all activities
      COMPREHENSIVE_ACTIVITY_SYSTEM.forEach(category => {
        category.subcategories.forEach(subcategory => {
          activities.push(...subcategory.activities);
        });
      });
    }

    // Apply filters
    if (filterType !== 'all') {
      activities = activities.filter(activity => activity.type === filterType);
    }

    if (filterDifficulty !== 'all') {
      const subcategories = COMPREHENSIVE_ACTIVITY_SYSTEM
        .flatMap(cat => cat.subcategories)
        .filter(sub => sub.difficulty === parseInt(filterDifficulty));
      activities = activities.filter(activity => 
        subcategories.some(sub => sub.activities.some(act => act.id === activity.id))
      );
    }

    // Apply search
    if (searchTerm) {
      activities = activities.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredActivities(activities);
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <Brain className="w-4 h-4" />;
      case 'game': return <Gamepad2 className="w-4 h-4" />;
      case 'challenge': return <Target className="w-4 h-4" />;
      case 'reflection': return <FileText className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: number): string => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-blue-500',
      3: 'bg-yellow-500', 
      4: 'bg-orange-500',
      5: 'bg-red-500'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryIcon = (categoryId: string) => {
    const icons = {
      'emotional_connection': <Heart className="w-5 h-5" />,
      'psychology_games': <Brain className="w-5 h-5" />,
      'creative_chaos': <Star className="w-5 h-5" />,
      'infidelity_recovery': <Trophy className="w-5 h-5" />,
      'communication_mastery': <Target className="w-5 h-5" />,
      'intimacy_romance': <Heart className="w-5 h-5" />,
      'life_partnership': <CheckCircle className="w-5 h-5" />
    };
    return icons[categoryId as keyof typeof icons] || <Star className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Dr. Marcie Welcome */}
        <div className="flex justify-center mb-6">
          <EnhancedDrMarcieAvatar
            personalityLevel={personalityLevel}
            coupleBackstory={coupleBackstory}
            className="animate__animated animate__fadeIn"
            hostingContext="activity_browser"
            autoGreeting={true}
            initialMessage={drMarcieMessage}
            showSpeechBubble={true}
          />
        </div>

        {/* Header */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-gray-900 dark:text-gray-100">
              1,400 Comprehensive Activities
            </CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
              7 Categories × 10 Subcategories × 20 Activities - Every single one hosted by Dr. Marcie!
            </p>
          </CardHeader>
        </Card>

        {/* Filters and Search */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {COMPREHENSIVE_ACTIVITY_SYSTEM.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Subcategory Filter */}
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory} disabled={!selectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subcategories</SelectItem>
                  {selectedCategory && 
                    ComprehensiveActivityManager.getCategoryById(selectedCategory)?.subcategories.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="quiz">Quizzes (350)</SelectItem>
                  <SelectItem value="game">Games (350)</SelectItem>
                  <SelectItem value="challenge">Challenges (350)</SelectItem>
                  <SelectItem value="reflection">Reflections (350)</SelectItem>
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulty Levels</SelectItem>
                  <SelectItem value="1">Level 1 (Beginner)</SelectItem>
                  <SelectItem value="2">Level 2 (Easy)</SelectItem>
                  <SelectItem value="3">Level 3 (Moderate)</SelectItem>
                  <SelectItem value="4">Level 4 (Advanced)</SelectItem>
                  <SelectItem value="5">Level 5 (Expert)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredActivities.length} activities
            </div>
          </CardContent>
        </Card>

        {/* Category Overview (when no category selected) */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPREHENSIVE_ACTIVITY_SYSTEM.map((category) => (
              <Card key={category.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className={`bg-gradient-to-r ${category.color} text-white rounded-t-lg`}>
                  <CardTitle className="flex items-center text-lg">
                    {getCategoryIcon(category.id)}
                    <span className="ml-2">{category.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>📊 10 Subcategories</div>
                    <div>🎯 200 Total Activities</div>
                    <div>⏰ ~{Math.round(category.subcategories.reduce((sum, sub) => sum + sub.estimatedTime, 0) / category.subcategories.length)} min average</div>
                  </div>

                  <Button
                    onClick={() => setSelectedCategory(category.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Explore Category
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Subcategory Overview (when category selected but no subcategory) */}
        {selectedCategory && !selectedSubcategory && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {ComprehensiveActivityManager.getCategoryById(selectedCategory)?.name} Subcategories
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                10 subcategories with 20 activities each = 200 total activities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ComprehensiveActivityManager.getCategoryById(selectedCategory)?.subcategories.map((subcategory) => (
                <Card key={subcategory.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg text-gray-900 dark:text-gray-100">
                      <span>{subcategory.name}</span>
                      <Badge className={`${getDifficultyColor(subcategory.difficulty)} text-white text-xs`}>
                        Level {subcategory.difficulty}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subcategory.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        ~{subcategory.estimatedTime}m
                      </div>
                      <div>20 Activities</div>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-xs">
                      <Badge variant="outline" className="text-center">5 Quizzes</Badge>
                      <Badge variant="outline" className="text-center">5 Games</Badge>
                      <Badge variant="outline" className="text-center">5 Challenges</Badge>
                      <Badge variant="outline" className="text-center">5 Reflections</Badge>
                    </div>

                    <Button
                      onClick={() => setSelectedSubcategory(subcategory.id)}
                      className="w-full"
                      variant="outline"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      View 20 Activities
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Activity List (when showing filtered activities) */}
        {(selectedSubcategory || searchTerm || filterType !== 'all' || filterDifficulty !== 'all') && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {selectedSubcategory 
                  ? `${ComprehensiveActivityManager.getSubcategoryById(selectedCategory, selectedSubcategory)?.name} Activities`
                  : 'Filtered Activities'
                }
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredActivities.length} activities found - Dr. Marcie hosts every single one!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActivities.map((activity, index) => (
                <Card key={`${activity.id}_${index}`} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base text-gray-900 dark:text-gray-100">
                      <span className="flex items-center">
                        {getActivityTypeIcon(activity.type)}
                        <span className="ml-2">{activity.title}</span>
                      </span>
                      <Badge className="text-xs capitalize">{activity.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        ~{Math.round(15 + index)} min
                      </div>
                      <div className="flex items-center">
                        <Trophy className="w-3 h-3 mr-1" />
                        {activity.pointValue} pts
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {activity.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-400 italic">
                      "Dr. Marcie: {activity.drMarcieIntro.slice(0, 60)}..."
                    </div>

                    <Button
                      onClick={() => onActivitySelect(activity, selectedCategory, selectedSubcategory)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start with Dr. Marcie
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Activity Statistics Summary */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-gray-900 dark:text-gray-100">
              Complete Activity System Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">1,400</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Activities</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-pink-600">350</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Interactive Quizzes</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">350</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fun Games</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">700</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Challenges + Reflections</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensiveActivityBrowser;