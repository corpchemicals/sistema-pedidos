export default class Order {
  constructor() {
    this.products = []
  }

  clean() {
    this.products = []
  }

  productIsOr(product) {
    return (product.category.charAt(2) === "-")
  }

  addProduct(product, print = false) {
    //delete number from "or" series ex. or100-101 to or101
    if(this.productIsOr(product)) product.category = product.category.split("-")[0] 

    //add product 
    const products = this.products
    const {category, number, amount} = product
    
    //for delete previous category of number series like 000 100 200 300...
    let key = `${category.toUpperCase()}${number}` 
    if(category.startsWith('or') && !isNaN(+category.charAt(2))) key = `OR${number}`
    product.key = key

    let index = products.findIndex(product => 
      (product.category === category) && (product.number === number))
      

    //-1 because findIndex return that when doesn't find elements
    if(index === -1) { 
      products.push(product)
      index = products.length - 1
    } 
    else products[index].amount += amount

    if(print) this.printProduct(index)
  }

  removeProduct(index) {
    console.log(index);
    this.products.splice(index, 1)
    console.log(this.products)
  }

  printProduct(index) {
    //print product in html
    const container = document.querySelector("#current-order-list")
    let {category, number, amount, key} = this.products[index]
    const existing = [...container.childNodes].find(child => child.dataset.identifier === `${category}${number}`)

    let li = document.createElement("li")
    li.dataset.identifier = `${category}${number}`
    
    if(existing) li = existing 
    
    li.dataset.amount = amount
    li.innerText = `${key}: ${li.dataset.amount} unidades` 

    li.addEventListener('click', (ev) => { 
      const liIndex = [...container.childNodes].findIndex(li => li === ev.target)
      container.removeChild(ev.target)
      this.removeProduct(liIndex)
    })

    container.appendChild(li)
  }
}