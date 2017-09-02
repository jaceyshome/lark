import _ from 'lodash';
import siteConstants from '../_support/site-constants';
import config from '../../../../test.config' ;
import {Strings} from '../../../_support/helpers';
import {DataManager} from '../../../_support/helpers';

export class SiteSupport {

    static init() {
        DataManager.set();
    }

    static getPage(pageName) {
        return  `${SiteSupport.getBaseUrl()}${siteConstants.TESTPAGES[_.camelCase(pageName)] || siteConstants.TESTPAGES.testDefault}.html`;
    }

    static getBaseUrl() {
        return config.host[config.env].baseUrl;
    }

    static goToPage(pageName) {
        browser.url(SiteSupport.getPage(pageName));
    }
}
