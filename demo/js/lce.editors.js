/**
 * jQuery Live CSS Editor (LCE) - property editors
 * 
 * @author Milan Rukavina 2012
 */
(function(){
    //default
    $.fn.livecsseditor.setPropertyEditor('default',function defaultEditorCallback(options){
        var html = '<form class="form-inline"><input type="text" value="" /><a class="btn" href="#"><i class=" icon-ok"></i></a></form>'
        options.container.html(html);
        options.container.find('input').val(options.value);
        options.container.find('a.btn').click(function(){
            options.setValue(options.container.find('input').val());
            return false; 
        });
    }); 

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

