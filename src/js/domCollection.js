export const newTaskForm = document.querySelector('#addTaskForm');
export const newTaskFormFields = {
  title: document.querySelector('#taskTitle'),
  description: document.querySelector('#taskDescription'),
  dueDate: document.querySelector('#taskDueDate'),
  priority: document.querySelector('#taskPriority'),
  project: document.querySelector('#taskProject'),
};

export const editTaskForm = document.querySelector('#editTaskForm');
export const editTaskFormFields = {
  title: document.querySelector('#oldtaskTitle'),
  description: document.querySelector('#oldtaskDescription'),
  dueDate: document.querySelector('#oldtaskDueDate'),
  priority: document.querySelector('#oldtaskPriority'),
  project: document.querySelector('#oldtaskProject'),
};
export const newProjectForm = document.querySelector('#newProjectForm');
export const newProjectFromFields = {
  name: document.querySelector('#projectName'),
};
export const editorContent = document.querySelector('#editorContent');
export const editorProjectTitle = document.querySelector('#editorTitle span');
export const projectUL = document.querySelector('#projects_list');
export const projectsMainList = document.querySelector('#projectsMainList');
export const todayDateInLeftMenu = document.querySelector('#todayDate');
export const inboxProjectListItem = document.querySelector(
  '[data-designation="inboxProjects"]'
);
export const todayProjectListItem = document.querySelector(
  '[data-designation="todayProjects"]'
);
export const mainMenuBtn = document.querySelector('#menu_btn');
export const homeButtonMenu = document.querySelector('#home_btn');
export const leftMainMenu = document.querySelector('.left_menu');
export const editTaskModal = document.querySelector('#editTaskModal');
