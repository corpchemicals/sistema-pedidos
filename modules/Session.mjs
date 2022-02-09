import { DOM } from './DOM.mjs'
import { Order } from './Order.mjs'
import { OrderList } from './OrderList.mjs'

export class Session {
   constructor() {
      this.productsURL = 'https://raw.githubusercontent.com/corpchemicals/products-list/main/products.json' 
      this.sendPhone = '+584244044072'
      this.#init()
      this.order = new Order()
      this.orderList = new OrderList()
   }
   
   async #init() {
      this.#setClientExistence()
      try {
         const products = await this.#getProductsFromURL()
         this.#setSelects(products)
         this.#setAddButton(products)
         this.#setPremadeOrderButton(products)
         this.#setSubmitButton()
         DOM.get("#finish-session").addEventListener("click", () => this.orderList.makePDF())
      } catch(err) {
         swal('Ocurrió un error')
      }
   }

   async #getProductsFromURL() {
      const response = await fetch(this.productsURL)
      return response.json()
   }

   #setClientExistence() {
      const checkClientExistence = DOM.get("#toggle-client-existence")
      const newClientFields = DOM.getAll(".new-client-field")
      
      checkClientExistence.addEventListener("change", ({target}) => {
          const container = target.parentElement
          container.classList.toggle("off-color")
          container.classList.toggle("on-color")
      
          newClientFields.forEach(field => {
               const inputs = field.querySelectorAll("input")
               
               inputs.forEach(input => {
                   const wasntRemoved = input.hasAttribute("required")
                   if(wasntRemoved) input.removeAttribute("required")
                   else input.required = true
                   input.value = ""
               })
      
               field.classList.toggle("displayNone")
          })
      })
   }

   #setSelects(products) {
      const categorySelect = DOM.get("select#category")
      const fromNumberSelect = DOM.get("select#from-number")
      const toNumberSelect = DOM.get("select#to-number")

      //fill categorySelect
      this.#fillSelects({
            select: categorySelect, 
            data: products, 
            isCategory: true
      })

      //Event listener when category is changing
      categorySelect.addEventListener("change", ({target}) => {
            DOM.removeAllChilds(fromNumberSelect)
            DOM.removeAllChilds(toNumberSelect)

            const category = target.value

            this.#fillSelects({
               select: fromNumberSelect, 
               data: products[category]
            })

            this.#fillSelects({
               select: toNumberSelect, 
               data: products[category]
            })
      })

      //Event listener when fromNumber is changing
      fromNumberSelect.addEventListener("change", ({target}) => {
            DOM.removeAllChilds(toNumberSelect)

            const category = categorySelect.value
            const fromNumber = +target.value
            const productsRemaining = products[category].slice(fromNumber)

            this.#fillSelects({
               select: toNumberSelect, 
               data: productsRemaining, 
               index: fromNumber
            })

            toNumberSelect.value = fromNumber
      })
   }

   #fillSelects({select, data, isCategory = false, index = 0}) {
      const selectOptions = []
      
      if(isCategory) {
         const sortedData = Object.keys({...data}).sort()
         for(const category of sortedData) {
               const option = DOM.createOption(category, category.toUpperCase())
               selectOptions.push(option)
            } 
      } else {
            for(const { number, name } of data) {
               const option = DOM.createOption(index, `${number}: ${name}`)
               selectOptions.push(option)
               index++
            }
      }

      select.append(...selectOptions)
   }
   
   // Premade Order
   #cleanPremadeOrderTextArea() {
      DOM.get("#premade-order").value = ""
   }

   #findSubstringIndex = (array, substring) => array.findIndex(elem => elem.toLowerCase().includes(substring))
   
   #findPremadeOrderValue(premadeOrder, title) {
      // find a value by its title
      const titleIndex = this.#findSubstringIndex(premadeOrder, title)
      const value = (titleIndex !== -1) ? premadeOrder[titleIndex].split(":")[1].trim() : ''
      return value
   }

   #getPremadeOrderProducts(premadeOrder) {
      const startIndex = this.#findSubstringIndex(premadeOrder, 'pedido')
      const endIndex = this.#findSubstringIndex(premadeOrder, 'precio total')
      const products = premadeOrder.slice(startIndex + 1, endIndex)
      return products
   }

   #normalizePremadeOrderProducts(products) {
      // clean from premadeOrderProducts decoration
      const keyAmountPairs = products.map(productLine => productLine.split(":"))
      const cleanedPairs = keyAmountPairs.map(pair => {
         let [keyName, amount] = pair
         keyName = keyName.substring(1).toLowerCase().trim() //delete first char
         amount = amount.trim().split(" ")[0] //get first value previous a white space
         return [keyName, amount]
      })
      return cleanedPairs
   }

   #changeDataInputValue(premadeOrder) {
      const data = {
         seller:                  this.#findPremadeOrderValue(premadeOrder, 'vendedor'),
         clientName:              this.#findPremadeOrderValue(premadeOrder, 'cliente'),
         clientFullPhone:         this.#findPremadeOrderValue(premadeOrder, 'teléfono').split("-"),
         clientFullPhoneOptional: this.#findPremadeOrderValue(premadeOrder, 'teléfono2').split("-"),
         clientFullID:            this.#findPremadeOrderValue(premadeOrder, 'identificación'),
         clientAddress:           this.#findPremadeOrderValue(premadeOrder, 'dirección'),
      }

      const toggleExistence = DOM.get("#toggle-client-existence")
      // add defaults option in an array when client exist
      if(data.clientFullPhone == "" && data.clientFullID == "") {
         data.clientFullPhone = ["", ""]
         data.clientFullPhoneOptional = ["", ""]
         data.clientFullID = ["J", ""]
         if(toggleExistence.checked == false) toggleExistence.click()
      } else { 
         data.clientFullID = [ data.clientFullID[0], data.clientFullID.substring(2) ]
         if(toggleExistence.checked == true) toggleExistence.click()
      }

      const sellerInput = DOM.get("#seller")
      sellerInput.value = data.seller
   
      const clientNameInput = DOM.get("#client-name")
      clientNameInput.value = data.clientName
   
   
      // Phone with its code
      const clientPhoneAreaCode = DOM.get("#phone-area-code")
      const clientPhoneInput = DOM.get("#client-phone")
      clientPhoneAreaCode.value = data.clientFullPhone[0]
      clientPhoneInput.value = data.clientFullPhone[1]

      // Phone with its code
      const clientPhoneAreaCodeOptional = DOM.get("#optional-phone-area-code")
      const clientPhoneInputOptional = DOM.get("#optional-client-phone")
      if(data.clientFullPhoneOptional.length > 1) {
         clientPhoneAreaCodeOptional.value = data.clientFullPhoneOptional[0]
         clientPhoneInputOptional.value = data.clientFullPhoneOptional[1]
      } else {
         clientPhoneAreaCodeOptional.value = ''
         clientPhoneInputOptional.value = ''
      }
   
      // Identification with its code
      const clientIdentificationTypeSelect = DOM.get("#identification-type")
      const clientIdentificationInput = DOM.get("#client-identification")
      clientIdentificationTypeSelect.value = data.clientFullID[0].toUpperCase() 
      clientIdentificationInput.value = data.clientFullID[1]
   
      const clientAddress = DOM.get("#client-address")
      clientAddress.value = data.clientAddress
   }

   #getCategoryByKeyName(keyName) {
      const splittedKeyName = keyName.split("")
      const isORSeries = keyName.startsWith("or") && !isNaN(splittedKeyName[2])
      if(isORSeries) return `or${splittedKeyName[2]}00`

      let category = ''
      for(const char of splittedKeyName) {
         if(!isNaN(char)) return category
         category += char
      }
   }

   #setPremadeOrderButton(products) {
      const button = DOM.get("#run-premade-order")
      button.addEventListener("click", () => {
         const premadeOrder = DOM.get("#premade-order").value.trim()
         if(premadeOrder === "") return;

         const splittedOrder = premadeOrder.split("\n").filter(line => line !== '')
         this.#changeDataInputValue(splittedOrder)
         const splittedProductsPairs = this.#getPremadeOrderProducts(splittedOrder)
         const normalizedOrder = this.#normalizePremadeOrderProducts(splittedProductsPairs)

         normalizedOrder.forEach(([keyName, amount]) => {
            const category = this.#getCategoryByKeyName(keyName)
            const product = products[category].filter(product => product.keyName === keyName)
            product[0].category = category
            this.order.addProducts(product, parseInt(amount))
         })

         this.#cleanPremadeOrderTextArea()
      })
   }

   #setAddButton(products) {
      DOM.get("button#add-order").addEventListener("click", () => {
         const amount = Number(DOM.get("input#amount").value)
         if(amount <= 0) return;
         
         const category = DOM.get("select#category").value
         const from = Number(DOM.get("select#from-number").value)
         const to = Number(DOM.get("select#to-number").value)
         
         const currentOrder = products[category].slice(from, to + 1)
         this.order.addProducts(currentOrder, amount)
      })
   }

   #cleanDataInputs() {
      const inputs = document.querySelectorAll(".form-data-wrapper input")
      inputs.forEach(input => input.value = "")
   }

   #setSubmitButton() {
      DOM.get("#send-order-form").addEventListener("submit", (ev) => {
         ev.preventDefault()
         const orderData = {
            seller: DOM.get("#seller").value,
            clientName: DOM.get("#client-name").value,
            clientPhone: DOM.get("#client-phone").value,
            clientPhoneOptional: DOM.get("#optional-client-phone").value,
            clientID: DOM.get("#client-identification").value,
            clientAddress: DOM.get("#client-address").value,
         }

         orderData.clientPhone &&= `${DOM.get("#phone-area-code").value}-${orderData.clientPhone}`
         orderData.clientPhoneOptional &&= `${DOM.get("#optional-phone-area-code").value}-${orderData.clientPhoneOptional}`
         orderData.clientID    &&= `${DOM.get("#identification-type").value}-${orderData.clientID}`
   
         
         if(this.order.total.length == 0) return;
         Swal.fire({
            title: '¿Seguro que quieres agregar el pedido?',
            text: "No podrás realizar cambios en él",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, agregar',
            cancelButtonText: 'Cancelar'
         }).then((result) => {
            if (result.isConfirmed) {
               this.order.setData(orderData)
               this.orderList.addOrder(this.order)

               this.order = new Order()
               this.#cleanDataInputs()
               Swal.fire(
                  '!Listo!',
                  'El pedido fue agregado',
                  'success'
               )
            }
         })
      }) 
   }
}