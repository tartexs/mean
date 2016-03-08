'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 930000;
var url = browser.params.baseUrl;

var randomYopEmail = function() {
  return 'hs_test' + Math.floor((Math.random() * 100000) + 1) + '@yopmail.com';
};

var user = {
  email: undefined,
  password: 'current_password',
  firstName: 'Homeswitch',
  lastName: 'QActivo'
}

/**
 * Create a user to recever his password
 */
function initPasswordRecoveryUser() {
  // init url
  browser.get(url);

  // loguot
  element(by.id('logoutbutton')).isDisplayed().then(function(result) {
    if (result) element(by.id('logoutbutton')).click();
  });

  // open login
  expect(element(by.id('openloginmodal')).isDisplayed()).toBe(true);
  element(by.id('openloginmodal')).click();
  browser.sleep(500);

  // open signup
  element(by.id('signupbutton')).click();
  browser.sleep(500);

  element(by.id('firstName')).sendKeys(user.firstName);
  element(by.id('lastName')).sendKeys(user.lastName);
  element(by.id('email')).sendKeys(user.email);
  element(by.id('password')).sendKeys(user.password);
  browser.sleep(500);

  browser.ignoreSynchronization = true;
  element(by.id('signup')).click();

  browser.sleep(1000);
  expect(element(by.id('successMessage')).isDisplayed()).toEqual(true);
  expect(element(by.id('successMessage')).getText()).toContain('Account created. Automatic login into your account');
  browser.ignoreSynchronization = false;
  browser.sleep(500);
}

/**
 * Open password recovery modal
 */
function openRecoveryModal() {
  // init url
  browser.get(url);

  // loguot
  element(by.id('logoutbutton')).isDisplayed().then(function(result) {
    if (result) element(by.id('logoutbutton')).click();
  });

  // open login
  expect(element(by.id('openloginmodal')).isDisplayed()).toBe(true);
  element(by.id('openloginmodal')).click();
  browser.sleep(500);

  // open recovery
  expect(element(by.id('recoverybutton')).isDisplayed()).toBe(true);
  element(by.id('recoverybutton')).click();
  browser.sleep(500);
}


describe('User Password recovery E2E Tests:', function () {

  it('should be able to init password recover with valid email address', function () {
    // Init user email
    user.email = randomYopEmail();

    // Do user signup
    initPasswordRecoveryUser();
    browser.sleep(1000);

    /**
     * Open recovery modal
     */
    // loguot
    element(by.id('logoutbutton')).isDisplayed().then(function(result) {
      if (result) element(by.id('logoutbutton')).click();
    });

    // open login
    expect(element(by.id('openloginmodal')).isDisplayed()).toBe(true);
    element(by.id('openloginmodal')).click();
    browser.sleep(500);

    // open recovery
    expect(element(by.id('recoverybutton')).isDisplayed()).toBe(true);
    element(by.id('recoverybutton')).click();
    browser.sleep(500);

    // Send credentials (email)
    element(by.id('credentials-email')).sendKeys(user.email);
    // Do recovery click
    element(by.id('recovery')).click();
    // Wait for success
    browser.sleep(2000);
    expect(element(by.css('p.text-center')).getText()).toContain('Sending password recovery email to '+ user.email +', check your email box for more details.');

    /**
     * Open mail provider and check for recovery email
     */

    // Avoid wait for angular load
    browser.ignoreSynchronization = true;
    // Open yop mail, fill credentrials and login
    browser.driver.get('http://www.yopmail.com/en/');
    element(by.id('login')).sendKeys(user.email);
    element(by.id('login')).sendKeys(protractor.Key.ENTER);

    // Get current/last recieved email iframe
    browser.switchTo().frame('ifmail');

    // Get email body
    var mailbody = element(by.id('mailmillieu'));
    expect(mailbody.isDisplayed()).toBe(true);

    // Get recovery link
    var link = mailbody.element(by.css('a'));

    // Get link ref (don't click to avoid target _blank)
    var linkTarget = link.getAttribute('href').then(function(attr) {
      // Open recovery page
      browser.get(attr);
      // Wait for Angular
      browser.ignoreSynchronization = false;
      // Check correct page
      expect(browser.getTitle()).toEqual('Homeswitch - Reset password');
      expect(element(by.id('doReset')).isDisplayed()).toEqual(true);
      // Send new password
      element(by.id('password')).sendKeys('new_password');
      element(by.id('verifypassword')).sendKeys('new_password');
      // do reset
      element(by.id('doReset')).click();
      // Wait for success message
      browser.sleep(2000);
      expect(element(by.css('p.text-center')).getText()).toContain('Password was correctly resetted.');
      browser.sleep(1000);
    });
  });

  it('should not be able to init password recover with an invalid email address', function () {
    /**
     * Open recovery modal
     */
    // loguot
    element(by.id('logoutbutton')).isDisplayed().then(function(result) {
      if (result) element(by.id('logoutbutton')).click();
    });

    // open login
    expect(element(by.id('openloginmodal')).isDisplayed()).toBe(true);
    element(by.id('openloginmodal')).click();
    browser.sleep(500);

    // open recovery
    expect(element(by.id('recoverybutton')).isDisplayed()).toBe(true);
    element(by.id('recoverybutton')).click();
    browser.sleep(500);

    // Send credentials (email)
    element(by.id('credentials-email')).sendKeys('some_unused_email_address_to_recovery@homeswitch.com.au');
    // Do recovery click
    element(by.id('recovery')).click();
    // Wait for success
    browser.sleep(2000);
    expect(element(by.id('errorMessage')).getText()).toContain('No account with that email has been found.');
    browser.sleep(1000);
  });


  it('should not be able to recover password with an invalid password', function () {
    // Init user email
    user.email = randomYopEmail();

    // Do user signup
    initPasswordRecoveryUser();
    browser.sleep(1000);

    /**
     * Open recovery modal
     */
    // loguot
    element(by.id('logoutbutton')).isDisplayed().then(function(result) {
      if (result) element(by.id('logoutbutton')).click();
    });

    // open login
    expect(element(by.id('openloginmodal')).isDisplayed()).toBe(true);
    element(by.id('openloginmodal')).click();
    browser.sleep(500);

    // open recovery
    expect(element(by.id('recoverybutton')).isDisplayed()).toBe(true);
    element(by.id('recoverybutton')).click();
    browser.sleep(500);

    // Send credentials (email)
    element(by.id('credentials-email')).sendKeys(user.email);
    // Do recovery click
    element(by.id('recovery')).click();
    // Wait for success
    browser.sleep(2000);
    expect(element(by.css('p.text-center')).getText()).toContain('Sending password recovery email to '+ user.email +', check your email box for more details.');

    /**
     * Open mail provider and check for recovery email
     */

    // Avoid wait for angular load
    browser.ignoreSynchronization = true;
    // Open yop mail, fill credentrials and login
    browser.driver.get('http://www.yopmail.com/en/');
    element(by.id('login')).sendKeys(user.email);
    element(by.id('login')).sendKeys(protractor.Key.ENTER);

    // Get current/last recieved email iframe
    browser.switchTo().frame('ifmail');

    // Get email body
    var mailbody = element(by.id('mailmillieu'));
    expect(mailbody.isDisplayed()).toBe(true);

    // Get recovery link
    var link = mailbody.element(by.css('a'));

    // Get link ref (don't click to avoid target _blank)
    var linkTarget = link.getAttribute('href').then(function(attr) {
      // Open recovery page
      browser.get(attr);
      // Wait for Angular
      browser.ignoreSynchronization = false;
      // Check correct page
      expect(browser.getTitle()).toEqual('Homeswitch - Reset password');
      expect(element(by.id('doReset')).isDisplayed()).toEqual(true);
      // Send new password
      element(by.id('password')).sendKeys('pwd');
      element(by.id('verifypassword')).sendKeys('pwd');
      // do reset
      element(by.id('doReset')).click();
      // Wait for error message
      browser.sleep(2000);
      expect(element(by.id('errorMessage')).getText()).toContain('The password must be at least 6 characters long.');
      browser.sleep(1000);
    });
  });


  it('should not be able to recover password with not matching passwords', function () {
    // Init user email
    user.email = randomYopEmail();

    // Do user signup
    initPasswordRecoveryUser();
    browser.sleep(1000);

    /**
     * Open recovery modal
     */
    // loguot
    element(by.id('logoutbutton')).isDisplayed().then(function(result) {
      if (result) element(by.id('logoutbutton')).click();
    });

    // open login
    expect(element(by.id('openloginmodal')).isDisplayed()).toBe(true);
    element(by.id('openloginmodal')).click();
    browser.sleep(500);

    // open recovery
    expect(element(by.id('recoverybutton')).isDisplayed()).toBe(true);
    element(by.id('recoverybutton')).click();
    browser.sleep(500);

    // Send credentials (email)
    element(by.id('credentials-email')).sendKeys(user.email);
    // Do recovery click
    element(by.id('recovery')).click();
    // Wait for success
    browser.sleep(2000);
    expect(element(by.css('p.text-center')).getText()).toContain('Sending password recovery email to '+ user.email +', check your email box for more details.');

    /**
     * Open mail provider and check for recovery email
     */

    // Avoid wait for angular load
    browser.ignoreSynchronization = true;
    // Open yop mail, fill credentrials and login
    browser.driver.get('http://www.yopmail.com/en/');
    element(by.id('login')).sendKeys(user.email);
    element(by.id('login')).sendKeys(protractor.Key.ENTER);

    // Get current/last recieved email iframe
    browser.switchTo().frame('ifmail');

    // Get email body
    var mailbody = element(by.id('mailmillieu'));
    expect(mailbody.isDisplayed()).toBe(true);

    // Get recovery link
    var link = mailbody.element(by.css('a'));

    // Get link ref (don't click to avoid target _blank)
    var linkTarget = link.getAttribute('href').then(function(attr) {
      // Open recovery page
      browser.get(attr);
      // Wait for Angular
      browser.ignoreSynchronization = false;
      // Check correct page
      expect(browser.getTitle()).toEqual('Homeswitch - Reset password');
      expect(element(by.id('doReset')).isDisplayed()).toEqual(true);
      // Send new password
      element(by.id('password')).sendKeys('valid_password');
      element(by.id('verifypassword')).sendKeys('other_valid_password');
      // do reset
      element(by.id('doReset')).click();
      // Wait for error message
      browser.sleep(2000);
      expect(element(by.id('errorVerify')).getText()).toContain('Password are no the same');
      browser.sleep(1000);
    });
  });


}, 50 * 1000);
