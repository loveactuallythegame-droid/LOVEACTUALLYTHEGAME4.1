// Environment variables for Jest tests
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NEXTAUTH_SECRET = 'test-secret-key'
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.ELEVENLABS_API_KEY = 'test-elevenlabs-key'