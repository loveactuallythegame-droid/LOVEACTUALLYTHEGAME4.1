import { GameSession, GameMechanic } from '@/components/game-engine';

export const gameLibrary: GameSession[] = [
  // Category A: Emotional Connection (SEEN Focus)
  {
    id: 'truth-or-trust',
    title: 'Truth or Trust',
    category: 'Emotional Connection',
    mechanic: 'audio-response',
    difficulty: 2,
    estimatedTime: 5,
    description: 'Share your deepest thoughts through voice messages',
    instructions: [
      'Hold the mic button to record your answer',
      'Speak from the heart - no one-word answers!',
      'Listen to your partner\'s response with full attention'
    ],
    questions: [
      {
        id: 'truth-1',
        type: 'audio-response',
        prompt: 'What\'s one thing you\'ve always wanted to tell me but never found the right moment?',
        mechanic: 'audio-response',
        timeLimit: 120,
        validation: { minLength: 10 }
      },
      {
        id: 'truth-2',
        type: 'audio-response',
        prompt: 'Describe a moment when you felt most connected to me',
        mechanic: 'audio-response',
        timeLimit: 90,
        validation: { minLength: 15 }
      }
    ],
    rewards: {
      points: 50,
      badge: 'Truth Seeker',
      unlock: 'Deep Connection Games'
    }
  },

  {
    id: 'love-language-showdown',
    title: 'Love Language Showdown',
    category: 'Emotional Connection',
    mechanic: 'ranking-reorder',
    difficulty: 1,
    estimatedTime: 3,
    description: 'Discover how you both give and receive love',
    instructions: [
      'Drag and drop the love languages in order of importance',
      'Be honest about what makes you feel most loved',
      'Compare results with your partner'
    ],
    questions: [
      {
        id: 'love-lang-1',
        type: 'ranking-reorder',
        prompt: 'Rank these love languages from most important (1st) to least important (5th) for YOU',
        mechanic: 'ranking-reorder',
        options: [
          'Words of Affirmation',
          'Acts of Service',
          'Receiving Gifts',
          'Quality Time',
          'Physical Touch'
        ]
      }
    ],
    rewards: {
      points: 30,
      badge: 'Love Linguist'
    }
  },

  {
    id: 'memory-lane-quiz',
    title: 'Memory Lane Quiz',
    category: 'Emotional Connection',
    mechanic: 'pin-on-image',
    difficulty: 2,
    estimatedTime: 4,
    description: 'Test your memory of special moments together',
    instructions: [
      'Click on the map where you think the event happened',
      'Be as precise as possible',
      'The closer you are, the higher your score!'
    ],
    questions: [
      {
        id: 'memory-1',
        type: 'pin-on-image',
        prompt: 'Where did we have our first kiss?',
        mechanic: 'pin-on-image',
        media: {
          type: 'image',
          url: '/images/city-map.jpg'
        }
      },
      {
        id: 'memory-2',
        type: 'pin-on-image',
        prompt: 'Where did we first say "I love you"?',
        mechanic: 'pin-on-image',
        media: {
          type: 'image',
          url: '/images/world-map.jpg'
        }
      }
    ],
    rewards: {
      points: 40,
      badge: 'Memory Master'
    }
  },

  {
    id: 'emotional-charades',
    title: 'Emotional Charades',
    category: 'Emotional Connection',
    mechanic: 'video-response',
    difficulty: 3,
    estimatedTime: 6,
    description: 'Act out emotions without words',
    instructions: [
      'Record a 10-second video acting out the emotion',
      'No talking allowed - use only facial expressions',
      'Your partner will guess what emotion you\'re showing'
    ],
    questions: [
      {
        id: 'charades-1',
        type: 'video-response',
        prompt: 'Act out "feeling ignored" without speaking',
        mechanic: 'video-response',
        timeLimit: 10,
        options: ['Feeling ignored', 'Excited', 'Confused', 'Angry']
      },
      {
        id: 'charades-2',
        type: 'video-response',
        prompt: 'Show "feeling appreciated" through expressions',
        mechanic: 'video-response',
        timeLimit: 10,
        options: ['Feeling appreciated', 'Bored', 'Surprised', 'Disappointed']
      }
    ],
    rewards: {
      points: 60,
      badge: 'Emotion Expert'
    }
  },

  {
    id: 'gratitude-cloud',
    title: 'The Gratitude Cloud',
    category: 'Emotional Connection',
    mechanic: 'word-cloud',
    difficulty: 1,
    estimatedTime: 3,
    description: 'Create a beautiful cloud of appreciation',
    instructions: [
      'Type as many positive words about your partner as possible',
      'You have 60 seconds - go fast!',
      'Watch the word cloud grow with your love'
    ],
    questions: [
      {
        id: 'gratitude-1',
        type: 'word-cloud',
        prompt: 'Type positive adjectives that describe your partner',
        mechanic: 'word-cloud',
        timeLimit: 60,
        validation: { minLength: 3, maxLength: 15 }
      }
    ],
    rewards: {
      points: 35,
      badge: 'Gratitude Guru'
    }
  },

  {
    id: 'eye-contact-challenge',
    title: 'Eye Contact Challenge',
    category: 'Emotional Connection',
    mechanic: 'face-detection',
    difficulty: 2,
    estimatedTime: 2,
    description: 'Hold eye contact for 60 seconds',
    instructions: [
      'Look into each other\'s eyes through the camera',
      'Hold contact for 60 seconds without looking away',
      'Feel the deep connection building between you'
    ],
    questions: [
      {
        id: 'eye-contact-1',
        type: 'face-detection',
        prompt: 'Hold eye contact for 60 seconds',
        mechanic: 'face-detection',
        timeLimit: 60
      }
    ],
    rewards: {
      points: 45,
      badge: 'Eye Contact Champion'
    }
  },

  // Category B: Conflict Resolution & Gottman
  {
    id: 'slap-of-truth',
    title: 'The Slap of Truth (Red Flags)',
    category: 'Conflict Resolution',
    mechanic: 'swipe-left-right',
    difficulty: 2,
    estimatedTime: 4,
    description: 'Identify relationship red and green flags',
    instructions: [
      'Swipe right for green flags, left for red flags',
      'Trust your instincts about healthy vs unhealthy behaviors',
      'Discuss any mismatches with your partner'
    ],
    questions: [
      {
        id: 'red-flag-1',
        type: 'swipe-left-right',
        prompt: 'Partner tracks your location without asking',
        mechanic: 'swipe-left-right',
        correctAnswer: 'red-flag'
      },
      {
        id: 'red-flag-2',
        type: 'swipe-left-right',
        prompt: 'Partner remembers your coffee order',
        mechanic: 'swipe-left-right',
        correctAnswer: 'green-flag'
      }
    ],
    rewards: {
      points: 40,
      badge: 'Flag Finder'
    }
  },

  {
    id: 'apology-auction',
    title: 'Apology Auction',
    category: 'Conflict Resolution',
    mechanic: 'slider',
    difficulty: 3,
    estimatedTime: 5,
    description: 'Rate apologies from trash to healing',
    instructions: [
      'Slide to rate how good each apology is',
      '0% = Trash apology, 100% = Healing apology',
      'Learn what makes a real apology'
    ],
    questions: [
      {
        id: 'apology-1',
        type: 'slider',
        prompt: '"I\'m sorry you feel that way"',
        mechanic: 'slider',
        correctAnswer: '20'
      },
      {
        id: 'apology-2',
        type: 'slider',
        prompt: '"I was wrong to raise my voice. I understand it hurt you, and I\'ll work on managing my anger better"',
        mechanic: 'slider',
        correctAnswer: '95'
      }
    ],
    rewards: {
      points: 50,
      badge: 'Apology Expert'
    }
  },

  // Category E: ROMANCE & SPARK
  {
    id: 'six-second-kiss',
    title: 'The 6-Second Kiss',
    category: 'Romance & Spark',
    mechanic: 'face-detection',
    difficulty: 1,
    estimatedTime: 1,
    description: 'Hold a kiss for 6 seconds',
    instructions: [
      'Touch your lips to the screen together',
      'Hold for 6 seconds without breaking contact',
      'Feel the romance spark between you!'
    ],
    questions: [
      {
        id: 'kiss-1',
        type: 'face-detection',
        prompt: 'Hold a 6-second kiss',
        mechanic: 'face-detection',
        timeLimit: 6
      }
    ],
    rewards: {
      points: 25,
      badge: 'Kiss Master'
    }
  },

  {
    id: 'date-night-roulette',
    title: 'Date Night Roulette',
    category: 'Romance & Spark',
    mechanic: 'wheel-spin',
    difficulty: 1,
    estimatedTime: 2,
    description: 'Spin the wheel for date night ideas',
    instructions: [
      'Spin the wheel to choose your effort level',
      'Pick one of three mystery date cards',
      'Commit to doing whatever date you reveal!'
    ],
    questions: [
      {
        id: 'date-1',
        type: 'wheel-spin',
        prompt: 'Spin for your date night category',
        mechanic: 'wheel-spin',
        options: ['Low Effort', 'Medium Effort', 'High Effort']
      }
    ],
    rewards: {
      points: 20,
      badge: 'Date Night Hero'
    }
  },

  {
    id: 'touch-map',
    title: 'Touch Map',
    category: 'Romance & Spark',
    mechanic: 'pin-on-image',
    difficulty: 2,
    estimatedTime: 3,
    description: 'Create a heatmap of your touch preferences',
    instructions: [
      'Tap areas on the body outline',
        'Red = Don\'t touch, Yellow = Maybe, Green = Yes please',
        'Share your maps with each other'
    ],
    questions: [
      {
        id: 'touch-1',
        type: 'pin-on-image',
        prompt: 'Mark your touch preferences on the body map',
        mechanic: 'pin-on-image',
        media: {
          type: 'image',
          url: '/images/body-outline.jpg'
        }
      }
    ],
    rewards: {
      points: 35,
      badge: 'Touch Explorer'
    }
  },

  {
    id: 'foreplay-slider',
    title: 'The Foreplay Slider',
    category: 'Romance & Spark',
    mechanic: 'slider',
    difficulty: 2,
    estimatedTime: 4,
    description: 'Build anticipation together',
    instructions: [
      'Set your current arousal level on the slider',
      'Your partner gets 3 attempts to raise it',
      'Feel the tension build between you!'
    ],
    questions: [
      {
        id: 'foreplay-1',
        type: 'slider',
        prompt: 'Set your current arousal level (0-100%)',
        mechanic: 'slider',
        validation: { minLength: 1 }
      }
    ],
    rewards: {
      points: 40,
      badge: 'Anticipation Builder'
    }
  },

  // Game Show Modes
  {
    id: 'couples-jeopardy',
    title: 'Couple\'s Jeopardy',
    category: 'Game Show',
    mechanic: 'matrix',
    difficulty: 3,
    estimatedTime: 8,
    description: 'Test your relationship knowledge',
    instructions: [
      'Choose a category and point value',
      'Answer in the form of a question',
      'Highest score wins bragging rights!'
    ],
    questions: [
      {
        id: 'jeopardy-1',
        type: 'matrix',
        prompt: 'Category: Firsts - $200: This is where we had our first date',
        mechanic: 'matrix',
        correctAnswer: 'What is [Coffee Shop Name]?'
      },
      {
        id: 'jeopardy-2',
        type: 'matrix',
        prompt: 'Category: Preferences - $400: This is your partner\'s favorite movie',
        mechanic: 'matrix',
        correctAnswer: 'What is [Movie Title]?'
      }
    ],
    rewards: {
      points: 80,
      badge: 'Jeopardy Champion'
    }
  },

  {
    id: 'newlywed-game',
    title: 'The Newlywed Game',
    category: 'Game Show',
    mechanic: 'fill-blanks',
    difficulty: 2,
    estimatedTime: 6,
    description: 'See how well you really know each other',
    instructions: [
      'Answer questions about your partner secretly',
      'Reveal answers simultaneously',
      'Matches score points, mismatches get roasted!'
    ],
    questions: [
      {
        id: 'newlywed-1',
        type: 'fill-blanks',
        prompt: 'Who is the better driver?',
        mechanic: 'fill-blanks',
        options: ['Me', 'My Partner', 'We\'re equally good', 'We\'re equally bad']
      },
      {
        id: 'newlywed-2',
        type: 'fill-blanks',
        prompt: 'Who takes longer to get ready?',
        mechanic: 'fill-blanks',
        options: ['Me', 'My Partner', 'About the same']
      }
    ],
    rewards: {
      points: 60,
      badge: 'Newlywed Expert'
    }
  }
];

// Game categories for filtering
export const gameCategories = [
  'All Games',
  'Emotional Connection',
  'Conflict Resolution',
  'Romance & Spark',
  'Game Show',
  'Creative Chaos',
  'Deep Healing'
];

// Get games by category
export const getGamesByCategory = (category: string): GameSession[] => {
  if (category === 'All Games') return gameLibrary;
  return gameLibrary.filter(game => game.category === category);
};

// Get games by difficulty
export const getGamesByDifficulty = (difficulty: 1 | 2 | 3 | 4 | 5): GameSession[] => {
  return gameLibrary.filter(game => game.difficulty === difficulty);
};

// Get random games for daily rotation
export const getRandomGames = (count: number = 5): GameSession[] => {
  const shuffled = [...gameLibrary].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get recommended games based on relationship stage
export const getRecommendedGames = (stage: 'new' | 'established' | 'struggling' | 'strong'): GameSession[] => {
  switch (stage) {
    case 'new':
      return gameLibrary.filter(game => 
        game.difficulty <= 2 && 
        ['Emotional Connection', 'Romance & Spark'].includes(game.category)
      );
    case 'established':
      return gameLibrary.filter(game => game.difficulty <= 3);
    case 'struggling':
      return gameLibrary.filter(game => 
        ['Conflict Resolution', 'Emotional Connection'].includes(game.category)
      );
    case 'strong':
      return gameLibrary.filter(game => game.difficulty >= 3);
    default:
      return gameLibrary;
  }
};

export default gameLibrary;