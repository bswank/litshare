const stripe = Stripe('pk_test_2otIt0NQeoZpqBuXVB3jbXo8')
const elements = stripe.elements({
  fonts: [
    {
      family: 'Lato',
      weight: 400,
      src: 'local("Lato Regular"), local("Lato-Regular"), url(https://fonts.gstatic.com/s/lato/v13/MDadn8DQ_3oT6kvnUq_2r_esZW2xOQ-xsNqO47m55DA.woff2) format("woff2")',
      unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215'
    }
  ]
})
const card = elements.create('card', {
  style: {
    base: {
      fontFamily: '"Lato", sans-serif'
    }
  }
})
card.mount('#card-element')
card.addEventListener('change', ({error}) => {
  const displayError = document.getElementById('card-errors')
  if (error) {
    displayError.textContent = error.message
  } else {
    displayError.textContent = ''
  }
})

const form = document.getElementById('payment-form')
form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const {token, error} = await stripe.createToken(card)
  if (error) {
    const errorElement = document.getElementById('card-errors')
    errorElement.textContent = error.message
  } else {
    stripeTokenHandler(token)
  }
})

const stripeTokenHandler = (token) => {
  const form = document.getElementById('payment-form')
  const hiddenInput = document.createElement('input')
  hiddenInput.setAttribute('type', 'hidden')
  hiddenInput.setAttribute('name', 'stripeToken')
  hiddenInput.setAttribute('value', token.id)
  form.appendChild(hiddenInput)
  form.submit()
}
