function setSellersOptions(sellers) { //sellers = array
  const input_seller = document.querySelector('#input-seller')
   //sellers
   for(const seller of sellers) {
    const option = document.createElement('option')
    option.innerHTML = seller
    option.value = seller
    input_seller.appendChild(option)
   }
}

export default setSellersOptions