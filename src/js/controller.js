import { events as pubSub } from './events';
import { Task } from './task';
import { Project } from './project';
import * as domElement from './domCollection';

// prevent text selection on double click
document.addEventListener('mousedown', (event) => {
  if (event.detail > 1) {
    event.preventDefault();
  }
});

window.addEventListener('load', () => {
  //load all task and projects to ui
  pubSub.publish('getAllTasksForUI', null);
  pubSub.publish('getAllProjectForUIList', null);

  //display today date in calendar icon
  domElement.todayDateInLeftMenu.textContent =
    new Date().getUTCDate().toString().length != 1
      ? new Date().getUTCDate().toString()
      : '0' + new Date().getUTCDate().toString();

  //assign today and index appropriate id from local storage
  pubSub.publish('getProjectID', [
    domElement.inboxProjectListItem,
    domElement.todayProjectListItem,
  ]);

  //auto select today project on load
  const todayProjectID = domElement.todayProjectListItem.id.substr(
    domElement.todayProjectListItem.id.indexOf('_')
  );
  pubSub.publish('displayProjectTasks', todayProjectID);

  // set calender min due Date  to current day for both new task and edit task forms
  document
    .querySelector('#taskDueDate')
    .setAttribute('min', new Date().toISOString().split('T')[0] + 'T00:00');
  document
    .querySelector('#oldtaskDueDate')
    .setAttribute('min', new Date().toISOString().split('T')[0] + 'T00:00');
});

//open close menu
domElement.mainMenuBtn.addEventListener('click', (e) => {
  document.querySelector('.editor').classList.toggle('toggle');
  domElement.leftMainMenu.classList.toggle('toggle');
});

// home button open todays tasks
domElement.homeButtonMenu.addEventListener('click', (e) => {
  const inboxListItem = document.querySelector(
    'li[data-designation="todayProjects"]'
  );

  pubSub.publish(
    'displayProjectTasks',
    inboxListItem.id.substr(inboxListItem.id.indexOf('_'))
  );

  //remove if already selected and add selected class to clicked node
  _removeCurrentSelection();
  inboxListItem.classList.toggle('selected');
});

//remove selection from all li items in left menu ul
function _removeCurrentSelection() {
  document.querySelector('li.selected')
    ? document
        .querySelector('.left_menu li.selected')
        .classList.remove('selected')
    : undefined;
}

//add task
domElement.newTaskForm.addEventListener('submit', (event) => {
  //bootstrap validation first then publish new event
  if (domElement.newTaskForm.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    domElement.newTaskForm.classList.add('was-validated');
  } else {
    event.preventDefault();
    event.stopPropagation();

    _createNewTask();
    $('#newTaskModal').modal('hide');
    pubSub.publish('clearFormFields', domElement.newTaskForm);
  }
});

//!-- updated this to work with the project id instead of project name thing
//update task
domElement.editTaskForm.addEventListener('submit', (event) => {
  //bootstrap validation first then publish new event
  if (domElement.editTaskForm.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    domElement.editTaskForm.classList.add('was-validated');
  } else {
    event.preventDefault();
    event.stopPropagation();

    const taskID = domElement.editTaskModal.getAttribute('data-TaskID');
    pubSub.publish('updateTask', [
      taskID,
      {
        title: domElement.editTaskFormFields.title.value,
        description: domElement.editTaskFormFields.description.value,
        dueDate: domElement.editTaskFormFields.dueDate.value,
        priority: domElement.editTaskFormFields.priority.value,
        projectID: domElement.editTaskFormFields.project[
          domElement.editTaskFormFields.project.selectedIndex
        ].getAttribute('data-editTaskTargetProject'),
      },
    ]);
    $('#editTaskModal').modal('hide');
    if (_getSelectedProjectID()) {
      pubSub.publish('displayProjectTasks', _getSelectedProjectID());
    }
    pubSub.publish('clearFormFields', domElement.editTaskForm);
  }
});

//add project
domElement.newProjectForm.addEventListener('submit', (event) => {
  if (domElement.newProjectForm.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    domElement.newProjectForm.classList.add('was-validated');
    document.querySelector('#newProjectModal .invalid-feedback').textContent =
      'Project name is required';
  } else if (
    ['today', 'inbox'].includes(
      domElement.newProjectFromFields.name.value.toLowerCase()
    )
  ) {
    event.preventDefault();
    event.stopPropagation();
    domElement.newProjectFromFields.name.classList.add('is-invalid');

    // capitalize the project name
    const capitalizedName =
      domElement.newProjectFromFields.name.value.charAt(0).toUpperCase() +
      domElement.newProjectFromFields.name.value.slice(1);

    // display custom invalid message when using today or inbox as project name
    document.querySelector(
      '#newProjectModal .invalid-feedback'
    ).textContent = `${capitalizedName} is a reserved project name`;
  } else {
    event.preventDefault();
    event.stopPropagation();

    domElement.newProjectFromFields.name.classList.remove('is-invalid');

    _createProject();
    $('#newProjectModal').modal('hide');
    pubSub.publish('clearFormFields', domElement.newProjectForm);
  }
});

// change current displayed project
domElement.projectsMainList.addEventListener('click', (e) => {
  if (e.target.closest('li[id*="project_"]')) {
    // auto hide menu on phone when project licked
    if (window.screen.availWidth < 768) {
      document.querySelector('.editor').classList.toggle('toggle');
      domElement.leftMainMenu.classList.toggle('toggle');
    }

    pubSub.publish(
      'displayProjectTasks',
      e.target.closest('li').id.substr(e.target.closest('li').id.indexOf('_'))
    );

    //remove if already selected and add selected class to clicked node
    _removeCurrentSelection();
    e.target.closest('li').classList.toggle('selected');
  }
});

//various listener for multiple actions
document.addEventListener('click', (e) => {
  //new task button click
  if (e.target.closest('button[id*="add_btn"]')) {
    // fill project list in add task form and select current displayed project
    const selectedProject = _getSelectedProjectID() ?? null;
    pubSub.publish('newTaskFillProjects', selectedProject);
  }

  // completed tasks
  if (e.target.closest(`button[id="completedTasks"]`)) {
    //remove current selected project
    _removeCurrentSelection();

    pubSub.publish('getCompletedTasksToUI', null);
  }

  //edit task button click
  if (e.target.closest('span[id*="editTask"]')) {
    const targetSpanID = e.target.closest('span').id;
    const taskID = targetSpanID.substr(targetSpanID.indexOf('_'));
    pubSub.publish('getTaskForEdit', taskID);
    pubSub.publish('editTaskFromPrjLst', taskID);
  }

  //click popover option to change priority
  if (
    e.target.closest('li') &&
    e.target.closest('ul[id*="changePriorityPopOver"]')
  ) {
    const taskID = e.target
      .closest('ul')
      .id.substr(e.target.closest('ul').id.indexOf('_'));
    pubSub.publish('changeTaskPriority', {
      taskID,
      clickedPriority: e.target.textContent.toLowerCase(),
    });
  }

  //!------ i have the issue here
  //click change project button
  if (e.target.closest('span[id*="projectPopover"]')) {
    const clickedSpan = e.target.closest('span[id*="projectPopover"]');
    const taskID = clickedSpan.id.substr(clickedSpan.id.indexOf('_'));
    pubSub.publish('editProjectPopover', taskID);
  }

  //!------ i have the issue here
  //click popover option to change project
  if (
    e.target.closest('li') &&
    e.target.closest('ul[id*="changeProjectPopover"]')
  ) {
    const taskID = e.target
      .closest('ul')
      .id.substr(e.target.closest('ul').id.indexOf('_'));
    pubSub.publish('changeTaskProject', [
      taskID,
      e.target.getAttribute('data-popoverTargetProjectId'),
    ]);
    if (_getSelectedProjectID()) {
      pubSub.publish('displayProjectTasks', _getSelectedProjectID());
    }
  }

  // click delete task
  if (e.target.closest('span[id*="delete"]')) {
    swal({
      text: 'Are you sure that you want to delete this task?',
      icon: 'warning',
      buttons: ['Cancel', true],
    }).then((willDelete) => {
      if (willDelete) {
        const id = e.target.closest('span').id;
        pubSub.publish('removeTask', id.substr(id.indexOf('_')));
      }
    });
  }

  // collapse task details
  if (
    (e.target.tagName == 'DIV' && e.target.id.includes('task_')) ||
    (e.target.closest('div[data-TargetTaskLeft^="task"]') &&
      e.target.tagName != 'INPUT')
  ) {
    const targetTask = e.target.closest('div[id^="task_"]');
    // collapseT${targetTask.id.substr(1) to remove the small t in task id and replace it with T
    const target = document.querySelector(
      `#collapseT${targetTask.id.substr(1)}`
    );

    if (target.classList.contains('show')) {
      $(`#collapseT${targetTask.id.substr(1)}`).collapse('hide');
    } else {
      $(`#collapseT${targetTask.id.substr(1)}`).collapse('show');
    }
  }

  //click project dropdown menu
  if (e.target.closest('li') && e.target.closest('li').id == 'projects') {
    e.target.closest('li').classList.toggle('rotate_arrow');
  }

  //toast undo button click
  if (e.target.id == 'undoTaskCompete') {
    const toast = e.target.closest('[id^="toast_"]');
    const targetTask = toast.id.substr(toast.id.indexOf('_'));

    taskQueue.splice(targetTask, 1);

    document.querySelector(`#check${targetTask}`).checked = false;
    document
      .querySelector(`#task${targetTask}`)
      .parentNode.classList.remove('hideTask');

    $(`#${toast.id}`).toast('hide');
  }
});

//!--- work on marking the task as done and changing the current project
//listen for task marked as completed
document.addEventListener('change', (e) => {
  if (e.target.id.includes('check_') && e.target.checked == true) {
    const targetedTask = e.target.closest('div[id^="task_"]');
    // targetedTask.setAttribute('data-taskToHide', `${targetedTask.id}`);
    targetedTask.parentNode.classList.add('hideTask');
    _queueTaskForCompletion(
      targetedTask.id.substr(targetedTask.id.indexOf('_'))
    );

    pubSub.publish(
      'displayToast',
      targetedTask.id.substr(targetedTask.id.indexOf('_'))
    );
  }
});

//-- had to make the taskQueGlobal to access it from another listener
let taskQueue = [];
function _queueTaskForCompletion(taskID) {
  if (taskQueue.length > 0) {
    //mark existent task as completed
    pubSub.publish('taskCompleted', taskQueue[0]);

    // add latest completed task to queue
    taskQueue = [];
    taskQueue.push(taskID);
  } else {
    taskQueue.push(taskID);
  }

  // timer to marks task in taskQueue as completed
  setTimeout(() => {
    //store latest task id to avoid executing old timers callBack function on recently taskQueue tasks
    let taskCash = taskID;
    if (taskQueue.length > 0 && taskQueue.includes(taskCash)) {
      pubSub.publish('taskCompleted', taskQueue[0]);

      taskQueue = [];
    }
  }, 5500);
}

function _createNewTask() {
  const task = new Task(
    domElement.newTaskFormFields.title.value,
    domElement.newTaskFormFields.description.value,
    domElement.newTaskFormFields.dueDate.value,
    domElement.newTaskFormFields.priority.value
  );

  // console.log(
  //   domElement.newTaskFormFields.project[
  //     domElement.newTaskFormFields.project.selectedIndex
  //   ].getAttribute('data-newTaskTargetProject')
  // );

  pubSub.publish('saveTask', {
    task,
    projectID: domElement.newTaskFormFields.project[
      domElement.newTaskFormFields.project.selectedIndex
    ].getAttribute('data-newTaskTargetProject'),
  });

  if (_getSelectedProjectID()) {
    pubSub.publish('displayProjectTasks', _getSelectedProjectID());
  }
}

function _createProject() {
  const project = new Project(domElement.newProjectFromFields.name.value);

  pubSub.publish('saveProject', project);
  pubSub.publish('displayProject', project);
}

function _getSelectedProjectID() {
  const selectedProject = document.querySelector(
    '#projectsMainList li.selected'
  );
  return selectedProject
    ? selectedProject.id.substr(selectedProject.id.indexOf('_'))
    : null;
}
