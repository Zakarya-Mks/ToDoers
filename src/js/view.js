import { DomHelperFunctions as domHelpers } from './domHelperFunctions';
import { events as pubSub } from './events';
import * as domElement from './domCollection';

[
  ['displayTask', displayTask],
  ['displayAllTasks', displayAllTasks],
  ['clearFormFields', _clearFormFields],
  ['removeTask', removeTaskFromUi],
  ['changeTaskPriority', updatePriorityPopOver],
  ['editThisTask', displayTaskEditModal],
  ['displayAllProjects', displayAllProjects],
  ['displayProject', displayProject],
  ['fillNewTaskPrjLst', fillNewTaskPrjLst],
  ['fillEditTaskPrjLst', fillEditTaskPrjLst],
  ['UpdateEditorTitle', setEditorTitle],
  ['projectPopoverData', fillProjectPopoverWithData],
  ['updateProjectPopoverData', updateProjectPopoverWithData],
  ['displayToast', displayToast],
  ['displayAllCompletedTasks', displayCompletedTasks],
].forEach((event) => {
  pubSub.on(event[0], event[1]);
});

function displayTask(task) {
  const taskNodeElement = _creatTaskNode(task);
  domElement.editorContent.append(taskNodeElement);

  _activateBootstrapToolTip();
  $(document).ready(function () {
    _activateListPopover(task);
    pubSub.publish('fillProjectPopover', task.id);
  });
}

function displayAllTasks(allTasksArr) {
  domElement.editorContent.innerHTML = '';
  allTasksArr.forEach((task) => {
    displayTask(task);
  });
}

function displayCompletedTasks(completedTasksArr) {
  domElement.editorContent.innerHTML = '';

  completedTasksArr.forEach((completedTask) => {
    const taskCard = _displayCompletedTask(completedTask);
    domElement.editorContent.append(taskCard);
  });
}

function _displayCompletedTask({ project, task, 'completed-on': completedOn }) {
  const taskDetails = domHelpers.createElementWithClass('div', [
    'wrapper',
    'border',
    'rounded',
    'd-flex',
    'flex-column',
    'flex-md-row',
    'm-1',
    'mx-md-3',
  ]);
  taskDetails.style.fontSize = '14px';

  const taskDetailsFirstCol = domHelpers.createElementWithClass('div', [
    'col-md-5',
    'px-2',
  ]);

  const taskDetailsFirstColFirstCell = domHelpers.createElementWithClass(
    'div',
    'p-1'
  );
  const taskDetailsFirstColFirstCellFirstSpan = domHelpers.createElementWithClass(
    'span'
  );
  taskDetailsFirstColFirstCellFirstSpan.style.fontWeight = '500';
  taskDetailsFirstColFirstCellFirstSpan.textContent = 'Title: ';
  const taskDetailsFirstColFirstCellSecondSpan = domHelpers.createElementWithClass(
    'span',
    'ml-1'
  );
  taskDetailsFirstColFirstCellSecondSpan.textContent = task.title;

  const taskDetailsFirstColSecondCell = taskDetailsFirstColFirstCell.cloneNode();

  const taskDetailsFirstColSecondCellFirstSpan = taskDetailsFirstColFirstCellFirstSpan.cloneNode();
  taskDetailsFirstColSecondCellFirstSpan.textContent = 'Due date: ';
  const taskDetailsFirstColSecondCellSecondSpan = taskDetailsFirstColFirstCellSecondSpan.cloneNode();
  taskDetailsFirstColSecondCellSecondSpan.textContent = new Date(
    task.dueDate
  ).toLocaleString();

  const taskDetailsFirstColThirdCell = taskDetailsFirstColFirstCell.cloneNode();

  const taskDetailsFirstColThirdCellFirstSpan = taskDetailsFirstColFirstCellFirstSpan.cloneNode();
  taskDetailsFirstColThirdCellFirstSpan.textContent = 'Completed: ';
  const taskDetailsFirstColThirdCellSecondSpan = taskDetailsFirstColFirstCellSecondSpan.cloneNode();
  taskDetailsFirstColThirdCellSecondSpan.textContent = completedOn;

  const taskDetailsSecondCol = domHelpers.createElementWithClass('div', [
    'col',
    'px-2',
  ]);

  const taskDetailsSecondColFirstCell = taskDetailsFirstColFirstCell.cloneNode();

  const taskDetailsSecondColFirstCellFirstSpan = taskDetailsFirstColFirstCellFirstSpan.cloneNode();
  taskDetailsSecondColFirstCellFirstSpan.textContent = 'Description: ';
  const taskDetailsSecondColFirstCellSecondSpan = taskDetailsFirstColFirstCellSecondSpan.cloneNode();
  taskDetailsSecondColFirstCellSecondSpan.textContent = task.description;

  const taskDetailsSecondColSecondCell = taskDetailsFirstColFirstCell.cloneNode();

  const taskDetailsSecondColSecondCellFirstSpan = taskDetailsFirstColFirstCellFirstSpan.cloneNode();
  taskDetailsSecondColSecondCellFirstSpan.textContent = 'Priority: ';
  const taskDetailsSecondColSecondCellSecondSpan = taskDetailsFirstColFirstCellSecondSpan.cloneNode();
  taskDetailsSecondColSecondCellSecondSpan.textContent = task.priority;

  const taskDetailsSecondColThirdCell = taskDetailsFirstColFirstCell.cloneNode();

  const taskDetailsSecondColThirdCellFirstSpan = taskDetailsFirstColFirstCellFirstSpan.cloneNode();
  taskDetailsSecondColThirdCellFirstSpan.textContent = 'Project: ';
  const taskDetailsSecondColThirdCellSecondSpan = taskDetailsFirstColFirstCellSecondSpan.cloneNode();
  taskDetailsSecondColThirdCellSecondSpan.textContent = project;

  // append children
  taskDetailsFirstColFirstCell.append(
    taskDetailsFirstColFirstCellFirstSpan,
    taskDetailsFirstColFirstCellSecondSpan
  );

  taskDetailsFirstColSecondCell.append(
    taskDetailsFirstColSecondCellFirstSpan,
    taskDetailsFirstColSecondCellSecondSpan
  );

  taskDetailsFirstColThirdCell.append(
    taskDetailsFirstColThirdCellFirstSpan,
    taskDetailsFirstColThirdCellSecondSpan
  );

  taskDetailsFirstCol.append(
    taskDetailsFirstColFirstCell,
    taskDetailsFirstColSecondCell,
    taskDetailsFirstColThirdCell
  );

  taskDetailsSecondColFirstCell.append(
    taskDetailsSecondColFirstCellFirstSpan,
    taskDetailsSecondColFirstCellSecondSpan
  );

  taskDetailsSecondColSecondCell.append(
    taskDetailsSecondColSecondCellFirstSpan,
    taskDetailsSecondColSecondCellSecondSpan
  );

  taskDetailsSecondColThirdCell.append(
    taskDetailsSecondColThirdCellFirstSpan,
    taskDetailsSecondColThirdCellSecondSpan
  );

  taskDetailsSecondCol.append(
    taskDetailsSecondColFirstCell,
    taskDetailsSecondColSecondCell,
    taskDetailsSecondColThirdCell
  );

  taskDetails.append(taskDetailsFirstCol, taskDetailsSecondCol);

  return taskDetails;
}

function displayTaskEditModal(task) {
  if (task) {
    document.querySelector('#oldtaskTitle').value = task.title;
    document.querySelector('#oldtaskDescription').value = task.description;
    document.querySelector('#oldtaskDueDate').value = task.dueDate;
    document.querySelector('#oldtaskPriority').value = task.priority;
    document.querySelector('#oldtaskProject').value = task.project;

    $('#editTaskModal').modal('show'); // bootstrap jquery call to display modal

    domElement.editTaskModal.setAttribute('data-TaskID', task.id);
  }
}

function fillNewTaskPrjLst({ projectArr, selectedProjectID }) {
  domElement.newTaskFormFields.project.innerHTML = '';
  projectArr.forEach((project) => {
    if (project.name != 'today') {
      const option = document.createElement('option');
      option.textContent = project.name;
      option.setAttribute('data-newTaskTargetProject', project.id);

      // select task current displayed project
      project.id == selectedProjectID ? (option.selected = true) : undefined;
      domElement.newTaskFormFields.project.append(option);
    }
  });
}

function fillEditTaskPrjLst([projectsArr, selectedProjectID]) {
  domElement.editTaskFormFields.project.innerHTML = '';
  projectsArr.forEach((project) => {
    if (project.name != 'today') {
      const option = document.createElement('option');
      option.textContent = project.name;
      option.setAttribute('data-editTaskTargetProject', project.id);

      // select task project
      project.id == selectedProjectID ? (option.selected = true) : undefined;
      domElement.editTaskFormFields.project.append(option);
    }
  });
}

function removeTaskFromUi(taskID) {
  try {
    const targetNode = document.querySelector(`#task${taskID}`);
    targetNode.parentNode.removeChild(targetNode);
  } catch (err) {}
}

function displayProject(project) {
  domElement.projectUL.insertBefore(
    _creatProjectListItem(project.name, project.id),
    domElement.projectUL.lastElementChild
  );
}

function displayAllProjects(projectsArr) {
  projectsArr.forEach((project) => {
    if (project.name != 'inbox' && project.name != 'today') {
      displayProject(project);
    }
  });
}

function setEditorTitle(projectName) {
  domElement.editorProjectTitle.textContent = projectName;
}

function _creatProjectListItem(name, id) {
  const li = document.createElement('li');
  li.id = 'project' + id;
  li.textContent = name;
  return li;
}

function _clearFormFields(form) {
  // this is for the form with a row and columns. the new task and edit form
  if ([...form.children][0].classList.contains('row')) {
    [...[...form.children][0].children].forEach((col) => {
      [...col.children].forEach((formGroup) => {
        [...formGroup.children].forEach((childNode) => {
          if (
            childNode.tagName.toLowerCase() == 'input' ||
            childNode.tagName.toLowerCase() == 'textarea'
          ) {
            childNode.value = '';
          } else if (childNode.tagName.toLowerCase() == 'select') {
            [...childNode.children][0].selected = true;
          }
        });
      });
    });
  } else {
    //this is for simple bootstrap form
    [...form.children].forEach((formGroup) => {
      [...formGroup.children].forEach((childNode) => {
        if (
          childNode.tagName.toLowerCase() == 'input' ||
          childNode.tagName.toLowerCase() == 'textarea'
        ) {
          childNode.value = '';
        } else if (childNode.tagName.toLowerCase() == 'select') {
          [...childNode.children][0].selected = true;
        }
      });
    });
  }

  form.classList.remove('was-validated');
}

function updatePriorityPopOver(clickedPriority_obj) {
  [
    ...document.querySelector(
      `#changePriorityPopOver${clickedPriority_obj.taskID}`
    ).children,
  ].forEach((li) => {
    if (li.textContent.toLowerCase() == clickedPriority_obj.clickedPriority) {
      li.classList.add('selected');
    } else {
      li.classList.remove('selected');
    }
  });

  const taskPriorityFlagFill =
    clickedPriority_obj.clickedPriority == 'high'
      ? '#DE4C4A'
      : clickedPriority_obj.clickedPriority == 'medium'
      ? '#F49C18'
      : '#4073d6';
  document.querySelector(
    `svg[id*="taskPriorityFlag${clickedPriority_obj.taskID}"]`
  ).parentNode.innerHTML = `<svg id="taskPriorityFlag${clickedPriority_obj.taskID}" data-bs-toggle="tooltip" data-bs-placement="top" title="Change Priority" width="24" height="24"><g fill="${taskPriorityFlagFill}"><path d="M5 5.5L6 5v14.5a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5v-14z"></path><path stroke="${taskPriorityFlagFill}" d="M5.5 13.58s2.42-1.32 6.5.02 7.5.03 7.5.03l-.02-7.95c.01-.05-3.4 1.26-7.48-.08s-6.5-.02-6.5-.02v7.93"></path></g></svg>`;

  _activateBootstrapToolTip();
}

// bootstrap tooltip activation------------
function _activateBootstrapToolTip() {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// bootstrap activate popOvers using jQuery
function _activateListPopover(task) {
  $(`#priorityPopover${task.id}`).popover({
    container: 'body',
    content: _getPriorityList(task),
    html: true,
  });
}

function _getPriorityList(task) {
  const ul = domHelpers.createElementWithClass('ul', ['pl-0', 'mb-0']);
  ul.id = `changePriorityPopOver${task.id}`;

  domHelpers.creatListItems(['High', 'Medium', 'Low'], ul, 'my-1');
  [...ul.children].forEach((li) => {
    if (li.textContent.toLowerCase() == task.priority) {
      li.classList.add('selected');
    }
  });

  return ul;
}

function fillProjectPopoverWithData([projectsInfoArr, taskID, taskProjectID]) {
  $(`#projectPopover${taskID}`).popover({
    container: 'body',
    content: _getProjectsList(projectsInfoArr, taskID, taskProjectID),
    html: true,
  });
}

function _getProjectsList(projectInfos, taskID, selectedPID) {
  const ul = domHelpers.createElementWithClass('ul', ['pl-0', 'mb-0', 'pr-2']);
  ul.id = `changeProjectPopover${taskID}`;

  const namesArr = projectInfos.map((projectObj) => projectObj.name);
  const idsArr = projectInfos.map((projectObj) => projectObj.id);
  domHelpers.creatListItems(namesArr, ul, 'my-1', {
    name: 'data-popoverTargetProjectId',
    attrData: idsArr,
    selectedPID,
  });

  return ul;
}

function updateProjectPopoverWithData([
  projectsInfoArr,
  taskID,
  taskProjectID,
]) {
  document.querySelector(
    `#changeProjectPopover${taskID}`
  ).innerHTML = _getProjectsList(
    projectsInfoArr,
    taskID,
    taskProjectID
  ).innerHTML;
}

function displayToast(taskID) {
  const documentBody = document.querySelector('body');

  //remove previous toast and display new one
  document.querySelector('div[id^="toast_"]')
    ? documentBody.removeChild(document.querySelector('div[id^="toast_"]'))
    : undefined;

  const toast = _creatToast(taskID);
  documentBody.appendChild(toast);
  $(`#${toast.id}`).toast('show');
}

function _creatToast(taskID) {
  const toast = domHelpers.createElementWithClass('div', 'toast');
  domHelpers.setAttributes(toast, {
    'aria-atomic': 'true',
    id: 'toast' + taskID,
    'data-delay': '5000',
    role: 'alert',
    'aria-live': 'assertive',
  });

  const toastBody = domHelpers.createElementWithClass('div', 'toast-body');
  toastBody.style.width = '200px';

  const flexContainer = domHelpers.createElementWithClass('div', [
    'd-flex',
    'justify-content-between',
  ]);

  const firstSpan = document.createElement('span');
  firstSpan.textContent = '1 task completed';
  const button = domHelpers.createElementWithClass('button', [
    'border-0',
    'bg-transparent',
  ]);
  button.id = 'undoTaskCompete';
  button.textContent = 'Undo';

  flexContainer.append(firstSpan, button);
  toastBody.append(flexContainer);
  toast.append(toastBody);
  return toast;
}

//helper Function To Creat a task dom element
const _creatTaskNode = function (task) {
  const taskWrapper = document.createElement('div');

  const taskDiv = domHelpers.createElementWithClass('div', [
    'task',
    'd-flex',
    'justify-content-between',
    'align-items-center',
    'py-2',
    'px-2',
    'mx-2',
  ]);

  taskDiv.id = `task${task.id}`;

  const taskDivLeftSection = domHelpers.createElementWithClass('div', [
    'task-left',
  ]);
  taskDivLeftSection.setAttribute('data-TargetTaskLeft', `task${task.id}`);

  const formCheck = domHelpers.createElementWithClass('div', [
    'form-check',
    'd-flex',
    'align-items-center',
    'h-100',
    'pl-0',
  ]);

  const taskDivLeftSectionInput = domHelpers.createElementWithClass('input', [
    'form-check-input',
    'p-0',
    'position-static',
    'mt-0',
    'ml-0',
    'mr-2',
  ]);
  domHelpers.setAttributes(taskDivLeftSectionInput, {
    type: 'checkbox',
    id: 'check' + task.id,
  });

  const taskDivLeftSectionLabel = domHelpers.createElementWithClass(
    'label',
    'form-check-label'
  );
  taskDivLeftSectionLabel.for = task.id;

  //insert task name
  // adjust phone title on displays
  window.screen.availWidth >= 320 && task.title.length > 10
    ? (taskDivLeftSectionLabel.textContent =
        task.title.substring(0, 12) + '...')
    : (taskDivLeftSectionLabel.textContent = task.title);
  window.screen.availWidth >= 400 && task.title.length > 20
    ? (taskDivLeftSectionLabel.textContent =
        task.title.substring(0, 20) + '...')
    : undefined;
  window.screen.availWidth >= 768
    ? (taskDivLeftSectionLabel.textContent = task.title)
    : undefined;

  formCheck.append(taskDivLeftSectionInput, taskDivLeftSectionLabel);

  //-----------
  taskDivLeftSection.append(formCheck);
  //-------------------

  const taskDivControls = domHelpers.createElementWithClass('div', [
    'task-controls',
  ]);

  const taskDivControlsEditSpan = document.createElement('span');
  domHelpers.setAttributes(taskDivControlsEditSpan, {
    id: 'editTask' + task.id,
    'data-bs-toggle': 'tooltip',
    'data-bs-placement': 'top',
    title: 'Edit',
  });

  taskDivControlsEditSpan.innerHTML = `<svg width="24" height="24"> <g fill="none" fill-rule="evenodd"> <path fill="currentColor" d="M9.5 19h10a.5.5 0 110 1h-10a.5.5 0 110-1z" ></path> <path stroke="currentColor" d="M4.42 16.03a1.5 1.5 0 00-.43.9l-.22 2.02a.5.5 0 00.55.55l2.02-.21a1.5 1.5 0 00.9-.44L18.7 7.4a1.5 1.5 0 000-2.12l-.7-.7a1.5 1.5 0 00-2.13 0L4.42 16.02z" ></path> </g> </svg>`;

  const taskDivControlsPrioritySpan = document.createElement('span');
  domHelpers.setAttributes(taskDivControlsPrioritySpan, {
    tabindex: '0',
    id: 'priorityPopover' + task.id,
    'data-toggle': 'popover',
    'data-placement': 'left',
    'data-trigger': 'focus',
  });

  const taskPriorityFlagFill =
    task.priority == 'high'
      ? '#DE4C4A'
      : task.priority == 'medium'
      ? '#F49C18'
      : '#4073d6';
  taskDivControlsPrioritySpan.innerHTML = `<svg id="taskPriorityFlag${task.id}" data-bs-toggle="tooltip" data-bs-placement="top" title="Change priority" width="24" height="24"><g fill="${taskPriorityFlagFill}"><path d="M5 5.5L6 5v14.5a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5v-14z"></path><path stroke="${taskPriorityFlagFill}" d="M5.5 13.58s2.42-1.32 6.5.02 7.5.03 7.5.03l-.02-7.95c.01-.05-3.4 1.26-7.48-.08s-6.5-.02-6.5-.02v7.93"></path></g></svg>`;

  const taskDivControlsProjectSpan = document.createElement('span');
  domHelpers.setAttributes(taskDivControlsProjectSpan, {
    tabindex: '0',
    id: 'projectPopover' + task.id,
    'data-toggle': 'popover',
    'data-placement': 'left',
    'data-trigger': 'focus',
  });
  taskDivControlsProjectSpan.innerHTML = `<svg data-bs-toggle="tooltip" data-bs-placement="top" title="Move to project" width="24" height="24" > <g fill="none" transform="translate(4 4)"> <circle cx="8" cy="8" r="7.5" stroke="currentColor" ></circle> <path fill="currentColor" d="M10.11 7.82L8.15 5.85a.5.5 0 1 1 .7-.7l2.83 2.82a.5.5 0 0 1 0 .71l-2.83 2.83a.5.5 0 1 1-.7-.7l1.98-1.99H4.5a.5.5 0 1 1 0-1h5.61z" ></path> </g> </svg>`;

  const taskDivControlsDeleteSpan = document.createElement('span');
  domHelpers.setAttributes(taskDivControlsDeleteSpan, {
    id: `delete${task.id}`,
    'data-bs-toggle': 'tooltip',
    'data-bs-placement': 'top',
    title: 'Delete',
  });
  taskDivControlsDeleteSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" > <g fill="none" fill-rule="evenodd"> <path d="M0 0h24v24H0z"></path> <rect width="14" height="1" x="5" y="6" fill="currentColor" rx=".5" ></rect> <path fill="currentColor" d="M10 9h1v8h-1V9zm3 0h1v8h-1V9z" ></path> <path stroke="currentColor" d="M17.5 6.5h-11V18A1.5 1.5 0 0 0 8 19.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5zm-9 0h7V5A1.5 1.5 0 0 0 14 3.5h-4A1.5 1.5 0 0 0 8.5 5v1.5z" ></path> </g></svg>`;

  taskDivControls.append(
    taskDivControlsEditSpan,
    taskDivControlsPrioritySpan,
    taskDivControlsProjectSpan,
    taskDivControlsDeleteSpan
  );

  taskDiv.append(taskDivLeftSection, taskDivControls);

  const taskDetails = domHelpers.createElementWithClass('div', [
    'wrapper',
    'border',
    'rounded',
    'd-flex',
    'flex-column',
    'flex-md-row',
    'py-1',
    'py-md-2',
    'm-1',
    'my-2',
    'mx-md-3',
  ]);

  taskDetails.style.fontSize = '14px';

  const transitionDiv = domHelpers.createElementWithClass('div', 'collapse');
  transitionDiv.setAttribute('data-parent', `#task${task.id}`);
  transitionDiv.id = `collapseTask${task.id}`;

  const taskDetailsFirstCol = domHelpers.createElementWithClass('div', [
    'col-md-5',
    'px-2',
  ]);

  const taskDetailsFirstColFirstCell = domHelpers.createElementWithClass(
    'div',
    'p-1'
  );
  const taskDetailsFirstColFirstCellFirstSpan = domHelpers.createElementWithClass(
    'span'
  );
  taskDetailsFirstColFirstCellFirstSpan.style.fontWeight = '500';

  taskDetailsFirstColFirstCellFirstSpan.textContent = 'Title: ';
  const taskDetailsFirstColFirstCellSecondSpan = domHelpers.createElementWithClass(
    'span',
    'ml-1'
  );
  taskDetailsFirstColFirstCellSecondSpan.textContent = task.title;

  const taskDetailsFirstColSecondCell = taskDetailsFirstColFirstCell.cloneNode();

  const taskDetailsFirstColSecondCellFirstSpan = taskDetailsFirstColFirstCellFirstSpan.cloneNode();
  taskDetailsFirstColSecondCellFirstSpan.textContent = 'Due date: ';
  const taskDetailsFirstColSecondCellSecondSpan = taskDetailsFirstColFirstCellSecondSpan.cloneNode();
  taskDetailsFirstColSecondCellSecondSpan.textContent = new Date(
    task.dueDate
  ).toLocaleString();

  const taskDetailsSecondCol = domHelpers.createElementWithClass('div', [
    'col',
    'px-2',
  ]);

  const taskDetailsSecondColFirstCell = taskDetailsFirstColFirstCell.cloneNode();

  const taskDetailsSecondColFirstCellFirstSpan = taskDetailsFirstColFirstCellFirstSpan.cloneNode();
  taskDetailsSecondColFirstCellFirstSpan.textContent = 'Description: ';
  const taskDetailsSecondColFirstCellSecondSpan = taskDetailsFirstColFirstCellSecondSpan.cloneNode();
  taskDetailsSecondColFirstCellSecondSpan.textContent = task.description;

  const taskDetailsSecondColSecondCell = taskDetailsFirstColFirstCell.cloneNode();

  const taskDetailsSecondColSecondCellFirstSpan = taskDetailsFirstColFirstCellFirstSpan.cloneNode();
  taskDetailsSecondColSecondCellFirstSpan.textContent = 'Priority: ';
  const taskDetailsSecondColSecondCellSecondSpan = taskDetailsFirstColFirstCellSecondSpan.cloneNode();
  taskDetailsSecondColSecondCellSecondSpan.textContent = task.priority;

  // append children
  taskDetailsFirstColFirstCell.append(
    taskDetailsFirstColFirstCellFirstSpan,
    taskDetailsFirstColFirstCellSecondSpan
  );

  taskDetailsFirstColSecondCell.append(
    taskDetailsFirstColSecondCellFirstSpan,
    taskDetailsFirstColSecondCellSecondSpan
  );

  taskDetailsFirstCol.append(
    taskDetailsFirstColFirstCell,
    taskDetailsFirstColSecondCell
  );

  taskDetailsSecondColFirstCell.append(
    taskDetailsSecondColFirstCellFirstSpan,
    taskDetailsSecondColFirstCellSecondSpan
  );

  taskDetailsSecondColSecondCell.append(
    taskDetailsSecondColSecondCellFirstSpan,
    taskDetailsSecondColSecondCellSecondSpan
  );

  taskDetailsSecondCol.append(
    taskDetailsSecondColFirstCell,
    taskDetailsSecondColSecondCell
  );

  taskDetails.append(taskDetailsFirstCol, taskDetailsSecondCol);
  transitionDiv.append(taskDetails);

  taskWrapper.append(taskDiv, transitionDiv);

  // return taskDiv;
  return taskWrapper;
};
