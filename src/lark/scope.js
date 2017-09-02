/**
 * Scope
 * Scope is the model of the MVC architecture
 *
 * ###Initial private properties###
 *
 * __id - unique id
 * _$$watchers - a collection of registered watchers
 * _$$events - a collection of registered events
 *
 * ###Initial public properties###
 * $$parent - parent scope
 * $$children - a collection of child scopes
 *
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
 * Update the dom tree with new values
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

/**
 * Execute watchers
 */
Scope.prototype.$execWatchers = function () {
    var watchers = this._$$watchers, watcher;
    if (watchers && watchers.length > 0) {
        for (var i = 0, length = watchers.length; i < length; i++) {
            watcher = watchers[i];
            (typeof watcher === 'function') && watcher();
        }
    }
};

/**
 * Remove watchers
 */
Scope.prototype.$removeWatcher = function () {
    this._$$watchers = null;
};


/**
 * Destroy the dom and register events
 */
Scope.prototype.$destroy = function () {
    //Delete all references and properties before remove this scope from the scope tree,
    //If remove this scope without removing the references of other scope objects, it may cause
    //memory leak

    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            this[key] = null;
            delete this[key];
        }
    }
    this.$off();
    this.$removeWatcher();

    //Remove the scope from the scope tree
    (this.$$parent != null) && this.$$parent.$removeChild(this);

};

/**
 * Remove the scope from the scope tree
 * @param {!Object} childScope
 * @example
 * ScopeA trees
 *
 *      ScopeA
 *       /   \
 *  ScopeB  ScopeC
 *
 * After calling ScopeA.$removeChild(ScopeC);
 *
 *      ScopeA
 *      /
 *  ScopeB
 *
 */
Scope.prototype.$removeChild = function (childScope) {
    this.$$children.splice(this.$$children.indexOf(childScope), 1);
};

/**
 * Add unique child scope to this scope
 * @param {!Object} childScope
 * @example
 * ScopeA trees
 *
 *      ScopeA
 *      /
 *  ScopeB
 *
 * After calling ScopeA.$addChild(ScopeC);
 *
 *      ScopeA
 *       /   \
 *  ScopeB  ScopeC
 *
 */
Scope.prototype.$addChild = function (childScope) {
    if (typeof this.$$children == undefined) {
        this.$$children = [];
    }
    if (this.$$children.indexOf(childScope) < 0) {
        this.$$children.push(childScope);
    }
};

/**
 * Get the expression {{}} mapping value with the corresponding scope property
 * @param {String} exp - expression
 * @example
 *
 * scopeA = {
 *      name: "Hello World"
 * }
 *
 * scopeA.$getExpValue("{{name}}");
 *
 * It will return "Hello World"
 */
Scope.prototype.$getExpValue = function (exp) {
    return lark.$expression.$get(this, exp);
};

/**
 * Set expression {{}} mapping value
 * @param {String} exp - expression
 * @param {*} value - value
 */
Scope.prototype.$setExpValue = function (exp, value) {
    lark.$expression.$set(this, exp, value);
};

/**
 * Register event handler
 * @param {String} eventName - register event name
 * @param {Function} fn - event handler
 * @returns {Function} fn - event handler
 */
Scope.prototype.$on = function (eventName, fn) {
    this._$$events.push({
        name: eventName,
        fn: fn
    });
    return fn;
};

/**
 * Emit event from this scope to the child scopes
 * @param {String} eventName - Event name
 * @param {*} data -
 */
Scope.prototype.$emit = function (eventName, data) {
    this._$$events.forEach(function (event) {
        if (event.name === eventName && typeof event.fn === 'function') {
            event.fn(data);
        }
    });
    if(!this.$$children || this.$$children.length === 0){
        return;
    }
    this.$$children.forEach(function (child) {
        child.$emit(eventName, data);
    });
};

/**
 * Broadcast event from the top root scope
 * @param {String} eventName - event name
 * @param {*} data - handling data
 */
Scope.prototype.$broadcast = function (eventName, data) {
    lark.$rootScope.$emit(eventName, data);
};

/**
 * Remove event from the events' collection
 * @param {String} eventName - event name
 * @param {Function} fn - event function
 */
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
    if(!eventName){
        this._$$events = null;
    }
    if (index != null) {
        this._$$events.splice(index, 1);
    }
};