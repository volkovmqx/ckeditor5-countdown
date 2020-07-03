// countdown/countdown.js

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import CountdownEditing from './countdownediting';
import CountdownUI from './countdownui';

export default class Countdown extends Plugin {
	static get requires() {
		return [ CountdownEditing, CountdownUI ];
	}
}
