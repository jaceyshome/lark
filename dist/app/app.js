var myApp = lark.addApp("mainContainer");

lark.addService('taskService', [function () {
    var service = {};

    var _tasks = [
        {
            id: "dj24sf9d",
            name: "Aliquam erat",
            description: "Pellentesque ut neque",
            estimation: 2
        },
        {
            id: "lsf74ds0",
            name: "Sed a libero",
            description: "Praesent nonummy mie",
            estimation: 5
        }
    ];

    var _currentTask = null;

    /**
     * List the task
     * @returns {Array} - task list
     */
    service.list = function() {
        return _tasks;
    };

    /**
     * Update task by its id
     * @param candidate
     * @returns {Object|undefined} - task or undefined
     */
    service.update = function(candidate) {
        if(candidate == undefined || candidate.id == undefined) {
            return candidate;
        }
        var task = service.get(candidate.id);
        if(task == undefined) {
            return undefined;
        }
        task.name = candidate.name || task.name;
        task.estimation = candidate.estimation || task.estimation;
        return task;
    };

    /**
     * Add a new task
     * @param {Object} candidate - task object
     * @returns {*}
     */
    service.add = function(candidate) {
        if(candidate == undefined) {
            return candidate;
        }
        var task = candidate;
        task.id = generateId();
        _tasks.push(task);

        return task;
    };

    /**
     * Get the task by its id
     * @param {String} candidate - task id
     * @returns {Object|undefined} - the task or undefined if couldn't find it
     */
    service.get = function(candidate) {
        if(candidate == undefined) {
            return candidate;
        }

        for(var i=0; i<_tasks.length;i++){
            if(_tasks[i].id === candidate.toString()){
                return _tasks[i];
            }
        }

        return undefined;
    };

    /**
     * Remove task from the tasks' list
     * @param {String} candidate - task id
     * @returns {Array} - task list
     */
    service.remove = function(candidate) {
        if(candidate == undefined || service.get(candidate) == undefined) {
            return;
        }

        if( _currentTask && _currentTask.id === candidate.toString()) {
            _currentTask = null;
        }

        _tasks.forEach(function(task, index){
            if(task.id === candidate.toString()) {
                _tasks.splice(index, 1);
                return _tasks;
            }
        });
        return _tasks;
    };

    service.setCurrentTask = function(task){
        _currentTask = task;
    };

    service.getCurrentTask = function(){
        return _currentTask;
    };

    /**
     * generate a new id
     * @param {number} length - id length
     * @returns {String} - id
     */
    function generateId(length) {
        return Math.random().toString(36).substr(2, ( length && length <=8 ) ? length : 8);
    }

    return service;

}]);
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
                    if($scope.currentTask.id == undefined) {
                        taskService.add($scope.currentTask);
                    } else {
                        taskService.update($scope.currentTask);
                    }
                    $scope.currentTask = null;
                };

                init();
            })
        }
    }
}]);


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

