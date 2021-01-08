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

  static creatListItems(
    innerElmArr,
    ulElement,
    listItemClass,
    attributes = null
  ) {
    for (let index = 0; index < innerElmArr.length; index++) {
      const listItem = document.createElement('li');
      listItemClass ? listItem.classList.add(listItemClass) : undefined;
      if (attributes) {
        listItem.setAttribute(attributes.name, attributes.attrData[index]);
        listItem.getAttribute('data-popoverTargetProjectId') ==
        attributes.selectedPID
          ? listItem.classList.add('selected')
          : undefined;
      }

      if (Array.isArray(innerElmArr[index])) {
        innerElmArr[index].forEach((element) => {
          listItem.append(element);
        });
      } else listItem.append(innerElmArr[index]);

      ulElement.append(listItem);
    }
  }
}
