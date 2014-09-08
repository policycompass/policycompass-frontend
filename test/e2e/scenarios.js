'use strict';
/**
 * E2E-Test for creating a metric
 */

describe('creation of a metric', function() {
    browser.get('index.html#/metrics/create');

    it('should create metric', function() {

        expect(browser.getTitle()).toEqual('Policy Compass');

        // Simulating the input to the data grid has to be done like this:
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
            // It should redirect to the new metric
            element(by.xpath('/html/body/div[1]/div/h1')).getText().then(function (text) {
                expect(text).toContain('TTT');
            });
        });

    });
});