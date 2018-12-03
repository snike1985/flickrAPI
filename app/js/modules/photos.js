import $ from 'jquery';

export default class photos {

    constructor(obj) {

        this.obj = obj;
        this.filter = this.obj.querySelector('.photos__filter');
        this.search = this.obj.querySelector('.photos__search');
        this.submit = this.obj.querySelector('.photos__submit');
        this.result = this.obj.querySelector('.photos__result');
        this.showMore = this.obj.querySelector('.photos__show-more .btn');
        this.options = {
            api_key: '604154e43df133158fd876fd5416d350',
            extras: 'url_m',
            per_page: 10,
            page: 1,
            format: 'json',
            nojsoncallback: 1
        };

        this.init();
    }

    sendRequest(options) {
        const self = this;

        $.get('http://api.flickr.com/services/rest/', options, function(res){
            if (res.stat === 'ok') {
                const photos = res.photos.photo;
                const pages = res.photos.pages;
                const total = res.photos.total;

                if (total == 0) {
                    self.obj.classList.add('no-result');
                } else {
                    if (pages > self.options.page) {
                        self.obj.classList.add('show-more');
                    } else {
                        self.obj.classList.remove('show-more');
                    }

                    photos.forEach((photo) => {
                        const elem = document.createElement('div');
                        const imageURL = photo['url_m'];

                        if (imageURL) {
                            elem.style.backgroundImage = 'url(' + imageURL + ')';
                        } else {
                            elem.classList.add('no-image-url');
                        }

                        elem.classList.add('photos__item');
                        self.result.appendChild(elem);
                    });
                }
            }
            else {
                console.log('something went wrong', res);
            }

            self.obj.classList.remove('loading');
        });
    }

    clearResults() {
        [...this.obj.querySelectorAll('.photos__item')].forEach((item) => {
            item.remove();
        });
    }

    load() {
        const options = this.options;
        const searchText = this.search.value;

        if (searchText) {
            options.method = 'flickr.photos.search';
            options.text = searchText;
        } else {
            options.method = 'flickr.photos.getRecent';
        }

        options.page = 1;
        this.obj.classList.remove('show-more');

        this.clearResults();
        this.sendRequest(options);
    }

    loadMore() {
        const options = this.options;

        options.page++;
        this.sendRequest(options);
    }

    onEvents() {

        this.filter.addEventListener('submit', (e) => {
            e.preventDefault();

            this.obj.classList.add('loading');
            this.load();
        });

        this.showMore.addEventListener('click', () => {
            this.obj.classList.add('loading');
            this.loadMore();
        });

    }
    
    init() {

        this.onEvents();
    }

}