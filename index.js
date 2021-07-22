
// functions
import setProductsOptions from './functions/setProductsOptions.js'
import setSellersOptions from './functions/setSellersOptions.js'
import addOrder from './functions/addOrder.js'
import putOrderInDisplay from './functions/putOrderInDisplay.js'
import addTotalOrder from './functions/addTotalOrder.js' 
import unifyOrders from './functions/unifyOrders.js'
import printDisarmedKits from './functions/printDisarmedKits.js'
import printToAssemble from './functions/printToAssemble.js'
import printOrders from './functions/printOrders.js'

//data
import products from './data/products.js'
import sellers from './data/sellers.js'
import kits_data from './data/kits-data.js'

const code_list_value = document.querySelector("#code-list-value")
document.querySelector("#input-code-list")
  .addEventListener("change", ev => code_list_value.innerText = ev.target.value)

document.querySelector("#code-list-cleaner").addEventListener("click", () => {
  document.querySelector("#code-list-value").innerText = "";
  document.querySelector("#input-code-list").value = "";
})


//Set all the options
setProductsOptions(products)
setSellersOptions(sellers)

let orders = []
let numOrder = 0;
//add orders and print them in display
const button_addOrder = document.querySelector("#button-addOrder")
button_addOrder.addEventListener('click', () => {
  orders = addOrder({
    orders, 
    putOrderInDisplay,
    numOrder
  })
})

const button_addTotalOrder = document.querySelector("#button-addTotalOrder")
button_addTotalOrder.addEventListener('click', () => {
  numOrder = addTotalOrder(orders[numOrder], numOrder)
})

const button_endOrders = document.querySelector('#button-endOrders')
button_endOrders.addEventListener('click', () => {
  if(numOrder > 0) {
    swal({
      title: "¿Deseas procesar los pedidos?",
      text: "Una vez procesados no podrás realizar cambios",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(confirm => {
      if(confirm) {
        document.querySelector("header").style.display = "none";
        document.querySelector("#app-container").style.display = "none";
        document.querySelector("footer").style.display = "none";
  
        //Actual date
        const date = new Date()
        const dateHTML = document.createElement("p")
        dateHTML.className = "result-date"
        dateHTML.innerHTML = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        document.querySelector("#app-result").appendChild(dateHTML)
        
        const { unified, toAssemble } = unifyOrders(orders)
        
        const kits = unified['kit']
        if(kits) printDisarmedKits(kits_data, kits)
        
        printToAssemble(products, toAssemble)
        printOrders(products, orders)
  
        setTimeout(window.print, 500)
      }
    })
  }
})



