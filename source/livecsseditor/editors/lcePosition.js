/**
 * livecsseditor Position editor
 * 
 *
 * @author Milan Rukavina
 * @version 2.0
 */

(function(){       
    //position editor attach
    $.fn.livecsseditor.setPropertyEditor(['left','top'],function positionEditorCallback(customizer, vars, config){
        customizer.defaultEditorCallback(customizer, vars, config);        
        var doc = customizer.getIFDoc();
        if(!customizer.$preview.contents().find(vars.selector).data("hasPosEditor")){
            customizer.jqueryUILoad(doc,function(){
                customizer.appendHead(null,doc,'js',null,'$("' + vars.selector + '").draggable({stop:function(event, ui){document.posCallbacks["' + vars.selector + '"].callback(event,ui);}});');
            });           
            doc.posCallbacks = doc.posCallbacks || {};
            doc.posCallbacks[vars.selector] = {
                callback: function(event, ui){
                    for(var i in doc.posCallbacks[vars.selector].listeners){
                        doc.posCallbacks[vars.selector].listeners[i](event, ui);
                    }
                },
                listeners:[]
            };            
        }
        customizer.$preview.contents().find(vars.selector).data("hasPosEditor",true);
        
        doc.posCallbacks[vars.selector].listeners.push(function(event, ui){
            var value = ui.position[vars.prop] + 'px';
            vars.container.find('input').val(value);
            vars.setValue(value);
        });      
    });    
})();

