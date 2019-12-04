/*
    jquery.table2
    ^^^^^^^^^^^^^^^

    Description: Add a pagination to everything.
    Version: Version 0.3.0
    Author: Kevin Eichhorn (https://github.com/neighbordog)
*/

(function( $ ) {

    $.table2 = function(element, options) {

        /*
            #Defaults
        */
        var defaults = {
            perPage:                3,              //how many items per page
            autoScroll:             true,           //boolean: scroll to top of the container if a user clicks on a pagination link
            scope:                  '',             //which elements to target
            table2Position:       ['bottom'],     //defines where the pagination will be displayed
            containerTag:           'nav',
            paginationTag:          'ul',
            itemTag:                'li',
            linkTag:                'a',
            useHashLocation:        true,           //Determines whether or not the plugin makes use of hash locations
            onPageClick:            function() {}   //Triggered when a pagination link is clicked

        };

        var plugin = this;
        var plugin_index = $('.table2').length;

        plugin.settings = {};

        var $element = $(element);

        var curPage, items, offset, maxPage;

        /*
            #Initliazes plugin
        */
        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            curPage = 1;
            items =  $element.children(plugin.settings.scope);
            maxPage = Math.ceil( items.length / plugin.settings.perPage ); //determines how many pages exist

            var paginationHTML = generatePagination(); //generate HTML for pageination

            if($.inArray('top', plugin.settings.table2Position) > -1) {
                $element.before(paginationHTML);
            }

            if($.inArray('bottom', plugin.settings.table2Position) > -1) {
                $element.after(paginationHTML);
            }

            $element.addClass("table2");
            $element.addClass("table2-" + plugin_index);

            var hash = location.hash.match(/\#table2\-(\d)/i);

            //Check if URL has matching location hash
            if(hash && plugin.settings.useHashLocation) {
                plugin.switchPage(hash[1]);
            } else {
                plugin.switchPage(1); //go to initial page
            }

        };

        /*
            #Switch to Page > 'page'
        */
        plugin.switchPage = function(page) {

            if(page == "next") {
                page = curPage + 1;
            }

            if(page == "prev") {
                page = curPage - 1;
            }

            //If page is out of range return false
            if(page < 1 || page > maxPage) {
                return false;
            }

            if(page > maxPage) {
                $('.table2-pagination-' + plugin_index).find('.page-next').addClass("deactive");
                return false;
            } else {
                $('.table2-pagination-' + plugin_index).find('.page-next').removeClass("deactive");
            }

            $('.table2-pagination-' + plugin_index).find('.active').removeClass('active');
            $('.table2-pagination-' + plugin_index).find('.page-' + page).addClass('active');

            offset = (page - 1) * plugin.settings.perPage;

            $( items ).hide();

            //Display items of page
            for(i = 0; i < plugin.settings.perPage; i++) {
                if($( items[i + offset] ).length)
                    $( items[i + offset] ).fadeTo(100, 1);
            }

            //Deactive prev button
            if(page == 1) {
                $('.table2-pagination-' + plugin_index).find('.page-prev').addClass("deactive");
            } else {
                $('.table2-pagination-' + plugin_index).find('.page-prev').removeClass("deactive");
            }

            //Deactive next button
            if(page == maxPage) {
                $('.table2-pagination-' + plugin_index).find('.page-next').addClass("deactive");
            } else {
                $('.table2-pagination-' + plugin_index).find('.page-next').removeClass("deactive");
            }

            curPage = page;

            return curPage;

        };

        /*
        #Kills plugin
        */
        plugin.kill = function() {

            $( items ).show();
            $('.table2-pagination-' + plugin_index).remove();
            $element.removeClass('table2');
            $element.removeData('table2');

        };

        /*
        #Generates HTML for pagination (nav)
        */
        var generatePagination = function() {

            var paginationEl = '<' + plugin.settings.containerTag + ' class="table2-pagination table2-pagination-' + plugin_index + '" data-parent="' + plugin_index + '">';
            paginationEl += '<' + plugin.settings.paginationTag + '>';

            paginationEl += '<' + plugin.settings.itemTag + '>';
            paginationEl += '<' + plugin.settings.linkTag + ' href="#" data-page="prev" class="page page-prev">&laquo;</' + plugin.settings.linkTag + '>';
            paginationEl += '</' + plugin.settings.itemTag + '>';

            for(i = 1; i <= maxPage; i++) {
                paginationEl += '<' + plugin.settings.itemTag + '>';
                paginationEl += '<' + plugin.settings.linkTag + ' href="#table2-' + i + '" data-page="' + i + '" class="page page-' + i + '">' + i + '</' + plugin.settings.linkTag + '>';
                paginationEl += '</' + plugin.settings.itemTag + '>';
            }

            paginationEl += '<' + plugin.settings.itemTag + '>';
            paginationEl += '<' + plugin.settings.linkTag + ' href="#" data-page="next" class="page page-next">&raquo;</' + plugin.settings.linkTag + '>';
            paginationEl += '</' + plugin.settings.itemTag + '>';

            paginationEl += '</' + plugin.settings.paginationTag + '>';
            paginationEl += '</' + plugin.settings.containerTag + '>';

            //Adds event listener for the buttons
            $(document).on('click', '.table2-pagination-' + plugin_index + ' .page', function(e) {
                e.preventDefault();

                var page = $(this).data('page');
                var table2Parent = $(this).parents('.table2-pagination').data('parent');

                //Call onPageClick callback function
                $('.table2-' + table2Parent).data('table2').settings.onPageClick();

                page = $('.table2-' + table2Parent).data('table2').switchPage(page);

                if(page) {
                    if(plugin.settings.useHashLocation)
                        location.hash = '#table2-' + page; //set location hash

                    if(plugin.settings.autoScroll)
                        $('html, body').animate({scrollTop: $('.table2-' + table2Parent).offset().top}, 'slow');

                }

            });

            return paginationEl;

        };

        plugin.init();

    };

    $.fn.table2 = function(options) {

        return this.each(function() {
            if (undefined === $(this).data('table2')) {
                var plugin = new $.table2(this, options);
                    $(this).data('table2', plugin);
            }
        });

    };

}( jQuery ));
