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
  

describe('GiphyObj', () => {
  let giphyObj;
  beforeEach(() => {
    giphyObj = new GiphyObj();
  });

  test('should return trending API URL', () => {
    expect(giphyObj.trending_api()).toBe(
      `https://api.giphy.com/v1/gifs/trending?api_key=${giphyObj.key}&limit=${giphyObj.limit}&offset=${giphyObj.offset}`
    );
  });

  test('should return search API URL', () => {
    giphyObj.q = 'cats';
    expect(giphyObj.search_api()).toBe(
      `https://api.giphy.com/v1/gifs/search?api_key=${giphyObj.key}&limit=${giphyObj.limit}&offset=${giphyObj.offset}&q=%22cats%22`
    );
  });

  test('should update offset by limit', () => {
    const initialOffset = giphyObj.offset;
    giphyObj.updateOffset();
    expect(giphyObj.offset).toBe(initialOffset + giphyObj.limit);
  });
});