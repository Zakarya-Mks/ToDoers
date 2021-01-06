export class Task {
  constructor(title, description, dueDate, priority) {
    this._id = _getID();
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
    this._priority = priority;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    if (value) {
      this._title = value;
    }
  }

  get description() {
    return this._description;
  }

  set description(value) {
    if (value) {
      this._description = value;
    }
  }

  get dueDate() {
    return this._dueDate;
  }

  set dueDate(value) {
    if (value) {
      this._dueDate = value;
    }
  }

  get priority() {
    return this._priority;
  }

  set priority(value) {
    if (value) {
      this._priority = value;
    }
  }
}

function _getID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
