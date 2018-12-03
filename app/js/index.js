import Photos from './modules/photos';

const CONFIG = {
  _photos() {

    const elems = document.querySelectorAll('.photos');

    [...elems].forEach((item) => {
      new Photos(item);
    } );

  },

  init() {

    this._photos();

  }
};

CONFIG.init();