document.getElementById('upload-button').addEventListener('click', () => {
  // Trigger the hidden file input
  document.getElementById('file-upload').click();
});

// Add an event listener for the file input to handle the selected GIF
document.getElementById('file-upload').addEventListener('change', async (e) => {
  const file = e.target.files[0];

  if (file && file.type === 'image/gif') {
    console.log("file upload successfull")
  }
});

const getFavs = function () {
  const localStorage = window.localStorage;
  const favsString = localStorage.getItem("gifs");
  const favs = favsString ? new Map(Object.entries(JSON.parse(favsString))) : new Map();

  return favs;
};
function shareOnFacebook(url) {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank');
}

function shareOnTwitter(url, text) {
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank');
}

function shareOnPinterest(url, imageUrl, description) {
  const shareUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description)}`;
  window.open(shareUrl, '_blank');
}

const setFavs = function(){
	let gifs =getFavs()
	let main = document.querySelector("#gifs-list");
 let modal = document.querySelector('.modal');
	let fragment = document.createDocumentFragment();
 let url;

	gifs.forEach(gif=>{
	let figure = document.createElement('figure', { class: 'figure' }); //Este no esta en el dom todavia
		figure.innerHTML = `
			<picture class="picture ">
				<source srcset="${gif.imageUrl}" type="image/png" media="(min-width:1920px)">
				<source srcset="${gif.imageUrl}" type="image/png" media="(min-width:1200px)">
				<source srcset="${gif.imageUrl}" type="image/png" media="(min-width:700px)">
				<image src="${gif.imageUrl}" alt="test" class="abc">
			</picture>
			<figcaption>
					<div class="autor flex-row aling-items-center">
							<img src="${gif.authorImage} "
					</div>
					<div class="info flex-col " >
							<p><strong>${gif.authorName || 'autor'}</strong></p>
					</div>
			</figcaption>
		`;
 let text, description;
 figure.addEventListener('click', (e)=>{
    modal.classList.add('display-modal');
    url = e.target.src;
    text = "Check out this amazing Gif!";
    description = "Check out this amazing Gif!";

    modal.addEventListener('click', (e) =>{

				if(e.target.id  === 'fav'){
						removeFav(url);
						e.target.textContent = "Removed";
				}
      
    if(e.target.id === 'copy'){
      navigator.clipboard.writeText(url);
          // Show "Copied" message
      e.target.textContent = 'Copied';

          // Reset the button text to "Copy" after 2 seconds (2000 milliseconds)
      setTimeout(() => {
        e.target.textContent = 'Copy';
       }, 2000);
      }
      if(e.target.id === 'share-fb'){
        shareOnFacebook(url);
      }
      if(e.target.id === 'share-twitter'){
        shareOnTwitter(url,text);
      }
      if(e.target.id === 'share-pinterest'){
          shareOnPinterest(url,url,description);
        }
        // if(e.target.id === 'share-insta'){
        //   shareOnInstagram(url,description);
        // }
      })
    });
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'close' || e.target.id === 'modal-overlay') {
        modal.classList.remove('display-modal');
      }
      if (e.target.id === 'copy') {
        console.log(url);
      }
    })

		fragment.appendChild(figure);
	})
	main.appendChild(fragment);

}

const removeFav = function(url){

	const localStorage = window.localStorage
 const favsString = localStorage.getItem("gifs");
	const favs = favsString ? JSON.parse(favsString) : {};
	delete favs[url];
	const newFavs = JSON.stringify(favs);
	localStorage.setItem("gifs", newFavs);

} 


setFavs();

