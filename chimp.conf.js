var gutil           = require('gulp-util');
var portSelenium    = Math.floor(Math.random() * 5000) + 1000;
var portWebDriverio = Math.floor(Math.random() * 9000) + 1000;

gutil.log('Selenium running in port:    ' + gutil.colors.bold.white.bgBlue(portSelenium));
gutil.log('WebDriverio running in port: ' + gutil.colors.bold.white.bgBlue(portWebDriverio));


/**
 * ChimpJs Configuration
 *
 * @config
 * @see https://github.com/xolvio/chimp/blob/master/src/bin/default.js#L67
 */
module.exports = {

    /**
     * Chimp js global configuration
     * @see default configuration https://github.com/xolvio/chimp/blob/master/src/bin/default.js
     * @see advanced configuration https://chimp.readme.io/docs/command-line-options
     */
    watch: true,
    watchTags: '@watch,@focus',
    domainSteps: null,
    e2eSteps: null,
    fullDomain: false,
    domainOnly: false,
    e2eTags: '@e2e',
    watchWithPolling: false,
    server: true,
    serverPort: 8060,
    sync: true,
    offline: false,
    showXolvioMessages: false,

    // - - - - GULP CHIMP - - - -
    singleRun:  false,

    //- - - - CUCUMBER - - - -
    path: './features',
    format: 'pretty',
    tags: '~@ignore',
    singleSnippetPerFile: true,
    recommendedFilenameSeparator: '_',
    chai: false,
    screenshotsOnError: true,
    screenshotsPath: './output/features/screenshots',
    captureAllStepScreenshots: false,
    saveScreenshotsToDisk: true,
    saveScreenshotsToReport: true,
    jsonOutput: './output/cucumber.json',
    conditionOutput: false,

    //- - - - CUCUMBER REPORT - - - -
    // htmlReport: true,
    // theme: 'bootstrap',
    // jsonFile: './output/cucumber.json',
    // output: './output/cucumber.html',
    // reportSuiteAsScenarios: false,
    // launchReport: false,

    // - - - - SELENIUM  - - - -
    // browser: 'firefox',
    // platform: '',
    // name: '',
    // user: '',
    // key: '',
    port: portSelenium,
    // host: null,

    // - - - - SAUCELABS - - - -
    // user: "",
    // key: "",
    // port: 80,
    // host: "ondemand.saucelabs.com",

    // - - - - WEBDRIVER-IO  - - - -
    // webdriverio: {
    //     desiredCapabilities: {},
    //     logLevel: 'silent',
    //     logOutput: './output/webdriverio/logs',
    //     host: '127.0.0.1',
    //     port: portWebDriverio,
    //     path: '/wd/hub',
    //     baseUrl: 'http://localhost:9000',
    //     coloredLogs: true,
    //     screenshotPath: './test/webdriverio/output/screenshots',
    //     waitforTimeout: 5000,
    //     waitforInterval: 250,
    // },

    // - - - - SELENIUM-STANDALONE
    seleniumStandaloneOptions: {
        // check for more recent versions of selenium here:
        // http://selenium-release.storage.googleapis.com/index.html
        version: '3.0.1',
        baseURL: 'https://selenium-release.storage.googleapis.com',
        drivers: {
            chrome: {
                // check for more recent versions of chrome driver here:
                // http://chromedriver.storage.googleapis.com/index.html
                version: '2.25',
                arch: process.arch,
                baseURL: 'https://chromedriver.storage.googleapis.com'
            },
            ie: {
                // check for more recent versions of internet explorer driver here:
                // http://selenium-release.storage.googleapis.com/index.html
                version: '2.50.0',
                arch: 'ia32',
                baseURL: 'https://selenium-release.storage.googleapis.com'
            },
            firefox: {
                // check for more recent versions of gecko  driver here:
                // https://github.com/mozilla/geckodriver/releases
                version: '0.11.1',
                arch: process.arch,
                baseURL: 'https://github.com/mozilla/geckodriver/releases/download'
            }
        }
    },

    // - - - - SESSION-MANAGER  - - - -
    noSessionReuse: false,

    // - - - - MOCHA  - - - -
    // mocha: false,
    // path: './src/**/*-test.js',
    // mochaTags: '',
    // mochaGrep: null,
    // mochaTimeout: 60000,
    // mochaReporter: 'spec',
    // mochaSlow: 10000,

    // - - - - PHANTOM  - - - -
    // phantom_w: 1280,
    // phantom_h: 1024,

    // - - - - DEBUGGING  - - - -
    log: 'info',
    debug: false,
    seleniumDebug: null,
    debugCucumber: null,
    debugBrkCucumber: null,
    debugMocha: null,
    debugBrkMocha: null
};
