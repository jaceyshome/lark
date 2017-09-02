lark.addComponent('taskAvatar', ['taskService', function (taskService) {
    return function () {
        return {
            scope: {
                task: "="
            },
            templateId: "component-task-avatar-template",
            link: (function ($scope, $element) {
                $scope.editTask = function() {
                    taskService.setCurrentTask($scope.task);
                    $scope.$broadcast("UPDATE-CURRENT-TASK");
                };

                $scope.removeMe = function() {
                    taskService.remove($scope.task.id);
                    $scope.$broadcast("UPDATE-CURRENT-TASK");
                }

            })
        }
    }
}]);

