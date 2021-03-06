import CategorySelect from './components/CategorySelect';
import DisplayCategories from './components/DisplayCategories';
import DisplayCustom from './components/DisplayCustom';
import DisplaySelect from './components/DisplaySelect';

const { applyFilters } = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
  PanelBody, SelectControl, RangeControl, ToggleControl,
} = wp.components;
const {
  InspectorControls,
  RichText,
} = wp.editor;

const createRange = (min, max) => num => Math.max(min, Math.min(max, num));

class DisplayComponent extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      results: [],
      loading: false,
      preview: (this.props.attributes.selectedPosts || []).length > 0,
      ctaText: this.props.attributes.ctaText,
      // Generate a key prefix as post id may not be unique.
      keyPrefix: Math.random().toString(36).substring(7),
    };

    this.props.styleOptions = [];

    this.range = createRange(1, 8);
  }

  /**
    * Higher order component that takes the attribute key,
    * this then returns a function which takes a value,
    * when called it updates the attribute with the key.
    * @param key
    * @returns {function(*): *}
    */
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });
  createUpdateAttributeWithFilter =
    (key, filter) =>
      value => this.props.setAttributes({ [key]: filter(value) });

  /**
    * Toggle the preview state for the 'selection' style.
    * @returns {*}
    */
  togglePreview = () => this.setState({
    preview: !this.state.preview,
  });

  render() {
    const { attributes } = this.props;
    const styleOptions = applyFilters('benenson.block.list.styleOptions', [{
      label: __('Link List', 'benenson'),
      value: 'list',
    }, {
      label: __('Grid', 'benenson'),
      value: 'grid',
    }, {
      label: __('Post', 'benenson'),
      value: 'post',
    },
    {
      label: __('Split Grid', 'benenson'),
      value: 'splitgrid',
    }]);

    const typeOptions = applyFilters('benenson.block.list.typeOptions', [{
      label: __('Category', 'benenson'),
      value: 'category',
    }, {
      label: __('Object Selection', 'benenson'),
      value: 'select',
    }, {
      label: __('Custom', 'benenson'),
      value: 'custom',
    }]);

    const quantityOptions = applyFilters('benenson.block.list.quantityOptions', {
      min: 1,
      max: 8,
    });

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <SelectControl
            label={ __('Style', 'benenson') }
            options={ styleOptions }
            value={ attributes.style }
            onChange={ this.createUpdateAttribute('style') }
          />
          <SelectControl
            label={ __('Type', 'benenson') }
            options={ typeOptions }
            value={ attributes.type }
            onChange={ this.createUpdateAttribute('type') }
          />
          { attributes.type === 'category' && <label>
            { __('Category:', 'benenson') }<br/>
            <CategorySelect
              value={ attributes.category }
              onChange={ this.createUpdateAttribute('category') }
            /><br/>
          </label> }
          { attributes.type === 'category' && <RangeControl
            label={ __('Number of posts to show:', 'benenson') }
            min={ quantityOptions.min }
            max={ quantityOptions.max }
            value={ attributes.amount || 3 }
            onChange={ this.createUpdateAttributeWithFilter('amount', this.range) }
          /> }
            { attributes.type === 'category' && <ToggleControl
              label={ __('Use related categories where supported', 'benenson') }
              checked={ attributes.categoryRelated }
              onChange={ this.createUpdateAttribute('categoryRelated') }
            /> }
            { attributes.type === 'select' && <ToggleControl
              label={ __('Display excerpt', 'benenson') }
              checked={ attributes.displayExcerpt }
              onChange={ this.createUpdateAttribute('displayExcerpt') }
            /> }
            { attributes.type === 'select' && (<div>
              <label htmlFor="editorButtonText">{ __('Button Text:', 'benenson') }</label>
              <RichText
                name="editorButtonText"
                className="editorButtonText"
                placeholder={ __('(CTA Text)', 'benenson') }
                value={ attributes.ctaText }
                keepPlaceholderOnFocus={ true }
                onChange={ this.createUpdateAttribute('ctaText') }
              /></div>) }
          { attributes.type === 'select' && <button onClick={ this.togglePreview }>
            { this.state.preview ? __('Hide Preview', 'benenson') : __('Show Preview', 'benenson') }
          </button> }
        </PanelBody>
      </InspectorControls>
      <div>
        { attributes.type === 'category' && <DisplayCategories
          amount={ attributes.amount || 3 }
          category={ attributes.category }
          style={ attributes.style }
          prefix={ this.state.keyPrefix }
        /> }
        { attributes.type === 'custom' && <DisplayCustom
          setAttributes={ this.props.setAttributes }
          custom={ attributes.custom || [] }
          style={ attributes.style }
          prefix={ this.state.keyPrefix }
        /> }
        { attributes.type === 'select' && <DisplaySelect
          setAttributes={ this.props.setAttributes }
          selectedPosts={ attributes.selectedPosts || [] }
          preview={ this.state.preview }
          style={ attributes.style }
          prefix={ this.state.keyPrefix }
          ctaText={ attributes.ctaText }
        /> }
      </div>
    </Fragment>);
  }
}

export default DisplayComponent;
