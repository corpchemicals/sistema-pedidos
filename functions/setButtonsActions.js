import validateEntryProduct from "./validateEntryProdut.js";

//add product button listener
export function setAddButton(products, order) {
  document.querySelector("button#add-product").addEventListener("click", () => {
    const selectors = document.querySelectorAll("select.iProduct")
    if(!validateEntryProduct()) return;
      
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
      const orderInfo = document.querySelectorAll(".order_info")
      const [seller, client, note] = [...orderInfo].map(input => input.value.trim())
      if(order.products.length > 0 && seller) {
        orders.removeHTMLCurrentOrder()
  
        orders.addOrder({
          order,
          seller, client, note,
          print: true
        })
        
        order.clean()
      }
    })
}

export function setProcessButton(orders) {
  document.querySelector("button#process-orders")
    .addEventListener("click", () => {
      if(orders.list.length > 0) {
        swal({
          title: "¿Deseas procesar los pedidos?",
          text: "Se imprimirán dos archivos",
          icon: "success",
          buttons: true,
        })
        .then(confirm => {
          if(confirm) {
            document.querySelectorAll("textarea").forEach(textarea => textarea.value = "")

            setTimeout(() => orders.process(), 200)
          }
        })
      }
    })
}