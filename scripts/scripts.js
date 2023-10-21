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

/** Get param q, from url, return empty string or query */
const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  let query = decodeURIComponent(params.get('q'));
  let url = '';
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

//View updaters
const updateMainView = (gifs) => {
  gifs.forEach((gif) => {
    //1. find element and build template
    let main = document.querySelector('#gifs-list'); //Esta en el dom
    let figure = document.createElement('figure', { class: 'figure' }); //Este no esta en el dom todavia
    let modal = document.querySelector('.modal');
    let url;
    figure.addEventListener('click', (e)=>{
      modal.classList.add('display-modal');
      url = e.target.src;
    });
    modal.addEventListener('click', (e) =>{
      if(e.target.id === 'close' || e.target.id === 'modal-overlay'){
        modal.classList.remove('display-modal');
      }
      if(e.target.id === 'copy'){
        console.log(url);
      }
    })

    figure.innerHTML = `
            <picture class="picture ">
                <source srcset="${
                  gif.images?.downsized?.url
                }" type="image/png" media="(min-width:1920px)">
                <source srcset="${
                  gif.images?.downsized?.url
                }" type="image/png" media="(min-width:1200px)">
                <source srcset="${
                  gif.images?.downsized?.url
                }" type="image/png" media="(min-width:700px)">
                <img src="${gif.images?.downsized?.url}" alt="Test" class="abc">
            </picture>
            <figcaption>
                <div class="autor flex-row aling-items-center">
                    <img src="${
                      gif.user?.avatar_url || 'https://placehold.jp/150x150.png'
                    }" alt="">
                    <div class="info flex-col ">
                        <p><strong>${gif.user?.username || 'autor'}</strong></p>
                        <p>${gif.source_tld}</p>
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

const init = async (offset = 0) => {
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
      let list = document.querySelector("#gifs-list");
      list.style.height = `${giphyObj.offset*10}vh`;
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
};

init();
