/**
 * livecsseditor Size editors
 * 
 *
 * @author Milan Rukavina
 * @version 2.0
 */

(function(){       
    //size editor attach
    $.fn.livecsseditor.setPropertyEditor(['width','height'],function sizeEditorCallback(customizer, vars, config){
        customizer.defaultEditorCallback(customizer, vars, config);
        var doc = customizer.getIFDoc();
        if(!customizer.$preview.contents().find(vars.selector).data("hasSizeEditor")){
            customizer.jqueryUILoad(doc,function(){
                customizer.appendHead(null,doc,'js',null,'$("' + vars.selector + '").resizable({stop:function(event, ui){document.sizeCallbacks["' + vars.selector + '"].callback(event,ui);}});');
            });           
            doc.sizeCallbacks = doc.sizeCallbacks || {};
            doc.sizeCallbacks[vars.selector] = {
                callback: function(event, ui){
                    for(var i in doc.sizeCallbacks[vars.selector].listeners){
                        doc.sizeCallbacks[vars.selector].listeners[i](event, ui);
                    }
                },
                listeners:[]
            };            
        }
        customizer.$preview.contents().find(vars.selector).data("hasSizeEditor",true);
        
        doc.sizeCallbacks[vars.selector].listeners.push(function(event, ui){
            var value = ui.size[vars.prop] + 'px';
            vars.container.find('input').val(value);
            vars.setValue(value);
        });     
    });
    
})();

