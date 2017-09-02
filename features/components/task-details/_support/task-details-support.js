import _ from 'lodash';
import FactoryGirl from 'factory_girl';
import ipsum from 'lorem-ipsum';

const COMPONENT_NAME = "data-task-details";

const ipsumOption = {
    count: 2,           // Number of words, sentences, or paragraphs to generate.
    units: 'words',     // Generate words, sentences, or paragraphs.
    format: 'plain'     // Plain text or html
};

const taskDetailsFields = {
    taskName: 'text',
    taskDescription: 'text',
    taskEstimation: 'number'
};

class TaskDetailsSupport {

    /**
     * Get this component
     */
    static getContainer(parent) {
        return (parent || driver).$(`[${COMPONENT_NAME}]`);
    }

    static getTextInput(container, id) {
        return _.find(container.$$('input'), (formElement)=> {
            return _.camelCase(formElement.getAttribute("id")) === id;
        });
    }

    static getButtonSave(container) {
        return container.$(`[data-js-click="save()"]`);
    }

    static fillTaskDetails(container, data) {
        let properties = TaskDetailsSupport._getProperties(data);
        TaskDetailsSupport._fillForm(container, properties);
        let result = {};
        _.forIn(taskDetailsFields, (data, key)=> {
            result[key] = properties[key].value
        });
        return result;
    }

    /**
     * Fill form fields
     * @param container
     * @param properties
     * @private
     *
     * TODO fillForm can be an individual form component
     */
    static _fillForm(container, properties) {

        _.forIn(properties, (data, key)=> {
            if(data.type === 'textInput') {
                TaskDetailsSupport.getTextInput(container, key).setValue(data.value);
            }
        });
    }

    static _getProperties(data) {
        let factoryName = 'taskDetails';
        if(!FactoryGirl.defined(factoryName)) {
            FactoryGirl.define(factoryName, function() {
                _.forIn(taskDetailsFields, (type, key)=> {
                    this[key] = {
                        value: type === "number" ? Math.floor(Math.random() * (8 - 0)) : ipsum(ipsumOption),
                        type: 'textInput'
                    };
                });
            });
        }
        return _.omit(FactoryGirl.create(factoryName, data), '__name__');
    }

}

module.exports = {TaskDetailsSupport};
