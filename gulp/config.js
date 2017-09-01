var path = require('path');

var appRoot = 'src/';
var outputRoot = 'dist/';
var demoRoot = 'demo/';
var testRoot = 'features/';

module.exports = {
    root: appRoot,
    outputRoot: outputRoot,

    lark: {
        src: [
            //Index
            "src/lark/lark.js" ,

            //Services
            "src/lark/service.js" ,
            "src/lark/services/*.js" ,

            //Components
            "src/lark/scope.js" ,
            "src/lark/components/*.js"
        ],

        dest: outputRoot
    },

    app: {
        src: appRoot + "app/**/*.js",
        dest: outputRoot + "app"
    },

    assets: {
        src: appRoot + "assets/**/*",
        dest: outputRoot + "assets"
    },

    demo : {
        src: demoRoot + '**/*.html',
        dest: outputRoot + 'demo/'
    },

    template : {
        src: appRoot + "**/*.html",
        dest: outputRoot,
        sitePathValueVariable: '<%=sitePathValue%>',
        ssiIncludeVariable: "${sitePath}",
        assetSitePathVariable: '<!--#echo var="sitePath" -->'
    }
};
