export default class OrderList {
  constructor() {
    this.list = []
    this.unified = []
  }
  
  addOrder(Order, seller, client="", note="") {
    Order = {...Order, seller, client, note}
    console.log(Order)
    this.list.push(Order)

    //Unifying orders into a single reference about a product
    for(const product of Order.products) {
      const {category, number, amount} = product
      const index = this.unified.findIndex(
          uProduct => uProduct.category === category && uProduct.number === number)
      
      if(index === -1) this.unified.push({...product, amount: `${amount}`})
      else this.unified[index].amount += `-${amount}`
    }
  }

  removeHTMLList() {
    const list = document.querySelector("#current-order-list")
    while(list.lastChild) {
      list.removeChild(list.lastChild)
    }
  }
}