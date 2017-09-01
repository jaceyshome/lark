/**
 * Scope class Constructor
 * @param {String} id - unique id of the scope
 * @returns {Object} scope - an instance of Scope
 * @constructor
 */
function Scope(id) {
    var scope = this;
    scope.__id = id;
    scope.$$parent = null;
    scope.$$children = [];
    Object.defineProperty(scope, '_$$watchers', {
        value: [],
        enumerable: false
    });
    Object.defineProperty(scope, "_$$events", {
        value: [],
        enumerable: false
    });
    return scope;
}

/**
 * Extend scope properties
 * @param {?Object} obj - passing object
 */
Scope.prototype.extend = function (obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            this[i] = this[i] || obj[i];
        }
    }
};

/**
 * Update the view
 */
Scope.prototype.$update = function () {
    lark.$refresh.loop();
};

/**
 * Register anonymous method in the watchers collection
 * Store the cache value in the anonymous method,
 *
 * @param {String|Object|function} expression - expression
 * @param fn
 */
Scope.prototype.$watch = function (expression, fn) {
    var scope = this;
    switch (typeof expression) {
        case 'string':
            scope._$$watchers.push((function (scope) {
                var cachedValue = null, newValue, firstRun = true;
                return function () {
                    newValue = scope.$getExpValue(expression);
                    if ((cachedValue !== JSON.stringify(newValue) || firstRun === true) && typeof fn === "function") {
                        firstRun = false;
                        fn(newValue);
                        cachedValue = JSON.stringify(newValue);
                    }
                };
            })(scope));
            break;
        case 'object':
            scope._$$watchers.push((function (scope) {
                var cachedValue = null, newValue, firstRun = true;
                return function () {
                    newValue = Array.prototype.map.call(expression, function (val) {
                        return scope.$getExpValue(val);
                    });
                    if ((cachedValue !== JSON.stringify(newValue) || firstRun === true) && typeof fn === "function") {
                        firstRun = false;
                        fn(newValue);
                        cachedValue = JSON.stringify(newValue);
                    }
                };
            })(scope));
            break;
        case 'function':
            //Watcher function won't cache value, as it will give more controls to $scope itself
            scope._$$watchers.push((function (scope) {
                return function () {
                    if (typeof fn === "function") {
                        fn(expression.call(scope));
                    }
                };
            })(scope));
            break;
        default :
            break;
    }
    this.$update();
};

Scope.prototype.$execWatchers = function () {
    var watchers = this._$$watchers, watcher;
    if (watchers && watchers.length > 0) {
        for (var i = 0, length = watchers.length; i < length; i++) {
            watcher = watchers[i];
            (typeof watcher === 'function') && watcher();
        }
    }
};

/*
    TODO: Add function to remove watchers
*/
Scope.prototype.$removeWatcher = function () {
};

Scope.prototype.$destroy = function () {
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            delete this[key];
        }
    }
    (this.$$parent != null) && this.$$parent.$removeChild(this);
};

Scope.prototype.$removeChild = function (childScope) {
    this.$$children.splice(this.$$children.indexOf(childScope), 1);
};

Scope.prototype.$addChild = function (childScope) {
    if (typeof this.$$children == undefined) {
        this.$$children = [];
    }
    if (this.$$children.indexOf(childScope) < 0) {
        this.$$children.push(childScope);
    }
};

Scope.prototype.$getExpValue = function (exp) {
    return lark.$expression.$get(this, exp);
};

Scope.prototype.$setExpValue = function (exp, value) {
    lark.$expression.$set(this, exp, value);
};

Scope.prototype.$on = function (eventName, fn) {
    this._$$events.push({
        name: eventName,
        fn: fn
    });
    return fn;
};

Scope.prototype.$emit = function (eventName, data) {
    this._$$events.forEach(function (event) {
        if (event.name === eventName && typeof event.fn === 'function') {
            event.fn(data);
        }
    });
    this.$$children.forEach(function (child) {
        child.$emit(eventName, data);
    });
};

Scope.prototype.$broadcast = function (eventName, data) {
    lark.$rootScope.$emit(eventName, data);
};

Scope.prototype.$off = function (eventName, fn) {
    var index;
    if (!!fn) {
        for (var i = 0, len = this._$$events.length; i < len; i++) {
            if (this._$$events[i].fn === fn) {
                index = i;
                break;
            }
        }
    }
    if (index != null) {
        this._$$events.splice(index, 1);
    }
};