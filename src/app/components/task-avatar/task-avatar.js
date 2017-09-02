lark.addComponent('taskAvatar', ['taskService', function (taskService) {
    return function () {
        return {
            scope: {
                task: "="
            },
            templateId: "component-task-avatar-template",
            link: (function ($scope, $element) {
                $scope.clickImage = function (e) {
                    taskService.currentCat = $scope.task;
                };

                $scope.removeMe = function () {
                    var index = taskService.tasks.indexOf($scope.task);
                    taskService.tasks.splice(index, 1);
                }

            })
        }
    }
}]);

