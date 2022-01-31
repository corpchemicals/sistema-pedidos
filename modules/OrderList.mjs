import { DOM } from './DOM.mjs'
export class OrderList {
   constructor() {
      this.list = []
      this.unified = []

      // const storageList = window.localStorage.getItem('list') 
      // const storageUnified = window.localStorage.getItem('unified') 
    
      // if(storageList && storageUnified) {
      //    this.list = JSON.parse(storageList.replace("\n", ""))
      //    this.unified = JSON.parse(storageUnified.replace("\n", ""))
      //    this.list.forEach(order => this.printOrder(order))
      // }
   }

   addOrder(order) {
      this.list.push(order)
      this.#unifyProducts(order)
      this.#printOrder(order)

      // window.localStorage.setItem('list', JSON.stringify(this.list))
      // window.localStorage.setItem('unified', JSON.stringify(this.unified))
   }

   #unifyProducts(order) {
      //Unify orders into a single reference about a product
      const products = order.total
      for(const product of products) {
         const {category, number, amount} = product

         const index = this.unified.findIndex(
            uProduct => uProduct.category === category && uProduct.number === number)
         
         if(index === -1) this.unified.push({...product})
         else this.unified[index].amount += `-${amount}`
      }
   }

   #createOrderLi(seller, clientName, orderPrice) {
      const ordersSummary = DOM.get("#total-orders-summary")
      const liContainer = DOM.create('li')

      const liContainerTitle = DOM.create("p")
      liContainerTitle.innerHTML = 
         `<span class="blue-colored-string">
            ${seller}:
         </span>
         <span class="dark-color-string">
            ${clientName.substring(0,25)}
         </span>
         <span class="blue-colored-string">
            ${orderPrice.toFixed(2)} $
         </span>
         `
      liContainer.append(liContainerTitle)
   
      ordersSummary.append(liContainer)
      return liContainer
   }

   #printOrder(order) {
      const products = order.total
      const orderPrice = order.price
      const { seller, clientName } = order.data
      const liContainer = this.#createOrderLi(seller, clientName, orderPrice)
      
      const hidedUl = DOM.create("ul")
      hidedUl.classList.add("hided-ul")
      for(const product of products) {
         const { amount, keyName } = product
         console.log(product);
      
         const li = DOM.create("li")
         li.innerText = `${keyName.toUpperCase()}: ${amount} unds.`
         hidedUl.append(li)
      }

      liContainer.append(hidedUl)
   }

   // PDF Disarmed section
   #getDisarmedKits() {
      const toIn = {}
      const toOut = {}
      for(const product of this.unified) {
         if(product.hasOwnProperty("content")) {
            const { amount, keyName, content }
            const unifiedAmount = 
               amount.split("-")
               .map(amount => amount.parseInt(amount))
               .reduce((acc, cv) => acc + cv)

            toIn[keyName] = unifiedAmount

            for(const element of content) {
               const { category, number, amount } = content
               const keyContent = category + number
               const newAmount = amount * unifiedAmount

               const keyContentExist = toOut.hasOwnProperty(keyContent)
               toOut[keyContent] += (keyContentExist) ? newAmount : 0
            }
         }
      }

      const sortedToOut = {}
      Object.keys(toOut).sort().forEach(key => sortedToOut[key] = toOut[key])
      return [toIn, sortedToOut]
   }

   #createDisarmedList(list, colorHighlighterClass) {
      const ol = DOM.create("ol")
      for(const [ name, amount ] of Object.entries(list)) {
         const span = DOM.create("span")
         span.innerText = amount
         span.classList.add(colorHighlighterClass)

         const li = DOM.create("li")
         li.innerText = `${name.toUpperCase()}: `
         li.append(span)

         ol.append(li)
      }
      
      return ol
   }

   #makePDFDisarmedSection() {
      const section = DOM.create("section")
      section.classList.add("disarmed-pdf-section")
      let toggleColor = true

      const [toIn, toOut] = this.#getDisarmedKits()
      const toInOl = this.#createDisarmedList(toIn, "green-amount")
      const toOutOl = this.#createDisarmedList(toIn, "red-amount")

      section.append(toInOl, toOutOl)
      return section
   }

   // PDF Order section
   #createOrderDataPElement(order) {
      const {seller, clientName, clientPhone, clientID, clientAddress} = order.data
      
      const p = DOM.create("p")
      p.innerHTML = `<span class="bold">Vendedor:</span> ${seller}<br>`
      p.innerHTML += `<span class="bold">Cliente:</span> ${clientName}<br>`
      
      if(clientID !== "") {
         p.innerHTML += `<span class="bold">Cliente:</span> ${clientName}<br>`
         p.innerHTML += `<span class="bold">Identificación:</span> ${clientID}<br>`
         p.innerHTML += `<span class="bold">Teléfono:</span> ${clientPhone}<br>`
         p.innerHTML += `<span class="bold">Dirección:</span> ${clientAddress}<br>`
      }
      
      return p
   }
   
   #createOrderProductsOl(order) {
      const ol = document.createElement("ol")
      const products = order.total
      for(const product of products) {
         const { name, amount, uPrice, keyName} = product
         const shortedName = name.substring(0, 30) + "..."
         const productPrice = amount * uPrice

         const li = DOM.create("li")
         li.innerHTML = `<span class="bold">${keyName}</span> | ${shortedName} unds. = <span class="bold">${productPrice.toFixed(2)}</span>`
      }
   }

   #makePDFOrdersSection() {
      const section = DOM.create("section")
      section.classList.add("orders-pdf-section")
      for(const order of this.list) {
         const div = DOM.create("div")
         const orderDataElement = this.#createOrderDataPElement(order)
         const orderOl = this.#createOrderProductsOl(order) 
         
         const h3 = DOM.create("h3")
         h3.innerText = `Precio Total: ${order.price}$`
         
         div.append(orderDataElement)
         div.append(orderOl)
         div.append(h3)

         section.appendChild(div)
      }
      return section
   }
   
   // PDF Assemble section
   #getUnifiedGroupedByCategory() {
      const groupedByCategory = []
      const categoriesSet = new Set()
      this.unified.forEach(product => categoriesSet.add(product.category))
      for(const category of categoriesSet) {
         const filteredProducts = this.unified.filter(product => product.category === category)
         groupedByCategory.push(filteredProducts)
      }
      return groupedByCategory
   }

   #createAssembleOl(group) {
      const ol = DOM.create("ol")
      const h2 = DOM.create("h2")
      h2.innerText = group[0].category.toUpperCase()
      ol.appendChild(h2)

      group.forEach(product => {
         const { name, amount, keyName } = product
         const li = DOM.create("li")
         li.innerHTML = `<span class="bold">${keyName}</span> | ${name}: <span class="bold">${amount}</span>`
         ol.appendChild(li)
      })

      return ol
   }
   
   #makePDFAssembleSection() {
      const section = DOM.create("section")
      section.classList.add("assemble-pdf-section")

      const groupedByCategory = this.#getUnifiedGroupedByCategory()
      for(const group of groupedByCategory) {
         const ol = this.#createAssembleOl(group)
         section.append(ol)
      }

      return section
   }

   // Process results
   cleanResults() {
      const resultsContainer = DOM.get("#results")
      DOM.removeAllChilds(resultsContainer)
   }
}