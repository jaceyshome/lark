/**
 * Service $refresh
 * Loop though the whole scope tree, execute watchers of each scope
 */
lark.addService('$refresh', [function () {
    var $refresh = {}, watchers = [];

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