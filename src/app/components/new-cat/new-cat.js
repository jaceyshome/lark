lark.addComponent('newCat', ['catService', function (catService) {
    return function () {
        return {
            scope: {},
            templateId: "component-new-cat-template",
            link: (function ($scope, $element) {

                function reset() {
                    $scope.newCat = {
                        name: '',
                        src: ''
                    };
                }

                $scope.add = function () {
                    if ($scope.newCat.name && $scope.newCat.src) {
                        catService.cats.push($scope.newCat);
                        reset();
                    }
                };

                reset();

            })
        }
    }
}]);

