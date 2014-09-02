'use strict';
/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */
describe('my app', function() {
    browser.get('index.html#/metrics/create');

    beforeEach(function () {

    });

    it('should have a title', function() {

        expect(browser.getTitle()).toEqual('Policy Compass');

        element(by.xpath('//*[@id="datagrid"]/div[1]/div[1]/div[1]/table/tbody/tr[1]/td[1]')).click();
        element(by.tagName('body')).sendKeys('2003-01-01');
        element(by.xpath('//*[@id="datagrid"]/div[1]/div[1]/div[1]/table/tbody/tr[1]/td[2]')).click();
        element(by.tagName('body')).sendKeys('2003-12-31');
        element(by.xpath('//*[@id="datagrid"]/div[1]/div[1]/div[1]/table/tbody/tr[1]/td[3]')).click();
        element(by.tagName('body')).sendKeys('23900.0');

        element(by.id('title')).sendKeys('TestTest');
        element(by.id('acronym')).sendKeys('TTT');
        element(by.cssContainingText('option', 'Economy')).click();
        element(by.cssContainingText('option', 'Health')).click();
        element(by.cssContainingText('option', 'decade')).click();
        element(by.id('keywords')).sendKeys('Test, World');
        element(by.id('nextStepButton')).click();
        element(by.id('metricdescription')).sendKeys('Description');
        element(by.cssContainingText('option', 'German')).click();
        element(by.id('saveButton')).click().then(function () {
            browser.waitForAngular();
            expect(browser.getCurrentUrl()).toContain('#/metrics/');
            element(by.xpath('/html/body/div[1]/div/h1')).getText().then(function (text) {
                expect(text).toContain('TestTest');
            });
        });

    });
});