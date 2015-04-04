# Live CSS Editor

## Overview

Live CSS Editor (LCE) is jquery plugin, "themeroller like" tool for customizing your web page design. Basically, you provide json with configuration and LCE shows: live preview and CSS editor with ability to edit properties you defined. So you can control which properties can be customized.

## Demo

http://rukavina.github.com/live-css-editor/demo

## Installation and setup

You have to include this dependencies in your page (head):

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
<script type="text/javascript" src="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
<script type="text/javascript" src="../dependencies/microtpl.js"></script>
<script type="text/javascript" src="../dependencies/jscolor/jscolor.js"></script>
<script type="text/javascript" src="../dependencies/chosen/chosen.jquery.min.js"></script>

<!-- Editor -->
<script src="../source/livecsseditor/livecsseditor-2.0.js"></script>
<script src="../source/livecsseditor/editors/lceColor.js"></script>
<script src="../source/livecsseditor/editors/lceFont.js"></script>
<script src="../source/livecsseditor/editors/lceBackground.js"></script>            
```

In the page's body provide div where editor will be placed - give it enough space. Note: there cannot be 2 LCEs on a single page.

```html
<div id="livecsseditor"></div> 
```

Init LCE when document is ready, ex.

```javascript
$(document).ready(function(){
    $('#livecsseditor').livecsseditor({
        pages: {
            'targets/simple.html': {
                name: 'First Page',
                def: {
                    'h1':{
                        name: 'Heading',
                        props:['color','background-color','font-family','font-weight','text-align'],
                        labels: ['Color','Background color','Font','Font Weight','Align'],
                        description: 'Update heading here',
                        editorsConfig:{
                            "font-family": {
                                "names": ["Verdana","Arial", "Times New Roman"]
                            }
                        },
                        iconClass: "glyphicon glyphicon-star"
                    },
                    'p,span':{
                        name: 'Text',
                        props:['font-size','color'],
                        labels: ['Font size','Color'],
                        editorsConfig:{
                            "font-size": {
                                "fixedValues": ["original","10px","11px","12px"]
                            }
                        },
                        iconClass: "glyphicon glyphicon-font"
                    }
                }
            }
        }
    });               
});
```

## Options
            

|option | description | default | possible values|
|-------|-------------|---------|----------------|
|**pages**|JSON definition of pages, styles and properties to be customized|null|Object|
|**layout_tpl**|[Micro template](http://ejohn.org/blog/javascript-micro-templating/) layout|__default template__|String|
|**props_tp**l|[Micro template](http://ejohn.org/blog/javascript-micro-templating/) property list layout|__default template__|String|
|**hoverColor**|Background color or selected element in the live preview|#faf3ba|String|


## Methods
            
### getCss( pagePath )

Get customized css string for defined page `pagePath` or all pages

Returns: **String**

- **pagePath**, Type: String, Default: null

```javascript
$('.selector').livecsseditor('getCss','page.html');</pre>
```

* * *

### getJson( pagePath )

Get customized JSON Object for defined page `pagePath` or all pages

Returns: **Object**

- **pagePath**, Type: String, Default: null</li>

```javascript
$('.selector').livecsseditor('getJson','page.html');</pre>
```

* * *

### setJson( jsonObject )

Set JSON Object for customized prepared style

- **jsonObject**, Type: Object, Default: null

```javascript
$('.selector').livecsseditor('setJson',{
    "page.html":{
        "h1": {
            "background-color": "#F9FF40",
            "color": "#FA2B46"
        }
    }
});
```

## Examples

* * *

### Standard Setup

[VIEW DEMO](demos/standard.html)

Follow standard installation. Start livecsseditor when the document is ready.

```javascript
$('#livecsseditor').livecsseditor({
    pages: {
        'targets/simple.html': {
            name: 'First Page',
            def: {
                'h1':{
                    name: 'Heading',
                    props:['color','background-color','font-family','font-weight','text-align'],
                    labels: ['Color','Background color','Font','Font Weight','Align'],
                    description: 'Update heading here',
                    editorsConfig:{
                        "font-family": {
                            "names": ["Verdana","Arial", "Times New Roman"]
                        }
                    },
                    iconClass: "glyphicon glyphicon-star"
                },
                'p,span':{
                    name: 'Text',
                    props:['font-size','color'],
                    labels: ['Font size','Color'],
                    editorsConfig:{
                        "font-size": {
                            "fixedValues": ["original","10px","11px","12px"]
                        }
                    },
                    iconClass: "glyphicon glyphicon-font"
                }
            }
        }
    }
});                
```

Options JSON has the following structure:

*   **pages**
    *   _page url_ URL to a page to be customized
        *   **name** Descriptive page name
        *   **def**
            *   _element css selector_ CSS selector of a DOM element
                *   **name** Descriptive element name
                *   **props** Array of editable CSS properties
                *   **labels** Array of descriptive names of editable properties
                *   **description** Description of the current element
                *   **iconClass** Optional element's icons css class
                *   **editorsConfig** Optional properties for particular editors
                    *   _property_ Value for each key is configuration for particular editor

* * *

### Multipage Setup

[VIEW DEMO](demos/multipage.html)

Livecsseditor let you manage multiple pages from the same screen.

* * *

### Size and Position Editors

[VIEW DEMO](demos/size-position.html)

In this example we have included custom position and size editors for in place, WYSIWYG editing. After standard installation you need to include these 2 editors:

```html
<script src="../source/livecsseditor/editors/lceSize.js"></script>
<script src="../source/livecsseditor/editors/lcePosition.js"></script>
```

Options JSON has to include definition for this properties on proper elements:

```javascript
'div.resizable':{
    name:'Resizable',
    props:['width','height'],
    iconClass: "glyphicon glyphicon-fullscreen"
},
'div.movable':{
    name:'Movable',
    props:['left','top'],
    iconClass: "glyphicon glyphicon-fullscreen"
}
```

Note that movable element needs to have absolute position in order to be draggable.

* * *

### Background image editor

[VIEW DEMO](demos/bg-image.html)

Selecting a background image for your elements is more of a backend task, thus you might want to create custom editor with integrated file manager or similar.

Still, there's a simple built-in option. Basically, it's a simple select box with predefined options provided by you.

```javascript
'div.resizable':{
    name:'BG Image',
    props:['background-image'],
    labels: ['Background Image'],
    description: 'Choose BG Image',
    editorsConfig:{
        "background-image": {
            "urls": ["images/bg1.jpg","images/bg2.jpg", "images/bg3.jpg"]
        }
    },
    iconClass: "glyphicon glyphicon-fullscreen"
}
```
* * *

### API Interaction

[VIEW DEMO](demos/api.html)

livecsseditor has two methods`getCss` and`getJson` for you to store somewhere definition of made customization. On the hand,`setJson` provides a way to load styles from JSON object:

Options JSON has to include definition for this properties on proper elements:

```javascript
//css button
$('#cssBtn').click(function(){
    alert($('#livecsseditor').livecsseditor('getCss','targets/complex.html'));
});
//json get button
$('#jsonBtn').click(function(){
    console.log($('#livecsseditor').livecsseditor('getJson','targets/complex.html'));
});
//json set button
$('#jsonSetBtn').click(function(){
    $('#livecsseditor').livecsseditor('setJson',{
        "targets/complex.html":{
            "h1": {
                "background-color": "#F9FF40",
                "color": "#FA2B46"
            }
        }
    });
});
```
* * *

### Custom Editor

[VIEW DEMO](demos/custom-editor.html)

Whenever you are not satisfied with built-in editor or you need some custom editing logic, you can easily plug in your custom editing function.

In this example we attached our custom color editor. Let's say we want our users to choose just red or green color, peace of cake:

```javascript
$.fn.livecsseditor.setPropertyEditor(['color','background-color'],
    function customColorEditor(customizer, vars, config){
        var $select = $('&lt;select class="form-control"&gt;&lt;/select&gt;'),
            html = '',
            options = {
                "original": "",
                "#FF0000": "Red",
                "#00FF00": "Green"
            };
        vars.container.append($select);
        for(var value in options){
            var selected = '';
            if (vars.value == value) {
                selected = ' selected="selected"';
            }
            html += '&lt;option value="' + value + '"' + selected  + '"&gt;' + options[value] + '&lt;/option&gt;';
        }
        $select.html(html).change(function(){
            vars.setValue($(this).val());
        })                    
});
```

We attached editor function using`$.fn.livecsseditor.setPropertyEditor`. Basically, we define in this call which properties we edit and callback function. During callback execution, livecsseditor provides 3 arguments:

*   **customizer** - livecsseditor instance
*   **vars** - running environment: value, setValue function, etc.
*   **config** - editor local configuration

* * *

### Fixed values

[VIEW DEMO](demos/fixed-values.html)

Whenever you want to limit available options to predefined set, there's no need to create custom editor, you can just define property editor configuration:

```javascript
$('#livecsseditor').livecsseditor({
    pages: {
        'targets/complex.html': {
            name: 'Complex page',
            def: {
                'h1':{
                    name: 'Heading',
                    props:['font-size'],
                    labels: ['Font size'],
                    editorsConfig:{
                        "font-size": {
                            "fixedValues": ["14px","15px", "16px"]
                        }
                    },
                    iconClass: "glyphicon glyphicon-star"
                }                                
            }
        }
    }
});
```

## Credits

This projects was inspired or uses the following projects:

* [jquery](http://jquery.com/)
* [JavaScript Micro-Templating](JavaScript Micro-Templating)
* [twitter bootstrap](http://twitter.github.com/bootstrap/)
* [jquery themeroller](http://jqueryui.com/themeroller/)
* [bootstrap colorpicker](http://www.eyecon.ro/bootstrap-colorpicker)

## Licence

The MIT License (MIT)

Copyright (c) 2012 Milan Rukavina

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.