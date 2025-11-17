module.exports = async () => {
  // Global teardown for Jest tests
  console.log('🧹 Cleaning up Jest test environment...');
  
  // Restore real timers
  jest.useRealTimers();
  
  // Clear all mocks
  jest.clearAllMocks();
  
  console.log('✅ Jest test environment cleanup complete');
};