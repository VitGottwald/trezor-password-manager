/*
 * Copyright (c) Peter Jensen, SatoshiLabs
 *
 * Licensed under Microsoft Reference Source License (Ms-RSL)
 * see LICENSE.md file for details
 */

'use strict';

var React = require('react'),
  Modal = require('react-bootstrap').Modal,
  icons = [
    'person',
    'social-bitcoin',
    'star',
    'flag',
    'heart',
    'settings',
    'email',
    'cloud',
    'alert-circled',
    'person-stalker',
    'android-cart',
    'image',
    'card',
    'earth',
    'wifi'
  ],
  TagModal = React.createClass({
    getInitialState() {
      return {
        showEditModal: false,
        showRemoveModal: false,
        newTagId: '',
        newTagTitle: '',
        newIcon: icons[0],
        content_changed: ''
      };
    },

    componentWillMount() {
      window.myStore.on('openAddTag', this.openEditModal);
      window.myStore.on('openEditTag', this.openEdit);
      window.myStore.on('openRemoveTag', this.openRemoveModal);
    },

    componentWillUnmount() {
      window.myStore.removeListener('openAddTag', this.openEditModal);
      window.myStore.removeListener('openEditTag', this.openEdit);
      window.myStore.removeListener('openRemoveTag', this.openRemoveModal);
    },

    componentDidUpdate() {
      if (this.state.showEditModal) {
        React.findDOMNode(this.refs.newTagTitle).focus();
      }
    },

    /////////
    //
    // ADD / EDIT TAG
    //
    ////////

    closeEditModal() {
      this.setState({
        showEditModal: false
      });
    },

    openEditModal() {
      this.setState({
        newTagId: '',
        newTagTitle: '',
        newIcon: icons[0],
        showEditModal: true,
        content_changed: ''
      });
    },

    openEdit(entryId) {
      var icon = window.myStore.getTagIconById(entryId);
      this.setState({
        newTagId: entryId,
        newTagTitle: window.myStore.getTagTitleById(entryId),
        newIcon: icons[icons.indexOf(icon)],
        showEditModal: true,
        content_changed: ''
      });
    },

    handleChange: function(e) {
      this.setState({
        [e.target.name]: e.target.value
      });
      if (this.state.content_changed === '') {
        this.setState({
          content_changed: 'edited'
        });
      }
    },

    nextIcon() {
      var index = icons.indexOf(this.state.newIcon) + 1;
      if (index >= icons.length) index = 0;
      this.setState({
        newIcon: icons[index],
        content_changed: 'edited'
      });
    },

    prevIcon() {
      var index = icons.indexOf(this.state.newIcon) - 1;
      if (index < 0) index = icons.length - 1;
      this.setState({
        newIcon: icons[index],
        content_changed: 'edited'
      });
    },

    saveTagChanges() {
      window.myStore.changeTagById(
        parseInt(this.state.newTagId),
        this.state.newTagTitle,
        this.state.newIcon
      );
    },

    addNewTag() {
      window.myStore.addNewTag(this.state.newTagTitle, this.state.newIcon);
    },

    handleKeyDown(e) {
      var ENTER = 13;
      if (e.keyCode == ENTER) {
        this.saveEditModal();
      }
    },

    saveEditModal() {
      if (this.state.newTagId === '' && this.state.newTagTitle !== '') {
        this.addNewTag();
      }
      if (this.state.newTagId !== '' && this.state.newTagTitle !== '') {
        this.saveTagChanges();
      }
      this.closeEditModal();
    },

    /////////
    //
    // ADD / EDIT TAG
    //
    ////////

    openRemoveModal(entryId) {
      var icon = window.myStore.getTagIconById(entryId);
      this.setState({
        newTagId: entryId,
        newTagTitle: window.myStore.getTagTitleById(entryId),
        newIcon: icons[icons.indexOf(icon)],
        showRemoveModal: true
      });
    },

    closeRemoveModal() {
      this.setState({
        showRemoveModal: false
      });
    },

    removeTagCloseModal() {
      window.myStore.removeTag(this.state.newTagId);
      this.setState({
        showRemoveModal: false
      });
    },

    render() {
      return (
        <div className="tag-modal">
          <Modal show={this.state.showEditModal} onHide={this.closeEditModal}>
            <Modal.Body>
              <div>
                <a className="icon ion-close-round close-btn" onClick={this.closeEditModal} />

                <div className="avatar">
                  <a className="icon ion-chevron-left prev" onClick={this.prevIcon} />
                  <span>
                    <i className={'icon icon-' + this.state.newIcon} />
                  </span>
                  <a className="icon ion-chevron-right next" onClick={this.nextIcon} />
                </div>
                <span className={'title ' + this.state.content_changed}>
                  <input
                    type="text"
                    autofocus
                    autoComplete="off"
                    name="newTagTitle"
                    ref="newTagTitle"
                    placeholder="New tag title"
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    value={this.state.newTagTitle}
                  />
                  <div className="btn-controls">
                    <button className="btn shadow green-btn" onClick={this.saveEditModal}>
                      Save
                    </button>
                    <button className="btn shadow red-btn" onClick={this.closeEditModal}>
                      Discard
                    </button>
                  </div>
                </span>
              </div>
            </Modal.Body>
          </Modal>

          <Modal show={this.state.showRemoveModal} onHide={this.closeRemoveModal}>
            <Modal.Body>
              <div>
                <a className="icon ion-close-round close-btn" onClick={this.closeRemoveModal} />

                <div className="avatar">
                  <span>
                    <i className={'icon ion-' + this.state.newIcon} />
                  </span>
                </div>
                <span className="title edited">
                  <input
                    type="text"
                    autoComplete="off"
                    name="removeTag"
                    ref="removeTag"
                    disabled
                    value={'Remove ' + this.state.newTagTitle + ' ?'}
                  />
                  <div className="btn-controls">
                    <button className="btn shadow red-btn" onClick={this.removeTagCloseModal}>
                      Yes, remove
                    </button>
                    <button className="btn shadow white-btn" onClick={this.closeRemoveModal}>
                      No
                    </button>
                  </div>
                </span>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      );
    }
  });

module.exports = TagModal;
