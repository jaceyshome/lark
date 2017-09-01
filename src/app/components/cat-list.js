lark.addComponent('catList', ['catService', function (catService) {
    return function () {
        return {
            template: '<div data-js-repeat="cat in cats" data-cat-avatar data-cat="cat"></div>',
            link: (function ($scope, $element) {
                $scope.cats = catService.cats;
            })
        }
    }
}]);

