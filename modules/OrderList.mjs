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
         this.list.forEach(order => this.printOrder(order))
      }
   }

   addOrder(order, seller) {
     
   }
}