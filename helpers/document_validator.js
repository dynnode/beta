"use strict";
module.exports = {

    validatedocument: function (requiredkeys, stack) {

        var requiredkeyssorted = requiredkeys.sort();
        var stackserialized = prepareStack(stack);
        var stackkeyssorted = stackserialized.sort();

        for (var i = 0; i < requiredkeyssorted.length; i++) {
            if (stackkeyssorted.indexOf(requiredkeyssorted[i]) === -1) {
                return false;
            }
        }

        return true;
    }

}


var inArray = function (key, stack) {

    var length = stack.length;
    for (var i = 0; i < length; i++) {
        if (stack[i] == key) return true;
    }
    return false;
};

var prepareStack = function (stack) {

    var newtack = [];
    for (var i in stack) {
        newtack.push(i)
    }

    return newtack;
};