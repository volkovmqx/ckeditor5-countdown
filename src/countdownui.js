import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import countdownIcon from '../theme/icons/stopwatch-solid.svg';

import DatepickerView from './ui/datepicker';

import {
	createDropdown
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

export default class CountdownUI extends Plugin {
	init() {
		const editor = this.editor;
		const command = editor.commands.get( 'countdown' );

		editor.ui.componentFactory.add( 'countdown', locale => {
			const dropdown = createDropdown( locale );
			const datepickerForm = new DatepickerView( getFormValidators(), editor.locale );

			this._setUpDropdown( dropdown, command, datepickerForm, editor );
			this._setUpForm( dropdown, datepickerForm, command );

			return dropdown;
		} );
	}

	_setUpDropdown( dropdown, command, datepicker ) {
		const editor = this.editor;
		const button = dropdown.buttonView;
		dropdown.panelView.children.add( datepicker );

		button.set( {
			label: 'Insert Countdown',
			icon: countdownIcon,
			tooltip: true
		} );

		// Note: Use the low priority to make sure the following listener starts working after the
		// default action of the drop-down is executed (i.e. the panel showed up). Otherwise, the
		// invisible form/input cannot be focused/selected.
		button.on( 'open', () => {
			// Make sure that each time the panel shows up, the URL field remains in sync with the value of
			// the command. If the user typed in the input, then canceled (`dateTimeInputView#inputView#value` stays
			// unaltered) and re-opened it without changing the value of the media command (e.g. because they
			// didn't change the selection), they would see the old value instead of the actual value of the
			// command.
			datepicker.dateTime = command.value || '';
			datepicker.dateTimeInputView.inputView.select();
			datepicker.focus();
		}, {
			priority: 'low'
		} );

		dropdown.on( 'submit', () => {
			if ( datepicker.isValid() ) {
				editor.execute( 'countdown', {
					value: datepicker.dateTime
				} );
				editor.editing.view.focus();
				closeUI();
			}
		} );

		dropdown.on( 'change:isOpen', () => datepicker.resetFormStatus() );
		dropdown.on( 'cancel', () => closeUI() );

		function closeUI() {
			editor.editing.view.focus();
			dropdown.isOpen = false;
		}
	}
	_setUpForm( dropdown, datepicker, command ) {
		datepicker.delegate( 'submit', 'cancel' ).to( dropdown );
		datepicker.dateTimeInputView.bind( 'value' ).to( command, 'value' );
	}
}

function getFormValidators() {
	return [
		datepicker => {
			if ( !datepicker.dateTime.length ) {
				return 'Countdown must not be empty';
			}
		}
	];
}
