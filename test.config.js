/**
 * Features global configuration
 * Hosts and global settings
 */

const ENV = "local";

module.exports = {

    browser: 'chrome',
    env: ENV, //develop or production
    developViewportSize: {
        width:  1024,
        height: 'auto'
    },

    host: {

        local: {
            baseUrl: "localhost:9000"
        },

        dev: {
            baseUrl: ""
        }
    }

};
