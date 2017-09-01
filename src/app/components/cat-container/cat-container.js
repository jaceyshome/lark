lark.addComponent('catContainer', ['catService', function (catService) {
    return function () {
        return {
            scope: {},
            templateId: "component-cat-container-template",
            link: (function ($scope, $element) {
                $scope.catService = catService;
                $scope.showAdmin = false;
                $scope.clickImage = function (e) {
                    catService.currentCat && (catService.currentCat.counter += 1);
                };
                $scope.toggle = function () {
                    $scope.showAdmin = !$scope.showAdmin;
                };
            })
        }
    }
}]);

