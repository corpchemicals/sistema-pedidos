export class DOM {
  static create(name) {
    return document.createElement(name)
  }

  static get(key) {
    return document.querySelector(key)
  }

  static getAll(key) {
    return document.querySelectorAll(key)
  }

  static createOption(value, innerText = value) {
    const option = this.create("option")
    option.value = value
    option.innerText = innerText
    return option
  }

  static removeAllChilds(parent) {
    const children = [...parent.children]
    children.forEach(child => parent.removeChild(child))
  }

  static removeElement(element) {
    element.remove();
  }
}