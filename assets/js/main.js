/*
	Serubin.net - Page setup
	Rewritten.
    Original code from:
   	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		wide: '(max-width: 1680px)',
		normal: '(max-width: 1280px)',
		narrow: '(max-width: 980px)',
		narrower: '(max-width: 840px)',
		mobile: '(max-width: 736px)'
	});

	$(function() {

	    var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$banner = $('#welcome');

        var headerHeight = 
            $header.height() + 
            parseInt($header.css("margin-top").replace("px")) + 
            parseInt($header.css("margin-top").replace("px"));

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            $body.removeClass('is-loading');
        });

        
        // Section definitions
        var sections = [
            {'min': "#welcome", 'max': "#intro", 'offset': 0},
            {'min': "#education", 'max': "#education", 'offset': -17},
            {'min': "#experience", 'max': "#experience", 'offset': -73, 'postset': 20},
            {'min': "#activities", 'max': "#activities", 'offset': 63}
        ];
        
        $.each(sections, function(index, item) {
            var $min = $(item.min);
            var $max = $(item.max);
            var $nav = $(item.min + "-nav");

			if(typeof item.postset == "undefined")
				item.postset = 0;
            
            // Calculates min and max areas
            var min = (
                $min.offset().top - (
                    parseInt($min.css("margin-top").replace("px"))
                    + parseInt($min.css("padding-top").replace("px"))
                    + headerHeight
                )
                + item.offset // offset for additional correction
            );
            var max = (
                $max.offset().top + $max.height() + (
                    parseInt($min.css("margin-bottom").replace("px"))
                    + parseInt($min.css("padding-bottom").replace("px"))
                )
				- item.postset
            );

            // Add to scroll spy watch list
            $window.scrollspy({
                min: min,
                max: max,
                onEnter: function(element, position) {
                    $nav.addClass('current');
                },
                onLeave: function(element, position) {
                    $nav.removeClass('current');
                }
            });
        });

        // Scrolly links.
        $('.scrolly').scrolly({ // Intro link
            speed: 1000, 
            offset: -20
        });
        $('.navscroll').scrolly({ // Most links
            speed: 1000, 
            offset: 50
        });
        $('#resume-nav .navscroll').scrolly({ // Resume fix
            speed: 1000, 
            offset: 90
        }); // Fix for resume secton
        $('nav .link').scrolly({ // Mobile nav - currently not working
            speed: 1000, 
            offset: 50
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9)
            $(':last-child').addClass('last-child');

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on narrower.
        skel.on('+narrower -narrower', function() {
            $.prioritize(
                '.important\\28 narrower\\29',
                skel.breakpoint('narrower').active
            );
        });

        // Dropdowns.
        $('#nav > ul').dropotron({
            mode: 'fade',
            noOpenerFade: true,
            globalOffsetY: -15,
            expandMode: (skel.vars.touch ? 'click' : 'hover')
        });

        // Off-Canvas Navigation.

        // Navigation Button.
        $(
            '<div id="navButton">' +
                '<a href="#navPanel" class="toggle"></a>' +
            '</div>'
        )
            .appendTo($body);

        // Navigation Panel.
        $(
            '<div id="navPanel">' +
                '<nav>' +
                    $('#nav').navList() +
                '</nav>' +
            '</div>'
        )
            .appendTo($body)
            .panel({
                delay: 500,
                hideOnClick: true,
                hideOnSwipe: true,
                resetScroll: true,
                resetForms: true,
                side: 'left',
                target: $body,
                visibleClass: 'navPanel-visible'
            });

        // Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
        if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
            $('#navButton, #navPanel, #page-wrapper')
                .css('transition', 'none');

        // Header.
        // If the header is using "alt" styling and #banner is present, use scrollwatch
        // to revert it back to normal styling once the user scrolls past the banner.
        // Note: This is disabled on mobile devices.
        if (!skel.vars.mobile
        &&	$header.hasClass('alt')
        &&	$banner.length > 0) {

            $window.on('load', function() {
                $banner.scrollwatch({
                    delay:		0,
                    range:		1,
                    anchor:		'top',
                    on:			function() { $header.addClass('alt reveal'); },
                    off:		function() { $header.removeClass('alt'); }
                });

            });

        }
        
        $("#footer-inner").css("position", "relative");
        var footerHeight = $("#footer").height();
        $("#footer-inner").css("position", "");
        $.each([$("#footer"), $("#footer-inner")], function(index, value) {
            value.css("height", footerHeight + "px");
        });
        
        $("#footer #spacer").css("bottom", (footerHeight - 60) + "px");

	});

})(jQuery);
