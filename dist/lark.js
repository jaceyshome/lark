/**
 *  This is the main part of the framework. It registers the components, create and initialise instances
 *  of each component add watchers to watch instances' changes
 *
 */
var lark = (function () {
    var lark = {}, entityTotal = 0,
        $mainContainer = null, _rootScope = null,
        components = [], services = {};

    /**
     * Root scope is public but read only
     * @example
     * lark.$rootScope returns the rootScope of the app
     */
    Object.defineProperty(lark, "$rootScope", {
        get: function () {
            return _rootScope;
        },
        enumerable: false,
        configurable: false
    });

    //--------------------  Public API --------------------
    /**
     * get the application main container and create the rootScope for it.
     * A page only has one main container
     * @param {!String} elementId - main container element id
     * @example 
     *
     * <body>
     *   <div id="mainContainer" >
     *      ....
     *   </div>
     * </body>
     *
     * lark.addApp("mainContainer");
     *
     */
    lark.addApp = function (elementId) {
        $mainContainer = document.getElementById(elementId);
        _rootScope = new Scope(generateUID());
    };

    /**
     * ##Add or register a component##
     * @param {String} name - component name
     * @param {Array} args - component arguments
     *
     * A typical example of the component
     *
     * ```
     * lark.addComponent('componentName', ['ServiceName', function (ServiceName) {
     *       return function () {
     *           return {
     *               scope: { },     //configurable object
     *               template: '',   //view template
     *               link: (function ($scope, $element) {}) //controller
     *           }
     *       }
     *   }]);
     * ```
     *
     * ### Scope ###
     * The scope parameter is a collection of Strings, it is optional, it collects optional properties in
     * the component $scope object. You can use it to get and set the data between sharing scope components
     * or set the configurable options for the component.
     *
     * Get and set the value between components like the parent and the child component.
     * The value is the property of the parent $scope.
     * @example
     *
     * <div data-parent-component >
     *      <div data-child-component data-parent-name="name" >
     *           {{parentName}}
     *      </div>
     * </div>
     *
     *
     * lark.addComponent('parentComponent', [function () {
     *       return function () {
     *           return {
     *               link: (function ($scope, $element) {
     *                   $scope.parentName = "radish";
     *               })
     *           }
     *       }
     *   }]);
     *
     * lark.addComponent('childComponent', [function () {
     *      return function () {
     *          return {
     *              scope: {
     *                  parentName: "="
     *              },
     *              link: (function ($scope, $element) {
     *                  console.log($scope.parentName); //Radish
     *              })
     *          }
     *      }
     *  }]);
     *
     *
     * Get the value of the component scope
     * <div data-featured-panel data-colour="dark" class="{{panelClass}}">
     *     ...
     * </div>
     * @example
     *
     * lark.addComponent('featuredPanel', [function () {
     *      return function () {
     *          return {
     *              scope: {
     *                  colour: "="
     *              },
     *              link: (function ($scope, $element) {
     *                  if($scope.colour == "dark") {
     *                      $scope.panelClass = "dark-panel";
;     *                  }
     *              })
     *          }
     *      }
     *  }]);
     *
     * After initialisation, the rendered view is
     * <div data-featured-panel data-colour="dark" class="dark-panel">
     *      ...
     * </div>
     *
     * ### Template ###
     * It is optional, it is a string of the html template.
     * A template expression is a {{, some contents, followed by a }}
     *
     * <span>{{data.name}}</span>
     * $scope.data = {
     *      name: "Hello World"
     * }
     *
     * rendered html is
     * <span>Hello World</span>
     *
     *
     * it supports function execution ()
     *   {{cats[0].fn('name',clickTimes)}}
     *
     *
     *   FIXME: this feature should be considered to be removed, as it provides the opportunity for passing the implementation
     *   details between components. Different components should use only data to communicate to each other, like black boxes.
     *   If the scope A passes the function into the sharing data, scope B is able to execute the function of the scope A,
     *   it means the scope A may expose its implementation details to the scope B, those two components may have strong
     *   dependencies on each other.
     *
     * Details about the expression in the expression service
     *
     * ### Link ###
     * The link parameter is the function called by the lark to on initialisation step
     * It has two parameters $scope and $element
     *
     *
     * $scope is the component object, which is the scope mapping to the component dom element.
     * $element is the dom element of the component
     *
     * @example
     *  lark.addComponent('CompHelloWorld', ['helloService', function (helloService) {
     *       return function () {
     *           return {
     *               scope: {
     *                   name: "="
     *               },
     *               template: '<div>{{displayHello}} {{displayWorld}} {{name}} !</div>',
     *               link: (function ($scope, $element) {
     *                   $scope.displayHello = helloService.getHello();
     *                   $scope.displayWorld = "World";
     *               })
     *           }
     *       }
     *   }]);
     *
     * An instance in the html page
     * @example
     * <div data-comp-hello-world data-name="Lark" ></div>
     *
     * After the initialisation, the result is
     * @example
     * <div data-comp-hello-world  data-name="Lark" >
     *      <div>Hello World Lark !</div>
     * </div>
     *
     *
     */
    lark.addComponent = function (name, args) {
        var _fn = args.pop(),
            _argServices = getServicesFromNames(args);
        components.push({
            name: name,
            attr: name.replace(/([A-Z])/g, "-$1").toLowerCase(),
            fn: _fn.apply(this, _argServices)
        });

        /**
         * TODO it may need to add priority property to the component to sort the elements based
         * on the component priority.
         * For the situation of the components sharing the same scope or different level of scopes
         * the priority property helps to define which component loading firstly,
         * to avoid the dependency problem if the low priority component waits for high priority component
         * finishes loading firstly
         *
         *  _components.sort(function(a,b) {
         *      if(a.fn().priority > b.fn().priority) {
         *          return 1;
         *      }
         *      if(a.fn().priority < b.fn().priority) {
         *          return -1;
         *      }
         *      return 0;
         *  });
         *
         *
         */

    };

    /**
     * Add / register the service instance.
     * @param {String} name - service name
     * @param {Array} args - service arguments
     * @returns {Object} - this service
     */
    lark.addService = function (name, args) {
        var _fn = args.pop(),
            _argServices = getServicesFromNames(args);
        services[name] = Service.call(_fn.apply(this, _argServices), generateUID());
        return services[name];
    };

    /**
     * Run the lark to setup the application, normally call this function after target dom element is loaded
     */
    lark.run = function () {
        setPublicServers();
        //collect all templates
        lark.$template.init($mainContainer);
        //build the scope tree structure
        loopElements(createScope(_rootScope), $mainContainer.children);
    };

    lark.bindMatchedComponents = bindMatchedComponents;
    lark.createScope = createScope;
    lark.generateUID = generateUID;

    //---------------------- Private helpers ---------------------
    /**
     * Create public services, which can be used for all components
     */
    function setPublicServers() {
        lark.$refresh = services["$refresh"];
        lark.$template = services["$template"];
        lark.$cache = services["$cache"];
        lark.$expression = services["$expression"];
    }

    function generateUID() {
        var id = "_" + entityTotal;
        entityTotal += 1;
        return id;
    }

    function getServicesFromNames(objNames) {
        var _objects = [];
        if (!objNames) {
            return [];
        }
        for (var i = 0, length = objNames.length; i < length; i++) {
            _objects.push(services[objNames[i]]);
        }
        return _objects;
    }

    /**
     * Scan the children elements of the current scope element to find the components
     * in the list of the components
     * @param {!Object} scope - Scope of the current element
     * @param {Array} elements - a list of the child elements of the current scope element
     */
    function loopElements(scope, elements) {
        for (var index = 0, length = elements.length; index < length; index++) {
            bindMatchedComponents(scope, elements[index]);
        }
    }

    /**
     * Bind the scope to the element, it will check whether the element has the attribute as the name
     * of the component and bind the scope onto it
     * @param {Object} scope - scope object
     * @param {Element} element - dom element
     */
    function bindMatchedComponents(scope, element) {
        if(element == undefined){
            return;
        }
        for (var i = 0, comLength = components.length; i < comLength; i++) {
            if (element.hasAttribute(components[i].attr) ||
                element.hasAttribute("data-" + components[i].attr)) {
                //returning scope will be a child
                scope = bindComponent(scope, element, components[i]);
            }
        }

        //Register this scope and the element to the watcher, which watches the changes of the scope
        //And update the scope and refresh the element
        addWatchersToElement(scope, element);

        //Scan its child elements
        loopElements(scope, element.children);
    }

    /**
     * Create scope object
     * @param {!Object} parentScope - the parent scope of the
     * @returns {Object} scope
     */
    function createScope(parentScope) {
        var _scope = new Scope(generateUID());
        _scope.$$parent = parentScope;
        parentScope.$addChild(_scope);
        return _scope;
    }

    /**
     * * @example
     * lark.addComponent('helloWorldComponent', ['httpService', function (httpService) {
            return function () {
                return {
                    scope: {

                    },
                    templateId: ""
                    template: "<div>{{displayHello}} {{displayWorld}}</div>",

                    link: (function ($scope, $element) {
                       $scope.displayName =  HttpService.getData();
                    })
                }
            }
     *  }]);
     * @param scope
     * @param element
     * @param component
     * @returns {*}
     */
    function bindComponent(scope, element, component) {
        var _component = component.fn(), _scope = {}, attr = null, parentScope = scope;
        //Create a new scope if the scope is isolated, otherwise different elements share the same scope
        if (_component.scope) {
            scope = createScope(scope);
            for (var key in _component.scope) {
                if (_component.scope.hasOwnProperty(key)) {
                    attr = key.replace(/([A-Z])/g, "-$1");
                    //get object from parent scope
                    _scope[key] = parentScope.$getExpValue(element.getAttribute(attr) || element.getAttribute("data-" + attr));
                }
            }
            scope.extend(_scope);
        }
        /**
         * template and template id principle
         * If template exists, use template, otherwise uses templateId
         */
        if (_component.template) {
            element.innerHTML = _component.template;
        }
        if (_component.templateId) {
            element.innerHTML = lark.$template.get(_component.templateId);
        }
        _component.link(scope, element);
        return scope;
    }

    /**
     * Add watcher to the scope and the corresponding dom element. The watcher watches the
     * changes of the dom element attributes or text nodes
     *
     * @param {!Object} scope - scope object
     * @param {!Element} element - dom element
     */
    function addWatchersToElement(scope, element) {
        var TEXT_NODE_TYPE = 3;

        //Watch the child element changes
        element.hasAttributes() && Array.prototype.forEach.call(element.attributes, function (attr) {
            watchElementAttribute(scope, element, attr);
        });

        //Watch the child text node changes
        element.childNodes && Array.prototype.forEach.call(element.childNodes, function (node) {
            //only care about text node
            if (node.nodeType == TEXT_NODE_TYPE) {
                //it is text node, need to wrap with span
                watchChildNode(scope, element, node);
            }
        });
    }

    /**
     * Create a watcher to watch the text node if the attribute has the expression {{}}
     * @param {!Object} scope - the scope of the element
     * @param {!Element} element - the dom element
     * @param {Object} node - a dom node of the element
     */
    function watchChildNode(scope, element, node) {
        //Check whether the element has the expression
        var results = node.textContent.match(/{{\s*?(.+?)\s*?}}/ig);
        if (results != null) {
            //It using the expression as the key, return the function to the watcher,
            //so once the node text change, scope.$watch will execute the function
            scope.$watch(results, (function (element, node) {
                //Cache the old value
                var oldVals, originalTextContent = node.textContent;
                return function (newVals) {
                    var newTextContent = originalTextContent;

                    //Update the old value if it doesn't equal the new value
                    if (newVals != oldVals) {
                        newVals.forEach(function (newVal) {
                            newTextContent = newTextContent.replace(/({{\s*?.+?\s*?}})/i, newVal != undefined ? newVal : '');
                        });
                        node.textContent = newTextContent;
                        oldVals = newVals;
                    }
                };
            })(element, node));
        }
    }

    /**
     * Create a watcher to watch the element attribute if the attribute has the expression {{}}
     * @param {Object} scope - the scope of the element
     * @param {Element} element - the dom element
     * @param {Object} attr - an attribute of the element
     */
    function watchElementAttribute(scope, element, attr) {
        //Check whether the element has the expression
        var results = attr.value.match(/{{\s*?(.+?)\s*?}}/ig), oldVal;
        if (results != null) {
            scope.$watch(results, (function (attr) {
                var oldVals, originalValue = attr.value;

                //Apply the new value to the element attribute
                return function (newVals) {
                    var newValue = originalValue;
                    if (newVals != oldVals) {
                        newVals.forEach(function (newVal) {
                            newValue = newValue.replace(/({{\s*?.+?\s*?}})/i, newVal != undefined ? newVal : '');
                        });
                        attr.value = newValue;
                        oldVals = newVals;
                    }
                };
            })(attr));
        }
    }

    return lark;

})();

/**
 * After page loaded, it will start to run the lark
 */
document.addEventListener("DOMContentLoaded", function () {
    lark.run();
});
/**
 * Service constructor
 * @param {String} id - service id
 * @returns {Object} service - a new instance of service
 * @constructor
 */
function Service(id) {
    var service = this;
    service.__id = id;
    return service;
}

/**
 * Service Expression
 * Expression {{}} is use for the html page to present the model value
 *
 * ###Principles###
 * It support object and function mapping
 *
 * {{cats[0].fn('name',obj.key)}}
 * {{cat.key.name}}
 *
 * It doesn't support mathematical markup
 * {{2+2=4}}
 * {{number1 + number2}}
 */
lark.addService('$expression', ["$cache", function ($cache) {

    var MAX_SAFE_INTEGER = 9007199254740991;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
        reIsPlainProp = /^\w*$/,
        rePropName = /([^.\d]{1}[^.]+\(.*\))|[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
    var reEscapeChar = /\\(\\)?/g;
    var service = {}, cache = {};

    /**
     * Get the value from object property paths
     * supports
     * {{cats[0].fn('name',obj.key)}}
     * {{cat.key.name}}
     * Doesn't support {{2+2=4}}
     */
    service.$get = function (obj, exp) {
        if (exp == null) {
            return;
        }
        var defaultValue = '';
        var result = null;
        exp = exp.replace(/{{|}}/g, '');
        if (obj == null) {
            return;
        }
        result = cache[exp];
        if (result == undefined) {
            result = toPath(exp);
        }
        if (result == undefined) {
            return defaultValue;
        }
        cache[exp] = result;
        return getValue(obj, toPath(exp));
    };

    /**
     * Set value to the expression
     * @param {Object} object - model object
     * @param {String} exp - expression
     * @param {*} value - value needs to set
     * @returns {*}
     */
    service.$set = function (object, exp, value) {
        if (object == null) {
            return object;
        }
        var path = cache[exp], pathKey = (path + '');
        if (path == undefined) {
            path = toPath(exp);
        }
        if (path == undefined) {
            return '';
        }
        cache[exp] = path;
        path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : path;

        var index = -1,
            length = path.length,
            lastIndex = length - 1,
            nested = object;

        while (nested != null && ++index < length) {
            var key = path[index];
            if (isObject(nested)) {
                if (index == lastIndex) {
                    nested[key] = value;
                } else if (nested[key] == null) {
                    nested[key] = isIndex(path[index + 1]) ? [] : {};
                }
            }
            nested = nested[key];
        }
        return object;
    };

    //-------------------------- Helpers ---------------------------
    function isIndex(value, length) {
        value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return value > -1 && value % 1 == 0 && value < length;
    }

    function isKey(value, object) {
        var type = typeof value;
        if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
            return true;
        }
        if (Object.prototype.toString.call(value) === '[object Array]') {
            return false;
        }
        var result = !reIsDeepProp.test(value);
        return result || (object != null && value in toObject(object));
    }

    function toPath(value) {
        var result = [];
        //TODO: need to add extra code if the value can be an array.
        value.replace(rePropName, function (match, fn, number, quote, string) {
            result.push(quote ? string.replace(reEscapeChar, '$1') : (handleFnPath(fn) || number || match));
        });
        return result;
    }

    function handleFnPath(match) {
        var result = match;
        if (match) {
            match.replace(/(.*)\((.*?)\)/ig, function (match, fnName, fnArguments) {
                if (fnName) {
                    result = (function () {
                        return function (master, self) {
                            var paths = (fnArguments.split(",")).map(function (arg) {
                                return toPath(arg)
                            });
                            if (typeof self[fnName] == "function") {
                                var isArgs = true, args = paths.map(function (path) {
                                    return getValue(master, path, isArgs)
                                });
                                return self[fnName].apply(self, args);
                            }
                        }
                    })();
                }
            })
        }
        return result;
    }

    function getValue(object, path, isFnArgs) {
        var master = object, pathKey = (path + ''), result, index = 0, length = path.length;
        if (object == null) {
            return;
        }
        if (pathKey !== undefined && pathKey in toObject(object)) {
            path = [pathKey];
        }
        while (object != null && index < length) {
            if (typeof path[index] == "function") {
                object = path[index](master, object);
            } else {
                if (object.hasOwnProperty(path[index])) {
                    object = object[path[index]];
                } else {
                    if (isFnArgs) {
                        //If object doesn't has this key, return the key if it is function args
                        return path[index];
                    } else {
                        object = null;
                    }
                }
            }
            index = index + 1;
        }
        return (index && index == length) ? object : undefined;
    }

    function toObject(value) {
        return isObject(value) ? value : Object(value);
    }

    function isObject(value) {
        // Avoid a V8 JIT bug in Chrome 19-20.
        // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
        var type = typeof value;
        return !!value && (type == 'object' || type == 'function');
    }

    return service;

}]);
/**
 * Service $refresh
 * Loop though the whole scope tree, execute watchers of each scope
 */
lark.addService('$refresh', [function () {
    var $refresh = {}, watchers = [];

    //TODO should provide the scope parameter to limit the scanning
    $refresh.loop = function () {
        execScopeWatchers(lark.$rootScope);
    };

    function execScopeWatchers(scope) {
        if (scope == null) {
            return;
        }
        scope.$execWatchers();
        if (scope.$$children && scope.$$children.length > 0) {
            scope.$$children.forEach(function (childScope) {
                childScope.$execWatchers();
                execScopeWatchers(childScope);
            })
        }
    }

    return $refresh;
}]);
/**
 * Service $template
 * Loop though the whole scope tree, execute watchers of each scope
 */
lark.addService('$template', [function () {
    var $template = {}, templates = {};

    /**
     * Get template by its id
     * @param {String} id - template id
     */
    $template.get = function(id) {
        return templates[id];
    };

    /**
     *
     */
    $template.init = function(mainContainer) {
        var list = document.querySelectorAll('[type="text/x-lark-template"]');
        Array.prototype.forEach.call(list, function(template){
            add(template.id, template.innerHTML);
        });
    };

    /**
     * Add template to templates
     * @param {String} id
     * @param template
     * @return template
     */
    function add(id, template) {
        if(templates[id] !== undefined && templates[id] !== template){
            console.warn("template: " + id + "has been registered");
            return templates[id];
        }
        templates[id] = template;
        return templates[id];
    }

    return $template;
}]);
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

    //FIXME: for js-repeat component, it doesn't remove the scope just has watchers[0] and events[0]
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
(function () {
    ('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' ')).forEach(function (eventName) {
        var marker = 'js',
            componentName = marker + eventName.charAt(0).toUpperCase() + eventName.slice(1),
            attrName = marker + '-' + eventName;
        lark.addComponent(componentName, [function () {
            return function () {
                return {
                    link: (function ($scope, $element) {
                        var fnStr = $element.getAttribute(attrName) || $element.getAttribute('data-' + attrName),
                            fnName = fnStr.replace(/\(.*?\)/g, '');
                        //TODO past event to inner function
                        $element.addEventListener(eventName, function (event) {
                            ($scope[fnName] != undefined) && $scope[fnName]();
                            $scope.$update();
                        }, false);
                    })
                }
            }
        }]);
    });
})();


/**
 * Hide and show component
 */
lark.addComponent('jsHide', [function () {
    return function () {
        return {
            //TODO provide ability to add custom show class and hide class
            scope: {
                showClass: "="
            },
            link: (function ($scope, $element) {
                var expression = $element.getAttribute('js-hide') || $element.getAttribute('data-js-hide');
                $scope.$watch(expression, function (val) {
                    if (val) {
                        $element.style.display = 'none';
                    } else {
                        $element.style.display = 'block';
                    }
                });
            })
        }
    }
}]);
/**
 * Remove and Add the dom element base on the condition
 * 
 */
lark.addComponent('jsIf', [function () {
    return function () {
        return {
            link: (function ($scope, $element) {
                var expression = $element.getAttribute('js-if') || $element.getAttribute('data-js-if');
                var $parentNode = $element.parentNode;
                $scope.$watch(expression, function (val) {
                    if (val && !$element.parentNode != $parentNode) {
                        $parentNode.appendChild($element);
                    } else {
                        $parentNode.removeChild($element);
                    }
                });
            })
        }
    }
}]);


lark.addComponent('jsModel', [function () {
    return function () {
        return {
            link: (function ($scope, $element) {
                var expression = $element.getAttribute('js-model') || $element.getAttribute('data-js-model');
                if (expression) {
                    $element.value = $scope.$getExpValue(expression);
                }

                $scope.$watch(expression, function (val) {
                    if ($element.value !== val) {
                        $element.value = (val === undefined) ? '' : val;
                    }
                });

                $element.addEventListener("keyup", (function () {
                    var oldValue = null;
                    return function (e) {
                        if (oldValue != e.target.value) {
                            $scope.$setExpValue(expression, e.target.value);
                            $scope.$update();
                        }
                        oldValue = e.target.value;
                        e.target.focus();
                    };
                })());
            })
        }
    }
}]);


/**
 * Data-js-repeat
 *
 * It instantiates a html tempalte once per item from a collection or an array. Each instance gets its own scope, where the given loop variable is set to the current collection item, and $index is set to the item index or key.
 * @example
 * <ul>
 *      <li data-js-repeat="task in tasks" >
 *          <p>{{task.name}}</p>
 *      </li>
 * </ul>
 *
 * Result
 * <ul>
 *      <li data-js-repeat="task in tasks" >
 *          <p>task A</p>
 *      </li>
 *      <li data-js-repeat="task in tasks" >
 *          <p>task B</p>
 *      </li>
 *      <li data-js-repeat="task in tasks" >
 *          <p>task C</p>
 *      </li>
 * </ul>
 *
 * Use component and its value
 *
 * Country
 * <data-component-country>
 *     <h3>{{country.name}}</h3>
 *     <p>{{country.intro}}</p>
 * </data-component-country>
 *
 * <div data-js-repeat="country in countries" data-component-country data-country="country"></div>
 *
 *
 */
lark.addComponent('jsRepeat', [function () {
    return function () {
        return {
            link: (function ($scope, $element) {
                var expression = $element.getAttribute('js-repeat') || $element.getAttribute('data-js-repeat');
                var results = expression.match(/(\w+)\s+?[Ii][Nn]\s+?(\w+)/);
                var match = results[0], itemKey = results[1], itemsKey = results[2];

                function init() {
                    if (
                        $scope.hasOwnProperty('$index') &&
                        $scope.hasOwnProperty(itemKey) && $scope.hasOwnProperty(itemsKey) &&
                        $scope.$index == $scope[itemsKey].indexOf($scope[itemKey])
                    ) {
                        //TODO child todo
                    } else {
                        addWatcherOnParent();
                        $element.parentNode.removeChild($element);
                    }
                }

                function createCachedScope() {
                    //cachedScope it is used for creating a scope for repeating scopes
                    var cachedScope = lark.createScope($scope.$$parent);
                    cachedScope.extend($scope);
                    delete cachedScope.$index;
                    cachedScope.watchers = [];
                    $scope.$$parent.$removeChild(cachedScope);
                    return cachedScope;
                }

                /**
                 * Add watchers to watch updating, adding, removing list items
                 * FIXME: it is better to make those handlers into static methods or into a service to save memory
                 */
                function addWatcherOnParent() {
                    $scope.$$parent.$watch((function (itemsKey) {
                            return function () {
                                return $scope.$getExpValue(itemsKey);
                            }
                        })(itemsKey), (function (scope, element, expression, itemKey, itemsKey, cachedChildScope, cachedChildElement) {
                            var cacheString = null, fn, children = null;
                            fn = function (items) {
                                if (cacheString != JSON.stringify(items)) {
                                    var length, state = (cacheString == null || items == null) ? 'initItems' :
                                        (length = (JSON.parse(cacheString).length - JSON.parse(JSON.stringify(items)).length));
                                    state = (state == 'initItems') ? 'initItems'
                                        :
                                        (length === 0) ? 'childrenChanges' : (length > 0) ? 'hasRemovedItems' : 'hasNewItems';
                                    switch (state) {
                                        case 'initItems':
                                            handleNewItems(scope, items, cachedChildElement);
                                            break;
                                        case 'childrenChanges':
                                            handleChildrenChanges(items);
                                            break;
                                        case 'hasRemovedItems':
                                            handleRemovedItems(items);
                                            break;
                                        case 'hasNewItems':
                                            handleNewItems(scope, items, cachedChildElement);
                                            break;
                                        default :
                                            break;
                                    }
                                    cacheString = JSON.stringify(items);
                                }
                            };


                            function handleChildrenChanges(items) {
                                //Currently, only handle children index changes
                                var newIndex;
                                if (!children || children.length === 0) {
                                    return;
                                }
                                for (var i = 0, len = children.length; i < len; i++) {
                                    newIndex = items.indexOf(children[i][itemKey]);
                                    children[i].$index = (children[i].$index == newIndex) ? children[i].$index : newIndex;
                                }
                            }

                            function handleRemovedItems(items) {
                                var child, hasChanged = false;
                                if (!children || children.length === 0 || items == null) {
                                    return;
                                }
                                for (var i = 0, len = children.length; i < len; i++) {
                                    child = children[i];
                                    if (child != undefined && items.indexOf(child[itemKey]) < 0) {
                                        hasChanged = true;
                                        delete child[itemsKey];
                                        delete child[itemKey];
                                        (!!child.$element) && child.$element.parentNode.removeChild(child.$element);
                                        children.splice(children.indexOf(child), 1);
                                        child.$destroy();
                                    }
                                }
                                (hasChanged) && handleChildrenChanges(items);
                            }

                            function handleNewItems(scope, items, cachedChildElement) {
                                //first find all children with items attribute
                                var newChildScope, childElement, newElementFns = [];
                                if (items == null) {
                                    return;
                                }
                                if (children == null) {
                                    children = [];
                                }
                                for (var i = children.length, len = items.length; i < len; i++) {
                                    childElement = cachedChildElement.cloneNode(true);
                                    element.appendChild(childElement);
                                    newChildScope = lark.createScope(scope);
                                    newChildScope.extend(cachedChildScope);
                                    newChildScope.$index = i;
                                    newChildScope[itemKey] = items[i];
                                    newChildScope.$element = childElement;
                                    newChildScope.$$parent = scope;
                                    children.push(newChildScope);
                                    newElementFns.push((function (childScope, childElement) {
                                        return function () {
                                            lark.bindMatchedComponents(childScope, childElement)
                                        };
                                    })(newChildScope, childElement));
                                }
                                if (newElementFns.length > 0) {
                                    for (var j = 0, length = newElementFns.length; j < length; j++) {
                                        newElementFns[j]();
                                    }
                                }
                            }

                            return fn;
                        })(
                        $scope.$$parent, $element.parentNode,
                        expression, itemKey, itemsKey,
                        createCachedScope(), $element.cloneNode(true)
                    ));
                }

                init();

            })
        }
    }
}]);


/**
 * Show and hide component
 */
lark.addComponent('jsShow', [function () {
    return function () {
        return {
            //TODO provide ability to add custom show class and hide class
            scope: {
                showClass: "="
            },
            link: (function ($scope, $element) {
                var expression = $element.getAttribute('js-show') || $element.getAttribute('data-js-show');
                $scope.$watch(expression, function (val) {
                    if (val) {
                        $element.style.display = 'block';
                    } else {
                        $element.style.display = 'none';
                    }
                });
            })
        }
    }
}]);


lark.addComponent('jsSrc', [function () {
    return function () {
        return {
            link: (function ($scope, $element) {
                $scope.$watch(
                    function () {
                        return $element.getAttribute('js-src') || $element.getAttribute('data-js-src');
                    },
                    (function () {
                        var oldValue = null;
                        return function (newVal) {
                            if (oldValue != newVal) {
                                $element.setAttribute('src', newVal);
                                oldValue = newVal;
                            }
                        }
                    })()
                );
            })
        }
    }
}]);

