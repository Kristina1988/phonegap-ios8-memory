cordova.define("APlugin", function(require, exports, module) {
var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');


var APlugin = {
    test : function() {
        console.log('JAVA SCRIPT TEST');
        

        var fileCallback = function(data) {
            console.log('dir success')
            console.log(data = JSON.parse(data));

            cordova.exec(function() { 
            }, null, 'APlugin', 'cdvLoadMod', [data[0].path]);
        }



        var dirCallback = function(data) {
            console.log('dir success')
            console.log(data = JSON.parse(data));

            cordova.exec(fileCallback, null, 'APlugin', 'cdvGetModFiles', [data[0].path]);
        }

        cordova.exec(dirCallback, null, 'APlugin', 'cdvGetModPaths', []);
    }
};


module.exports = APlugin;

});
