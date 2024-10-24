'use strict';
class GiphyObj {
  key = '6zzmXysXbC6FVLIrBCIeQUTEjtl9DNN5';
  q = '';
  trending_api = () =>
    `https://api.giphy.com/v1/gifs/trending?api_key=${this.key}&limit=${this.limit}&offset=${this.offset}`;
  search_api = () =>
    `https://api.giphy.com/v1/gifs/search?api_key=${this.key}&limit=${this.limit}&offset=${this.offset}&q=%22${this.q}%22`;
  offset = 0;
  limit = 10;

  updateOffset = () => {
    this.offset += this.limit;
  };
}

const style = document.createElement('style');
style.innerHTML = `
  .fav {
    font-size: 24px; /* Make the heart larger */
    color: red; /* Red color */
    background: none; /* Remove background */
    border: none; /* Remove border */
    cursor: pointer; /* Make it look clickable */
    transition: transform 0.2s ease; /* Smooth hover effect */
  }

  .fav:hover {
    transform: scale(1.2); /* Make it a bit larger when hovered */
  }

  .autor img {
    width: 30px;  /* Adjust the size of the logo */
    height: 30px; /* Keep the logo square, you can adjust as needed */
    border-radius: 50%; /* Optional: make the logo circular */
  }

  .info strong {
    font-size: 14px;  /* Reduce the name font size */
    color: #333;      /* Adjust the color if needed */
  }

  .info p {
    font-size: 12px;  /* Reduce the font size of the additional info text */
    color: #666;      /* Optional: add a lighter color for the secondary text */
  }
`;
document.head.appendChild(style);

/** Get param q, from url, return empty string or query */
const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  let query = decodeURIComponent(params.get('q'));
  if (query == 'null') {
    query = '';
  }

  return query;
};

/**Load Api with gifs */
const loadGifs = async (url, callback) => {
  let gifsResponse = await fetch(url);
  let gifs = await gifsResponse.json();
  if (gifs.data.length > 0) {
    callback(gifs.data);
  } else {
    document.getElementById('gifs-list').innerHTML = `<div class="flex-col">
            <p>Lo siento, no se encontro</p>
            <img src="assets/images/no.gif" alt="no encontrado"> 
        </div> `;
  }
  return gifs.data;
};

/**Search */

const searchEvent = (e, giphyObj) => {
  //call search api with params
  let barraBusqueda = document.getElementById('search');
  let q = barraBusqueda.value;
  giphyObj.q = q;
  //delete previus result
  document.querySelector('#gifs-list').innerHTML = '';
  loadGifs(giphyObj.search_api(), updateMainView);
  //update view search text
  let searchElement = document.getElementById('search-term');
  searchElement.innerHTML = q;
  //update q param
  var queryParams = new URLSearchParams(window.location.search);
  queryParams.set('q', q);
  history.replaceState(null, null, '?' + queryParams.toString());
  setHistory(q);
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0;
};
/**Load infinite */
// listen for scroll event and load more images if we reach the bottom of window

/** HISTORY */
const getHistory = () => {
  let localStorage = window.localStorage;
  let historyString = localStorage.getItem('history');
  let history = historyString ? JSON.parse(historyString) : [];
  let menu = document.getElementById('history');
  history.map((q) => {
    let li = document.createElement('li');
    li.innerHTML = `<li><a class="tag-btn" href="?q=${q}">${q}</a> </li>
        `;
    menu.prepend(li);
  });
};

const setHistory = (q) => {
  //get history fron local storage
  let localStorage = window.localStorage;
  let historyString = localStorage.getItem('history');
  let history = historyString ? JSON.parse(historyString) : [];
  let menu = document.getElementById('history');
  if (history.length < 3) {
    history.push(q);
  } else {
    history.shift();
    history.push(q);

    menu.removeChild(menu.lastElementChild);
  }
  localStorage.setItem('history', JSON.stringify(history));

  let li = document.createElement('li');
  li.innerHTML = `<li><a class="tag-btn" href="?q=${q}">${q}</a> </li>
    `;
  menu.prepend(li);
};

function shareOnFacebook(url) {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  window.open(shareUrl, '_blank');
}

function shareOnTwitter(url, text) {
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank');
}

function shareOnPinterest(url, imageUrl, description) {
  const shareUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
    url
  )}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(
    description
  )}`;
  window.open(shareUrl, '_blank');
}

//View updaters
const updateMainView = (gifs) => {
  gifs.forEach((gif) => {
    //1. find element and build template
    let main = document.querySelector('#gifs-list'); //Esta en el dom
    let figure = document.createElement('figure', { class: 'figure' }); //Este no esta en el dom todavia
    let modal = document.querySelector('.modal');
    let url;

    let text, description;
    figure.addEventListener('click', (e) => {
      modal.classList.add('display-modal');
      url = e.target.src;
      text = 'Check out this amazing Gif!';
      description = 'Check out this amazing Gif!';

      modal.addEventListener('click', (e) => {
        if (e.target.id === 'copy') {
          navigator.clipboard.writeText(url);
          // Show "Copied" message
          e.target.textContent = 'Copied';

          // Reset the button text to "Copy" after 2 seconds (2000 milliseconds)
          setTimeout(() => {
            e.target.textContent = 'Copy';
          }, 2000);
        }
        if (e.target.id === 'share-fb') {
          shareOnFacebook(url);
        }
        if (e.target.id === 'share-twitter') {
          shareOnTwitter(url, text);
        }
        if (e.target.id === 'share-pinterest') {
          shareOnPinterest(url, url, description);
        }
        // if(e.target.id === 'share-insta'){
        //   shareOnInstagram(url,description);
        // }
      });
    });
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'close' || e.target.id === 'modal-overlay') {
        modal.classList.remove('display-modal');
      }
      if (e.target.id === 'copy') {
        console.log(url);
      }
    });

    figure.innerHTML = `
  <picture class="picture">
    <source srcset="${gif.images?.downsized?.url}" type="image/png" media="(min-width:1920px)">
    <source srcset="${gif.images?.downsized?.url}" type="image/png" media="(min-width:1200px)">
    <source srcset="${gif.images?.downsized?.url}" type="image/png" media="(min-width:700px)">
    <img src="${gif.images?.downsized?.url}" alt="Test" class="abc">
  </picture>
  <figcaption>
    <div class="autor flex-row align-items-center">
      <img src="${gif.user?.avatar_url || 'https://placehold.jp/150x150.png'}" alt="">
      <div class="info flex-col">
        <p><strong>${gif.user?.username || 'autor'}</strong></p>
        <p>${gif.source_tld}</p>
      </div>
      <div class="fav-container">
        <button id="fav" onclick="getGifInfo(event)" class="fav">❤</button>
         <!-- Add your text here -->
      </div>
    </div>
  </figcaption>
`;

    //4. agregar el nodo html a el padre.
    main.appendChild(figure);
  });
};
/** Updates search termn in view */
const updateParamView = (q) => {
  let text = q ? q : 'Todo';
  let searchElement = document.getElementById('search-term');
  searchElement.innerHTML = text;
};

const init = async () => {
  const searchTerm = getUrlParams();
  const giphyObj = new GiphyObj();
  giphyObj.q = searchTerm;
  updateParamView(searchTerm);
  getHistory();

  if (searchTerm) {
    loadGifs(giphyObj.search_api(), updateMainView);
  } else {
    loadGifs(giphyObj.trending_api(), updateMainView);
  }

  // Improved scroll event handling
  let loading = false; // Prevent multiple scroll events

  window.addEventListener('scroll', () => {
    if (
      !loading &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 1
    ) {
      loading = true;
      giphyObj.updateOffset();
      //update css
      let list = document.querySelector('#gifs-list');
      list.style.height = `${giphyObj.offset * 10}vh`;
      if (searchTerm) {
        loadGifs(giphyObj.search_api(), (gifs) => {
          updateMainView(gifs);
          loading = false;
        });
      } else {
        loadGifs(giphyObj.trending_api(), (gifs) => {
          updateMainView(gifs);
          loading = false;
        });
      }
    }
  });

  const searchBar = document.getElementById('search');
  searchBar.addEventListener('search', (e) => {
    searchEvent(e, giphyObj);
  });

  document.getElementById('search-btn').addEventListener('click', (e) => {
    searchEvent(e, giphyObj);
  });

  const toggle = document.querySelector('#toggle');
  const toggleImage = document.querySelector('#toggle-image');
  const searchInput = document.querySelector('input');
  toggle.addEventListener('click', modeSwitch);

  let isLight = true;
  const lightLamp = (toggleImage.src = './assets/images/lightLamp.svg');
  const darkLamp = (toggleImage.src = './assets/images/darklamp.svg');

  function modeSwitch() {
    isLight = !isLight;
    // toggle button image light/dark switcher
    isLight ? (toggleImage.src = darkLamp) : (toggleImage.src = lightLamp);
    // toggle light/dark mode
    var rootElement = document.body;
    rootElement.classList.toggle('dark-mode');
    // toggle input Search background and color
    isLight
      ? searchInput.classList.remove('dark')
      : searchInput.classList.add('dark');
  }
};

// Add an event listener for the "Upload GIF" button
document.getElementById('upload-button').addEventListener('click', () => {
  // Trigger the hidden file input
  document.getElementById('file-upload').click();
});

// Add an event listener for the file input to handle the selected GIF
document.getElementById('file-upload').addEventListener('change', async (e) => {
  const file = e.target.files[0];

  if (file && file.type === 'image/gif') {
    console.log('file upload successfull');
  }
});
// Below function is basically used in HTML
/* eslint-disable no-unused-vars */
const getGifInfo = function (e) {
  e.stopPropagation();
  const figure = e.target.closest('figure');
  const imageElement = figure.querySelector('.picture img');
  const imageUrl = imageElement.getAttribute('src');
  const imageAlt = imageElement.getAttribute('alt');

  const authorImage = figure.querySelector('.autor img').getAttribute('src');
  const authorName = figure.querySelector('.autor strong').innerText;
  setFavs(imageUrl, { imageUrl, imageAlt, authorName, authorImage });
};

const setFavs = function (link, gif) {
  const localStorage = window.localStorage;
  const favsString = localStorage.getItem('gifs');
  const favs = favsString ? JSON.parse(favsString) : {};
  favs[link] = gif;
  const newFavs = JSON.stringify(favs);
  localStorage.setItem('gifs', newFavs);
};

init();
