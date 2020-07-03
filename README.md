# ckeditor5-countdown

Countdown plugin for ckeditor5.

## Quick start

First, install the build from npm:

```bash
yarn add ckeditor5-countdown
```

Use it in your application:

```js
import Countdown from 'ckeditor5-countdown';
```

Add to the array

```js
ClassicEditor.builtinPlugins = [
  .
  .
  .
  Countdown
];
```


Finally add to the toolbar items array

```js
toolbar: {
  items: [
    .
    .
    .
    'countdown'
  ]
}
```

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html).
