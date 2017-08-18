$('.user-menu-toggle').click(function() {
  if ($('header nav ul li.user.user-notifications-toggle a').hasClass('active')) {
    $('.user-notifications').fadeOut(150);
    $('header nav ul li.user.user-notifications-toggle a').removeClass('active');
  }
  $('.user-menu').fadeToggle(150);
  $('header nav ul li.user.user-menu-toggle a').toggleClass('active');
});

$('#wrapper').click(function() {
  $('.user-menu').fadeOut(150);
  $('header nav ul li.user.user-menu-toggle a').removeClass('active');
});

$('.user-notifications-toggle').click(function() {
  if ($('header nav ul li.user.user-menu-toggle a').hasClass('active')) {
    $('.user-menu').fadeOut(150);
    $('header nav ul li.user.user-menu-toggle a').removeClass('active');
  }
  $('.user-notifications').fadeToggle(150);
  $('header nav ul li.user.user-notifications-toggle a').toggleClass('active');
});

$('#wrapper').click(function() {
  $('.user-notifications').fadeOut(150);
  $('header nav ul li.user.user-notifications-toggle a').removeClass('active');
});

$('.flash').delay('100').slideDown().delay('7000').slideUp();

$('.flash').click(function() {
  $(this).stop();
});

(function activePage(page) {
  if (!page == '') {
    const choice = document.querySelector(page);
    choice.classList.add('current');
  }
})(pageVar);

function autocomplete(input, latInput, lngInput) {
  if(!input) return; // don't run if there's no address on page

  const options = {types: ['(regions)']};

  const dropdown = new google.maps.places.Autocomplete(input, options);

  dropdown.addListener('place_changed', function() {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });

  input.addEventListener('keydown', function(e){
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });
}

const acInput = document.querySelector('#address');
const acLatInput = document.querySelector('#lat');
const acLngInput = document.querySelector('#lng');

autocomplete(acInput, acLatInput, acLngInput);

function searchResultsHTML(communities) {
  return communities.map(community => {
    return `
      <a href="/communities/${community.slug}" class="search--result">
        <p>${community.name}</p>
      </a>
    `
  }).join('');
};

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.searchResults');

  searchInput.addEventListener('input', function() {
    if (!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';
    searchResults.innerHTML = '';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = DOMPurify.sanitize(searchResultsHTML(res.data));
          return;
        }
        searchResults.innerHTML = DOMPurify.sanitize(`<div class="search--result">No results for ${this.value} found.</div>`)
      })
      .catch(err => {
        console.error(err);
      });
  });

  searchInput.addEventListener('keyup', (e) => {
    if (![38, 40, 13].includes(e.keyCode)) {
      return;
    }
    const activeClass = 'active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search--result');
    let next;
    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1]
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }

    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  });
};

typeAhead(document.querySelector('.search'));

$('#createCommunityModal--trigger').click(function() {
  $('#createCommunityModal').fadeIn('fast');
  $('body').addClass('no-scroll');
});

$('#editCommunityModal--trigger').click(function() {
  $('#editCommunityModal').fadeIn('fast');
  $('body').addClass('no-scroll');
});

$('#deleteCommunityModal--trigger').click(function() {
  $('#deleteCommunityModal').fadeIn('fast');
  $('body').addClass('no-scroll');
});

$('#leaveCommunityModal--trigger').click(function() {
  $('#leaveCommunityModal').fadeIn('fast');
  $('body').addClass('no-scroll');
});

$('#editProfileModal--trigger').click(function() {
  $('#editProfileModal').fadeIn('fast');
  $('body').addClass('no-scroll');
});

$('#deleteAccountModal--trigger').click(function() {
  $('#deleteAccountModal').fadeIn('fast');
  $('body').addClass('no-scroll');
});

$('#forgotPasswordModal--trigger').click(function() {
  $('#forgotPasswordModal').fadeIn('fast');
  $('body').addClass('no-scroll');
});

$('.modal .cancel').click(function() {
  $('.modal-wrapper').fadeOut('fast');
  $('body').removeClass('no-scroll');
});

$('.modal').click(function(e) {
  e.stopPropagation();
});

$('.modal-container').click(function() {
  $('.modal-wrapper').fadeOut('fast');
  $('body').removeClass('no-scroll');
});
