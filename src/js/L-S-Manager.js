import { compareAsc } from 'date-fns';
import { events as pubSub } from './events';
import { Project } from './project';
import { Task } from './task';
[
  ['saveTask', saveTaskToLS],
  ['saveProject', saveProject],
  ['getAllTasksForUI', getAllTasksForUI],
  ['removeTask', removeTaskFromLS],
  ['changeTaskPriority', updatePriority],
  ['getTaskForEdit', getTaskForEdit],
  ['editTaskFromPrjLst', editTaskFromFillPrjLst],
  ['getAllProjectForUIList', getAllProjectsForUI],
  ['newTaskFillProjects', newTaskFillProjects],
  ['displayProjectTasks', getProjectTasks],
  ['getProjectID', getProjectsIds],
  ['updateTask', updateTask],
  ['changeTaskProject', editTaskProject],
  ['fillProjectPopover', getDataToProjectPopover],
  ['editProjectPopover', getProjectsToProjectPopover],
  ['taskCompleted', completeTask],
  ['getCompletedTasksToUI', getAllCompletedTaskToUI],
].forEach((paramArr) => {
  pubSub.on(paramArr[0], paramArr[1]);
});

// if localStorage contain task load them if not assign empty arr
const tasksArr = _readFromLS('allTasks') ? _parseLSData('task') : [];

// if localStorage contain Project load them if not assign arr with inbox project and today
const projectArr = _readFromLS('allProjects')
  ? _parseLSData('project')
  : [new Project('inbox'), new Project('today')];

const completedTasks = _readFromLS('completedTasks')
  ? _parseLSData('completedTask')
  : [];

function _parseLSData(dataType) {
  if (dataType == 'project') {
    const resultArr = _readFromLS('allProjects');
    const parsedArr = resultArr.map((project) => {
      project.__proto__ = Project.prototype;
      return project;
    });
    return parsedArr;
  } else if (dataType == 'task') {
    const tasksArr = _readFromLS('allTasks');
    const parsedArr = tasksArr.map((task) => {
      task.__proto__ = Task.prototype;
      return task;
    });
    return parsedArr;
  } else if (dataType == 'completedTask') {
    const resultArr = _readFromLS('completedTasks');
    const parsedArr = resultArr.map((taskProjectCombo) => {
      taskProjectCombo.task.__proto__ = Task.prototype;
      return taskProjectCombo;
    });

    return parsedArr;
  }
}

function completeTask(taskId) {
  const taskProjectCombo = {};

  for (let index = 0; index < tasksArr.length; index++) {
    if (tasksArr[index].id == taskId) {
      taskProjectCombo.task = tasksArr[index];
      break;
    }
  }

  projectArr.forEach((project) => {
    if (project.projectTasks.includes(taskId)) {
      if (project.name != 'today') {
        taskProjectCombo.project = project.name;
      }
    }
  });

  pubSub.publish('removeTask', taskId);
  taskProjectCombo['completed-on'] = new Date().toLocaleString();

  completedTasks.push(taskProjectCombo);
  _writeToLS('completedTasks', completedTasks);
}

function saveTaskToLS({ task, projectID }) {
  tasksArr.push(task);
  _writeToLS('allTasks', tasksArr);

  //add taskId to appropriate project tasksList

  projectArr.forEach((project) => {
    if (project.id == projectID) {
      project.projectTasks = task.id;
    }
  });

  //update todays tasks
  const todaysTasksIDs = _getTodaysTasks().map((task) => {
    return task.id;
  });

  for (let index = 0; index < projectArr.length; index++) {
    // add all new todays task
    if (projectArr[index].name == 'today') {
      todaysTasksIDs.forEach((taskID) => {
        if (!projectArr[index].projectTasks.includes(taskID)) {
          projectArr[index].projectTasks = taskID;
        }
      });

      //remove all yesterdays tasks
      projectArr[index].projectTasks.forEach((taskID) => {
        if (!todaysTasksIDs.includes(taskID)) {
          projectArr[index].projectTasks.splice(index, 1);
        }
      });
      break;
    }
  }

  _writeToLS('allProjects', projectArr);
}

function saveProject(project) {
  projectArr.push(project);
  _writeToLS('allProjects', projectArr);
}

function getTaskForEdit(taskID) {
  const resultArr = tasksArr.filter((task) => task.id == taskID);

  pubSub.publish('editThisTask', resultArr[0]);
}

function getProjectTasks(projectID) {
  let target = projectArr.filter((project) => project.id == projectID);

  const projectTasks = tasksArr.filter((task) =>
    target[0].projectTasks.includes(task.id)
  );

  pubSub.publish('displayAllTasks', projectTasks);
  pubSub.publish('UpdateEditorTitle', target[0].name);
}

function updateTask([taskID, taskObj]) {
  tasksArr.forEach((task) => {
    if (task.id == taskID) {
      task.title = taskObj.title;
      task.description = taskObj.description;
      task.dueDate = taskObj.dueDate;
      task.priority = taskObj.priority;
    }
  });

  //remove task from old project and add it to new project
  editTaskProject([taskID, taskObj.projectName]);
  _writeToLS('allTasks', tasksArr);
}

function editTaskProject([taskID, newProjectName]) {
  newProjectName = newProjectName.toLowerCase();
  projectArr.forEach((project) => {
    if (
      project.projectTasks.includes(taskID) &&
      project.name != newProjectName &&
      project.name != 'today'
    ) {
      project.projectTasks.splice(project.projectTasks.indexOf(taskID), 1);
    } else if (
      !project.projectTasks.includes(taskID) &&
      project.name == newProjectName
    ) {
      project.projectTasks.push(taskID);
    }
  });
  _writeToLS('allProjects', projectArr);
}

function getDataToProjectPopover(taskID) {
  const taskProjectID = projectArr.filter((project) => {
    if (project.name != 'today') {
      return project;
    }
  });
  const projectsInfoArr = projectArr.map((project) => {
    return { id: project.id, name: project.name };
  });

  pubSub.publish('projectPopoverData', [
    projectsInfoArr,
    taskID,
    taskProjectID[0].id,
  ]);
}

function getProjectsToProjectPopover(taskID) {
  const taskProjectID = projectArr.filter((project) => {
    if (project.projectTasks.includes(taskID) && project.name != 'today') {
      return project;
    }
  });
  const projectsInfoArr = projectArr.map((project) => {
    return { id: project.id, name: project.name };
  });

  pubSub.publish('updateProjectPopoverData', [
    projectsInfoArr,
    taskID,
    taskProjectID[0].id,
  ]);
}

function _getTodaysTasks() {
  const resultArr = tasksArr.filter((task) => {
    const taskDate = new Date(
      new Date(task.dueDate).toISOString().split('T')[0]
    );
    const today = new Date(new Date().toISOString().split('T')[0]);

    // compare both date if equal return 0
    if (compareAsc(taskDate, today) == 0) {
      return task;
    }
  });

  return resultArr;
}

function getProjectsIds([inboxDomEl, todayDomEl]) {
  projectArr.forEach((project) => {
    if (project.name == 'inbox') {
      inboxDomEl.id = 'project' + project.id;
    } else if (project.name == 'today') {
      todayDomEl.id = 'project' + project.id;
    }
  });
}

function updatePriority(clickedPriority_obj) {
  tasksArr.forEach((task) => {
    if (task.id == clickedPriority_obj.taskID) {
      task.priority = clickedPriority_obj.clickedPriority;
    }
  });
  _writeToLS('allTasks', tasksArr);
}

function removeTaskFromLS(taskID) {
  tasksArr.forEach((task, index) => {
    if (task.id == taskID) {
      tasksArr.splice(index, 1);
    }
  });

  projectArr.forEach((project) => {
    if (project.projectTasks.includes(taskID)) {
      project.projectTasks.splice(project.projectTasks.indexOf(taskID), 1);
    }
  });

  _writeToLS('allTasks', tasksArr);
  _writeToLS('allProjects', projectArr);
}

// publish an event with the tasks list as param
function getAllTasksForUI() {
  pubSub.publish('displayAllTasks', tasksArr);
}

function getAllProjectsForUI() {
  // if project other than index exist
  if (projectArr.length > 1) {
    pubSub.publish('displayAllProjects', projectArr);
  }
}

function getAllCompletedTaskToUI() {
  pubSub.publish('displayAllCompletedTasks', completedTasks);
  pubSub.publish('UpdateEditorTitle', 'Completed Tasks');
}

//fill project list in the new task modal
function newTaskFillProjects() {
  pubSub.publish('fillNewTaskPrjLst', projectArr);
}

// fill project list in the edit task modal
function editTaskFromFillPrjLst(taskID) {
  const project = projectArr.filter((project) =>
    project.projectTasks.includes(taskID)
  );

  const selectedProject = project[0].name;
  pubSub.publish('fillEditTaskPrjLst', [projectArr, selectedProject]);
}

// write and read from Local Storage
function _writeToLS(name, dataToWrite) {
  localStorage.setItem(name, JSON.stringify(dataToWrite));
}
function _readFromLS(name) {
  return JSON.parse(localStorage.getItem(name));
}

//auto add projectArr to local storage if not exist
(function () {
  if (localStorage.getItem('allProjects') == null) {
    _writeToLS('allProjects', projectArr);
  }
})();
