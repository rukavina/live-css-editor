/**
 * livecsseditor Font editor
 * 
 *
 * @author Milan Rukavina
 * @version 2.0
 */

(function(){

    //attach font editor
    $.fn.livecsseditor.setPropertyEditor(['font-family'],function fontFamilyEditorCallback(customizer, vars, config){
        var fonts = config.names;
        var fontNames = vars.value.split(",");
        for(var i in fontNames){
            fontNames[i] = $.trim(fontNames[i]).toLowerCase();
        }
        var html = '<select class="form-control" multiple="multiple"></select>';
        vars.container.html(html);
        var $select = vars.container.find('select');
        html = '';
        for(var i in fonts){
            var font = fonts[i];
            var selected = '';
            $.each(fontNames, function(index, value) {
                if (selected == '' && $.trim(value).toLowerCase() == font.toLowerCase()) {
                    selected = ' selected="selected"';
                    return false;
                }
            });           
            html += '<option value="' + font.toLowerCase() + '"' + selected  + ' style="font-family:' + font + ';">' + font + '</option>';
        }
        //chosen plugin
        $select .html(html)
                .chosen({width: "95%"})
                .change(function(evt, params){
                    if(params.selected){
                        fontNames.push(params.selected);
                    }
                    if(params.deselected){
                        var index = $.inArray(params.deselected,fontNames);
                        if(index >= 0){
                            fontNames.splice(index,1);
                        }
                    }
                    //fontNames keeps order of selected fonts
                    if(fontNames){
                        var val = fontNames.join(',');
                    }
                    else{
                        var val = "";
                    }
                    vars.setValue(val);
                })
                .on('chosen:showing_dropdown', function(evt, chosen) {
                    //hack to show chosen in accordion
                    vars.container.parents('.panel').css('overflow','visible');
                });
    });    
})();

