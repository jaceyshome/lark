import _ from'lodash';
import {TaskListSupport} from '../_support/task-list-support';
import {TaskDetailsSupport} from '../../task-details/_support/task-details-support';
import {NewTaskSupport} from '../../new-task/_support/new-task-support';
import {TaskAvatarSupport} from '../../task-avatar/_support/task-avatar-support';

/**
 * Component task list
 */
module.exports = function () {

    let taskListComponent = null;
    let taskDetailsComponent = null;
    let candidateTask = null;

    this.When(/^I create a list item$/, function () {

        taskListComponent = TaskListSupport.getContainer();
        let listLength = TaskListSupport.getList(taskListComponent).length;

        NewTaskSupport.getButtonCreate(NewTaskSupport.getContainer()).click();
        taskDetailsComponent = TaskDetailsSupport.getContainer();
        candidateTask = TaskDetailsSupport.fillTaskDetails(taskDetailsComponent);

        TaskDetailsSupport.getButtonSave(taskDetailsComponent).click();
        expect(TaskListSupport.getList(taskListComponent).length - listLength).toBe(1);

    });

    this.When(/^I delete a list item$/, function () {

        taskListComponent = TaskListSupport.getContainer();
        let listLength = TaskListSupport.getList(taskListComponent).length;
        candidateTask = {
            taskName: TaskListSupport.getListItem(taskListComponent).getText()
        };
        TaskAvatarSupport.getButtonDelete(TaskListSupport.getListItem(taskListComponent)).click();
        expect(listLength - TaskListSupport.getList(taskListComponent).length).toBe(1);

    });

    this.Then(/^I should see it appears in the list$/, function () {
        let lastItem = _.last(TaskListSupport.getList(taskListComponent));
        expect(TaskAvatarSupport.getButtonEdit(lastItem).getText()).toEqual(candidateTask.taskName);
    });

    this.Then(/^I should see it disappears form the list$/, function () {
        let item = _.find(TaskListSupport.getList(taskListComponent), (item)=>{
            return item.getText() === candidateTask.taskName;
        });
        expect(item).toBeUndefined();
    });

};
