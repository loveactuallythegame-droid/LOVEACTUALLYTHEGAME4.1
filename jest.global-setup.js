module.exports = async () => {
  // Global setup for Jest tests
  console.log('🧪 Setting up Jest test environment...');
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.NEXTAUTH_SECRET = 'test-secret-key';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/love_actually_test';
  process.env.OPENAI_API_KEY = 'test-openai-key';
  process.env.ELEVENLABS_API_KEY = 'test-elevenlabs-key';
  
  // Mock timers globally
  jest.useFakeTimers();
  
  console.log('✅ Jest test environment setup complete');
};