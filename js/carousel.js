+function($) {
  "use strict";

    var Carousel = function(element, options){
      this.$element = $(element);
      this.options = options;
      this.$pagination = this.$element.parent().find(".carousel-pagination")
      this.paused      =
      this.sliding     =
      this.interval    =
      this.$active     =
      this.$items      = null;
      this.$prevButton = this.$element.parent().find(".caurosel-previous-button");
      this.$nextButton = this.$element.parent().find(".caurosel-next-button");

      this.$prevButton.on("click", $.proxy(this.prev, this))
      this.$nextButton.on("click", $.proxy(this.next, this))

      this.options.pause = this.$element
          .on('mouseenter', $.proxy(this.pause, this))
          .on('mouseleave', $.proxy(this.cycle, this))
      }

    Carousel.DEFAULTS = {
      interval: 5000,
      pause: 'hover',
      wrap: true
    }

    Carousel.prototype.to = function(position){
      var that = $(this);
      var activeIndex = this.getActiveIndex();
      if (pos > this.$items.length - 1 || pos < 0) return;

      return this.slide(pos > activeIndex ? "next" : "prev", $(this.$items[pos]))
    }

    Carousel.prototype.slide = function(type, next){

      var $active   = this.$element.find('.active-slide')
      var $next     = next || $active[type]()
      var direction = type == 'next' ? 'next' : 'prev'
      var fallback  = type == 'next' ? 'first' : 'last'

      if (!$next.length) {
        $next = this.$element.find(".slide")[fallback]();
      }

      $active.removeClass('active-slide')
      $next.addClass('active-slide')

      if (this.$pagination.length) {
        this.$pagination.find(".active").removeClass("active");
        var $nextPageIndicator = 
          $(this.$pagination.children()[this.getActiveIndex()]);
        $nextPageIndicator && $nextPageIndicator.addClass("active")
      }
    }

    Carousel.prototype.next = function () {
      return this.slide('next')
    }

    Carousel.prototype.prev = function () {
      return this.slide('prev')
    }

    Carousel.prototype.getActiveIndex = function(){
      this.$active = this.$element.find(".active-slide");
      this.$items = this.$active.parent().children(".slide");

      return this.$items.index(this.$active);
    }

    Carousel.prototype.pause = function(){

    }

    var old = $.fn.carousel

    $.fn.carousel = function(option){
      return this.each(function(){
        var $this = $(this);
        var data = null;
        var options = $.extend({}, Carousel.DEFAULTS, option);
        console.log(options)
        $this.data("some-data", (data = new Carousel(this, options)));
      });
    }

    $.fn.carousel.Constructor = Carousel

    $.fn.carousel.noConflict = function () {
      $.fn.carousel = old
      return this
    } 

}(jQuery)