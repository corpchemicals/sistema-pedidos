import Order from "./Order.js";
import validateEntryProduct from "./validateEntryProdut.js";

//add product button listener
export function setAddButton(products, order) {
  document.querySelector("button#add-product").addEventListener("click", () => {
    debugger
    const selectors = document.querySelectorAll("select.iProduct")
    if(!validateEntryProduct()) return console.log("implement sweet alert")
      
    const [category, from, to] = [...selectors].map(selector => selector.value)
    const amount = parseInt(document.querySelector("input#amount").value)

    //create new array with range of products to add 
    const productsToAdd = products[category].slice(+from, +to + 1)
    for(const product of productsToAdd) {
      const modified = {...product, category, amount} 
      order.addProduct(modified, true) //true for print
    }
  })
}
  
export function setFinishButton(order, orders) {
  document.querySelector("button#finish-order")
    .addEventListener("click", () => {
      orders.removeHTMLList()

      const orderInfo = document.querySelectorAll(".order_info")
      const [seller, client, note] = [...orderInfo].map(input => input.value.trim())
      orders.addOrder(order, seller, client, note)
      
      order.clean()
      console.log(order)
      console.log(orders)

    })
}