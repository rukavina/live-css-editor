# Live CSS Editor

## Overview

Live CSS Editor (LCE) is jquery plugin, "themeroller like" tool for customizing your web page design. Basically, you provide json with configuration and LCE shows: live preview and CSS editor with ability to edit properties you defined. So you can control which properties can be customized.

## Demo

http://rukavina.github.com/live-css-editor/demo

## Installation and setup

You have to include this dependencies in your page (head):

```html
<script src="js/jquery-1.7.1.min.js"></script>
<script src="js/microtpl.js"></script>
<!-- lce itself -->
<script src="js/jquery.livecsseditor.js"></script>
<link rel="stylesheet" type="text/css" href="css/livecsseditor.css">
<script src="js/lce.editors.js"></script>
<!-- colorpicker -->
<link rel="stylesheet" media="screen" type="text/css" href="plugins/colorpicker/css/colorpicker-bootstrap.css"/>
<script type="text/javascript" src="plugins/colorpicker/js/colorpicker-bootstrap.js"></script>
<!-- twitter bootstrap -->
<link rel="stylesheet" type="text/css" href="plugins/bootstrap/css/bootstrap.min.css"  media="screen">
<script src="plugins/bootstrap/js/bootstrap.min.js"></script>
<!-- jquery ui -->
<link rel="stylesheet" type="text/css" href="plugins/jquery-ui-1.9.1/css/smoothness/jquery-ui-1.9.1.custom.min.css"  media="screen">
<script src="plugins/jquery-ui-1.9.1/js/jquery-ui-1.9.1.custom.min.js"></script>             
```

In the page's body provide div where editor will be placed - give it enough space. Note: there cannot be 2 LCEs on a single page.

```html
<div id="lce"></div> 
```

Init LCE when document is ready, ex.

```javascript
    $('#lce').livecsseditor({
        pages: {
            'demo/index.html': {
                name: 'Demo page',
                def: {
                    'h1':{
                        name: 'Heading',
                        props:['color','background-color']
                    },
                    'p,span':{
                        name: 'Text',
                        props:['font-size','color']
                    }            
                }
            },
            'demo/second.html': {
                name: 'Second page',
                def: {
                    'h2':{
                        name: 'Heading 2',
                        props:['color']
                    },
                    'em':{
                        name: 'Text',
                        props:['font-size']
                    }            
                }
            }
        }
    });
```

Options json has a list of pages with urls to be customized and json definition of selector/properties which can be altered in LCE.

After customization is done, you would like to grab CSS:

```javascript
  $('#lce').livecsseditor('getCss',{pagePath:'demo/index.html'})
```

This will return css for just a page with provided path...but you could do

```javascript
  $('#lce').livecsseditor('getCss');
```

and get single CSS string for all pages.

## Use Case

Possible use case could be backend of your website where you can provide admin ability to develop his own custom skin without CSS knowledge. In WYSIWYG fashion he will be able to customize look and feel by live previewing front-end pages during customization.
Generated CSS could be stored in file/db and used by the frontend rendering engine to overwrite default css.

## Custom property editors

At the moment LCE comes with built in:
* color picker for "color" and "background-color"
* position ("left","top") draggable live feature for managing an element's position
* size ("width","height") resizable live feature for managing an element's size
* default, fallback generic editor for any other property

Fortunately, there's an easy way to develop your own editors and attach it to LCE. Here's how specialized color editor is developed :

* Create new .js file
* write there something like:

```javascript
(function(){
    //color
    $.fn.livecsseditor.setPropertyEditor(['color','background-color'],function colorEditorCallback(options){
        var html = '<form class="form-inline"><div class="input-append color" data-color="' + options.value + '" data-color-format="rgb"><input type="text" value="' + options.value + '" /><span class="add-on"><i style="background-color: ' + options.value + '"></i></span></div><a class="btn" href="#"><i class=" icon-ok"></i></a></form>';
        options.container.html(html);
        options.container.find('div.color').colorpicker();
        options.container.find('a.btn').click(function(){
            options.setValue(options.container.find('input').val());
            return false; 
        });        
    });  
    
})();
```

Basically, you just call *$.fn.livecsseditor.setPropertyEditor* and provide callback which renders your property editor. *options* is an object:

```javascript
{
    'container':valueContainer,//div container
    'selector': propSelector,//css selector
    'prop':prop,//property name
    'value':props[propSelector].values[prop],//current value
    'setValue':function(value){//set value callback
    }
}
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