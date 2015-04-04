/**
 * livecsseditor Color editor
 * 
 *
 * @author Milan Rukavina
 * @version 2.0
 */

(function(){
    var hexDigits = new Array
    ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

    //Function to convert hex format to a rgb color
    function rgb2hex(rgb) {
        if(rgb.substr(0, 4).toLowerCase() == 'rgba'){
            rgb = rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
            return rgba2hex(parseInt(rgb[1],10),parseInt(rgb[2],10),parseInt(rgb[3],10),parseInt(rgb[4],10));
        }
        var rgbArr = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if(!rgbArr){
            return rgb;
        }
        return hex(rgbArr[1]) + hex(rgbArr[2]) + hex(rgbArr[3]);
    }

    // convert RGBA color data to hex
    function rgba2hex(r, g, b, a) {
        if(r == g && g == b && b == a && a == 0){
            return '';
        }
        if (r > 255 || g > 255 || b > 255 || a > 255)
            throw "Invalid color component";
        return (256 + r).toString(16).substr(1) +((1 << 24) + (g << 16) | (b << 8) | a).toString(16).substr(1);
    }
    
    /**
     * Convert to hex string
     * 
     * @param {Integer} x
     * @returns {String}
     */
    function hex(x) {
        return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
    }

    //attach color editor
    $.fn.livecsseditor.setPropertyEditor(['color','background-color'],function colorEditorCallback(customizer, vars, config){
        var html = '<input type="text" class="form-control" value="" />';
        vars.container.html(html);
        //convert to hex
        if(vars.value.substr(0, 1) == '#'){
            var hexValue = vars.value.substr(1);
        }
        else{
            var hexValue = rgb2hex(vars.value);
        }        
        //create picker
        var cPicker = new jscolor.color(vars.container.find('input').get(0), {});
        cPicker.required = false;
        cPicker.fromString(hexValue)        
        //when value is changed
        vars.container.find('input').val(hexValue).change(function(){
            var color  = $(this).val();
            if(color == ''){
                color = "rgba(0,0,0,0)";
            }
            else{
                color = '#' + color;
            }
            vars.setValue(color);
        });
    });    
})();

