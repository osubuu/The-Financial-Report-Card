import scrollToElement from 'scroll-to-element';

const Utils = {
	toResults: () => scrollToElement('.results', { ease: 'inSine', duration: 500 }),
};

export default Utils;
