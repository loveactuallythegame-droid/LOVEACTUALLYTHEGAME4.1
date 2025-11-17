# 💕 Love, Actually... The Game
## How About We DON'T Break Up?

**Interactive couples therapy gaming platform with Dr. Marcie Liss - Transform relationship healing into an engaging, competitive experience.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.8-2D3748)](https://www.prisma.io/)
[![AI Powered](https://img.shields.io/badge/AI-Powered-purple)](https://openai.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

---

## 🎭 **Meet Dr. Marcie Liss - Your AI Couples Therapist**

Dr. Marcie is an omnipresent AI therapist who hosts every interaction, provides real-time insights, and guides couples through their healing journey with professional expertise, warmth, and just the right amount of sass.

### **🌟 Key Features:**
- **3 Personality Levels** - Choose how direct and sassy you want Dr. Marcie to be
- **Voice Synthesis** - Hear Dr. Marcie speak with emotional inflection using ElevenLabs
- **Always Present** - Persistent avatar that guides every activity and interaction
- **Professional Analysis** - AI-powered insights based on relationship psychology

---

## 🎮 **Game Features Overview**

### **🎯 1,400 Therapeutic Activities**
**7 Core Categories × 10 Subcategories × 20 Activities Each**

- **🧡 Emotional Connection** (200 activities) - SEEN Method based
- **🧠 Psychology Games** (200 activities) - Gottman Method & Research
- **🎨 Creative Chaos** (200 activities) - Fun & Connection Building
- **💔 Infidelity Recovery** (200 activities) - Specialized Healing Track
- **💬 Communication Mastery** (200 activities) - Advanced Communication Skills
- **🌹 Intimacy & Romance** (200 activities) - Physical, Emotional & Spiritual Connection
- **🏡 Life Partnership** (200 activities) - Building Strong Life Partnership

### **🚨 SOS Fight Solver - 3-Phase Conflict Resolution**
- **Phase 1**: Immediate separation into private "writing booths"
- **Phase 2**: AI-powered clarifying questions with emotional analysis
- **Phase 3**: Shared debrief with Dr. Marcie's professional assessment
- **Compliance Engine**: Focus lock system ensures participation
- **Repair Games**: Tailored mini-games for post-conflict healing

### **💝 Romance Redemption Section**
**15 Evidence-Based Romance Games:**
- **Connection Depth**: "How Well Do You REALLY Know Me?", "Memory Lane Championship"
- **Romance Revival**: "Surprise Factor", "Love Note Olympics", "Date Night Design"
- **Repair & Reconnection**: "Forgiveness Foundations", "Trust Rebuilding Blocks"

### **📊 Daily Relationship Metrics**
- **Trust Level Tracker** (1-10 daily rating with context)
- **Love Level Monitor** (feeling loved + love language analysis)
- **Connection Level Gauge** (emotional closeness + intimacy assessment)
- **Predictive Analytics** with early warning systems

### **🏆 Competitive Gaming System**
- **Real-time leaderboards** for individuals and couples
- **Achievement badges** and milestone celebrations
- **Point system** for activity completion, effort, and growth
- **Weekly/monthly tournaments** and challenges

### **⚙️ Advanced Settings & Memory Access**
- **Dr. Marcie Personality Control** (3 levels with live preview)
- **Emotional Dossier Access** (complete relationship history)
- **Pattern Analysis** and progress visualization
- **Privacy Controls** and data export options

---

## 🛠 **Technical Architecture**

### **Frontend Stack**
- **Next.js 14** with App Router and Server Components
- **TypeScript 5.3** with strict type safety
- **React 18** with modern hooks and patterns
- **Tailwind CSS** with custom therapy-focused design system
- **shadcn/ui** component library with accessibility features
- **Framer Motion** for smooth animations and transitions

### **Backend & API**
- **Next.js API Routes** with RESTful design
- **Prisma 5** ORM with PostgreSQL database
- **Server Actions** for form handling and mutations
- **Middleware** for authentication and security
- **Rate limiting** and input validation

### **AI Integration**
- **OpenAI GPT-4** for conversation analysis and response generation
- **ElevenLabs** text-to-speech for Dr. Marcie's voice
- **Advanced pattern recognition** for relationship insights
- **Sentiment analysis** and emotional intelligence
- **Predictive modeling** for relationship trajectory

### **Database Schema**
```prisma
// Core Models
model User { ... }
model DailyMetric { ... }
model ActivityCompletion { ... }
model RomanceRedemption { ... }
model ConflictResolution { ... }
model EmotionalDossier { ... }
model CompetitionStats { ... }
```

### **Security & Privacy**
- **End-to-end encryption** for sensitive relationship data
- **GDPR compliant** data handling and export
- **Secure authentication** with session management
- **Privacy controls** for data sharing and visibility
- **Audit logging** for all user interactions

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- PostgreSQL database
- OpenAI API key
- ElevenLabs API key

### **Installation**

```bash
# Clone the repository
git clone https://github.com/Meli2112/love-actually-game.git
cd love-actually-game

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and database URL

# Set up the database
npm run db:generate
npm run db:push
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### **Environment Variables**

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/love_actually_game"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
ELEVENLABS_API_KEY="your-elevenlabs-api-key"

# App Configuration
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Analytics
VERCEL_ANALYTICS_ID="your-analytics-id"
```

---

## 📖 **Usage Guide**

### **For Couples**
1. **Sign Up** - Both partners create accounts and link them
2. **Meet Dr. Marcie** - Choose her personality level (1-3)
3. **Daily Check-ins** - Rate trust, love, and connection levels
4. **Explore Activities** - Browse 1,400+ therapeutic exercises
5. **Resolve Conflicts** - Use the SOS Fight Solver when needed
6. **Track Progress** - View analytics and celebrate milestones

### **For Therapists**
- **Professional Dashboard** - Monitor multiple couples' progress
- **Customizable Activities** - Adapt exercises for specific needs
- **Progress Reports** - Generate comprehensive relationship assessments
- **Integration Tools** - Export data for clinical use

---

## 🔬 **Scientific Foundation**

### **Evidence-Based Approaches**
- **Gottman Method** - Seven Principles for Making Marriage Work
- **Emotionally Focused Therapy (EFT)** - Sue Johnson's attachment-based approach
- **SEEN Method** - Safety, Emotional validation, Empathy, Needs identification
- **Nonviolent Communication** - Marshall Rosenberg's compassionate communication

### **Research Integration**
- **Attachment Theory** - Secure, anxious, avoidant, and disorganized patterns
- **Love Languages** - Gary Chapman's 5 love languages framework
- **Conflict Resolution** - Research-backed de-escalation techniques
- **Positive Psychology** - Strength-based relationship building

---

## 🏗 **Project Structure**

```
love-actually-game/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes (23 endpoints)
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── dashboard.tsx     # Main dashboard
│   │   ├── enhanced-sos-fight-solver.tsx
│   │   ├── enhanced-romance-redemption.tsx
│   │   └── ...               # 25+ components
│   ├── lib/                  # Utility libraries
│   │   ├── dr-marcie-ai.ts   # AI personality system
│   │   ├── omnipresent-dr-marcie.ts
│   │   ├── comprehensive-1400-activities.ts
│   │   └── ...               # 8 core libraries
│   └── hooks/                # Custom React hooks
├── prisma/                   # Database schema and migrations
├── .github/                  # GitHub workflows and templates
├── docs/                     # Additional documentation
└── tests/                    # Test files
```

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Standards**
- **TypeScript strict mode** - No implicit any, complete type safety
- **ESLint + Prettier** - Consistent code formatting
- **Jest testing** - Unit and integration tests
- **Accessibility** - WCAG 2.1 AA compliance
- **Performance** - Lighthouse score > 90

---

## 📊 **Metrics & Analytics**

### **Relationship Health Indicators**
- **Daily metric trends** (trust, love, connection)
- **Activity completion rates** and engagement scores
- **Conflict resolution success** and time to resolution
- **Communication pattern analysis** and improvement tracking

### **Platform Analytics**
- **User engagement** - Session duration, return rates
- **Feature usage** - Most popular activities and tools
- **Success metrics** - Relationship satisfaction improvements
- **AI effectiveness** - Dr. Marcie response quality ratings

---

## 🌟 **Roadmap**

### **Phase 1: Core Platform** ✅
- ✅ 1,400 therapeutic activities
- ✅ Dr. Marcie AI with 3 personality levels
- ✅ SOS Fight Solver with 3-phase resolution
- ✅ Daily metrics tracking and analytics
- ✅ Romance redemption games with evidence upload

### **Phase 2: Advanced Features** 🚧
- 🔄 Group therapy sessions for multiple couples
- 🔄 Therapist dashboard for professional monitoring
- 🔄 Mobile app with push notifications
- 🔄 Integration with wearable devices for biometric data
- 🔄 Advanced AI conversation analysis

### **Phase 3: Platform Expansion** 📋
- 📋 White-label solution for therapy practices
- 📋 Multi-language support (Spanish, French, German)
- 📋 Family therapy extensions (parent-child, siblings)
- 📋 Research partnership integration
- 📋 Telehealth video session integration

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Dr. John Gottman** - Research foundation for relationship psychology
- **Dr. Sue Johnson** - Emotionally Focused Therapy principles
- **OpenAI** - GPT-4 language model for conversation analysis
- **ElevenLabs** - Text-to-speech technology for Dr. Marcie's voice
- **Vercel** - Deployment platform and hosting
- **Prisma** - Database ORM and management

---

## 📞 **Support & Contact**

- **Documentation**: [Full Documentation](https://github.com/Meli2112/love-actually-game/wiki)
- **Issues**: [Report Bug](https://github.com/Meli2112/love-actually-game/issues)
- **Discussions**: [Community Forum](https://github.com/Meli2112/love-actually-game/discussions)
- **Email**: support@loveactuallygame.com

---

## 🎯 **Mission Statement**

**"We believe every relationship deserves a fighting chance. Through gamification, AI-powered therapy, and evidence-based interventions, we're transforming how couples heal, grow, and thrive together."**

---

**Built with ❤️ for couples who choose love over letting go.**

**© 2024 Love, Actually... The Game. All rights reserved.**