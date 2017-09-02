import _ from 'lodash';

const COMPONENT_NAME = "data-new-task";

class NewTaskSupport {

    /**
     * Get this component
     */
    static getContainer(parent){
        return (parent || driver).$(`[${COMPONENT_NAME}]`);
    }

    static getButtonCreate(container){
        return (container).$("button");
    }

}

module.exports = {NewTaskSupport};
