describe('App Configuration', () => {
  beforeEach(() => {
    // Clear the module cache to allow re-requiring with different mocks
    jest.resetModules();
  });

  test('should not setup swagger when swagger_output.json does not exist', () => {
    const fs = require('fs');
    // Mock fs.existsSync to return false (the else branch) BEFORE requiring the app
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    // Require the app - this will skip the swagger setup (implicit else branch)
    const app = require('../src/app');
    
    expect(app).toBeDefined();
    expect(fs.existsSync).toHaveBeenCalled();
    
    // Restore mocks
    fs.existsSync.mockRestore();
  });
});

