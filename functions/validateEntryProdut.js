export default function validateEntryProduct() {
    let validate = true
    const selects = document.querySelectorAll("select")
    const amount = parseInt(document.querySelector("input#amount").value)

    selects.forEach(({value}) => validate = (value === "") ? false : validate)
    if(amount <= 0 || isNaN(amount)) validate = false

    return validate;
}