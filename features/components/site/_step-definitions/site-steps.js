import siteConstants from '../_support/site-constants';
import {SiteSupport} from '../_support/site-support';
import {ViewPort} from '../../../_support/helpers';
import _ from 'lodash';

module.exports = function() {

    //Hack: not sure how to intergrate the widoscreenshot
    this.Before(function () {
        SiteSupport.init();
    });

    /**
     * File the page
     * @param {String} pageName - the test page name
     */
    this.Given(/^[aATt][nhe]{0,} ([a-zA-Z ]*) page$/, function(pageName) {

        //Set viewport size always to the default size at the start.
        // ViewPort.resetToInitialSize();
        SiteSupport.goToPage(pageName);
        let doesExist = browser.waitForExist("body");
        expect(doesExist).toBe(true);

    });

};
