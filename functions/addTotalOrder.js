function addTotalOrder(order, current_order) {
  const seller = document.querySelector("#input-seller").value
  const client = document.querySelector("#client-description").value
  //if seller is selected
  if(seller !== 'default') {
    //if order exist
    if(Object.keys(order?.order).length > 0) {
      order.seller = seller
      order.client = client.replace(/\n/, '<br>')
      document.querySelector("#client-description").value = ""

      const prev_html = document.querySelector(`#order${current_order}`)
      // delete previous order html
      document.querySelector('#current-order-container').removeChild(prev_html)
      current_order++
    }
  } 
  return current_order
}

export default addTotalOrder