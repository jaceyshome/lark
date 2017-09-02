lark.addComponent('taskContainer', ['taskService', function (taskService) {
    return function () {
        return {
            scope: {},
            templateId: "component-task-container-template",
            link: (function ($scope, $element) {
                $scope.taskService = taskService;
                $scope.showAdmin = false;
                $scope.clickImage = function (e) {
                    taskService.currentCat && (taskService.currentCat.counter += 1);
                };
                $scope.toggle = function () {
                    $scope.showAdmin = !$scope.showAdmin;
                };
            })
        }
    }
}]);

