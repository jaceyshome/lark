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