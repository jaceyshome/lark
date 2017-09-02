import _ from 'lodash';

const COMPONENT_NAME = "data-task-avatar";

class TaskAvatarSupport {

    /**
     * Get this component
     */
    static getContainer(parent){
        return (parent || driver).$(`[${COMPONENT_NAME}]`);
    }

    static getButtonEdit(container) {
        return container.$(`[data-js-click="editTask()"]`);
    }

    static getButtonDelete(container) {
        return container.$(`[data-js-click="removeMe()"]`);
    }
}

module.exports = {TaskAvatarSupport};
