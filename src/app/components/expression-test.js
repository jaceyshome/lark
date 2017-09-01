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

