"use strict";
class GiphyObj {
    key = "6zzmXysXbC6FVLIrBCIeQUTEjtl9DNN5";
    q = "";
    trending_api = () => `https://api.giphy.com/v1/gifs/trending?api_key=${this.key}&limit=${this.limit}&offset=${this.offset}`;
    search_api = () => `https://api.giphy.com/v1/gifs/search?api_key=${this.key}&limit=10&offset=${this.offset}&q=%22${this.q}%22`;
    offset = 0;
    limit = 10;
}


/** Get param q, from url, return empty string or query */
const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    let query = decodeURIComponent(params.get('q'));
    let url = "";
    if (query == "null") {
        query = "";
    }

    return query
}

/**Load Api with gifs */
const loadGifs = async(url, callback) => {
    let gifsResponse = await fetch(url);
    let gifs = await gifsResponse.json();
    callback(gifs.data);
    return gifs.data;
}

/**Load Api with gifs */
const updateMainView = (gifs) => {
    gifs.forEach(gif => {
        //1. donde lo voy a poner?
        let main = document.querySelector("#gifs-list"); //Esta en el dom
        //2. crear la plantilla de la caja
        let figure = document.createElement("figure", { class: "figure" }); //Este no esta en el dom todavia
        //3. rellenar la información con el objeto.

        //Curar elementos

        figure.innerHTML =
            `
           
            <picture class="picture">
                <source srcset="${gif.images?.downsized?.url}" type="image/png" media="(min-width:1920px)">
                <source srcset="${gif.images?.downsized?.url}" type="image/png" media="(min-width:1200px)">
                <source srcset="${gif.images?.downsized?.url}" type="image/png" media="(min-width:700px)">
                <img src="${gif.images?.downsized?.url}" alt="Test" class="abc">
            </picture>
            <figcaption>
                <div class="autor flex-row aling-items-center">
                    <img src="${gif.user?.avatar_url  || "https://placehold.jp/150x150.png"}" alt="">
                    <div class="info flex-col ">
                        <p><strong>${gif.user?.username || "autor"}</strong></p>
                        <p>${gif.source_tld}</p>
                    </div>
                </div>
            </figcaption>
        
           `;
        //4. agregar el nodo html a el padre.
        main.appendChild(figure);
    });

}

//View updaters
/** Updates search termn in view */
const updateParamView = (q) => {
    let text = q ? q : "Todo";
    let searchElement = document.getElementById("search-term")
    searchElement.innerHTML = text;
}



const init = async() => {
        // check param from url
        const searchTerm = getUrlParams();
        let giphyObj = new GiphyObj();
        giphyObj.q = searchTerm;
        updateParamView(searchTerm);



        if (searchTerm) {
            loadGifs(giphyObj.search_api(), updateMainView);
        } else {
            loadGifs(giphyObj.trending_api(), updateMainView);
        }


    }
    //Funcion de inicio
init();