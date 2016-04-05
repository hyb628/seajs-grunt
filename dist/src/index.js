define("index", [ "./util/util" ], function(require, exports, module) {
    var util = require("./util/util");
    var result = util.add(1 + 1);
});

define("util/util", [], function(require, exports, module) {
    exports.add = function(a, b) {
        return a + b;
    };
});
