lark.addComponent('taskList', ['taskService', function (taskService) {
    return function () {
        return {
            templateId: 'component-task-list-template',
            link: (function ($scope, $element) {
                $scope.tasks = taskService.list();
            })
        }
    }
}]);


