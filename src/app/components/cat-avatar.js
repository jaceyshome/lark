lark.addComponent('catAvatar', ['catService', function (catService) {
    return function () {
        return {
            scope: {
                cat: "="
            },
            template: '<div class="cat-avatar-container" data-js-mouseover="mouseOver()" data-js-mouseout="mouseOut()">' +
            '<a class="image-button" href="javascript:void(0);" data-js-click="clickImage()">' +
            '<img data-js-src="{{cat.src}}" alt="cat image"/>' +
            '<span class="text">{{cat.name}}</span>' +
            '</a>' +
            '<button class="delete-button" data-js-click="removeMe()">delete</button>' +
            '</div>',
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

