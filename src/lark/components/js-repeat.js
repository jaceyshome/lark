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

