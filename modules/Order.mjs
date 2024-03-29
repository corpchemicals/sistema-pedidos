import { DOM } from './DOM.mjs'

export class Order {
   constructor() {
      this.total = []
      this.data = {
         seller: "",
         clientName: "",
         clientPhone: "",
         clientID: "",
         clientAddress: "",
         summaryNote: ""
      }
      this.price = 0
      this.#init()
   }

   #cleanInterface() {
     const summaryElement = DOM.get("#order-summary")
     const summaryPrice = DOM.get("#order-price")
      summaryPrice.innerText = "$ 0.00"
     DOM.removeAllChilds(summaryElement)
   }

   #init() {
      this.#cleanInterface()
      this.#setListElementListener()
   }

   #updateTotalPriceElement() {
      const totalPriceElement = DOM.get("#order-price")
      totalPriceElement.innerText = (this.price === 0) ? "0.00$" : this.price.toFixed(2) + "$"
   }

   #setListElementListener() {
      DOM.get("#order-summary").addEventListener("click", ({target}) => {
         const isTargetTrashIcon = target.tagName == "I" //for icon
         if(isTargetTrashIcon == false) return;
         const productElement = target.parentElement

         const productIndex = 
            this.total.findIndex(product => product.keyName === productElement.dataset.keyName)
         
         const { uPrice, amount } = this.total[productIndex]            
         const priceToRemove = uPrice * amount
         this.price -= priceToRemove

         this.#updateTotalPriceElement()           
         this.total.splice(productIndex, 1)
         
         DOM.removeElement(productElement)
      })
   }
      
   addProducts(products, amount) {
      products.forEach((product) => {
         const productIndex = this.total.findIndex(element => element.keyName === product.keyName)
         const productExist = (productIndex > -1)
         let productToPrint;         
         if(productExist) {
            this.total[productIndex].amount += amount
            productToPrint = this.total[productIndex]
         }
         else {
            const newObj = {
               ...product, 
               amount: amount 
            }
            if(!newObj.hasOwnProperty("category")) newObj.category = DOM.get("#category").value

            this.total.push(newObj)
            productToPrint = newObj
         }
         
         this.#printProduct(productToPrint)

         const { uPrice } = product
         this.price += uPrice * amount
         this.#updateTotalPriceElement()
      }) 
   }

   #printProduct(product) {
      const listElement = DOM.get("#order-summary")
      const listChildren = [...listElement.children]
      const listChildIndex = listChildren.findIndex(child => child.dataset.keyName === product.keyName)
      
      const listChild = listChildren[listChildIndex] ?? DOM.create("li")
      this.#fillProductListElement(listChild, product)
      
      if(listChildIndex === -1) {
         listChild.dataset.keyName = product.keyName
         listElement.appendChild(listChild)
      }
   }

   #fillProductListElement(container, product) {
      const { name, keyName, amount, uPrice, isPacked} = product
      const productPrice = amount * uPrice
      
      // if product list was already included into dom
      const existentPrice = container.querySelector(".product-price")
      if(existentPrice) {
         const existentAmount = container.querySelector(".product-amount")
         existentAmount.innerText = `: ${amount} ${isPacked ? 'pq' : 'unds'}. `
         existentPrice.innerText = productPrice.toFixed(2) + "$"
         return
      }
      
      // abbr keyName tag
      const abbr = DOM.create("abbr")
      abbr.classList.add('listed-product')
      abbr.title = name
      abbr.tabIndex = 0
      abbr.innerText = keyName
      container.append(abbr)
      
      //  p container for amount and price span tags
      const p = DOM.create("p")
      p.classList.add("order-product-info")

         // span amount tag
      const spanAmount = DOM.create("span")
      spanAmount.classList.add("product-amount")
      spanAmount.innerText = `: ${amount} ${isPacked ? 'pq' : 'unds'}. `
      p.append(spanAmount)

         // span price tag
      const spanPrice = DOM.create("span")
      spanPrice.classList.add("product-price")
      spanPrice.innerText = productPrice.toFixed(2) + "$"
      p.append(spanPrice)

      container.append(p)

      // i trash icon tag 
      const img = DOM.create("i")
      img.classList.add("trash-icon")
      container.append(img)
   }

   setData(data) {
      this.data = {...data}
   }
}