import classnames from 'classnames';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Component, Fragment } = wp.element;
const {
  InspectorControls, RichText,
} = wp.editor;
const {
  PanelBody, Button, DateTimePicker, ColorPicker,
} = wp.components;

const { PostMediaSelector } = benenson.components;

registerBlockType('benenson/block-countdown', {
  title: __('Countdown timer', 'benenson'),
  description: __('Set a future date to countdown to.', 'benenson'),
  icon: 'download',
  category: 'benenson',
  supports: {
  },

  attributes: {
    title: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    backgroundColor: {
      type: 'string',
    },
    backgroundId: {
      type: 'interger',
    },
    backgroundUrl: {
      type: 'string',
    },
  },
  edit: DisplayComponent,

  save: () => null,
});
