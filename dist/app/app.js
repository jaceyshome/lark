var myApp = lark.addApp("mainContainer");

lark.addService('catService', [function () {
    var service = {};

    service.cats = [
        {
            name: "lonely cat",
            src: "assets/images/cat.jpg",
            counter: 0
        },
        {
            name: 'cute cat',
            src: "assets/images/cat2.jpg",
            counter: 1
        },
        {
            name: 'lazy cat',
            src: "assets/images/cat-vet.jpg",
            counter: 2
        },
        {
            name: 'funny cat',
            src: "assets/images/cat3.jpg",
            counter: 3
        },
        {
            name: 'stone cat',
            src: "assets/images/cat4.jpg",
            counter: 4
        }
    ];

    service.currentCat = null;

    return service;
}]);
lark.addComponent('expressionTest', ['catService', function (catService) {
    return function () {
        return {
            scope: {},
            template: "<div>{{cats[0].fn('name',clickTimes)}}</div>",
            link: (function ($scope, $element) {
                $scope.cats = [
                    {
                        name: "lonely cat",
                        clickTimes: 3,
                        fn: function (string, clickTimes) {
                        },
                        children: ['black', 'white']
                    },
                    {
                        name: 'funny cat',
                        counter: 4
                    },
                    {
                        name: 'stone cat',
                        counter: 5
                    }
                ];
            })
        }
    }
}]);


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

