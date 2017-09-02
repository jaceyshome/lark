lark.addComponent('taskDetails', ['taskService', function (taskService) {
    return function () {
        return {
            scope: {},
            templateId: "component-task-details-template",
            link: (function ($scope, $element) {

                function init() {
                    $scope.currentTask = null;
                    getCurrentTask();
                    $scope.$on("UPDATE-CURRENT-TASK", getCurrentTask);
                }

                function getCurrentTask() {
                    $scope.currentTask = JSON.parse(JSON.stringify(taskService.getCurrentTask()));
                }

                $scope.save = function() {
                    taskService.update($scope.currentTask);
                    $scope.currentTask = null;
                };

                init();
            })
        }
    }
}]);

