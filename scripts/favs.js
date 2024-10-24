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

const getFavs = function () {
  const localStorage = window.localStorage;
  const favsString = localStorage.getItem('gifs');
  const favs = favsString
    ? new Map(Object.entries(JSON.parse(favsString)))
    : new Map();

  return favs;
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

const setFavs = function () {
  let gifs = getFavs();
  let main = document.querySelector('#gifs-list');
  let modal = document.querySelector('.modal');
  let fragment = document.createDocumentFragment();
  let url;

  gifs.forEach((gif) => {
    let figure = document.createElement('figure', { class: 'figure' });
    figure.innerHTML = `
      <picture class="picture ">
        <source srcset="${gif.imageUrl}" type="image/png" media="(min-width:1920px)">
        <source srcset="${gif.imageUrl}" type="image/png" media="(min-width:1200px)">
        <source srcset="${gif.imageUrl}" type="image/png" media="(min-width:700px)">
        <image src="${gif.imageUrl}" alt="test" class="abc">
      </picture>
      <figcaption>
        <div class="autor flex-row aling-items-center">
          <img src="${gif.authorImage}" />
        </div>
        <div class="info flex-col">
          <p><strong>${gif.authorName || 'autor'}</strong></p>
        </div>
        <button class="remove-fav-btn">Remove from Favorites</button>
      </figcaption>
    `;

    // Event listener for removing the favorite (outside modal logic)
    figure.querySelector('.remove-fav-btn').addEventListener('click', (e) => {
      e.stopPropagation();  // Prevents the modal from being triggered on remove
      removeFav(gif.imageUrl);  // Remove GIF from localStorage using its imageUrl
      figure.remove();  // Remove the GIF from the DOM
    });

    fragment.appendChild(figure);

    // Modal logic
    figure.addEventListener('click', (e) => {
      modal.classList.add('display-modal');
      url = e.target.src;

      // Close button listener
      modal.querySelector('#close').addEventListener('click', () => {
        modal.classList.remove('display-modal');
      });

      modal.addEventListener('click', (e) => {
        if (e.target.id === 'fav') {
          removeFav(url);
          e.target.textContent = 'Removed';
        }
        if (e.target.id === 'copy') {
          navigator.clipboard.writeText(url);
          e.target.textContent = 'Copied';
          setTimeout(() => {
            e.target.textContent = 'Copy';
          }, 2000);
        }
        if (e.target.id === 'share-fb') {
          shareOnFacebook(url);
        }
        if (e.target.id === 'share-twitter') {
          shareOnTwitter(url, 'Check out this amazing Gif!');
        }
        if (e.target.id === 'share-pinterest') {
          shareOnPinterest(url, url, 'Check out this amazing Gif!');
        }
      });
    });
  });

  main.appendChild(fragment);
};

// Updated removeFav function
const removeFav = function (url) {
  let favs = getFavs();  // Get current favorites
  favs.delete(url);  // Remove the GIF from the Map using the imageUrl as the key
  const newFavs = JSON.stringify(Object.fromEntries(favs));  // Convert Map back to an object
  localStorage.setItem('gifs', newFavs);  // Update localStorage with the new state
};

setFavs();

