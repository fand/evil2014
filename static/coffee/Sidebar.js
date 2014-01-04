(function() {
  this.Sidebar = (function() {
    function Sidebar(ctx, player, session, mixer) {
      this.ctx = ctx;
      this.player = player;
      this.session = session;
      this.mixer = mixer;
      this.sidebar_pos = {
        x: 0,
        y: 1,
        type: 'master'
      };
      this.view = new SidebarView(this);
    }

    Sidebar.prototype.show = function(song, select_pos) {
      this.song = song;
      this.select_pos = select_pos;
      if (this.select_pos.type === 'tracks') {
        if (this.sidebar_pos.x === this.select_pos.x && this.sidebar_pos.type === this.select_pos.type) {
          return;
        }
        this.sidebar_pos = this.select_pos;
        return this.view.showTracks(this.song.tracks[this.select_pos.x]);
      } else {
        if (this.sidebar_pos.y === this.select_pos.y && this.sidebar_pos.type === this.select_pos.type) {
          return;
        }
        this.sidebar_pos = this.select_pos;
        return this.view.showMaster(this.song.master[this.select_pos.y]);
      }
    };

    Sidebar.prototype.saveMaster = function(obj) {
      if (this.sidebar_pos.y === -1) {
        return;
      }
      return this.session.saveMaster(this.sidebar_pos.y, obj);
    };

    Sidebar.prototype.saveTracksEffect = function(i, param) {
      if (this.sidebar_pos.type === 'master') {
        return;
      }
      return this.player.synth[this.sidebar_pos.x].effects[i].saveParam();
    };

    return Sidebar;

  })();

}).call(this);
