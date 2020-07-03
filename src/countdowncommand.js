import Command from '@ckeditor/ckeditor5-core/src/command';

export default class CountdownCommand extends Command {
	execute( { value } ) {
		const editor = this.editor;

		editor.model.change( writer => {
			// Create a <countdown> elment with the "name" attribute...
			const countdown = writer.createElement( 'countdown', { time: value } );

			// ... and insert it into the document.
			editor.model.insertContent( countdown );

			// Put the selection on the inserted element.
			writer.setSelection( countdown, 'on' );
		} );
	}

	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;

		const isAllowed = model.schema.checkChild( selection.focus.parent, 'countdown' );

		this.isEnabled = isAllowed;
	}
}
