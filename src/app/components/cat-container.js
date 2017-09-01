lark.addComponent('catContainer', ['catService', function (catService) {
    return function () {
        return {
            scope: {},
            template: '<div data-js-if="catService.currentCat">{{catService.currentCat.name}} <a href="javascript:void(0);" data-js-click="clickImage()">' +
            '<img data-js-src="{{catService.currentCat.src}}" alt="cat image for {{catService.currentCant.name}}"/>' +
            '<span>{{catService.currentCat.name}} has been clicked by {{catService.currentCat.counter}} times</span>' +
            '</a>' +
            '<button data-js-click="toggle()" class="adminButton">edit</button>' +
            '<div class="admin-container" data-js-show="showAdmin">' +
            '<input data-js-model="catService.currentCat.name" placeholder="name"/>' +
            '<input data-js-model="catService.currentCat.src" placeholder="src"/>' +
            '<input data-js-model="catService.currentCat.counter" placeholder="counter"/>' +
            '</div>',
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

