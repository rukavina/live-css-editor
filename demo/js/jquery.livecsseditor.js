/**
 * jQuery Live CSS Editor (LCE)
 * 
 * @author Milan Rukavina 2012
 */

(function($)
{
    var opts = {}, self = null, preview = null, inspector = null, properties = null, propEditors = {};    
    
    /**
     * main jquery plugin function
     */
    $.fn.livecsseditor = function(options,params)
    {
        
        //create options
        opts = $.extend({}, $.fn.livecsseditor.defaults, options);

        if(options == 'getCss'){
            opts = self.data('opts');
            var pagePath = null;
            if(params && params['pagePath']){
                pagePath = params['pagePath'];
            }
            return getCss(pagePath);
        }

        // return the object back to the chained call flow
        return this.each(function()
        {
            self = $(this);
            //store opts
            self.data('opts',opts);
            loadTpl(opts.layout_tpl,function renderLayout(tplStr){
                self.html(tmpl(tplStr,{'pages':opts.pages}));
                preview = self.find('#lcePreview');
                inspector = self.find('#lceInspector');
                properties = self.find('#lceProperties');
                //get first page
                for(var pagePath in opts.pages){break;}
                //load page
                loadPage(pagePath);
                //on change page
                inspector.find('#lcePages').change(function(){
                    loadPage($(this).val())
                });
            }); 
        });               
    };

    /**
     * Get css code - for all pages or just pagePath
     */
    function getCss(pagePath){
        var css = '';

        var cssForPage = function cssForPage(props){
            var css = '';
            for(var propSelector in props){
                var selectorCss = '';
                props[propSelector].values = props[propSelector].values || {};
                for(var i = 0; i < props[propSelector].props.length; i++){
                    var prop = props[propSelector].props[i];
                    if(props[propSelector].values[prop]){
                        selectorCss += prop + ':' + props[propSelector].values[prop] + '; '
                    }
                }
                if(selectorCss != ''){
                    css += propSelector + '{' + selectorCss + "}\n";
                }
            }
            return css;
        }
        if(pagePath){
            css += cssForPage(opts.pages[pagePath].def);
        }
        else{
            for(var currPagePath in opts.pages){
                css += cssForPage(opts.pages[currPagePath].def);
            }
        }
        return css;
    }

    /**
     * Assign editor to a property
     *
     */
    function assignEditor(props, propSelector, prop, valueContainer, editor, selectorIndex, propertyIndex){
        props[propSelector].editors[prop] = editor({
            'id':'editor-' + selectorIndex + '-' + propertyIndex,
            'container':valueContainer,
            'selector': propSelector,
            'prop':prop,
            'value':props[propSelector].values[prop],
            'setValue':function(value){
                props[propSelector].values[prop] = value;
                preview.contents().find(propSelector).css(prop,value);
            },
            'preview':preview,
            'previewId':'lcePreview'
        });        
    }

    /**
     * Load page
     */
    function loadPage(pagePath){
        var props = opts.pages[pagePath].def, currEditor;
        //load iframe
        preview.attr("src", pagePath);
        preview.load(function(){
            loadTpl(opts.props_tpl,function renderProperties(tplStr){
                properties.html(tmpl(tplStr,{'properties':props}));                
                //set editors, read values
                var selectorIndex = 0;
                for(var propSelector in props){
                    props[propSelector].editors = props[propSelector].editors || {};
                    props[propSelector].values = props[propSelector].values || {};
                    for(var i = 0; i < props[propSelector].props.length; i++){
                        var prop = props[propSelector].props[i];
                        //if values are not empty - we might come back from previous page
                        //so we need to re-apply style
                        if(props[propSelector].values[prop]){
                            preview.contents().find(propSelector).css(prop,props[propSelector].values[prop]);
                        }
                        else{
                            //read value
                            props[propSelector].values[prop] = preview.contents().find(propSelector).css(prop);
                        }
                        var query = '#properties-' + selectorIndex + ' li.prop-index-' + i + ' > div.lcePropValue';
                        var valueContainer = properties.find(query).first();
                        currEditor = (propEditors[prop])?propEditors[prop]:propEditors['default']; 
                        assignEditor(props, propSelector, prop, valueContainer, currEditor, selectorIndex, i);
                    }
                    preview.contents().find(propSelector).data('selectorIndex',selectorIndex).click(function(){
                        properties.find('.collapse').removeClass('in');
                        properties.find('#properties-' + $(this).data('selectorIndex')).addClass('in');
                    });
                    selectorIndex++;
                }
                //mark selected selector
                properties.find('.collapse').on('show', function () {
                    var selected = preview.contents().find($(this).data('selector'));
                    var selectedBgColor = selected.css('background-color');
                    selected.animate({'background-color':'yellow'},500,function(){
                        $(this).css('background-color',selectedBgColor);
                    });
                });
            });            
        })
    }    
    
    var tpls = {};

    /**
     * Ajax call to a page and parse microtpl
     */
    function loadTpl(url,callback){
        if(tpls[url] == null){
            $.get(url, function(data){
                tpls[url] = data;
                if(callback){
                    callback(data);
                }
            }, 'html');
        }
        else{
            if(callback){
                callback(tpls[url]);
            }
        }
        return tpls[url];
    }    

    /*
    function getCssDefinition(iframe,path){
        var sheets = iframe[0].contentDocument.styleSheets, definition = {};
        for(var i = 0; i < sheets.length; i++) {
            if(sheets[i].href.indexOf(path) == -1){
                continue;
            }
            var rules = sheets[i].rules || sheets[i].cssRules;
            for(var r = 0; r < rules.length; r++) {
                //console.log(rules[r]);
                definition[rules[r].selectorText] = css2json(rules[r].style);
            }
        }
        return definition;
    }

    function css2json(css){
        var s = {};
        if(!css) return s;
        for(var i = 0; i < css.length; i++) {
            if((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
        return s;
    }*/

    /**
     * Attach custom editor for a property
     */
    $.fn.livecsseditor.setPropertyEditor = function setPropertyEditor(property,editorCallback){
        if(property instanceof Array){
            for(var i = 0; i < property.length; i++){
                propEditors[property[i]] = editorCallback;
            }
        }
        else{
            propEditors[property] = editorCallback;
        }        
    }  

    
    
    /**
     * default options
     */
    $.fn.livecsseditor.defaults =
    {
        'layout_tpl':'tmpl/layout.html',
        'props_tpl':'tmpl/properties.html'
    };
})(jQuery);   // pass the jQuery object to this function


