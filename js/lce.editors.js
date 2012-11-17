/**
 * jQuery Live CSS Editor (LCE) - property editors
 * 
 * @author Milan Rukavina 2012
 */
(function(){
    function defaultEditorCallback(options){
        var html = '<form class="form-inline"><input type="text" value="" /><a class="btn" href="#"><i class=" icon-ok"></i></a></form>'
        options.container.html(html);
        options.container.find('input').val(options.value);
        options.container.find('a.btn').click(function(){
            options.setValue(options.container.find('input').val());
            return false; 
        });
    }    
    //default
    $.fn.livecsseditor.setPropertyEditor('default',defaultEditorCallback); 

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
    
    function appendHead(filename,doc,ext,id,content){
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

    function getIFDoc(options){
        var iframe = document.getElementById(options.previewId);
        var doc = iframe.contentWindow || iframe.contentDocument;
        if (doc.document) {
            doc = doc.document;
        }
        return doc;
    }
    
    function jqueryUILoad(options,doc,onLoad){
        if(!this.queryUiIncluded){
            appendHead('../js/jquery-1.7.1.min.js',doc,'js','jquery');
            appendHead('../plugins/jquery-ui-1.9.1/css/smoothness/jquery-ui-1.9.1.custom.min.css',doc,'css');
            appendHead('../plugins/jquery-ui-1.9.1/js/jquery-ui-1.9.1.custom.min.js',doc,'js','jqueryui');            
        }
        this.queryUiIncluded = true;
        options.preview.contents().find('#jqueryui').load(function(){
            onLoad();
        });         
    }
    
    //position
    $.fn.livecsseditor.setPropertyEditor(['left','top'],function positionEditorCallback(options){
        defaultEditorCallback(options);
        var doc = getIFDoc(options);
        if(!options.preview.contents().find(options.selector).data("hasPosEditor")){
            jqueryUILoad(options,doc,function(){
                appendHead(null,doc,'js',null,'$("' + options.selector + '").draggable({stop:function(event, ui){document.posCallbacks["' + options.selector + '"].callback(event,ui);}});');
            });           
            doc.posCallbacks = doc.posCallbacks || {};
            doc.posCallbacks[options.selector] = {
                callback: function(event, ui){
                    for(var i in doc.posCallbacks[options.selector].listeners){
                        doc.posCallbacks[options.selector].listeners[i](event, ui);
                    }
                },
                listeners:[]
            };            
        }
        options.preview.contents().find(options.selector).data("hasPosEditor",true);              
        
        doc.posCallbacks[options.selector].listeners.push(function(event, ui){
            var value = ui.position[options.prop] + 'px';
            options.container.find('input').val(value);
            options.setValue(value);
        });      
    });

    //size
    $.fn.livecsseditor.setPropertyEditor(['width','height'],function positionEditorCallback(options){
        defaultEditorCallback(options);        
        var doc = getIFDoc(options);
        if(!options.preview.contents().find(options.selector).data("hasSizeEditor")){
            jqueryUILoad(options,doc,function(){
                appendHead(null,doc,'js',null,'$("' + options.selector + '").resizable({stop:function(event, ui){document.sizeCallbacks["' + options.selector + '"].callback(event,ui);}});');
            });           
            doc.sizeCallbacks = doc.sizeCallbacks || {};
            doc.sizeCallbacks[options.selector] = {
                callback: function(event, ui){
                    for(var i in doc.sizeCallbacks[options.selector].listeners){
                        doc.sizeCallbacks[options.selector].listeners[i](event, ui);
                    }
                },
                listeners:[]
            };            
        }
        options.preview.contents().find(options.selector).data("hasSizeEditor",true);              
        
        doc.sizeCallbacks[options.selector].listeners.push(function(event, ui){
            var value = ui.size[options.prop] + 'px';
            options.container.find('input').val(value);
            options.setValue(value);
        });     
    });
    
})();

