const React = require('react');
const openSocialModal = require('./openSocialModal');

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
   * @param {string} service - 'TWITTER' | 'FACEBOOK' | 'HATEBU'
   */
  share (service) {
    const url  = location.href;
    const text = this.renderText();

    openSocialModal(service, url, text);
  }

  render () {
    return (
      <div className="clearfix">
        <div className="social" onClick={() => this.share('HATEBU')}/>
        <div className="social fa fa-facebook" onClick={() => this.share('FACEBOOK')}/>
        <div className="social fa fa-twitter" onClick={() => this.share('TWITTER')}/>
      </div>
    );
  }

}

module.exports = SocialButtons;
