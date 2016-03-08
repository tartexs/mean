'use strict';

var url = browser.params.baseUrl;

var randomEmail = function() {
  return 'hs_signup_test_' + Math.floor((Math.random() * 10000000) + 1) + '@yopmail.com';
};

var user = {
  email: undefined,
  firstName: 'First Name',
  lastName: 'Last Name',
  email: randomEmail(),
  password: 'password'
}

function openSignupModal() {
  // loguot
  element(by.id('logoutbutton')).isDisplayed().then(function(result) {
    if (result) element(by.id('logoutbutton')).click();
  });
  // open signup
  expect(element(by.id('openloginmodal')).isDisplayed()).toBe(true);
  element(by.id('openloginmodal')).click();
  element(by.id('signupbutton')).click();
  expect(element(by.id('signup')).isDisplayed()).toBe(true);
  expect(element(by.buttonText('Signup!')).isDisplayed()).toBe(true);
}

function checkIfVisible(id) {
  element(by.id(id)).isDisplayed().then(function(result) {
    return result;
  });
}

describe('User Signup E2E Tests:', function () {

  it('should be able to signup a new user with valid data', function () {
    browser.get(url);
    openSignupModal();

    element(by.id('firstName')).sendKeys(user.firstName);
    element(by.id('lastName')).sendKeys(user.lastName);
    element(by.id('email')).sendKeys(user.email);
    element(by.id('password')).sendKeys(user.password);
    //browser.ignoreSynchronization = true;
    element(by.id('signup')).click();

    expect(element(by.id('successMessage')).isDisplayed()).toEqual(true);
    expect(element(by.id('successMessage')).getText()).toContain('Account created. Automatic login into your account');
    //browser.ignoreSynchronization = false;
  });

  it('should not be able to signup a new user with a already used email', function () {
    browser.get(url);
    openSignupModal();

    element(by.id('firstName')).sendKeys('Other first name');
    element(by.id('lastName')).sendKeys('Other last name');
    element(by.id('email')).sendKeys(user.email); // same email
    element(by.id('password')).sendKeys('some_valid_password');
    element(by.id('signup')).click();
    browser.sleep(2500);

    expect(element(by.id('errorMessage')).isDisplayed()).toEqual(true);
    expect(element(by.id('errorMessage')).getText()).toContain('Email already exists');
  });

  it('should not be able to signup a new user with a invalid password', function () {
    browser.get(url);
    openSignupModal();

    element(by.id('firstName')).sendKeys('Other first name');
    element(by.id('lastName')).sendKeys('Other last name');
    element(by.id('email')).sendKeys(randomEmail());
    element(by.id('password')).sendKeys('pwd');
    //browser.ignoreSynchronization = true;
    element(by.id('signup')).click();
    browser.sleep(2000);

    expect(element(by.id('errorMessage')).isDisplayed()).toEqual(true);
    expect(element(by.id('errorMessage')).getText()).toContain('The password must be at least 6 characters long.');
    //browser.ignoreSynchronization = false;
  });

  it('should not be able to continue signup without first name (form validation)', function () {
    browser.get(url);
    openSignupModal();

    element(by.id('lastName')).sendKeys('Other last name');
    element(by.id('email')).sendKeys(randomEmail());
    element(by.id('password')).sendKeys('some_valid_password');
    element(by.id('signup')).click();
    browser.sleep(1000);

    expect(element(by.id('firstNameError')).isDisplayed()).toEqual(true);
    expect(element(by.id('firstNameError')).getText()).toContain('Please insert your first name');
  });

  it('should not be able to continue signup without last name (form validation)', function () {
    browser.get(url);
    openSignupModal();

    element(by.id('firstName')).sendKeys('Other first name');
    element(by.id('email')).sendKeys(randomEmail());
    element(by.id('password')).sendKeys('some_valid_password');
    element(by.id('signup')).click();
    browser.sleep(1000);

    expect(element(by.id('lastNameError')).isDisplayed()).toEqual(true);
    expect(element(by.id('lastNameError')).getText()).toContain('Please insert your last name');
  });

  it('should not be able to continue signup without password (form validation)', function () {
    browser.get(url);
    openSignupModal();

    element(by.id('firstName')).sendKeys('Other first name');
    element(by.id('lastName')).sendKeys('Other last name');
    element(by.id('email')).sendKeys(randomEmail());
    element(by.id('signup')).click();
    browser.sleep(1000);

    expect(element(by.id('passwordError')).isDisplayed()).toEqual(true);
    expect(element(by.id('passwordError')).getText()).toContain('Please insert your account password');
  });

  it('should not be able to continue signup without email (form validation)', function () {
    browser.get(url);
    openSignupModal();

    element(by.id('firstName')).sendKeys('Other first name');
    element(by.id('lastName')).sendKeys('Other last name');
    element(by.id('password')).sendKeys('some_valid_password');
    element(by.id('signup')).click();
    browser.sleep(1000);

    expect(element(by.id('emailError')).isDisplayed()).toEqual(true);
    expect(element(by.id('emailError')).getText()).toContain('Please insert a valid email address');
  });

  it('should not be able to continue signup with an invalid email (form validation)', function () {
    browser.get(url);
    openSignupModal();

    element(by.id('firstName')).sendKeys('Other first name');
    element(by.id('lastName')).sendKeys('Other last name');
    element(by.id('email')).sendKeys('this_email_is_not_valid@');
    element(by.id('password')).sendKeys('some_valid_password');
    element(by.id('signup')).click();
    browser.sleep(1000);

    expect(element(by.id('emailError')).isDisplayed()).toEqual(true);
    expect(element(by.id('emailError')).getText()).toContain('Please insert a valid email address');
  });

}, 50 * 1000);
