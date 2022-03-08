import { DOM } from './DOM.mjs'
export class OrderList {
   constructor() {
      this.list = []
      this.unified = []
      this.#setOrderSummaryDeleteListener()

      const storageList = window.localStorage.getItem('list') 
      const storageUnified = window.localStorage.getItem('unified') 
      
      if(storageList && storageUnified) {
         this.list = JSON.parse(storageList.replace("\n", ""))
         this.unified = JSON.parse(storageUnified.replace("\n", ""))
         this.list.forEach(order => this.#printOrder(order))
      }
   }

   #updateLocalStorage() {
      window.localStorage.setItem('list', JSON.stringify(this.list))
      window.localStorage.setItem('unified', JSON.stringify(this.unified))
   }

   #findProductIndexFromUnified(keyName) {
      return this.unified.findIndex(product => product.keyName === keyName)
   }

   #removeOrderFromUnified(products)  {
      products.forEach(({keyName, amount}) => {
         const unifiedIndex = this.#findProductIndexFromUnified(keyName)
         const unifiedAmount = this.unified[unifiedIndex].amount
         if(unifiedAmount.length === 1) {
            this.unified.splice(unifiedIndex, 1)
            return;
         }

         const splittedAmount = unifiedAmount.split("-")
         const splittedIndex = splittedAmount.findIndex(uniAmount => uniAmount === amount+"")
         splittedAmount.splice(splittedIndex, 1)
         const joinedAmount = splittedAmount.join("-")
         this.unified[unifiedIndex].amount = joinedAmount
      })
   }

   #removeOrder(index) {
      const { total } = this.list[index]
      this.#removeOrderFromUnified(total)
      this.list.splice(index, 1)

      console.log(this.list);
      console.log(this.unified);
      this.#updateLocalStorage()
   }

   addOrder(order) {
      this.list.push(order)
      this.#unifyProducts(order)
      this.#printOrder(order)
      console.log(this.list);
      console.log(this.unified);

      this.#updateLocalStorage()
   }

   #unifyProducts(order) {
      //Unify orders into a single reference about a product
      const products = order.total
      for(const product of products) {
         const {category, number, amount} = product

         const index = this.unified.findIndex(
            uProduct => uProduct.category === category && uProduct.number === number)
         
         if(index === -1) this.unified.push({...product, amount: `${amount}`})
         else this.unified[index].amount += `-${amount}`
      }
   }

   #setOrderSummaryDeleteListener() {
      const ordersSummary = DOM.get("#total-orders-summary")
      ordersSummary.addEventListener("click", ({target}) => {
         if(target.tagName !== "I") return;
         const li = target.parentElement.parentElement
         const liIndex = [...ordersSummary.children].findIndex(child => child == li)
         this.#removeOrder(liIndex)
         DOM.removeElement(li)
      })
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
         <i class="trash-icon"></i>
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
            const { amount, keyName, content } = product
            const unifiedAmount = 
               amount.split("-")
               .map(amount => parseInt(amount))
               .reduce((acc, cv) => acc + cv)

            toIn[keyName] = unifiedAmount

            for(const element of content) {
               let { category, number, amount } = element


               // If category content is or200 or similar
               const keyContent = (category.startsWith("or") && !isNaN(category.charAt(2)))
                  ? "OR" + number
                  : category + number

               const newAmount = amount * unifiedAmount

               const keyContentExist = toOut.hasOwnProperty(keyContent)
               toOut[keyContent] = (keyContentExist) ? toOut[keyContent] + newAmount : newAmount
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
         li.innerText = `-${name.toUpperCase()}: `
         li.append(span)

         ol.append(li)
      }
      
      return ol
   }

   #makePDFDisarmedSection() {
      const section = DOM.create("section")
      section.classList.add("disarmed-pdf-section")

      const [toIn, toOut] = this.#getDisarmedKits()
      if(Object.keys(toIn).length === 0) return ""
      const toInOl = this.#createDisarmedList(toIn, "green-amount")
      const toOutOl = this.#createDisarmedList(toOut, "red-amount")

      section.append(toInOl, toOutOl)
      return section
   }

   // PDF Order section
   #createOrderDataPElement(order) {
      const {seller, clientName, clientPhone, clientPhoneOptional, clientID, clientAddress} = order.data
      
      const p = DOM.create("p")
      p.innerHTML = `<span class="bold">Vendedor:</span> ${seller}<br>`
      p.innerHTML += `<span class="bold">Cliente:</span> ${clientName}<br>`
      
      if(clientID !== "") {
         p.innerHTML += `<span class="bold">Identificación:</span> ${clientID}<br>`
         p.innerHTML += `<span class="bold">Teléfono:</span> ${clientPhone}<br>`
         if(clientPhoneOptional !== "") p.innerHTML += `<span class="bold">Teléfono2:</span> ${clientPhoneOptional}<br>`
         p.innerHTML += `<span class="bold">Dirección:</span> ${clientAddress}<br>`
      }
      
      return p
   }
   
   #createOrderProductsOl(order) {
      const ol = document.createElement("ol")
      const products = order.total
      for(const product of products) {
         const { name, amount, uPrice, keyName} = product
         const shortedName = name.substring(0, 28) + "..."
         const productPrice = amount * uPrice

         const li = DOM.create("li")
         li.innerHTML = `<span class="bold">${keyName.toUpperCase()}</span> | ${shortedName}: ${amount} unds. = <span class="bold">${productPrice.toFixed(2)} $</span>`
         ol.append(li)
      }
      return ol
   }

   #makePDFOrdersSection() {
      const section = DOM.create("section")
      section.classList.add("orders-pdf-section")
      const sortedListByLength = [...this.list].sort((a, b) => {
         const aLength = a.total.length
         const bLength = b.total.length
         if(aLength < bLength) return 1
         if(aLength > bLength) return -1
   
         return 0
      })      

      for(const order of sortedListByLength) {
         const div = DOM.create("div")
         const orderDataElement = this.#createOrderDataPElement(order)
         const orderOl = this.#createOrderProductsOl(order) 
         
         const h3 = DOM.create("h3")
         h3.innerText = `Precio Total: ${order.price.toFixed(2)}$`
         
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
         const { amount, keyName } = product
         const li = DOM.create("li")
         li.innerHTML = `<span class="bold">${keyName.toUpperCase()}</span>: ${amount}`
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
   #cleanResults() {
      const resultsContainer = DOM.get("#pdf-results")
      DOM.removeAllChilds(resultsContainer)
   }

   makePDF() {
      if(this.list.length == 0) return;
      const resultsContainer = DOM.get("#pdf-results")
      const date = new Date();
      const dateFileTitle = `(${date.getHours()}:${date.getMinutes()})-${date.getDate()}-${date.getMonth() + 1}`

      // Sorting unified array
      this.unified.sort((a, b) => {
         if(a.key < b.key) return 1
         if(a.key > b.key) return -1
   
         return 0
      })      

      const orderSection = this.#makePDFOrdersSection()
      const disarmedSection = this.#makePDFDisarmedSection()
      const assembleSection = this.#makePDFAssembleSection()

      document.title = `${dateFileTitle}-pedidos`
      resultsContainer.append(orderSection)
      resultsContainer.append(disarmedSection)
      window.print()
      this.#cleanResults()

      document.title = `${dateFileTitle}-armaje`
      resultsContainer.append(assembleSection)
      window.print()
      this.#cleanResults()

      this.#cleanResults()
      document.title = "Sistema de Pedidos"

      window.localStorage.clear()
   }
}