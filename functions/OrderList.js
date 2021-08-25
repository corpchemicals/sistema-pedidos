export default class OrderList {
  constructor() {
    this.list = []
    this.unified = []

    const storageList = window.localStorage.getItem('list') 
    const storageUnified = window.localStorage.getItem('unified') 
    
    if(storageList && storageUnified) {
      this.list = JSON.parse(storageList.replace("\n", ""))
      this.unified = JSON.parse(storageUnified.replace("\n", ""))

      for(const order of this.list) {
        this.printOrder(order)
      }
    }
  }
  
  addOrder({order, seller, client="", note="", print=false}) {
    order = {...order, seller, client, note}
    this.list.push(order)

    //Unifying orders into a single reference about a product
    for(const product of order.products) {
      const {category, number, amount} = product

      const index = this.unified.findIndex(
          uProduct => uProduct.category === category && uProduct.number === number)
      
      if(index === -1) this.unified.push({...product, amount: `${amount}`})
      else this.unified[index].amount += `-${amount}`
    }

    if(print) this.printOrder(order)

    window.localStorage.setItem('list', JSON.stringify(this.list))
    window.localStorage.setItem('unified', JSON.stringify(this.unified))
  
  }

  removeHTMLCurrentOrder() {
    const list = document.querySelector("#current-order-list")
    while(list.lastChild) {
      list.removeChild(list.lastChild)
    }
  }

  printOrder(order) {
    const container = document.querySelector("#orders-list")
    const { products, seller, client } = order

    const principalLi = document.createElement("li")
    
    const span = document.createElement("span")
    span.innerText = `${seller}: ${client.substr(0, 25)}...`
    principalLi.appendChild(span)
    
    container.appendChild(principalLi)
    
    const ul = document.createElement("ul")

    for(const product of products) {
      let { amount, key} = product

      const li = document.createElement("li")
      li.innerText = `${key}: ${amount} unidades` 
      ul.appendChild(li)
    } 
    
    principalLi.appendChild(ul)
  }

  getDisarmedKits(unified) {
    const toIn = {}
    const toOut = {}
    for(const product of unified) {
      if(product.category === "kit") {
        const unifiedAmount =
          product.amount
            .split("-")
            .map(elem => parseInt(elem))
            .reduce((acc, cv) => acc + cv)

        toIn[`kit${product.number}`] = unifiedAmount

        for(const content of product.content) {
          let { category, number, amount } = content

          const key = category + number;
          amount *= unifiedAmount;

          (toOut[key]) 
            ? toOut[key] += amount
            : toOut[key] = amount        
        }
      }
    }

    const toOutOrdered = {}
    Object.keys(toOut).sort().forEach(key => toOutOrdered[key] = toOut[key])

    return [toIn, toOutOrdered]
  }

  makeKitSection(disarmedKits) {
    const section = document.createElement("section")
    section.classList.add("kit-section")
    let toggleColor = true

    for(const to of disarmedKits) {
      const ol = document.createElement("ol")
      
      Object.entries(to).forEach(pair => {
        let [ name, amount ] = pair
        //for or<number> series content like or000 or100
        if(name.startsWith("or")) name = name.slice(5)

        const span = document.createElement("span")
        span.innerText = amount
        span.classList.add((toggleColor) ? "green-amount" : "red-amount")

        const li = document.createElement("li")
        li.innerText = `${name.toUpperCase()}: `
        li.appendChild(span)

        ol.appendChild(li)
      })

      toggleColor = false
      
      section.appendChild(ol)
    }

    document.querySelector("#results").appendChild(section)
  }

  makeOrderSection(list) {
    const section = document.createElement("section")
    section.classList.add("orders-section")
    for(const order of list) {
      const div = document.createElement("div")
      const { seller, client, note, products } = order

      const p = document.createElement("p")
      p.innerHTML = 
      `${"Vendedor".bold()}: ${seller}<br>${"Cliente".bold()}: ${client}<br>`

      if(note) p.innerHTML += `${"Nota".bold()}: ${note}<br>`

      div.appendChild(p)
      
      const ol = document.createElement("ol")
      let orderPrice = 0

      for(const product of products) {
        const { name, amount, uPrice, key } = product
        
        const shortedName = name.substr(0, 30) + "..."
        
        const productPrice = amount * uPrice
        orderPrice += productPrice 
        
        const li = document.createElement("li")
        const text = `${key.bold()} | ${shortedName}: ${amount} unds. = ${productPrice.toFixed(2).bold()}$`
        li.innerHTML = text

        ol.appendChild(li)
      }

      div.appendChild(ol)
      
      const h3 = document.createElement("h3")
      h3.innerText = `Precio Total: ${orderPrice.toFixed(2)}$`

      div.appendChild(h3)

      section.appendChild(div)
    }

    document.querySelector("#results").appendChild(section)
  }

  makeAssembleSection(unified) {
    const ol = document.createElement("ol")
    ol.classList.add("assemble-list")

    for(const product of unified) {
      const li = document.createElement("li")
      const {name, amount, key} = product

      const text = `${key.bold()} | ${name}: ${amount.bold()}`
      li.innerHTML = text
      ol.appendChild(li)
    }

    document.querySelector("#results").appendChild(ol)
  }

  cleanResults() {
    const container = document.querySelector("#results")
    while(container.lastChild) {
      container.removeChild(container.lastChild)
    }
  }

  process() {
    const date = new Date();
    const dateText = `${date.getDate()}-${date.getMonth()+1}`

    const list = this.list
    const unified = this.unified.sort((a, b) => {
      if(a.key > b.key) return 1
      if(a.key < b.key) return -1

      return 0
    })
    
    const disarmedKits = this.getDisarmedKits(unified)
    
    this.makeOrderSection(list)
    document.title = `${dateText}_Pedidos`
    window.print()
    this.cleanResults()
    
    this.makeAssembleSection(unified)
    this.makeKitSection(disarmedKits)
    document.title = `${dateText}_Armaje`
    window.print()

    this.cleanResults()
    document.title = "Formato de Pedidos"
    
    window.localStorage.clear()
  }
}