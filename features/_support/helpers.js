import _ from 'lodash' ;
import testConfig from '../../test.config';
import globalConstants from './constants/global-constants';
import numeral from 'numeral';


class Keyboard {

    /**
     * FIXME: the "keys" command will be deprecated soon. Please use a different command in order to avoid failures in your test after updating WebdriverIO.
     *
     * @see https://github.com/Codeception/CodeceptJS/issues/525
     *
     * @param {!Element} element
     * @param {?number} tabCount - tab time count default to 60
     */
    static tabToElement(element, tabCount = 60) {

        expect(element.value).not.toBeNull();
        expect(tabCount > 0).toBe(true);

        if(tabCount <= 0) {
            console.error("Couldn't tab to the element", element);
            return null;
        }
        browser.keys("Tab");
        if(element.value.ELEMENT === browser.elementActive().value.ELEMENT){
            return element;
        } else {
            Keyboard.tabToElement(element, (tabCount - 1));
        }
    }

    /**
     *
     * @param {String} keyName - key name
     */
    static pressKey(keyName) {
        browser.keys(keyName);
    }

}


class Strings {

    static kebabLowerCase(str) {
        return `${_.replace(str.toLowerCase(), /\s|&/g, "-")}`;
    }

    static carriageCase(str) {
        return _.replace(_.kebabCase(str), "-", "_");
    }

}

/**
 * Control view port size for different test cases
 */
class ViewPort {

    static _getViewportDefaultWidth() {
        return (testConfig.env === "local" && testConfig.developViewportSize.width !== "auto") ? testConfig.developViewportSize.width : browser.getViewportSize().width;
    }


    static _getViewportDefaultHeight() {
        return (testConfig.env === "local" && testConfig.developViewportSize.height !== "auto") ? testConfig.developViewportSize.height : browser.getViewportSize().height;
    }


    static resetToInitialSize() {

        if(!DataManager.get(globalConstants.initialViewportSizeWidth)){
            DataManager.set(globalConstants.initialViewportSizeWidth, ViewPort._getViewportDefaultWidth());
        }
        if(!DataManager.get(globalConstants.initialViewportSizeHeight)){
            DataManager.set(globalConstants.initialViewportSizeHeight, ViewPort._getViewportDefaultHeight());
        }

        if( _.toNumber(browser.getViewportSize().width) !== _.toNumber(DataManager.get(globalConstants.initialViewportSizeWidth)) ||
            _.toNumber(browser.getViewportSize().height) !== _.toNumber(DataManager.get(globalConstants.initialViewportSizeHeight))
        ){
            ViewPort.setSize();
        }
    }


    /**
     * @param {string|number?} width - view port width, default to initial viewport width
     * @param {string|number?} height - view port height, default to initial viewport height
     */
    static setSize(width, height) {
        browser.setViewportSize({
            width: _.toNumber(width || ViewPort.getInitialSize().width),
            height: _.toNumber(height || ViewPort.getInitialSize().height)
        }, true);
    }


    static getInitialSize() {
        expect(DataManager.get(globalConstants.initialViewportSizeWidth)).not.toBeNull();
        expect(DataManager.get(globalConstants.initialViewportSizeHeight)).not.toBeNull();

        return {
            width: _.toNumber(DataManager.get(globalConstants.initialViewportSizeWidth)),
            height: _.toNumber(DataManager.get(globalConstants.initialViewportSizeWidth))
        }
    }

}


class Numbers {

    static numeral(candidate) {
        return ({
            'first': 1,
            'second': 2,
            'third': 3,
            'fourth': 4,
            'fifth': 5,
            'sixth': 6,
            'seventh': 7,
            'eighth': 8,
            'ninth': 9,
            'tenth': 10
        })[candidate] || numeral(candidate).value();
    }

}

class Elements {

    static getScrollTop(selector) {
        browser.timeouts('script', 3000);
        return browser.execute(function(selector) {
            return document.querySelectorAll(selector)[0].scrollTop;
        }, selector).value;
    }

}

/**
 * Manage global parameters
 */
class DataManager {

    static get(key) {
        if(!browser[globalConstants.globalNamespace]) {
            browser[globalConstants.globalNamespace] = {};
        }
        return browser[globalConstants.globalNamespace][key];
    }

    static set(key, value) {
        if(!key) {
            return;
        }
        if(!browser[globalConstants.globalNamespace]) {
            browser[globalConstants.globalNamespace] = {};
        }
        if(typeof value === 'Object') {
            browser[globalConstants.globalNamespace][key] = JSON.stringify(value);
        } else {
            browser[globalConstants.globalNamespace][key] = value;
        }
        return browser[globalConstants.globalNamespace][key];
    }

}


export {
    Keyboard,
    Strings,
    ViewPort,
    Numbers,
    Elements,
    DataManager
}

