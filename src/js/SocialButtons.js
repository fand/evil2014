const React = require('react');

class SocialButtons extends React.Component {

  renderText () {
    const song = this.props.song;
    if (song.title == null) {
      return '"evil" by gmork';
    }
    if (song.creator != null) {
        return `"${song.title}" by ${song.creator}`;
    }
    else {
        return `"${song.title}"`;
    }
  }

  /**
   * @param {string} service - 'twitter' | 'facebook' | 'hatebu'
   */
  share (service) {

    const url  = location.href;
    const text = this.renderText();

    if (service === 'twitter') {
        const twUrl = `http://twitter.com/intent/tweet?url=${encodeURI(`${url}&text=${text}&hashtags=evil`)}`;
        window.open(twUrl, 'Tweet', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
    }
    else if (service === 'facebook') {
        const fbUrl = `http://www.facebook.com/sharer.php?&u=${url}`;
        window.open(fbUrl, 'Share on facebook', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1');
    }
    else {
        const hbUrl = `http://b.hatena.ne.jp/entry/${url.split('://')[1]}`;
        window.open(hbUrl);
    }

  }


  render () {
    return (
      <div className="clearfix">
        <div className="social" onClick={() => this.share('hatebu')}/>
        <div className="social fa fa-facebook" onClick={() => this.share('facebook')}/>
        <div className="social fa fa-twitter" onClick={() => this.share('twitter')}/>
      </div>
    );
  }

}

module.exports = SocialButtons;
