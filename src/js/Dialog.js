const React = require('react');
const openSocialModal = require('./openSocialModal');

class Dialog extends React.Component {

  constructor () {
    super();
    this.state = {
      isVisible : false,
      isSuccess : true,
      songTitle : null,
      userName  : null,
      songUrl   : location.href,
    };
  }

  renderText () {
    const { songTitle, userName } = this.state;

    if (songTitle == null) {
      return '"evil" by gmork';

    }
    if (userName != null) {
      return `"${songTitle}" by ${userName}`;
    }
    else {
      return `"${songTitle}"`;
    }
  }

  closeDialog () {
    this.setState({ isVisible: false });
  }

  renderSuccess () {
    const text = this.renderText();
    const title = this.state.songTitle ? `${text} :: evil` : 'evil';

    history.pushState('', title, new URL(this.state.songUrl).pathname);
    document.title = title;

    return (
      <div className="Dialog__Success">
        <i className="fa fa-check Dialog__Message__Icon"/>
        <div className="Dialog__Message__Main">Saved!</div>
        <div className="Dialog__Message__Sub">{this.state.songUrl}</div>

        <div className="clearfix Dialog__Social">
          <i className="Dialog__Social__Twitter fa fa-twitter"
            onClick={() => openSocialModal('TWITTER', this.state.songUrl, text)}/>
          <a className="Dialog__Social__Facebook fa fa-facebook"
            onClick={() => openSocialModal('FACEBOOK', this.state.songUrl, text)}/>
        </div>
      </div>
    );
  }

  renderFailure () {
    return (
      <div className="Dialog__Failure">
        <i className="fa fa-frown-o Dialog__Message__Icon"/>
        <div className="Dialog__Message__Main">Failed.</div>
        <div className="Dialog__Message__Sub">"Hmm... something's going wrong."</div>
      </div>
    );
  }

  render () {
    if (!this.state.isVisible) { return null; }

    return (
      <div className="Dialog">
        <div className="Dialog__Window">
          {this.state.isSuccess ? this.renderSuccess() : this.renderFailure()}
          <i className="fa fa-times Dialog__Close" onClick={() => this.closeDialog()}/>
        </div>
      </div>
    );
  }

}

module.exports = Dialog;
