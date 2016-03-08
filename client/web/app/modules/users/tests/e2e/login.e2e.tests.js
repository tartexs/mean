'use strict';

var url = browser.params.baseUrl;

var user = {
  email: 'gboris@mail.com',
  password: 'Gboris1234!'
}

function openLoginModal() {
  // loguot
  element(by.id('logoutbutton')).isDisplayed().then(function(result) {
    if (result) element(by.id('logoutbutton')).click();
  });
  // open login
  expect(element(by.id('openloginmodal')).isDisplayed()).toBe(true);
  element(by.id('openloginmodal')).click();
  expect(element(by.id('logginbutton')).isDisplayed()).toBe(true);
}

function checkIfVisible(id) {
  element(by.id(id)).isDisplayed().then(function(result) {
    return result;
  });
}

describe('User Login E2E Tests:', function () {

  it('should be able to login with valid data (with admin user and be redirected to admin page)', function () {
    browser.get(url);
    openLoginModal();

    element(by.id('credentials-email')).sendKeys(user.email);
    element(by.id('credentials-pass')).sendKeys(user.password);
    element(by.id('logginbutton')).click();
    browser.sleep(2000);


    expect(browser.getTitle()).toEqual('Homeswitch - Admin panel');
    expect(element(by.id('logout')).isDisplayed()).toEqual(true);
  });

  it('should not be able to login with an unused email', function () {
    browser.get(url);
    openLoginModal();

    element(by.id('credentials-email')).sendKeys('some_unused_email_address@homeswitch.com.au');
    element(by.id('credentials-pass')).sendKeys(user.password);
    element(by.id('logginbutton')).click();
    browser.sleep(2000);


    expect(element(by.id('errorMessage')).isDisplayed()).toEqual(true);
    expect(element(by.id('errorMessage')).getText()).toContain('Authentication failed. User not found.');
  });

  it('should not be able to login with an incorrect password', function () {
    browser.get(url);
    openLoginModal();

    element(by.id('credentials-email')).sendKeys(user.email);
    element(by.id('credentials-pass')).sendKeys('incorrect_password');
    element(by.id('logginbutton')).click();
    browser.sleep(2000);


    expect(element(by.id('errorMessage')).isDisplayed()).toEqual(true);
    expect(element(by.id('errorMessage')).getText()).toContain('Authentication failed. Wrong password.');
  });

}, 50 * 1000);
