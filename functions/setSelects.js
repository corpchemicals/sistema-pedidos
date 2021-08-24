export function setProductsSelects(products) {
  const selectCategory = document.querySelector("select#category")
  const selectFromNumber = document.querySelector("select#from-number")
  const selectToNumber = document.querySelector("select#to-number")

  //Create Option with value and inner text equals
  function createOption(value, text = value) {
    const option = document.createElement("option")
    option.value = value 
    option.innerText = text
    return option
  }

  //Remove options about a select without default one
  function removeOptions(select) {
    while(select.lastChild.value !== "") {
      const lastChild = select.lastChild
      select.removeChild(lastChild)
    }
  }

  //Append options for category selector
  for(const category in products) { 
    const option = createOption(category, category.toUpperCase())
    selectCategory.appendChild(option)
  }

  //Add listener to change options of selectFromNumber when 
  //category is change
  selectCategory.addEventListener('change', (ev) => {
    removeOptions(selectFromNumber)
    removeOptions(selectToNumber)
    
    const category = ev.target.value
    let index = 0
    for(const { number, name} of products[category]) {
      const option = createOption(index, `${number} --- ${name}`)
      selectFromNumber.appendChild(option)
      index++
    }
  })

  //Add listener to change options of selectToNumber when
  //selectFromNumber is change
  selectFromNumber.addEventListener('change', (ev) => {
    removeOptions(selectToNumber)
    
    const category = selectCategory.value
    const fromNumber = parseInt(ev.target.value)
    const productsRemaining = products[category].slice(fromNumber)

    let index = fromNumber
    for(const { number, name } of productsRemaining) {
      const option = createOption(index, `${number} --- ${name}`)
      selectToNumber.appendChild(option)
      index++
    }

    selectToNumber.value = fromNumber
  })
}

export function setSellersSelect(sellers) {
  const datalist = document.querySelector("datalist#sellers")
  for (const seller of sellers) {
    const option = document.createElement("option")
    option.value = seller
    datalist.appendChild(option)
  }
}