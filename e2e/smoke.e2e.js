describe('Halal Scanner E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  it('should show login screen and navigate to signup', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
    await element(by.text('Create an account')).tap();
    await expect(element(by.text('Sign Up'))).toBeVisible();
  });

  it('should recover from camera permission denial', async () => {
    await expect(element(by.id('try-again-btn'))).toBeVisible();
    await element(by.id('try-again-btn')).tap();
  });
});
