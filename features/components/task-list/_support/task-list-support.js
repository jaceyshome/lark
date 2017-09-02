import _ from 'lodash';

const COMPONENT_NAME = "data-task-list";

class TaskListSupport {

    /**
     * Get this component
     * @param {!string} parent - "the parent container"
     */
    static getContainer(parent){
        return (parent || driver).$(`[${COMPONENT_NAME}]`);
    }

    static getList(container){
        return (container).$$(`[data-js-repeat="task in tasks"]`);
    }

    static getListItem(container, index = 0) {
        return TaskListSupport.getList(container)[index];
    }

}

module.exports = {TaskListSupport};
