/* global $ */

const obj = {
  title: 'Test of AJAX 2',
  subtitle: 'Subtitle Example',
  author: 'Literally, Brian Swank',
  libraries: [`59b2932c76320d080109d43b`]
}

$('#testsubmit').click(function () {
  console.log('button works!')
  $.ajax({
    url: '/books/quick-add',
    type: 'POST',
    data: JSON.stringify(obj),
    contentType: 'application/json',
    success: function (data) {
      console.log(data)
    },
    error: function (xhr, text, err) {
      console.log('error: ', err)
      console.log('text: ', text)
      console.log('xhr: ', xhr)
      console.log('there is a problem whit your request, please check ajax request')
    }
  })
})

// addBookToLib()
