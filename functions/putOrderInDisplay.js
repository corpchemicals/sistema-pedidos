function putOrderInDisplay({ orders, type, subtype, numOrder, amount }) { //order = { product: amount, ... }
  const product = 
    (type.substring(0,2) === 'or' && !isNaN(+type.charAt(2))) 
      ? subtype 
      : type + subtype
  const current_order_container = document.querySelector("#current-order-container")
  let container = document.querySelector(`#order${numOrder}`) 
  let li = document.querySelector(`#product${product}`)

  if(!container) {
    const lista = document.createElement('ul')
    lista.setAttribute("id", `order${numOrder}`) 
    current_order_container.appendChild(lista)
    container = lista
  }
  
  if(!li) {
    li = document.createElement('li')
    li.setAttribute("id", `product${product}`)
    container.appendChild(li)
  }
  
  li.innerHTML = `${product.toUpperCase()}: ${amount} unidades.`

  li.onclick = function() {
    container.removeChild(li)
    delete orders[numOrder]['order'][type]
  } 
}

export default putOrderInDisplay