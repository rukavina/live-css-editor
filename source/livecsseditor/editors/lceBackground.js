/**
 * Livecssditor Background editor
 * 
 *
 * @author Milan Rukavina
 * @version 2.0
 */

(function(){

    //attach image chooser
    $.fn.livecsseditor.setPropertyEditor(['background-image'],function bgImageEditorCallback(customizer, vars, config){
        var urls = config.urls;
        var html = '<select class="form-control"></select>';
        var value = vars.value.replace('url(','').replace(')','');
        vars.container.html(html);
        var $select = vars.container.find('select');
        html = '';
        for(var url in urls){
            var selected = '', urlPath = url, urlName = urls[url];
            if(urls instanceof Array){
                urlPath = urls[url];
            }
            if ($.trim(value).toLowerCase() == url.toLowerCase()) {
                selected = ' selected="selected"';
            }
            html += '<option value="' + urlPath + '"' + selected  + '>' + urlName + '</option>';
        }
        $select .html(html)
                .chosen({width: "95%"})
                .change(function(evt, params){
                    vars.setValue('url("' + $(this).val() + '")');
                })
                .on('chosen:showing_dropdown', function(evt, chosen) {
                    vars.container.parents('.panel').css('overflow','visible');
                });
    });
    
})();

