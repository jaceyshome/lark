lark.addComponent('catList', ['catService', function (catService) {
    return function () {
        return {
            templateId: 'component-cat-list-template',
            link: (function ($scope, $element) {
                $scope.cats = catService.cats;
            })
        }
    }
}]);


