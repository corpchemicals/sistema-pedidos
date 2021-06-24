function printDisarmedKits(products, kits) { //in params are kits
  const disarmed = {}
  let html_kits = ``
  for(const kit in kits) {
    //multiply kits amount for their elements
    const amount = kits[kit]
    const data_key = `kit${kit}`
    //add kit li element  
    html_kits += `
    <li>
      ${data_key.toUpperCase()}:  
      <span style="color: #4aa96c;">
        ${amount}
      </span>
    </li>`

    //orings
    for(const oring in products[data_key]['orings']) {
      (disarmed[oring])
        ? disarmed[oring] += products[data_key]['orings'][oring]*amount
        : disarmed[oring] = products[data_key]['orings'][oring]*amount;
    }
    //microfilters
    for(const microfilter in products[data_key]['microfilters']) {
      (disarmed[microfilter])
      ? disarmed[microfilter] += products[data_key]['microfilters'][microfilter]*amount
      : disarmed[microfilter] = products[data_key]['microfilters'][microfilter]*amount;
    }
  }

  let html_kitcontent = ``
  for(const content in disarmed) {
    const amount = disarmed[content]
    html_kitcontent += `
    <li>
      ${content}:  
      <span style="color: #f55c47;">
        -${amount}
      </span>
    </li>`
  }

  //HTML format
  const body = document.querySelector("body")
  const container = document.createElement('section')
  //Administrative input Orings
  container.className = 'disarmKits'
  container.innerHTML = `
    <article>
    <h2>Entrada</h2>
    <ul>${html_kits}</ul>
    </article>
    <article>
    <h2>Salida</h2>
    <ul>${html_kitcontent}</ul>
    </article>
  `
  const app_result = document.querySelector("#app-result")
  app_result.appendChild(container)
}

export default printDisarmedKits