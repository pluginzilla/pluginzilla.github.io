
/*
    jquery.selectjs
    ^^^^^^^^^^^^^^^

    Description: Select Options
    Version: Version 0.0.1
    Author: BJIT Limited 
*/

(function( $ ) {

    $.selectjs = function(element, options) {

        var plugin = this;
        plugin.settings = {};
        var $element = $(element);

        /*
            #Default data for plugin
        */
        var defaults =  {
            title: "Demo Select",
            firstOption: "-Select-",
            elementName: "select-element",
            elementId: "select-element",
            searchable: false,
            pagination: false,
            valueGeneration: true,
            actionButtons : false,
            data : ["No Data"],
            perPage : 5,
            onchangeEvent : function(){

            }
        };


        /*
            #Initliazes plugin
        */
        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.drawElement(plugin.getRefineArray(plugin.settings.data));
        };

        /*
        #refine array data to assure uniqueness
        */
        plugin.getRefineArray = function(values) {
            valurs = plugin.getSortedArray(values);
            var refined = []; 
            for (var i = 0; i < values.length; i++) {
                if (refined.indexOf(values[i])==-1) {
                    refined.push(values[i]);
                }
            }

            return refined;
        };
        /*
        #sort array data to assure uniqueness
        */
        plugin.getSortedArray = function(values) {
            return values.sort();
        };
        
        /*
        #Generates HTML for  select options
        */
        plugin.drawElement = function(labels) {
            var select = document.createElement("select");
            select.name = plugin.settings.elementName;
            select.id = plugin.settings.elementId;
            select.onchange = plugin.settings.onchangeEvent;
            select.className = "form-control";

            if (plugin.settings.firstOption!="" && plugin.settings.firstOption!=null) {
                var option = document.createElement("option");
                option.text = plugin.settings.firstOption;
                option.value = '';
                select.appendChild(option);
            }

            for (var i = 0; i < labels.length; i++) {
                var option = document.createElement("option");
                var value = plugin.settings.valueGeneration ? i : labels[i];

                option.text = labels[i];
                option.value = value;
                select.appendChild(option);
            }

            if (plugin.settings.title!="" && plugin.settings.title!=null) {
                var h1 = document.createElement("h2");
                h1.innerHTML = plugin.settings.title;
                $element[0].appendChild(h1);
            }
            //$element[0].parent().appendChild("<h1>Select Bookmarks Folder</h1>");
            
            $element[0].appendChild(select);
            return 1;
        };

        plugin.init();

    };

    $.fn.selectjs = function(options) {
        return this.each(function() {
            if (undefined === $(this).data('selectjs')) {
                var plugin = new $.selectjs(this, options);
                    $(this).data('selectjs', plugin);
            }
        });

    };

}( jQuery ));
