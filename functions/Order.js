export default class Order {
  constructor() {
    this.products = []
  }

  clean() {
    this.products = []
  }

  addProduct(product, print = false) {
    //add product 
    const products = this.products
    const {category, number, amount} = product

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
    debugger
    this.products.splice(index, 1)
    console.log(this.products)
  }

  printProduct(index) {
    //print product in html
    const container = document.querySelector("#current-order-list")
    const {category, number, amount} = this.products[index]
    const existing = [...container.childNodes].find(child => child.dataset.identifier === `${category}${number}`)

    let li = document.createElement("li")
    li.dataset.identifier = `${category}${number}`
    
    if(existing) li = existing 
    
    li.dataset.amount = amount
    li.innerText = `${category.toUpperCase()}-${number}: ${li.dataset.amount} unidades` 

    li.addEventListener('click', (ev) => { 
      container.removeChild(ev.target)
      this.removeProduct(index)
    })

    container.appendChild(li)
  }
}