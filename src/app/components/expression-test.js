lark.addComponent('expressionTest', ['taskService', function (taskService) {
    return function () {
        return {
            scope: {},
            template: "<div>{{tasks[0].fn('name',clickTimes)}}</div>",
            link: (function ($scope, $element) {
                $scope.tasks = [
                    {
                        name: "lonely task",
                        clickTimes: 3,
                        fn: function (string, clickTimes) {
                        },
                        children: ['black', 'white']
                    },
                    {
                        name: 'funny task',
                        counter: 4
                    },
                    {
                        name: 'stone task',
                        counter: 5
                    }
                ];
            })
        }
    }
}]);

