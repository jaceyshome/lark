lark.addComponent('newCat', ['catService', function (catService) {
    return function () {
        return {
            scope: {},
            template: '<div>' +
            '<button data-js-click="add()" class="adminButton">add</button>' +
            '<div class="new-cat-container">' +
            '<input data-js-model="newCat.name" placeholder="name"/>' +
            '<input data-js-model="newCat.src" placeholder="src"/>' +
            '</div>' +
            '</div>',
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

