function printToAssemble(products, toAssemble) {
  const toAssembleHTML = document.createElement('section')
  toAssembleHTML.className = 'to_assemble'

  for(const category in toAssemble) {
    const container = document.createElement('article')
    const h2 = document.createElement('h2')
    const ul = document.createElement('ul')
    h2.innerHTML = category.toUpperCase()
    let total = (category === 'kit') ? true : false
    container.appendChild(h2)
    for(const product in toAssemble[category]) {
      let { number, name } = products[category].find(element => element.number === product)
      const amount = toAssemble[category][product]
      
      const numberHTML = document.createElement('li')
      const booleanN = (category.substring(0,2) === 'or' && (+category.charAt(2) || category.charAt(2) === '0'))
      numberHTML.innerHTML = (booleanN) ? number : `${category}${number}`
      numberHTML.innerHTML += ` | ${name} | ${amount}`
      
      if(total) 
        numberHTML.innerHTML += " | Total: " +
          amount.replace(" ", "")
            .split("-")
            .reduce((accumulator, currentValue) => (+accumulator) + (+currentValue))
      
      ul.appendChild(numberHTML)
      container.appendChild(ul)
    }
    toAssembleHTML.appendChild(container)
  }

  document.querySelector("#app-result").appendChild(toAssembleHTML)

  //order for size
  const toAssemble_articles = document.querySelectorAll('.to_assemble > article')
  const toAssemble_ul = Array.from(document.querySelectorAll('.to_assemble > article > ul'))
  const sizes = toAssemble_ul.map(element => element.offsetHeight).sort()
  const evaluated_indexes = []
  sizes.forEach((element, max_index) => {
    const index = toAssemble_ul.findIndex((subelement,index) => subelement.offsetHeight === element && !evaluated_indexes.includes(index))
    evaluated_indexes.push(index)
    toAssemble_articles[index].style.order = max_index + 1
  }) 
}

export default printToAssemble