const SERVICE = {
  TWITTER  : 'TWITTER',
  FACEBOOK : 'FACEBOOK',
  HATEBU   : 'HATEBU',
};

/**
 * Open popup window to share to SNS.
 * @param {SERVICE} service - 'twitter' | 'facebook' | 'hatebu'
 * @param {string} url - url to share
 * @param {string} text
 */
function openSocialModal (service, url, text) {
  switch (service) {
  case SERVICE.TWITTER: {
    const twUrl = `http://twitter.com/intent/tweet?url=${encodeURI(`${url}&text=${text}&hashtags=evil`)}`;
    window.open(twUrl, 'Tweet', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
    break;
  }
  case SERVICE.FACEBOOK: {
    const fbUrl = `http://www.facebook.com/sharer.php?&u=${url}`;
    window.open(fbUrl, 'Share on facebook', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
    break;
  }
  case SERVICE.HATEBU: {
    const hbUrl = `http://b.hatena.ne.jp/entry/${url.split('://')[1]}`;
    window.open(hbUrl);
    break;
  }
  default:
    throw new TypeError(`Invalid Service Name "${service}"`);
  }
}

module.exports = openSocialModal;
