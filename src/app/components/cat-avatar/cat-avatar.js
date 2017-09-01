lark.addComponent('catAvatar', ['catService', function (catService) {
    return function () {
        return {
            scope: {
                cat: "="
            },
            templateId: "component-cat-avatar-template",
            link: (function ($scope, $element) {
                $scope.clickImage = function (e) {
                    catService.currentCat = $scope.cat;
                };

                $scope.removeMe = function () {
                    var index = catService.cats.indexOf($scope.cat);
                    catService.cats.splice(index, 1);
                }

            })
        }
    }
}]);

