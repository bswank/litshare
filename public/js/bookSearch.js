/* global $ */

$('form[name="bookSearch"]').on('submit', function (e) {
  e.preventDefault()
  const searchInputVal = $('.search--input').val()
  $('.searchResults').empty()
  $.ajax({
    url: `https://www.googleapis.com/books/v1/volumes?q=${searchInputVal}&KEY=AIzaSyCw4XzKi2KdnH3KQKZJUMi4614fVUGD2l4`,
    success:
    function (json) {
      console.log(json)
      var htmlcontent = ''
      for (let i = 0; i < 5; i++) {
        if (json.items[i].volumeInfo.title && json.items[i].volumeInfo.authors && json.items[i].volumeInfo.imageLinks) {
          // for every one, create a form to save book
          htmlcontent += `
            <div class="book-suggestion">
              <li>
                <img src=${json.items[i].volumeInfo.imageLinks.smallThumbnail}>
                <div class="info">
                  <h3><strong>${json.items[i].volumeInfo.title}</strong></h3>
                  <p>${json.items[i].volumeInfo.subtitle}</p>
                  <p><small>${json.items[i].volumeInfo.authors[0]}</small></p>
                </div>
                <button class="pos mt short"><i class="fa fa-plus"></i></button>
                <br>
              </li>
            </div>
          `
        }
      }
      document.querySelector('.searchResults').innerHTML = `<div class="book-suggestions"><ul>${htmlcontent}</ul></div>`
    }
  })
})
