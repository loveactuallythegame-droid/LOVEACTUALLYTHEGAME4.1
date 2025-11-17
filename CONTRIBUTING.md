# 🤝 Contributing to Love, Actually... The Game

Thank you for your interest in contributing to **Love, Actually... The Game**! We're building the world's most engaging couples therapy gaming platform, and we'd love your help making it even better.

## 🌟 Ways to Contribute

### 🐛 **Bug Reports**
- Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include detailed steps to reproduce
- Provide screenshots or videos when helpful
- Test on multiple devices/browsers if possible

### 💡 **Feature Requests**
- Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)
- Explain the problem your feature would solve
- Consider the therapeutic value and user experience
- Think about how it fits with Dr. Marcie's personality

### 🔧 **Code Contributions**
- Fix bugs, improve performance, or add new features
- Follow our coding standards and best practices
- Include tests for new functionality
- Update documentation as needed

### 📚 **Documentation**
- Improve README, guides, or code comments
- Create tutorials or examples
- Translate content (future multilingual support)
- Review and suggest improvements

### 🎭 **Content Creation**
- Suggest new therapeutic activities or games
- Contribute Dr. Marcie dialogue and responses
- Create relationship assessment questions
- Design achievement badges and celebrations

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- PostgreSQL database
- Git knowledge
- Basic understanding of Next.js and React

### **Development Setup**

1. **Fork & Clone**
   ```bash
   # Fork the repository on GitHub, then:
   git clone https://github.com/YOURUSERNAME/love-actually-game.git
   cd love-actually-game
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys and database URL
   ```

4. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Verify Setup**
   - Open [http://localhost:3000](http://localhost:3000)
   - Create a test account and explore the platform
   - Run tests: `npm test`

---

## 📋 Development Workflow

### **Branch Strategy**
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Individual feature development
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### **Pull Request Process**

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

2. **Make Your Changes**
   - Write clean, well-documented code
   - Follow our coding standards
   - Add tests for new functionality
   - Update documentation

3. **Test Your Changes**
   ```bash
   npm run lint          # Code linting
   npm run type-check    # TypeScript checking
   npm test              # Run test suite
   npm run build         # Verify build works
   ```

4. **Commit with Conventional Commits**
   ```bash
   git commit -m "feat: add new romance redemption game"
   git commit -m "fix: resolve Dr. Marcie voice synthesis issue"
   git commit -m "docs: update API documentation"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/amazing-new-feature
   ```
   - Create pull request on GitHub
   - Use our PR template
   - Link related issues
   - Request review from maintainers

### **Commit Message Convention**
We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

---

## 🎯 Coding Standards

### **TypeScript Guidelines**
- **Strict typing** - No implicit `any`, explicit types for all variables
- **Interface definitions** - Use interfaces for object types
- **Type imports** - Use `import type` for type-only imports
- **Error handling** - Proper error boundaries and try-catch blocks

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const createUser = (profile: UserProfile): Promise<User> => {
  // Implementation
};

// ❌ Bad
const createUser = (profile: any) => {
  // Implementation
};
```

### **React Component Guidelines**
- **Functional components** with hooks
- **Props interfaces** for all components
- **Error boundaries** for robust UX
- **Accessibility** - ARIA labels, semantic HTML
- **Performance** - Memoization where appropriate

```typescript
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
};
```

### **API Route Guidelines**
- **RESTful design** - Proper HTTP methods and status codes
- **Input validation** - Use Zod for request validation
- **Error handling** - Consistent error responses
- **Rate limiting** - Prevent abuse
- **Documentation** - Clear API documentation

```typescript
// ✅ Good API Route
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateUserSchema.parse(body);
    
    // Process request
    const user = await createUser(validatedData);
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### **Database Guidelines**
- **Prisma best practices** - Proper relations and constraints
- **Data validation** - Client and server-side validation
- **Transactions** - Use transactions for complex operations
- **Migrations** - Proper migration management
- **Security** - Parameterized queries, input sanitization

### **Dr. Marcie AI Guidelines**
- **Personality consistency** - Maintain character across interactions
- **Therapeutic value** - Responses should be helpful and appropriate
- **Non-repetitive** - Avoid canned responses, ensure variety
- **Professional boundaries** - Maintain appropriate therapist role
- **Emotional intelligence** - Context-aware and empathetic responses

---

## 🧪 Testing Guidelines

### **Test Types**
- **Unit Tests** - Individual functions and components
- **Integration Tests** - API endpoints and user flows
- **E2E Tests** - Complete user journeys
- **Performance Tests** - Load testing and optimization

### **Testing Best Practices**
```typescript
// ✅ Good Test
describe('Romance Redemption Game', () => {
  it('should calculate score correctly', () => {
    const gameData = {
      creativityScore: 85,
      effortScore: 90,
      followThroughScore: 95,
      partnerRating: 9,
    };
    
    const result = calculateRomanceScore(gameData);
    
    expect(result.totalPoints).toBe(269); // Expected calculation
    expect(result.grade).toBe('A');
  });
  
  it('should handle Dr. Marcie feedback generation', async () => {
    const mockGameResult = createMockGameResult();
    
    const feedback = await generateMarcieFeedback(mockGameResult);
    
    expect(feedback).toBeDefined();
    expect(feedback.personalityLevel).toBe(2);
    expect(feedback.message).toContain('couples');
  });
});
```

### **Coverage Requirements**
- **Minimum 80%** code coverage for new features
- **Critical paths** must have 100% coverage
- **API endpoints** require integration tests
- **Dr. Marcie AI** responses need comprehensive testing

---

## 🎨 Design Guidelines

### **UI/UX Principles**
- **Therapy-focused** - Calming, supportive, professional
- **Mobile-first** - Responsive design for all devices
- **Accessibility** - WCAG 2.1 AA compliance
- **Performance** - Fast loading, smooth interactions
- **Dr. Marcie Integration** - Consistent avatar presence

### **Color Palette**
- **Primary**: Therapy pink (#ec4899)
- **Secondary**: Therapy purple (#8b5cf6)
- **Trust colors**: Low (#ef4444), Medium (#f59e0b), High (#10b981)
- **Love colors**: Low (#ec4899), Medium (#f472b6), High (#be185d)
- **Connection colors**: Low (#8b5cf6), Medium (#a78bfa), High (#5b21b6)

### **Typography**
- **Headings**: Clear hierarchy, emotional warmth
- **Body text**: Readable, comfortable spacing
- **Dr. Marcie dialogue**: Friendly but professional tone
- **Instructions**: Clear, actionable language

---

## 🚦 Code Review Process

### **What Reviewers Look For**
- **Functionality** - Does it work as intended?
- **Code quality** - Clean, readable, maintainable
- **Performance** - Efficient algorithms and queries
- **Security** - No vulnerabilities or data leaks
- **Testing** - Adequate test coverage
- **Documentation** - Clear comments and README updates
- **Therapeutic value** - Does it help couples?

### **Review Checklist**
- [ ] Code follows TypeScript strict mode
- [ ] All tests pass
- [ ] No console.log statements in production code
- [ ] Error handling is comprehensive
- [ ] API endpoints have proper validation
- [ ] Dr. Marcie responses are appropriate
- [ ] Mobile responsiveness verified
- [ ] Accessibility standards met
- [ ] Performance impact considered
- [ ] Documentation updated

---

## 📞 Getting Help

### **Community Resources**
- **GitHub Discussions** - Ask questions, share ideas
- **Issues** - Report bugs or request features
- **Pull Requests** - Get code review and feedback
- **Discord** (Coming soon) - Real-time community chat

### **Maintainer Contact**
- **Primary Maintainer**: @Meli2112
- **Email**: contribute@loveactuallygame.com
- **Response Time**: Usually within 24-48 hours

### **Documentation**
- **API Documentation** - `/docs/api.md`
- **Component Library** - `/docs/components.md`
- **Dr. Marcie AI Guide** - `/docs/dr-marcie.md`
- **Database Schema** - `/docs/database.md`

---

## 🏆 Recognition

### **Contributor Recognition**
- **Contributors** listed in README
- **Special badges** for significant contributions
- **Dr. Marcie mentions** your contributions in-app
- **Early access** to new features
- **Community showcase** of your work

### **Types of Recognition**
- 🐛 **Bug Hunter** - Finding and fixing bugs
- 🎨 **Designer** - UI/UX improvements
- 📚 **Documentarian** - Documentation contributions
- 🧪 **Tester** - Comprehensive testing
- 🎭 **Content Creator** - Therapeutic activities and Dr. Marcie content
- 🚀 **Feature Builder** - Major feature contributions
- 💕 **Community Champion** - Helping other contributors

---

## 📜 Code of Conduct

### **Our Commitment**
We're committed to providing a welcoming, inclusive environment for all contributors, regardless of:
- Experience level
- Gender identity and expression
- Sexual orientation
- Disability
- Personal appearance
- Body size
- Race, ethnicity, or nationality
- Religion or belief system
- Age

### **Expected Behavior**
- **Be respectful** and kind in all interactions
- **Use welcoming language** that encourages participation
- **Accept constructive criticism** gracefully
- **Focus on what's best** for the community and couples using our platform
- **Show empathy** toward other contributors and users

### **Unacceptable Behavior**
- Harassment, discrimination, or offensive comments
- Personal attacks or insults
- Sharing private information without consent
- Trolling, spamming, or disruptive behavior
- Any conduct that would be inappropriate in a professional setting

### **Enforcement**
Violations will be addressed through:
1. **Warning** - First offense education
2. **Temporary restriction** - Limited participation
3. **Permanent ban** - Serious or repeated violations

Report issues to contribute@loveactuallygame.com

---

## 🎯 Project Roadmap

### **Current Focus Areas**
- 🎭 **Dr. Marcie AI Enhancement** - More personality, better responses
- 📱 **Mobile Optimization** - Touch controls, performance
- 🎮 **Gaming Features** - New activities, competitions
- 🔒 **Privacy & Security** - Enhanced data protection
- 🌍 **Accessibility** - WCAG compliance, screen readers

### **Future Expansion**
- 🌐 **Internationalization** - Multi-language support
- 👥 **Group Therapy** - Multiple couples sessions
- 📊 **Advanced Analytics** - Deeper relationship insights
- 💼 **Professional Tools** - Therapist dashboard
- 🎯 **Specialized Tracks** - LGBTQ+, long-distance, etc.

---

## 💝 Final Notes

**Love, Actually... The Game** isn't just a coding project - it's a mission to help couples build stronger, healthier relationships. Every contribution you make has the potential to positively impact real relationships and help couples choose love over letting go.

When you contribute:
- **Think therapeutically** - How does this help couples?
- **Maintain Dr. Marcie's warmth** - Keep the experience supportive
- **Consider privacy** - Protect sensitive relationship data
- **Build for scale** - Design for thousands of couples
- **Test thoroughly** - Relationships are too important for bugs

**Thank you for helping us build something meaningful!** 💕

---

**Questions?** Don't hesitate to reach out. We're here to help you succeed and make meaningful contributions to couples everywhere.

**Happy coding, and thank you for choosing love!** ✨