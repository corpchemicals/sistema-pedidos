function unifyOrders(orders) {
  const unified = {}
  const toAssemble = {}
  //convert the content of multiply orders in one object
  orders.forEach(element => {
    const order = element.order
    Object.keys(order).forEach(key => {
      //if element doesnt exist
      if(!unified[key]) unified[key] = {};
      if(!toAssemble[key]) toAssemble[key] = {};

      for(const product_key in order[key]) {
        const product = order[key][product_key]
        if (unified[key][product_key]) {
          unified[key][product_key] += product //add
          toAssemble[key][product_key] += ` - ${product}`
        } else {
          unified[key][product_key] = product //declare
          toAssemble[key][product_key] = `${product}` 
        }
      }
    })
  })

  return { unified, toAssemble }
}

export default unifyOrders