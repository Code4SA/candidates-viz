var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

/**
 * author Remy Sharp
 * url http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 */
(function ($) {
    function getViewportHeight() {
        var height = window.innerHeight; // Safari, Opera
        var mode = document.compatMode;

        if ( (mode || !$.support.boxModel) ) { // IE, Gecko
            height = (mode == 'CSS1Compat') ?
            document.documentElement.clientHeight : // Standards
            document.body.clientHeight; // Quirks
        }

        return height;
    }

    $(window).scroll(function () {
        var vpH = getViewportHeight(),
            scrolltop = (document.documentElement.scrollTop ?
                document.documentElement.scrollTop :
                document.body.scrollTop),
            elems = [];
        
        // naughty, but this is how it knows which elements to check for
        $.each($.cache, function () {
            if (this.events && this.events.inview) {
                elems.push(this.handle.elem);
            }
        });

        if (elems.length) {
            $(elems).each(function () {
                var $el = $(this),
                    top = $el.offset().top,
                    height = $el.height(),
                    inview = $el.data('inview') || false;

                if (scrolltop > (top + height) || scrolltop + vpH < top) {
                    if (inview) {
                        $el.data('inview', false);
                        $el.trigger('inview', [ false ]);                        
                    }
                } else if (scrolltop < (top + height)) {
                    if (!inview) {
                        $el.data('inview', true);
                        $el.trigger('inview', [ true ]);
                    }
                }
            });
        }
    });
    
    // kick the event to pick up any elements already in view.
    // note however, this only works if the plugin is included after the elements are bound to 'inview'
    $(function () {
        $(window).scroll();
    });
})(jQuery);


/* Modified FitVids to work with iFrame Ads --------------*/
/*
(function( $ ){

  $.fn.fitAds = function( options ) {
    var settings = {
      customSelector: null
    }
    
    var div = document.createElement('div'),
        ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];
        
  	div.className = 'fit-ads-style';
    div.innerHTML = '&shy;<style>         
      .fluid-width-ad-wrapper {        
         width: 100%;                     
         position: relative;              
         padding: 0;                      
      }                                   
                                          
      .fluid-width-ad-wrapper iframe,  
      .fluid-width-ad-wrapper object,  
      .fluid-width-ad-wrapper embed {  
         position: absolute;           
         top: 0;                          
         left: 0;                         
         width: 100%;                     
         height: 100%;                    
      }                                   
    </style>';
                      
    ref.parentNode.insertBefore(div,ref);
    
    if ( options ) { 
      $.extend( settings, options );
    }
    
    return this.each(function(){
      var selectors = [
        "iframe",         
        "object", 
        "embed"
      ];
      
      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }
      
      var $allVideos = $(this).find(selectors.join(','));

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() == 'embed' && $this.parent('object').length || $this.parent('.fluid-width-ad-wrapper').length) { return; } 
        var height = this.tagName.toLowerCase() == 'object' ? $this.attr('height') : $this.height(),
            aspectRatio = height / $this.width();
        $this.wrap('<div class="fluid-width-ad-wrapper" />').parent('.fluid-width-ad-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  
  }
})( jQuery );
*/

jQuery(window).load(function(){
	//Try Respond Ads
	//jQuery( '.ad_zone' ).fitAds();
});

jQuery(document).ready(function(){	
	
	//Fix menu overflow
	var wrapper_pos = jQuery('#wrapper').offset();
	
	var wrapper_right = wrapper_pos.left + jQuery('#wrapper').outerWidth();
	
	jQuery.each(jQuery('ul.sub-menu'), function(){
		var sub_menu_pos = jQuery(this).offset();
		var sub_menu_right = sub_menu_pos.left + jQuery(this).outerWidth();
		
		if(sub_menu_right > wrapper_right) jQuery(this).css('left', 'auto').css('right', 0).find('li').css('float', 'right');
	});
	
	//Datepickers
	if(jQuery( 'input.date' ).get(0)) jQuery( 'input.date' ).datepicker();
	
	//Special reports arrow width fix
	jQuery('#special-reports .arrow').css('border-left-width', jQuery('#special-reports').width()/2 + 'px');
	jQuery('#special-reports .arrow').css('border-right-width', jQuery('#special-reports').width()/2 + 'px');
	
	jQuery('#special-reports').mouseenter(function(){
		jQuery(this).addClass('.hover');
	}).mouseleave(function(){
		jQuery(this).removeClass('.hover');
	});
	
	//Mod search for multimedia by date	
	jQuery('#submit-cp-form').click(function(e){
		e.preventDefault();
					
		var dates = jQuery('#searchbydate .date:first').val().split('/');
		jQuery('#searchbydate #monthnum').val(dates[0]);
		jQuery('#searchbydate #day').val(dates[1]);
		jQuery('#searchbydate #year').val(dates[2]);
		
		jQuery('#searchbydate .date:first').val('');
		
		jQuery('#searchbydate').submit();
		
	});
	
	
	// FitVids - Responsive Videos
	jQuery( '.embed-youtube, .unoslider, .multimedia, .multimedia-latest, .post .entry' ).fitVids({ customSelector : "iframe[src^='//player.vimeo.com']" });
	
	//Special Reports Hover
	jQuery('#special-reports').mouseenter(function(){
		jQuery('#special-reports .arrow').addClass('grow');
	}).mouseleave(function(){
		jQuery('#special-reports .arrow').removeClass('grow');
	});
	
	//News Ticker
	jQuery(function () {
        jQuery('#home-news-ticker').ticker({
        	controls: false,        // Whether or not to show the jQuery News Ticker controls
        	titleText: ''
        });
    });
	
	//Slide Toggler
	jQuery('.slide-toggle .toggle').click(function(){
		if(jQuery(this).hasClass('closed')){
			jQuery(this).removeClass('closed').html('Hide');
			jQuery('#main-slides').slideDown('normal');
			jQuery(this).parent().parent('.slider-container').removeClass('closed');
		}else{
			jQuery(this).addClass('closed').html('Show');
			jQuery('#main-slides').slideUp('normal');
			jQuery(this).parent().parent('.slider-container').addClass('closed');
		}		
	});
	
	//Media Slide Content Toggle
	jQuery('.media .woo-slideshow .content .excerpt').hide();
	jQuery('.media .woo-slideshow .slide').mouseenter(function(){
		jQuery(this).find('.content .excerpt').slideDown('fast');
	}).mouseleave(function(){
		jQuery(this).find('.content .excerpt').slideUp('fast');
	});
	
	//Most Popular Homepage Carousel Animations
	jQuery('.home .carousel-slider .slide .type').hide();
	jQuery('.home .carousel-slider .slide .type .category-posts').hide();
	jQuery('.home .carousel-slider .slide').mouseenter(function(){
		jQuery(this).find('.type').slideDown('fast');
		jQuery(this).addClass('active');
		jQuery('.home .carousel-slider .slide:not(.active) .item').addClass('inactive');
	}).mouseleave(function(){
		jQuery(this).find('.type').slideUp('fast');
		jQuery(this).removeClass('active');
		jQuery('.home .carousel-slider .slide .item').removeClass('inactive');
		//Close Media if open
		if(jQuery(this).find('.type').hasClass('open')){
			jQuery(this).find('.type').toggleClass('open').find('.category-posts').slideToggle('fast');
		}
	});
	
	//Most popular Multimedia Arrow Hover
	jQuery('.home .carousel-slider .slide .type .arrow-circle').click(function(event){
		event.preventDefault();
		jQuery(this).parent().parent().toggleClass('open').find('.category-posts').slideToggle('fast');
	});
	
	//News Section Animations
	jQuery('.news-posts .section .category-posts').hide();
	jQuery('.news-posts .section .category-head').mouseenter(function(){
		jQuery(this).addClass('open').find('.category-posts').slideDown('fast');
		jQuery('.news-posts .section :not(.active)').addClass('inactive');
	}).mouseleave(function(){
		jQuery(this).removeClass('open').find('.category-posts').slideUp('fast');
		jQuery('.news-posts .section').removeClass('inactive');		
	});
			
	jQuery('.news-posts .section').mouseenter(function(){
		jQuery(this).addClass('active');
		jQuery('.news-posts .section :not(.active)').addClass('inactive');
	}).mouseleave(function(){
		jQuery(this).removeClass('active');
		jQuery('.news-posts .section').removeClass('inactive');
	});
	
	//News Section Animations
	jQuery('.below-loop .section .category-posts').hide();
	jQuery('.below-loop .section .category-head').mouseenter(function(){
		jQuery(this).addClass('open').find('.category-posts').slideDown('fast');
		jQuery('.below-loop .section :not(.active)').addClass('inactive');
	}).mouseleave(function(){
		jQuery(this).removeClass('open').find('.category-posts').slideUp('fast');
		jQuery('.below-loop .section').removeClass('inactive');		
	});
			
	jQuery('.below-loop .section').mouseenter(function(){
		jQuery(this).addClass('active');
		jQuery('.below-loop .section :not(.active)').addClass('inactive');
	}).mouseleave(function(){
		jQuery(this).removeClass('active');
		jQuery('.below-loop .section').removeClass('inactive');
	});
	
	//News Section Animations
	jQuery('.sidebar_special_reports .sidebar_special_report .category-posts').hide();
	jQuery('.sidebar_special_reports .sidebar_special_report .category-head').mouseenter(function(){
		jQuery(this).addClass('open').find('.category-posts').slideDown('fast');
		jQuery('.sidebar_special_reports .sidebar_special_report :not(.active)').addClass('inactive');
	}).mouseleave(function(){
		jQuery(this).removeClass('open').find('.category-posts').slideUp('fast');
		jQuery('.sidebar_special_reports .sidebar_special_report').removeClass('inactive');		
	});
			
	jQuery('.sidebar_special_reports .sidebar_special_report').mouseenter(function(){
		jQuery(this).addClass('active');
		jQuery('.sidebar_special_reports .sidebar_special_report :not(.active)').addClass('inactive');
	}).mouseleave(function(){
		jQuery(this).removeClass('active');
		jQuery('.sidebar_special_reports .sidebar_special_report').removeClass('inactive');
	});
	
	//Single Post talking Point Animations
	jQuery('.single-side .talking_point .category-posts').hide();
	jQuery('.single-side .talking_point .post-head').mouseenter(function(){
		jQuery(this).addClass('open').find('.category-posts').slideDown('fast');		
	}).mouseleave(function(){
		jQuery(this).removeClass('open').find('.category-posts').slideUp('fast');		
	});		
		
	jQuery('.second_latest_report_post .opinion .category-posts').hide();
	jQuery('.second_latest_report_post .opinion .post-head').mouseenter(function(){
		jQuery(this).addClass('open').find('.category-posts').slideDown('fast');		
	}).mouseleave(function(){
		jQuery(this).removeClass('open').find('.category-posts').slideUp('fast');		
	});	
	
	jQuery('.featured_reports .multimedia .category-posts').hide();
	jQuery('.featured_reports .multimedia .post-head').mouseenter(function(){
		jQuery(this).addClass('open').find('.category-posts').slideDown('fast');		
	}).mouseleave(function(){
		jQuery(this).removeClass('open').find('.category-posts').slideUp('fast');		
	});		
	
	// Multimedia BLock hovers
	jQuery('.media-box').mouseenter(function(){
		jQuery(this).addClass('open').find('.media-title').slideDown('fast');
	}).mouseleave(function(){
		jQuery(this).removeClass('open').find('.media-title').slideUp('fast');
	});	
	
	//Uno Slider - add class on mousenter
	jQuery('.unoslider').mouseenter(function(){
		jQuery(this).addClass('hover');
	}).mouseleave(function(){
		jQuery(this).removeClass('hover');
	});	
	
	if(jQuery('.navigation').length){
		jQuery('.navigation').children('a').each(function(){
			console.log(jQuery(this).text());
			if(jQuery(this).text().indexOf("Previous") != -1){
				jQuery(this).addClass('nav_prev');
			}else{
				jQuery(this).addClass('nav_next');
			}
		});
	}
	
	jQuery('.regular_columnists ul').hide();
	jQuery('.regular_columnists').mouseenter(function(){
		jQuery(this).addClass('open').find('ul').slideDown('fast');		
	}).mouseleave(function(){
		jQuery(this).removeClass('open').find('ul').slideUp('fast');		
	});
	
	if(jQuery(window).width() == 768 ) {
		jQuery('#navigation').wrap('div');
		jQuery( '#navigation' ).parent('div').hide();
		// Show/hide the main navigation
	  	jQuery( '.nav-toggle' ).click(function() {
		  jQuery( '#navigation' ).parent('div').slideToggle( 'fast', function() {
		  	return false;
		    // Animation complete.
		  });
		});
		
	}
	
	//Hot or Not Vote
	//console.log(kri8itParams.ajax_url);
	jQuery('.thumbs-up.active').click(function(){
		
		var clicked = jQuery(this);
		var the_id = jQuery(this).attr('rel');
		var hotnot = jQuery(this).parent('.vote').attr('rel');
		
		clicked.parent('.vote').fadeTo('fast', 0.3);
		
		jQuery.ajax({
			type: "POST",
			data: { action: 'kri8it_hotnot_vote', post_id: the_id, vote: 'up', type: hotnot },
			url: kri8itParams.ajax_url ,
			success: function (data) {
				clicked.parent('.vote').fadeTo('fast', 1);
				clicked.removeClass('active');
				clicked.siblings('.thumbs-down').fadeTo('normal', 0.5).removeClass('active');
				clicked.parent('.vote').append(data);			
			}
		});
		
	});
	
	jQuery('.thumbs-down.active').click(function(){
		
		var clicked = jQuery(this);
		var the_id = jQuery(this).attr('rel');
		var hotnot = jQuery(this).parent('.vote').attr('rel');
		
		clicked.parent('.vote').fadeTo('fast', 0.3);
		
		jQuery.ajax({
			type: "POST",
			data: { action: 'kri8it_hotnot_vote', post_id: the_id, vote: 'down', type: hotnot },
			url: kri8itParams.ajax_url,
			success: function (data) {
				clicked.parent('.vote').fadeTo('fast', 1);
				clicked.removeClass('active');
				clicked.siblings('.thumbs-up').fadeTo('normal', 0.5).removeClass('active');
				clicked.parent('.vote').append(data);							
			}
		});
		
	});
	
	
});

/* --------------------------------------------------------*/
/* FlexSliders --------------------------------------------*/
/* --------------------------------------------------------*/
jQuery(window).load(function() {
  
	// Main Slider
	jQuery('#main-slides').cycle({
		'timeout'			: 10000,		
		'slideExpr'			: "li:not(.placeholder)",
		'slideResize'		: false,
        'containerResize'	: false,
        'pause'				: true   
	});
	
	// Top Stories Slider
	jQuery('#top-story-slides').cycle({
		'timeout'			: 6000,		
		'slideExpr'			: "li:not(.placeholder)",
		'slideResize'		: false,
        'containerResize'	: false,
        'next' 				: '.top-stories-slider .slider-nav .next',
		'prev' 				: '.top-stories-slider .slider-nav .prev',
		'pager'				: '.top-stories-slider .slider-pager',
		'pause'				: true  
	});
	jQuery('.top-stories-slider').mouseenter(function(){
		jQuery(this).addClass('hover');
	}).mouseleave(function(){
		jQuery(this).removeClass('hover');
	});
	
	// Small Slider
	jQuery('#small-slides').cycle({
		'timeout'			: 6000,		
		'slideExpr'			: "li:not(.placeholder)",
		'slideResize'		: false,
        'containerResize'	: false, 
        'pause'				: true       
	});
	
	//Carousel Slider - Most Popular Homepage
	jQuery('.home .carousel-slider').flexslider({
		animation: "slide",
		animationLoop: true,
		pauseOnHover: true,
		controlNav: false,
		itemWidth: 224,
		itemMargin: 18,
		minItems: 4,
		maxItems: 4,
		slideshow: false
	});
	
	//Carousel Slider - Hot or Not Archives
	jQuery('.hot-or-not-slide .slides').cycle({
		'timeout'			: 0,
		'next' 				: '#hotnot-next',
		'prev' 				: '#hotnot-prev',
		//'fx'				: 'scrollHorz',
		//'easing'			: 'easeOutQuad',
		'slideExpr'			: "li:not(.placeholder)",
		'slideResize'		: false,
        'containerResize'	: false        
	});
	
	// Hot or Not Widget
	jQuery('.hotnot-slide').cycle({
		'timeout'	: 0,
		'next' 		: '.hot-or-not-widget-next',
		'prev' 		: '.hot-or-not-widget-prev',
		'fx'		: 'scrollHorz',
		'easing'	: 'easeOutQuad'
	});	
	

	jQuery('#cartoon-slideshow').cycle({
		'timeout'			: 0,
		'next' 				: '#cartoon-next',
		'prev' 				: '#cartoon-prev',
		//'fx'				: 'scrollHorz',
		//'easing'			: 'easeOutQuad',
		'slideExpr'			: "li:not(.placeholder)",
		'slideResize'		: false,
        'containerResize'	: false        
	});
	
	jQuery('#gallery').cycle({
		'timeout'			: 10000,
		'next' 				: '#gallery-next',
		'prev' 				: '#gallery-prev',		
		'slideExpr'			: "li:not(.placeholder)",
		'slideResize'		: false,
        'containerResize'	: false,
        'before'			: function(currSlideElement, nextSlideElement, options, forwardFlag){        	
        	var height = jQuery(nextSlideElement).height();
        	jQuery('#gallery').height(height);
        },
        'pager'				:  '#gallery-pager',
        'pagerAnchorBuilder': function(idx, slide) {        	
        	var src = jQuery(slide).find('img').attr('src');
        	src = src.replace('w=630&h=0', 'w=80&h=80');
	        return '<li><a href="#"><img src="' + src + '" width="80" height="80" /></a></li>'; 
	    } 
	});	
	
	jQuery('.gallery-container').mouseenter(function(){
		jQuery('.gallery-nav').addClass('show');		
	}).mouseleave(function(){
		jQuery('.gallery-nav').removeClass('show');			
	});		
	
	
	var item_height = 0;
	jQuery('.item-holder').each(function(){
		if(jQuery(this).height() > item_height){
			item_height = jQuery(this).height();
		}
	});
	
	jQuery('.item-holder').each(function(){
		if(jQuery(window).width() > 480) jQuery(this).css('height', item_height) ;
	});
	
	/* Grow Uno SLider to fit captions */
	/*
	var caption_height = jQuery('#media_slider .unoslider_caption').outerHeight();
	jQuery('#media_slider').css('margin-bottom',caption_height+'px');
	
	var caption_height = jQuery('#unoslider-2 .unoslider_caption').outerHeight();
	jQuery('.home .top-stories .media').css('margin-bottom',caption_height+'px');
	
	var caption_height = jQuery('.slider-container .unoslider_caption').outerHeight();
	jQuery('.slider-container').css('margin-bottom',caption_height+'px');
	*/
});
