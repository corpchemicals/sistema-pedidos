import OrderList from "./functions/OrderList.js"
import Order from "./functions/Order.js"
import { setProductsSelects, setSellersSelect } from "./functions/setSelects.js"
import {  setAddButton, setFinishButton, setProcessButton } from "./functions/setButtonsActions.js"


//title for fullscreen
function toggleFullscreen() {
  if(!document.fullscreenElement) return document.documentElement.requestFullscreen()
  document.exitFullscreen()
}

document.querySelector("h1").addEventListener("click", toggleFullscreen)

//data
import sellers from "./data/sellers.js"
const productsUrl = './data/products.json'

//from json
fetch(productsUrl)
.then(response => response.json())
.then(products => {
  const Orders = new OrderList()
  const current_order = new Order()
  
  //Set selects options
  setProductsSelects(products)
  setSellersSelect(sellers)
  
  //Set buttons actions
  setAddButton(products, current_order)
  setFinishButton(current_order, Orders)
  setProcessButton(Orders)
})
.catch(e => swal('Ocurrió un error, llame al técnico'))
