function printOrders(products, orders) {
  const orders_container = document.createElement('section')
  orders_container.className = "orders_container"

  for(const element of orders) {
    const { seller, order, client } = element
    let orders_ulists = ``
    let order_price = 0

    let list_elements = ``

    for(const category in order) {
      for(const product_key in order[category]) {
        const booleanN = (category.substring(0,2) === 'or' && (+category.charAt(2) || category.charAt(2) === '0'))
        const code = ((booleanN) ? product_key : category + product_key).toUpperCase()
        const amount = order[category][product_key]
        let { price, name } = products[category].find(elem => elem.number === product_key)

        name = name.substr(0,20)
        const total_price = price * amount
        order_price += total_price
        
        list_elements += `<li>${code} --> ${name}: ${amount} unidades ${total_price.toFixed(2)}$</li>`
      }
    }

    const container = document.createElement('article')
    container.className = 'order_container'
    container.innerHTML = `
      <p>----</p>
      <ul>
      <li>${client}</li>
      <li>Vendedor: ${seller}</li>
      ${list_elements}
      <li>Precio Total: ${order_price.toFixed(2)}$</li>
      </ul>
      <p>----</p>
    `

    orders_container.appendChild(container);
  }

  document.querySelector('#app-result').appendChild(orders_container)
}

export default printOrders