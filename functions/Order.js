/*
products = [
    {
    category: "kit"
    number: "001",
    amount: 10,
    name: 'Kit Asiatico NBR',
    uPrice: 1.73},
  ]
*/
class Order {
  constructor(products, seller, client = "", note = "") {
    this.products = products
    this.seller = seller
    this.client = client
    this.note = note
  }

  addProduct(product, container) {
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

    if(container) this.printProduct(index, container)
  }

  removeProduct(index) {
    delete this.products[index]
  }

  printProduct(index, container) {
    const {category, number, amount} = this.products[index]
    
    const li = document.createElement("li")
    const text = `${category.toUpperCase()}${number}: ${amount} unidades` 
    li.innerText = text

    li.addEventListener("click", (ev) => { 
      container.removeChild(ev.target)
      this.removeProduct(index)
    })

    container.appendChild(li)
  }

  hasKits() {
    const hasAKit = this.products.find(product => product.category === "kit")
    return (hasAKit) ? true : false
  }
}

class OrderList {
  constructor() {
    this.list = []
    this.unified = []
  }

  addOrder(Order) {
    this.list.push(Order)
    for(const product of Order.products) {
      const {category, number, amount} = product
      const index = this.unified.findIndex(
        uProduct => uProduct.category === category && uProduct.number === number)
      
      if(index === -1) this.unified.push({...product, amount: `${amount}`})
      else this.unified[index].amount += `-${amount}`
    }
  }
}

const order1 = new Order([
  {
  category: "kit",
  number: "001",
  amount: 10,
  name: 'Kit Asiatico NBR',
  uPrice: 1.73},
], "Marcelo")

const order2 = new Order([
  {
  category: "kit",
  number: "002",
  amount: 20,
  name: 'Kit Asiatico NBR',
  uPrice: 1.73},
], "Marcelo")

const list = new OrderList()

list.addOrder(order1)
list.addOrder(order2)

list.unified
