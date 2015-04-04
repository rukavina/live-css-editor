/**
 * Livecsseditor
 *
 * @author Milan Rukavina
 * @version 2.0
 */

;
(function( $, window, document, undefined ){
    /**
     * Default optons values
     */
    /**
     * default options
     */
    var defaults =
    {
        layout_tpl:' \
<div class="row ">\
    <div class="col-md-9" id="lcePreviewPanel">\
        <div class="panel panel-primary">\
            <div class="panel-heading"><h3 class="panel-title">Preview</h3></div>\
            <div class="panel-body">\
                <iframe id="lcePreview" src=""></iframe>\
            </div>\
        </div>\
    </div>\
    <div id="lceInspector" class="col-md-3">\
        <%\
        var pageCount = 0;\
        for (var pagePath in pages){pageCount++;}\
        if(pageCount > 1){%>\
        <div class="panel panel-primary">\
            <div class="panel-heading"><h3 class="panel-title">Pages</h3></div>\
            <div class="panel-body">\
                <select class="form-control" id="lcePages">\
                    <% for (var pagePath in pages){%>\
                    <option value="<%=pagePath%>"><%=pages[pagePath].name%></option>\
                    <% } %>\
                </select>\
            </div>\
        </div>\
        <% }%>\
        <div id="lceProperties">\
        </div>\
    </div>\
</div>',
        props_tpl:'\
<div class="panel-group" id="propAccordion">\
<%\
var selectorIndex = 0;\
for (var selector in properties){\
    var props = properties[selector].props;\
%>\
    <div class="panel panel-default <%="selector-index-" + selectorIndex%>">\
        <div class="panel-heading">\
            <h4 class="panel-title">\
            <% if(properties[selector].iconClass){ %>\
                <span class="<%=properties[selector].iconClass %>"></span>\
            <% } %>\
                <a class="accordion-toggle" data-selector="<%=selector%>" data-toggle="collapse" data-parent="#propAccordion" data-target="#<%="properties-" + selectorIndex%>" href="#<%="properties-" + selectorIndex%>"><%=properties[selector].name%></a>\
            </h4>\
        </div>\
        <div id="<%="properties-" + selectorIndex%>" class="panel-collapse collapse" data-selector="<%=selector%>">\
            <div class="panel-body">\
                    <% if(properties[selector].description){%> \
                    <div class="well well-sm"><%=properties[selector].description%></div>\
                    <% }%>\
                    <ul class="property-list">\
                    <% for (var propId in props){%>\
                        <li class="<%="prop-index-" + propId%> form-group" data-prop="<%=props[propId]%>">\
                            <% var propName = (properties[selector].labels && properties[selector].labels[propId])?properties[selector].labels[propId]:props[propId]; %>\
                            <label><%=propName%></label>\
                            <div class="lcePropValue"></div>\
                        </li>\
                    <% } %>\
                </ul>\
            </div>\
        </div>\
    </div>\
<%\
    selectorIndex++;\
} %>\
</div>\
',
        hoverColor: '#faf3ba',
        editorsConfig:{
            "background-position": {
                "fixedValues": {
                    "original": "",
                    "bottom": "Bottom",
                    "left": "Left",
                    "right": "Right",
                    "center": "Center",
                    "top": "Top"
                }
            },
            "display": {
                "fixedValues": {
                    "original": "",
                    "block": "Block",
                    "inline": "Inline",
                    "none": "None"
                }
            },
            "float": {
                "fixedValues": {
                    "original": "",
                    "left": "Left",
                    "right": "Right",
                    "none": "None"
                }
            },
            "font-family": {
                "names": ["Arial", "Times New Roman"]
            },
            "font-weight": {
                "fixedValues": {
                    "original": "",
                    "bold": "Bold",
                    "normal": "Normal"
                }
            },
            "font-style": {
                "fixedValues": {
                    "original": "",
                    "italic": "Italic",
                    "normal": "Normal",
                    "oblique": "Oblique"
                }
            },
            "text-decoration": {
                "fixedValues": {
                    "original": "",
                    "none": "None",
                    "underline": "Underline"
                }
            },
            "text-align": {
                "fixedValues": {
                    "original": "",
                    "left": "Left",
                    "right": "Right",
                    "center": "Center",
                    "justify": "Justify"
                }
            },
            "vertical-align": {
                "fixedValues": {
                    "original": "",
                    "auto": "Auto",
                    "top": "Top",
                    "middle": "Middle",
                    "bottom": "Bottom",
                    "baseline": "Baseline"
                }
            }
        }
    };

    var propEditors = {};

    /**
     * Livecsseditor constructor
     *
     * @param {object} elem
     * @param {object} options
     * @return {Livecsseditor}
     */
    var Livecsseditor = function( elem, options ){
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.metadata = this.$elem.data("Livecsseditor-options" );
        this.config = $.extend({}, defaults, this.options);
        this.pageDef = {};
        this.pagePath = null;
        this.init();
        this.$elem.data("Livecsseditor-instance",this);
    };

    /**
     * Init plugin - update dom, set properties
     */
    Livecsseditor.prototype.init = function(){
        var self = this;


        this.$elem.html(tmpl(this.config.layout_tpl,{'pages':this.config.pages}));
        this.previewId = 'lcePreview';
        this.$preview = this.$elem.find('#' + this.previewId);
        this.$inspector = this.$elem.find('#lceInspector');
        this.$properties = this.$elem.find('#lceProperties');
        //get first page
        for(var pagePath in self.config.pages){break;}
        //load page
        this.loadPage(pagePath);
        //on change page
        this.$inspector.find('#lcePages').change(function(){
            self.loadPage($(this).val())
        });
        //set default editor
        $.fn.livecsseditor.setPropertyEditor('default', this.defaultEditorCallback);
    }
    

    /**
     * Get css or json custimization - for all pages or just pagePath
     *
     * @param {string} pagePath
     * @param {boolean} returnJson
     * @return {string|object}
     */
    Livecsseditor.prototype.getCss = function(pagePath, returnJson){
        var self = this, css = '', json = {};
        //get css for a page
        var cssForPage = function cssForPage(props){
            var css = '', json = {};
            for(var propSelector in props){
                var selectorCss = '', selectorJson = {};
                props[propSelector].values = props[propSelector].values || {};
                for(var i = 0; i < props[propSelector].props.length; i++){
                    var prop = props[propSelector].props[i];
                    if(props[propSelector].values[prop]){
                        selectorCss += prop + ':' + props[propSelector].values[prop] + '; ';
                        selectorJson[prop] = props[propSelector].values[prop];
                    }
                }
                if(selectorCss != ''){
                    css += propSelector + '{' + selectorCss + "}\n";
                    json[propSelector] = selectorJson;
                }
            }
            if(returnJson){
                return json;
            }
            else{
                return css;
            }            
        }
        //single page
        if(pagePath){
            if(returnJson){
                json[pagePath] = cssForPage(self.config.pages[pagePath].def);
            }
            else{
                css += cssForPage(self.config.pages[pagePath].def);
            }            
            
        }
        //all pages
        else{
            for(var currPagePath in self.config.pages){
                if(returnJson){
                    json[pagePath] = cssForPage(self.config.pages[currPagePath].def);
                }
                else{
                    css += cssForPage(self.config.pages[currPagePath].def);
                }
            }
        }
        if(returnJson){
            return json;
        }
        else{
            return css;
        }
    }
    
    /**
     * Load json object
     * 
     * @param {object} json
     */
    Livecsseditor.prototype.setJson = function(json){
        var self = this;
        for(var pagePath in json){
            var pageDef = self.config.pages[pagePath].def;
            for(var propSelector in json[pagePath]){
                pageDef[propSelector] = pageDef[propSelector] || {};
                pageDef[propSelector].values = pageDef[propSelector].values || {};
                for(var prop in json[pagePath][propSelector]){
                    pageDef[propSelector].values[prop] = json[pagePath][propSelector][prop];
                }
            }
        }
        //reload page path
        if(this.pagePath){
            this.loadPage(this.pagePath);
        }
    }

    /**
     * Assign editor to a property
     *
     */
    /**
     * Get css or json custimization - for all pages or just pagePath
     *
     * @param {string} propSelector current css selector
     * @param {string} prop css property
     * @param {jQuery} valueContainer dom container
     * @param {function} editor editor function
     * @param {integer} selectorIndex selector index
     * @param {integer} propertyIndex property index
     * @param {object} editorConfig
     */    
    Livecsseditor.prototype.assignEditor = function(propSelector, prop, valueContainer, editor, selectorIndex, propertyIndex, editorConfig){
        var self = this;
        this.pageDef[propSelector].editors[prop] = editor(self, {
            'id': 'editor-' + selectorIndex + '-' + propertyIndex,
            'container': valueContainer,
            'selector': propSelector,
            'prop': prop,
            'value': this.pageDef[propSelector].values[prop],
            'setValue': function(value){
                var $element = self.$preview.contents().find(propSelector);
                if(!$element.data('original-' + prop)){
                    $element.data('original-' + prop,$element.css(prop));
                }
                if(value == 'original'){
                    value = $element.data('original-' + prop);
                }
                self.pageDef[propSelector].values[prop] = value;
                $element.css(prop,value);
            }
        }, editorConfig);        
    }

    /**
     * Load page
     * 
     * @param {string} pagePath page url
     */
    Livecsseditor.prototype.loadPage = function(pagePath){
        var self = this, currEditor;
        this.pagePath = pagePath;
        this.pageDef = self.config.pages[pagePath].def;
        //load iframe
        self.$preview.attr("src", pagePath);
        self.$preview.load(function(){
            self.$properties.html(tmpl(self.config.props_tpl,{'properties':self.pageDef}));
            //set editors, read values
            var selectorIndex = 0;
            for(var propSelector in self.pageDef){
                self.pageDef[propSelector].editors = self.pageDef[propSelector].editors || {};
                self.pageDef[propSelector].editorsConfig = self.pageDef[propSelector].editorsConfig || {};
                self.pageDef[propSelector].values = self.pageDef[propSelector].values || {};
                for(var i = 0; i < self.pageDef[propSelector].props.length; i++){
                    var prop = self.pageDef[propSelector].props[i];
                    //if values are not empty - we might come back from previous page
                    //so we need to re-apply style
                    if(self.pageDef[propSelector].values[prop]){
                        self.$preview.contents().find(propSelector).css(prop,self.pageDef[propSelector].values[prop]);
                    }
                    else{
                        //read value
                        self.pageDef[propSelector].values[prop] = self.$preview.contents().find(propSelector).css(prop);
                    }
                    var query = '#properties-' + selectorIndex + ' li.prop-index-' + i + ' > div.lcePropValue';
                    var valueContainer = self.$properties.find(query).first();
                    currEditor = (propEditors[prop])?propEditors[prop]:propEditors['default'];
                    //editor config for current selector
                    var editorConfig = self.pageDef[propSelector].editorsConfig[prop];
                    if(!editorConfig){
                        //global config for editor
                        editorConfig = self.config.editorsConfig[prop];
                    }
                    if(!editorConfig){
                        editorConfig = {};
                    }
                    self.assignEditor(propSelector, prop, valueContainer, currEditor, selectorIndex, i, editorConfig);
                }
                self.$preview.contents().find(propSelector).data('selectorIndex',selectorIndex)
                .css('cursor','pointer')
                .hover(
                    function() {
                        if(!$(this).data('orig-color')){
                            $(this).data('orig-color',$(this).css('background-color'));
                        }
                        $(this).css('background-color',self.config.hoverColor);
                        //self.$properties.find('.panel-collapse').removeClass('in');
                        //self.$properties.find('#properties-' + $(this).data('selectorIndex')).addClass('in');
                        //console.log($(this).data('selectorIndex'));
                    }, function() {
                        $(this).css('background-color',$(this).data('orig-color'));
                    }
                )
                .click(function(){
                    //self.$properties.find('.panel-collapse').collapse('hide');
                    var $properties = self.$properties.find('#properties-' + $(this).data('selectorIndex'));
                    if(!$properties.hasClass('in')){
                        self.$properties.find('#properties-' + $(this).data('selectorIndex')).collapse('toggle');
                    }
                });
                selectorIndex++;
            }
            //mark selected selector
            self.$properties.find('.panel-collapse').on('show.bs.collapse', function () {                
                var selected = self.$preview.contents().find($(this).data('selector'));
                if(!selected.data('orig-color')){
                    selected.data('orig-color',selected.css('background-color'));
                }

                selected.animate({'background-color':self.config.hoverColor},500,function(){
                    $(this).css('background-color',selected.data('orig-color'));
                });
            });            
        })
    }

    /**
     * Default/fallback editor
     * 
     * @param {Livecsseditor} customizer
     * @param {object} vars
     * @param {object} config
     */
    Livecsseditor.prototype.defaultEditorCallback = function(customizer, vars, config){
        if(config && config.fixedValues){
            return customizer.genericOptionsEditor(config.fixedValues, vars);
        }
        var html = '<input type="text" class="form-control" value="" />';
        vars.container.html(html);
        vars.container.find('input').val(vars.value).change(function(){
            vars.setValue($(this).val());
        });
    }
    
    /**
     * Generic options editor
     * 
     * @param {object} options
     * @param {object} vars
     * @param {object} style
     */
    Livecsseditor.prototype.genericOptionsEditor = function(options,vars,styles){
        var html = '<select class="form-control"></select>';
        vars.container.html(html);
        var $select = vars.container.find('select');
        html = '';
        var isArray = options instanceof Array;
        for(var value in options){
            var selected = '';
            var currValue = value;
            if(isArray){
                currValue = options[value];
            }
            if (vars.value == currValue) {
                selected = ' selected="selected"';
            }
            var style = '';
            if(styles && styles[currValue]){
                style = ' style="' + styles[currValue] + '"';
            }
            html += '<option value="' + currValue + '"' + selected  + '">' + options[value] + '</option>';
        }
        $select.html(html).change(function(){
            vars.setValue($(this).val());
        });
    }    

    /**
     * Append script or style in document's head
     * 
     * @param {string} filename url
     * @param {document} doc DOM document
     * @param {string} ext js or css
     * @param {string} id
     * @param {string} content optional script content
     */
    Livecsseditor.prototype.appendHead = function(filename,doc,ext,id,content){
        if (ext == "js"){ //if filename is a external JavaScript file
            var fileref=doc.createElement('script');
            fileref.setAttribute("type","text/javascript");
            if(id){
                fileref.setAttribute("id", id);
            }
            if(!filename && content){
                fileref.innerHTML = content;
            }else{
                fileref.setAttribute("src", filename);
            }
        }
        else if (ext=="css"){ //if filename is an external CSS file
            var fileref = doc.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref!="undefined"){
            doc.getElementsByTagName("head")[0].appendChild(fileref);
        }
    }
    
    /**
     * Get IFrame document object
     * @returns {document}
     *
     */
    Livecsseditor.prototype.getIFDoc = function(){
        var iframe = document.getElementById(this.previewId);
        var doc = iframe.contentWindow || iframe.contentDocument;
        if (doc.document) {
            doc = doc.document;
        }
        return doc;
    }
    
    /**
     * Load jquery and UI in preview IFrame
     * 
     * @param {document} doc
     * @param {function} onLoad
     */
    Livecsseditor.prototype.jqueryUILoad = function(doc,onLoad){
        if(!this.queryUiIncluded){
            this.appendHead('http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',doc,'js','jquery');
            this.appendHead('http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-lightness/jquery-ui.min.css',doc,'css');
            this.appendHead('http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js',doc,'js','jqueryui');
        }
        this.queryUiIncluded = true;
        this.$preview.contents().find('#jqueryui').load(function(){
            onLoad();
        });
    }

    /**
     * Jquery entry function
     * 
     * @param {object} options
     * @param {object} params
     * @return {jQuery}
     */
    $.fn.livecsseditor = function(options, params) {        
        //just call existing instance
        if(options === 'getCss' || options === 'getJson' || options === 'setJson'){
            var customizer = $(this).data("Livecsseditor-instance");
            if(customizer){
                if(options === 'setJson'){
                    return customizer.setJson(params);
                }
                else{
                    var pagePath = null;
                    return customizer.getCss(params, options == 'getJson');
                }
            }
        }        
        else{
            this.each(function() {
                return new Livecsseditor(this, options);
            });
        }
    };

    /**
     * Attach custom editor for a property
     * 
     * @param {string} property
     * @param {function} editorCallback
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
    
})( jQuery, window , document );   // pass the jQuery object to this function
