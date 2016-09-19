const React = require('react');
const _     = require('lodash');

// Sessionを呼ぶ処理
// this.model.cuePattern(x, y);
// this.model.cueOff(x);
// this.model.cueScene(y)
// this.model.editPattern(pos.x, pos.y);
// this.model.savePattern(src.x, src.y);
// this.model.readTrack(this.song, src, dst);
// this.model.readPattern(this.song.tracks[dst.x].patterns[dst.y], dst.x, dst.y);
// this.model.readMaster(this.song.master[dst.y], dst.y);
// this.model.player.sidebar.show(this.song, this.select_pos);
// this.model.saveSong

// Sessionから呼ばれる処理
// this.view.showSuccess     - Ajaxで保存成功のモーダルを表示
// this.view.showError       - Ajaxで保存失敗のモーダルを表示
// this.view.readSong        - song全体の表示を更新
// this.view.drawScene       - あるsceneの表示を更新
// this.view.drawTrackName   - あるtrackの表示を更新
// this.view.drawPatternName - あるpatternの表示を更新
// this.view.addSynth        - あるsynthを追加して表示を更新
// this.view.getSelectPos    - 現在選択されているposを返す
// this.view.clearAllActive  - 選択解除する
// this.view.beat            - 再生ボタンを光らせる
// this.view.getCSRFToken    - CSRF対策のtokenを返す

class SessionComponent extends React.Component {

  constructor () {
    super();
    this.state = {
      song: null,
    };
  }

  onDoubleClickTrackCell (x, y) {
    this.props.model.editPattern(x, y);
  }

  onDoubleClickEmptyCell (x, y) {
    this.props.model.editPattern(x, y);
  }

  renderTrackCell (pattern, x, y) {
    if (!pattern) {
      return (
        <div className="Session__Track__EmptyCell" key={y}
          onDoubleClick={() => this.onDoubleClickTrackCell(x, y)}/>
      );
    }
    return (
      <div className="Session__Track__Cell" key={y}
        onDoubleClick={() => this.onDoubleClickTrackCell(x, y)}>
        {pattern.name}
      </div>
    );
  }

  renderTrack (track, x) {
    return (
      <div className="Session__Track" key={x}>
        <div className="Session__Track__Header">
          {track.name}
        </div>
        {Array.from(track.patterns).map((p, y) => this.renderTrackCell(p, x, y))}
      </div>
    );
  }

  renderEmptyTrack (x) {
    const cells = _.range(this.state.song.length + 4);
    return (
      <div className="Session__EmptyTrack" key={x}>
        <div className="Session__EmptyTrack__Header"></div>
        {cells.map((c, y) => (
          <div className="Session__EmptyTrack__Cell" key={c}
            onDoubleClick={() => this.onDoubleClickTrackCell(x, y)}/>
        ))}
      </div>
    );
  }

  render () {
    const song = this.state.song;
    if (!song) { return null; }

    const empties = _.range(song.tracks.length + 7);

    return (
      <div className="Session">
        <div className="Session__Tracks">
          {song.tracks.map((t, x) => this.renderTrack(t, x))}
        </div>
        <div className="Session__EmptyTracks">
          {empties.map(x => this.renderEmptyTrack(x))}
        </div>
      </div>
    );
  }

}

module.exports = SessionComponent;
