lark.addComponent('newCat', ['taskService', function (taskService) {
    return function () {
        return {
            scope: {},
            templateId: "component-new-task-template",
            link: (function ($scope, $element) {

                function reset() {
                    $scope.task = {
                        name: '',
                        src: ''
                    };
                }

                $scope.add = function () {
                    if ($scope.task.name && $scope.task.src) {
                        taskService.tasks.push($scope.newCat);
                        reset();
                    }
                };

                reset();

            })
        }
    }
}]);

