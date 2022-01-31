import { DOM } from './DOM.mjs'

export class OrderList {
   constructor() {
      this.list = []
      this.unified = []

      const storageList = window.localStorage.getItem('list') 
      const storageUnified = window.localStorage.getItem('unified') 
    
      if(storageList && storageUnified) {
         this.list = JSON.parse(storageList.replace("\n", ""))
         this.unified = JSON.parse(storageUnified.replace("\n", ""))
         // this.list.forEach(order => this.printOrder(order))
      }
   }

   addOrder(order) {
      this.list.push(order)
      console.log(order);
      // this.#unifyProducts(order)

      window.localStorage.setItem('list', JSON.stringify(this.list))
      window.localStorage.setItem('unified', JSON.stringify(this.unified))
   }

   #unifyProducts(order) {
      //Unify orders into a single reference about a product
      for(const product of order.products) {
         const {category, number, amount} = product

         const index = this.unified.findIndex(
            uProduct => uProduct.category === category && uProduct.number === number)
         
         if(index === -1) this.unified.push({...product, amount: `${amount}`})
         else this.unified[index].amount += `-${amount}`
      }
   }
}