lark.addService('taskService', [function () {
    var service = {};

    var _tasks = [
        {
            id: "dj24sf9d",
            name: "task 1",
            estimation: 5
        },
        {
            id: "lsf74ds0",
            name: "task 2",
            estimation: 5
        }
    ];

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
        var task = service.find(candidate.id);
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
        _tasks.forEach(function (task, index) {
            if(task.id === candidate.toString()) {
                return task;
            }
        });

        return undefined;
    };

    /**
     * Remove task from the tasks' list
     * @param {String} candidate - task id
     * @returns {Array} - task list
     */
    service.remove = function(candidate) {
        if(candidate == undefined || service.find(candidate) == undefined) {
            return;
        }
        _tasks.forEach(function(task, index){
            if(task.id === candidate.toString()) {
                _tasks.splice(index,1);
                return _tasks;
            }
        });
        return _tasks;
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