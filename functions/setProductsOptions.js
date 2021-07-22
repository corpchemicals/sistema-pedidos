function setProductsOptions(products) {
  const input_type = document.querySelector('#input-type')
  const input_subtype = document.querySelector('#input-subtype')
  const datalist = document.querySelector('#code-list')

  //types
  for(const type in products) {
    const option = document.createElement('option')
    option.innerHTML = type.toUpperCase()
    option.value = type
    input_type.appendChild(option)
  }
  
  //subtypes
  input_type.addEventListener('change', () => {
    while(input_subtype.lastChild.value !== 'default') { //default = seleccionar... 
      input_subtype.removeChild(input_subtype.lastChild)
      datalist.removeChild(datalist.lastChild)
    }
    
    if(input_type.value !== 'default') {
      for(const subtype of products[input_type.value]) {
        const sub_option = document.createElement('option')
        sub_option.innerText = subtype.number
        sub_option.value = subtype.number
        input_subtype.appendChild(sub_option)

        const datalist_option = document.createElement('option')
        datalist_option.value = `${input_type.value.toUpperCase()}${subtype.number}: ${subtype.name}`
        datalist.appendChild(datalist_option)
      }    
    }
  })
} 

export default setProductsOptions