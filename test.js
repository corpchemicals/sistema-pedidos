const order = "Vendedor: dsa\nCliente: dsa\nPedido:\n\n-KIT001: 10 unds.\n-KIT002: 10 unds.\n-KIT003: 10 unds.\n-KIT004: 10 unds.\n-KIT005: 10 unds.\n-KIT006: 10 unds.\n-KIT007: 10 unds.\n-KIT008: 10 unds.\n-KIT009: 10 unds.\n-KIT010: 10 unds.\n-KIT011: 10 unds.\n-KIT012: 10 unds.\n-KIT013: 10 unds.\n-KIT014: 10 unds.\n-KIT015: 10 unds.\n-KIT016: 10 unds.\n-KIT017: 10 unds.\n-KIT018: 10 unds.\n-KIT019: 10 unds.\n-KIT020: 10 unds.\n-KIT021: 10 unds.\n-KIT022: 10 unds.\n-KIT023: 10 unds.\n-KIT024: 10 unds.\n-KIT025: 10 unds.\n-KIT026: 10 unds.\n\nPrecio Total: 577.30$"
const splitByLinebreak = string => string.split("\n").filter(line => line !== '')
const findSubstringIndex = (array, substring) => array.findIndex(elem => elem.toLowerCase().includes(substring))

function findPremadeOrderValue(premadeOrder, title) {
   // find a value by its title
   const titleIndex = findSubstringIndex(premadeOrder, title)
   const value = (titleIndex !== -1) ? premadeOrder[titleIndex].split(":")[1].trim() : ''
   return value
}

function getPremadeOrderProducts(premadeOrder) {
   const startIndex = findSubstringIndex(premadeOrder, 'pedido')
   const endIndex = findSubstringIndex(premadeOrder, 'precio total')
   const products = premadeOrder.slice(startIndex + 1, endIndex)
   return products
}

function cleanPremadeOrderProducts(products) {
   // clean from premadeOrderProducts decoration
   const keyAmountPairs = products.map(productLine => productLine.split(":"))
   const cleanedPairs = keyAmountPairs.map(pair => {
      let [keyName, amount] = pair
      keyName = keyName.substring(1).toLowerCase() //delete first char
      amount = amount.trim().split(" ")[0] //get first value previous a white space
      return [keyName, amount]
   })
   return cleanedPairs
}

let newOrder = splitByLinebreak(order)
const data = {
   seller: findPremadeOrderValue(newOrder, 'vendedor'),
   client: findPremadeOrderValue(newOrder, 'cliente'),
   order: findPremadeOrderValue(newOrder, 'teléfono'),
   phoneNumber: findPremadeOrderValue(newOrder, 'identificación'),
   address: findPremadeOrderValue(newOrder, 'dirección'),
}

const splitted = getPremadeOrderProducts(newOrder)
const cleaned = cleanPremadeOrderProducts(splitted)