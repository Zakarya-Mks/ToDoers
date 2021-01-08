export class Project {
  constructor(name) {
    this._id = _getID();
    this._name = name;
    this._projectTasks = [];
  }

  get id() {
    return this._id;
  }

  set id(value) {
    if (value) {
      this._id = value;
    }
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (value) {
      this._name = value;
    }
  }

  get projectTasks() {
    return this._projectTasks;
  }

  set projectTasks(value) {
    if (value) {
      this._projectTasks.push(value);
    }
  }
}

function _getID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
