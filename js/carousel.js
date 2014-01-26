+function($) {
  "use strict";

  var Carousel = function(element, options){
    this.$element = $(element);
    this.options = options;
    this.$pagination = this.$element.parent().find(".carousel-pagination")
    this.$paginationIndicators = this.$pagination.children();
    this.$active     =
    this.$items      = null;
    this.$prevButton = this.$element.parent().find(".caurosel-previous-button");
    this.$nextButton = this.$element.parent().find(".caurosel-next-button");
    var that = this;

    this.$prevButton.on("click", $.proxy(this.prev, this));
    this.$nextButton.on("click", $.proxy(this.next, this));
    this.$paginationIndicators.on("click", function(){
      var $this = $(this);
      var positionToSlide = that.$paginationIndicators.index($this);
      that.to(positionToSlide);
    });
  }

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true
  }

  Carousel.prototype.to = function(position){
    var that = $(this);
    var activeIndex = this.getActiveIndex();
    if (position > this.$items.length - 1 || position < 0) return;

    return this.slide(position > activeIndex ? "next" : "prev", $(this.$items[position]))
  }

  Carousel.prototype.slide = function(type, next){
    var $active   = this.$element.find('.active-slide')
    var $next     = next || $active[type]()
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      $next = this.$element.find(".slide")[fallback]();
    }

    if ($next.hasClass("active-slide")) return;

    var e = $.Event('slide.bs.carousel', { 
      relatedTarget: $next[0], direction: direction 
    })

    if (this.$pagination.length) {
      this.$pagination.find(".active").removeClass("active");
      this.$element.one('slid.bs.carousel', function () {
        var $nextPageIndicator = $(that.$pagination.children()[that.getActiveIndex()]);
        $nextPageIndicator && $nextPageIndicator.addClass("active")
      })
    }

    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return
    $next.addClass(type)
    $next[0].offsetWidth // force reflow
    $active.addClass(direction)
    $next.addClass(direction)
    $active
      .one("start", function () {
        $next.removeClass([type, direction].join(' ')).addClass('active-slide')
        $active.removeClass(['active-slide', direction].join(' '))
        setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
      })

    setTimeout(function(){ $active.trigger("start") }, 600)
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

  var old = $.fn.carousel

  $.fn.carousel = function(option){
    return this.each(function(){
      var options = $.extend({}, Carousel.DEFAULTS, option);
      var carousel = new Carousel(this, options)
    });
  }

  $.fn.carousel.Constructor = Carousel

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }
}(jQuery)