// Press F5 in visual studio code to launch app.js with node
// This file loads requirejs module first 
// The specific module can then be loaded with requirejs([<module-path>], function(<module-name>))

var requirejs = require('requirejs');

requirejs.config({
    //By default load any module IDs from js/lib
    nodeRequire: require,
    //baseUrl: 'Common',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    // paths: {
    //     app: '../app'
    // }
});

// Start the main app logic.
requirejs(["./ts/tests/tester"],
function   (testerModule) {
    var tester = new testerModule.Tester();
    tester.allTests();
});