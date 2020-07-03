import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// MODIFIED
import {
	toWidget,
	viewToModelPositionOutsideModelElement
} from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import CountdownCommand from './countdowncommand';

import '../theme/countdown.css';
import 'pickerjs/dist/picker.css';

export default class CountdownEditing extends Plugin {
	static get requires() {
		return [ Widget ];
	}

	init() {
		this._defineSchema();
		this._defineConverters();

		this.editor.commands.add( 'countdown', new CountdownCommand( this.editor ) );

		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement( this.editor.model, viewElement => viewElement.hasClass( 'timer' ) )
		);
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register( 'countdown', {
			// Allow wherever text is allowed:
			allowWhere: '$text',

			// The countdown will act as an inline node:
			isInline: true,

			// The inline widget is self-contained so it cannot be split by the caret and it can be selected:
			isObject: true,

			// The countdown can have many types, like date, name, surname, etc:
			allowAttributes: [ 'time' ]
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'span',
				classes: [ 'timer' ]
			},
			model: ( viewElement, modelWriter ) => {
				// Extract the "name" from "{name}".
				const time = viewElement.getChild( 0 ).data.slice( 3 );

				return modelWriter.createElement( 'countdown', { time } );
			}
		} );

		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'countdown',
			view: ( modelItem, viewWriter ) => {
				const widgetElement = createCountdownView( modelItem, viewWriter );

				// Enable widget handling on a countdown element inside the editing view.
				return toWidget( widgetElement, viewWriter );
			}
		} );

		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'countdown',
			view: createCountdownView
		} );

		// Helper method for both downcast converters.
		function createCountdownView( modelItem, viewWriter ) {
			const time = modelItem.getAttribute( 'time' );

			const countdownView = viewWriter.createContainerElement( 'span', {
				class: 'timer',
				'data-time': time
			} );

			// Insert the countdown name (as a text).
			const innerText = viewWriter.createText( '⏱️ ' + time );
			viewWriter.insert( viewWriter.createPositionAt( countdownView, 0 ), innerText );

			return countdownView;
		}
	}
}
