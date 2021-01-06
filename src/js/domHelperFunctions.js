export class DomHelperFunctions {
  static setAttributes(el, attrs) {
    for (let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  static createElementWithClass(elmType, className) {
    const domElement = document.createElement(elmType);

    if (Array.isArray(className)) {
      className.forEach((item) => domElement.classList.add(item));
    } else {
      domElement.classList.add(className);
    }
    return domElement;
  }

  static creatListItems(innerElmArr, ulElement, listItemClass) {
    for (let index = 0; index < innerElmArr.length; index++) {
      const listItem = document.createElement('li');
      listItemClass ? listItem.classList.add(listItemClass) : '';

      if (Array.isArray(innerElmArr[index])) {
        innerElmArr[index].forEach((element) => {
          listItem.append(element);
        });
      } else listItem.append(innerElmArr[index]);

      ulElement.append(listItem);
    }
  }
}
