lark.addComponent('newTask', ['taskService', function (taskService) {
    return function () {
        return {
            scope: {},
            templateId: "component-new-task-template",
            link: (function ($scope, $element) {

                $scope.create = function() {
                    taskService.setCurrentTask({
                        name: "new task",
                        description: "",
                        estimation: 0
                    });
                    $scope.$broadcast("UPDATE-CURRENT-TASK");
                };

            })
        }
    }
}]);

