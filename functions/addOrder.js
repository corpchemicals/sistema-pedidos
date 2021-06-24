//numOrder = number of current order (int)  
function addOrder({ orders, numOrder, putOrderInDisplay }) {
  const type = document.querySelector("#input-type").value
  let subtype = document.querySelector("#input-subtype").value
  let amount = +(document.querySelector("#input-amount").value)

  if(subtype !== 'default' && amount > 0) {
    //if order doesnt exist
    if(!orders[numOrder]) orders[numOrder] = {order: {}, seller: ''};
    
    //add more amount to existent order / create new product of order
    if(!orders[numOrder]['order'][type]) orders[numOrder]['order'][type] = {};
    
    (orders[numOrder]['order'][type][subtype])
      ? orders[numOrder]['order'][type][subtype] += amount
      : orders[numOrder]['order'][type][subtype] = amount;
    
    //print order
    if(putOrderInDisplay) {
      putOrderInDisplay({
        type,
        subtype,
        orders,
        numOrder, 
        amount: orders[numOrder]['order'][type][subtype]
      })
    }
  } 
  return orders
}

export default addOrder