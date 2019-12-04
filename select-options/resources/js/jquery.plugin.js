
/*
    jquery.appjs
    ^^^^^^^^^^^^^^^

    Description: Select Options
    Version: Version 0.0.1
    Author: Arifur Rahman (https://github.com/arifcseru)
*/

(function( $ ) {

    $.appjs = function(element, options) {

        /*
            #Default data for plugin
        */
       var defaults =  {
		header: "Bookmark Folder Selection",
		firstOption: "Select Bookmark Folder",
        searchable: false,
        pagination: false,
		actionButtons : false,
		data : ["No Data"],
		perPage : 5
	};

        var plugin = this;

        plugin.settings = {};

        var $element = $(element);


        /*
            #Initliazes plugin
        */
        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.drawElement(plugin.getRefineArray(plugin.settings.data));
        };

        /*
        #Generates HTML for table (nav)
        */
        plugin.getRefineArray = function(values) {
            var refined = []; 
            for (var i = 0; i < values.length; i++) {
                if (refined.indexOf(values[i])==-1) {
                    refined.push(values[i]);
                }
            }

            return refined;
        };
        /*
        #Generates HTML for  select options
        */
        plugin.drawElement = function(values) {
            return 1;
        };

        plugin.init();

    };

    $.fn.appjs = function(options) {

        return this.each(function() {
            if (undefined === $(this).data('appjs')) {
                var plugin = new $.appjs(this, options);
                    $(this).data('appjs', plugin);
            }
        });

    };

}( jQuery ));
