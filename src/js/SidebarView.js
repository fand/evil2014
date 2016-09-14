const React = require('react');
const ReactDOM = require('react-dom');
const SidebarComponent = require('./SidebarComponent');

class SidebarView {

    /**
     * @param {Sidebar} model
     * Called by Sidebar.prototype.constructor.
     */
    constructor (model) {
        this.component = ReactDOM.render(
            <SidebarComponent model={model}/>,
            document.querySelector('#sidebar-wrapper')
        );
    }

    showTracks (track, pattern) {
        this.component.setState({
            mode : 'TRACKS',
            track,
            pattern,
        });
    }

    showMaster (scene) {
        this.component.setState({
            mode : 'MASTER',
            scene,
        });
    }

}

module.exports = SidebarView;
