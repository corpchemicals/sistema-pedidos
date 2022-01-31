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
      //    // this.list.forEach(order => this.printOrder(order))
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
         
         if(index === -1) this.unified.push(product)
         else this.unified[index].amount += `-${amount}`
      }
   }

   #createOrderLi(seller, clientName, orderPrice) {
      const ordersSummary = document.querySelector("#total-orders-summary")
      const liContainer = document.createElement('li')

      const liContainerTitle = document.createElement("p")
      liContainerTitle.innerHTML = 
         `<span class="blue-colored-string">
            ${seller}: 
         </span>
         <span class="dark-color-string">
            ${clientName.substring(0,25)}...
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
      
      const hidedUl = document.createElement("ul")
      hidedUl.classList.add("hided-ul")
      for(const product of products) {
         const { amount, keyName } = product
      
         const li = document.createElement("li")
         li.innerText = `${keyName.toUpperCase()}: ${amount} unds.`
         hidedUl.appendChild(li)
      }

      liContainer.appendChild(hidedUl)
   }
}