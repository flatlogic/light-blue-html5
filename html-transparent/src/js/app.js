window.PJAX_ENABLED = true;
window.DEBUG        = true;

//colors
//same as in _variables.scss
//keep it synchronized
var $lime = "#8CBF26",
    $red = "#e5603b",
    $redDark = "#d04f4f",
    $blue = "#6a8da7",
    $green = "#56bc76",
    $orange = "#eac85e",
    $pink = "#E671B8",
    $purple = "#A700AE",
    $brown = "#A05000",
    $teal = "#4ab0ce",
    $gray = "#666",
    $white = "#fff",
    $textColor = $gray;

//turn off charts is needed
var chartsOff = false;
if (chartsOff){
    nv.addGraph = function(){};
}

COLOR_VALUES = [$red, $orange, $green, $blue, $teal, $redDark];

window.colors = function(){
    if (!window.d3) return false;
    return d3.scale.ordinal().range(COLOR_VALUES);
}();

function keyColor(d, i) {
    if (!window.colors){
        window.colors = function(){
            return d3.scale.ordinal().range(COLOR_VALUES);
        }();
    }
    return window.colors(d.key)
}

function testData(stream_names, points_count) {
    var now = new Date().getTime(),
        day = 1000 * 60 * 60 * 24, //milliseconds
        days_ago_count = 60,
        days_ago = days_ago_count * day,
        days_ago_date = now - days_ago,
        points_count = points_count || 45, //less for better performance
        day_per_point = days_ago_count / points_count;
    return stream_layers(stream_names.length, points_count, .1).map(function(data, i) {
        return {
            key: stream_names[i],
            values: data.map(function(d,j){
                return {
                    x: days_ago_date + d.x * day * day_per_point,
                    y: Math.floor(d.y * 100) //just a coefficient
                }
            })
        };
    });
}

function closeNavigation(){
    var $accordion = $('#side-nav').find('.panel-collapse.in');
    $accordion.collapse('hide');
    $accordion.siblings(".accordion-toggle").addClass("collapsed");
    resetContentMargin();
    var $sidebar = $('#sidebar');
    if ($(window).width() < 768 && $sidebar.is('.in')){
        $sidebar.collapse('hide');
    }
}

function resetContentMargin(){
    if ($(window).width() > 767){
        $(".content").css("margin-top", '');
    }
}

function initPjax(){
    var PjaxApp = function(){
        this.pjaxEnabled = window.PJAX_ENABLED;
        this.debug = window.DEBUG;
        this.$sidebar = $('#sidebar');
        this.$content = $('.content');
        this.$loaderWrap = $('.loader-wrap');
        this.pageLoadCallbacks = {};
        this.loading = false;

        this._resetResizeCallbacks();
        this._initOnResizeCallbacks();

        if (this.pjaxEnabled){

            //prevent pjaxing if already loading
            this.$sidebar.find('a:not(.accordion-toggle):not([data-no-pjax])').on('click', $.proxy(this._checkLoading, this));
            $(document).pjax('#sidebar a:not(.accordion-toggle):not([data-no-pjax])', '.content', {
                fragment: '.content',
                type: 'GET', //use POST to prevent caching when debugging,
                timeout: 10000
            });
            $(document).on('pjax:start', $.proxy(this._changeActiveNavigationItem, this));
            $(document).on('pjax:start', $.proxy(this._resetResizeCallbacks, this));
            $(document).on('pjax:send', $.proxy(this.showLoader, this));
            $(document).on('pjax:success', $.proxy(this._loadScripts, this));
            //custom event which fires when all scripts are actually loaded
            $(document).on('pjax-app:loaded', $.proxy(this._loadingFinished, this));
            $(document).on('pjax-app:loaded', $.proxy(this.hideLoader, this));
            $(document).on('pjax:end', $.proxy(this.pageLoaded, this));
            window.onerror = $.proxy(this._logErrors, this);
        }
    };

    PjaxApp.prototype._initOnResizeCallbacks = function(){
        var resizeTimeout,
            view = this;

        $(window).resize(function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function(){
                view._runPageCallbacks(view.resizeCallbacks);
            }, 100);
        });
    };

    PjaxApp.prototype._resetResizeCallbacks = function(){
        this.resizeCallbacks = {};
    };

    PjaxApp.prototype._changeActiveNavigationItem = function(event, xhr, options){
        this.$sidebar.find('li.active').removeClass('active');

        this.$sidebar.find('a[href*="' + this.extractPageName(options.url) + '"]').each(function(){
            if (this.href === options.url){
                $(this).closest('li').addClass('active')
                    .closest('.panel').addClass('active');
            }
        });
    };

    PjaxApp.prototype.showLoader = function(){
        var view = this;
        this.showLoaderTimeout = setTimeout(function(){
            view.$content.addClass('hiding');
            view.$loaderWrap.removeClass('hide');
            setTimeout(function(){
                view.$loaderWrap.removeClass('hiding');
            }, 0)
        }, 200);
    };

    PjaxApp.prototype.hideLoader = function(){
        clearTimeout(this.showLoaderTimeout);
        this.$loaderWrap.addClass('hiding');
        this.$content.removeClass('hiding');
        var view = this;
        this.$loaderWrap.one($.support.transition.end, function () {
            view.$loaderWrap.addClass('hide');
            view.$content.removeClass('hiding');
        }).emulateTransitionEnd(200)
    };

    /**
     * Specify a function to execute when window was resized.
     * Runs maximum once in 100 milliseconds.
     * @param fn A function to execute
     */
    PjaxApp.prototype.onResize = function(fn){
        this._addPageCallback(this.resizeCallbacks, fn);
    };

    /**
     * Specify a function to execute when page was reloaded with pjax.
     * @param fn A function to execute
     */
    PjaxApp.prototype.onPageLoad = function(fn){
        this._addPageCallback(this.pageLoadCallbacks, fn);
    };

    PjaxApp.prototype.pageLoaded = function(){
        this._runPageCallbacks(this.pageLoadCallbacks);
    };

    PjaxApp.prototype._addPageCallback = function(callbacks, fn){
        var pageName = this.extractPageName(location.href);
        if (!callbacks[pageName]){
            callbacks[pageName] = [];
        }
        callbacks[pageName].push(fn);
    };

    PjaxApp.prototype._runPageCallbacks = function(callbacks){
        var pageName = this.extractPageName(location.href);
        if (callbacks[pageName]){
            _(callbacks[pageName]).each(function(fn){
                fn();
            })
        }
    };

    PjaxApp.prototype._loadScripts = function(event, data, status, xhr, options){
        var $bodyContents = $($.parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0], document, true)),
            $scripts = $bodyContents.filter('script[src]').add($bodyContents.find('script[src]')),
            $templates = $bodyContents.filter('script[type="text/template"]').add($bodyContents.find('script[type="text/template"]')),
            $existingScripts = $('script[src]'),
            $existingTemplates = $('script[type="text/template"]');

        //append templates first as they are used by scripts
        $templates.each(function() {
            var id = this.id;
            var matchedTemplates = $existingTemplates.filter(function() {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this.id === id;
            });
            if (matchedTemplates.length) return;

            var script = document.createElement('script');
            script.id = $(this).attr('id');
            script.type = $(this).attr('type');
            script.innerHTML = this.innerHTML;
            document.body.appendChild(script);
        });



        //ensure synchronous loading
        var $previous = {
            load: function(fn){
                fn();
            }
        };

        $scripts.each(function() {
            var src = this.src;
            var matchedScripts = $existingScripts.filter(function() {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this.src === src;
            });
            if (matchedScripts.length) return;

            var script = document.createElement('script');
            script.src = $(this).attr('src');
            $previous.load(function(){
                document.body.appendChild(script);
            });

            $previous = $(script);
        });

        var view = this;
        $previous.load(function(){
            $(document).trigger('pjax-app:loaded');
            view.log('scripts loaded.');
        })
    };

    PjaxApp.prototype.extractPageName = function(url){
        //credit: http://stackoverflow.com/a/8497143/1298418
        var pageName = url.split('#')[0].substring(url.lastIndexOf("/") + 1).split('?')[0];
        return pageName === '' ? 'index.html' : pageName;
    };

    PjaxApp.prototype._checkLoading = function(e){
        var oldLoading = this.loading;
        this.loading = true;
        if (oldLoading){
            this.log('attempt to load page while already loading; preventing.');
            e.preventDefault();
        } else {
            this.log(e.currentTarget.href + ' loading started.');
        }
        //prevent default if already loading
        return !oldLoading;
    };

    PjaxApp.prototype._loadingFinished = function(){
        this.loading = false;
    };

    PjaxApp.prototype._logErrors = function(){
        var errors = JSON.parse(localStorage.getItem('lb-errors')) || {};
        errors[new Date().getTime()] = arguments;
        localStorage.setItem('lb-errors', JSON.stringify(errors));
    };

    PjaxApp.prototype.log = function(message){
        if (this.debug){
            console.log(message
                    + " - " + arguments.callee.caller.toString().slice(0, 30).split('\n')[0]
                    + " - " + this.extractPageName(location.href)
            );
        }
    };

    window.PjaxApp = new PjaxApp();
}


function initDemoFunctions(){
    $(document).one('pjax:end', function(){
//        alert('The page was loaded with pjax!');
    });
}

$(function(){

    var $sidebar = $('#sidebar');

    $sidebar.on("mouseleave",function(){
        if (($(this).is(".sidebar-icons") || $(window).width() < 1049) && $(window).width() > 767){
            setTimeout(function(){
                closeNavigation();
            }, 300); // some timeout for animation
        }
    });

    //need some class to present right after click
    $sidebar.on('show.bs.collapse', function(e){
        e.target == this && $sidebar.addClass('open');
    });

    $sidebar.on('hide.bs.collapse', function(e){
        if (e.target == this) {
            $sidebar.removeClass('open');
            $(".content").css("margin-top", '');
        }
    });

    $(window).resize(function(){
        closeNavigation();
    });

    //class-switch for button-groups
    $(".btn-group > .btn[data-toggle-class]").click(function(){
        var $this = $(this),
            isRadio = $this.find('input').is('[type=radio]'),
            $parent = $this.parent();

        if (isRadio){
            $parent.children(".btn[data-toggle-class]").removeClass(function(){
                return $(this).data("toggle-class")
            }).addClass(function(){
                return $(this).data("toggle-passive-class")
            });
            $this.removeClass($(this).data("toggle-passive-class")).addClass($this.data("toggle-class"));
        } else {
            $this.toggleClass($(this).data("toggle-passive-class")).toggleClass($this.data("toggle-class"));
        }
    });


    $("#search-toggle").click(function(){
        //first hide menu if open

        if ($sidebar.data('bs.collapse')){
            $sidebar.collapse('hide');
        }

        var $notifications = $('.notifications'),
            notificationsPresent = !$notifications.is(':empty');

        $("#search-form").css('height', function(){
            var $this = $(this);
            if ($this.height() == 0){
                $this.css('height', 40);
                notificationsPresent && $notifications.css('top', 86);
            } else {
                $this.css('height', 0);
                notificationsPresent && $notifications.css('top', '');
            }
        });
    });


    //hide search field if open
    $sidebar.on('show.bs.collapse', function () {
        var $notifications = $('.notifications'),
            notificationsPresent = !$notifications.is(':empty');
        $("#search-form").css('height', 0);
        notificationsPresent && $notifications.css('top', '');
    });

    /*   Move content down when second-level menu opened */
    $("#side-nav").find("a.accordion-toggle").on('click',function(){
        if ($(window).width() < 768){
            var $this = $(this),
                $sideNav = $('#side-nav'),
                menuHeight = $sideNav.height() + parseInt($sideNav.css('margin-top')) + parseInt($sideNav.css('margin-bottom')),
                contentMargin = menuHeight + 20,
                $secondLevelMenu = $this.find("+ ul"),
                $subMenuChildren = $secondLevelMenu.find("> li"),
                subMenuHeight = $.map($subMenuChildren, function(child){ return $(child).height()})
                    .reduce(function(sum, el){ return sum + el}),
                $content = $(".content");
            if (!$secondLevelMenu.is(".in")){ //when open
                $content.css("margin-top", (contentMargin + subMenuHeight - $this.closest('ul').find('> .panel > .panel-collapse.open').height()) + 'px');
            } else { //when close
                $content.css("margin-top", contentMargin - subMenuHeight + 'px');
            }
        }
    });

    $sidebar.on('show.bs.collapse', function(e){
        if (e.target == this){
            if ($(window).width() < 768){
                var $sideNav = $('#side-nav'),
                    menuHeight = $sideNav.height() + parseInt($sideNav.css('margin-top')) + parseInt($sideNav.css('margin-bottom')),
                    contentMargin = menuHeight + 20;
                $(".content").css("margin-top", contentMargin + 'px');
            }
        }
    });

    //need some class to present right after click for submenu
    var $subMenus = $sidebar.find('.panel-collapse');
    $subMenus.on('show.bs.collapse', function(e){
        if (e.target == this){
            $(this).addClass('open');
        }
    });

    $subMenus.on('hide.bs.collapse', function(e){
        if (e.target == this){
            $(this).removeClass('open');
        }
    });

    initPjax();
    initDemoFunctions();

});

/**
 * Widgster plugin. Will be extracted to separate open source repo after next release.
 */
!function ($) {

    "use strict";

    // WIDGSTER CLASS DEFINITION
    // ======================

    var Widgster = function (el, options) {
        this.$element = $(el);
        this.$collapse = this.$element.find('[data-widgster=collapse]');
        this.$expand = this.$element.find('[data-widgster=expand]');
        this.$fullscreen = this.$element.find('[data-widgster=fullscreen]');
        this.$restore = this.$element.find('[data-widgster=restore]');
        this.options = options;
        this.collapsed = options.collapsed;
        this.fullscreened = options.fullscreened;

        this._initHandlers();

        if (this.collapsed){
            this.collapse(false);
        } else {
            this.$expand.hide();
        }

        if (this.fullscreened){
            this.fullscreen();
        } else {
            this.$restore.hide();
        }

        this.options.autoload && this.load();
        var interval = parseInt(this.options.autoload);
        if (!isNaN(interval)){
            var widgster = this;
            this._autoloadInterval = setInterval(function(){
                widgster.load();
            }, interval)
        }
    };

    Widgster.DEFAULTS = {
        collapsed: false,
        fullscreened: false,
        transitionDuration: 150,
        bodySelector: '.body',
        showLoader: true,
        autoload: false,
        loaderTemplate: '<div style="text-align: center; margin-top: 10px;">Loading...</div>',
        /**
         * provide a way to insert a prompt before removing widget
         * @param callback
         */
        closePrompt: function(callback){
            callback()
        }
    };

    Widgster.prototype.collapse = function(animate){
        animate = typeof animate == "undefined" ? true : animate;
        var e = $.Event('collapse.widgster');
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;

        var widgster = this,
            duration = animate ? this.options.transitionDuration : 0;
        this.$element.find(this.options.bodySelector).slideUp(duration, function(){
            widgster.$element.addClass('collapsed');
            widgster.$element.trigger($.Event('collapsed.widgster'));
            widgster.collapsed = true;
        });

        this.$collapse.hide();
        this.$expand.show();

        return false;
    };

    Widgster.prototype.expand = function(animate){
        animate = typeof animate == "undefined" ? true : animate;
        var e = $.Event('expand.widgster');
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;

        var widgster = this,
            duration = animate ? this.options.transitionDuration : 0;
        this.$element.find(this.options.bodySelector).slideDown(duration, function(){
            widgster.$element.removeClass('collapsed');
            widgster.$element.trigger($.Event('expanded.widgster'));
            widgster.collapsed = false;
        });

        this.$collapse.show();
        this.$expand.hide();

        return false;
    };

    Widgster.prototype.close = function(){
        //could have been remove.widgster, but http://bugs.jquery.com/ticket/14600
        var e = $.Event('close.widgster');

        this.$element.trigger(e);

        if (e.isDefaultPrevented()) return;

        this.options.closePrompt && this.options.closePrompt($.proxy(this._doClose, this));

        return false;
    };

    Widgster.prototype.load = function(){
        var e = $.Event('load.widgster');

        this.$element.trigger(e);

        if (e.isDefaultPrevented()) return;

        var widgster = this;
        this.$element.find(this.options.bodySelector).load(this.options.load, function(responseText, textStatus, xhr){
            widgster.expand();
            widgster.options.showLoader && widgster._hideLoader();
            widgster.$element.trigger($.Event('loaded.widgster', {
                responseText: responseText,
                textStatus: textStatus,
                xhr: xhr
            }))
        });
        this.options.showLoader && this._showLoader();

        return false;
    };

    Widgster.prototype.fullscreen = function(){
        var e = $.Event('fullscreen.widgster');

        this.$element.trigger(e);

        if (e.isDefaultPrevented()) return;

        this.$element.css({
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            margin: 0,
            'z-index': 10000
        });
        $('body').css('overflow', 'hidden');

        this.wasCollapsed = this.collapsed;
        this.expand(false);

        this.$fullscreen.hide();
        this.$restore.show();

        this.$collapse.hide(); this.$expand.hide();

        this.$element.addClass('fullscreened');

        this.$element.trigger($.Event('fullscreened.widgster'));

        return false;
    };

    Widgster.prototype.restore = function(){
        var e = $.Event('restore.widgster');

        this.$element.trigger(e);

        if (e.isDefaultPrevented()) return;

        this.$element.css({
            position: '',
            top: '',
            right: '',
            bottom: '',
            left: '',
            margin: '',
            'z-index': ''
        });
        $('body').css('overflow', '');

        this.$fullscreen.show();
        this.$restore.hide();

        if (this.collapsed){
            this.$collapse.hide(); this.$expand.show();
        } else {
            this.$collapse.show(); this.$expand.hide();
        }

        this.wasCollapsed && this.collapse(false);

        this.$element.removeClass('fullscreened');

        this.$element.trigger($.Event('restored.widgster'));

        return false;
    };

    Widgster.prototype._doClose = function(){

        this.$element.detach();

        var e = $.Event('closed.widgster', {$element: this.$element});

        this.$element.trigger(e);
    };

    Widgster.prototype._showLoader = function(){
        var $body = this.$element.find(this.options.bodySelector);

        this.$loaderWrap = this.$element.find('.widgster-loader-wrap');

        //create loader html if does not exist
        if (this.$loaderWrap.length == 0){
            this.$loaderWrap = $('<div class="widgster-loader-wrap" style="position: absolute; top: 0; right: 0; bottom: 0; ' +
                'left: 0; display: none"></div>');
            this.$element.append(this.$loaderWrap);
        }
        this.$loaderWrap.html(this.options.loaderTemplate);
        this.$loaderWrap.css({
            'margin-top': $body.position().top
        });
        if (!this.collapsed){
            $body.fadeTo(this.options.transitionDuration, 0);
            this.$loaderWrap.fadeIn(this.options.transitionDuration)
        }
    };

    Widgster.prototype._hideLoader = function(){
        this.$loaderWrap.fadeOut(this.options.transitionDuration);
        this.$element.find(this.options.bodySelector).fadeTo(this.options.transitionDuration, 1);
    };

    /**
     * Attach all required widgster functions to data-widgster elements.
     * @private
     */
    Widgster.prototype._initHandlers = function(){
        this.$element.on('click.collapse.widgster', '[data-widgster=collapse]', $.proxy(this.collapse, this));
        this.$element.on('click.expand.widgster', '[data-widgster=expand]', $.proxy(this.expand, this));
        this.$element.on('click.close.widgster', '[data-widgster=close]', $.proxy(this.close, this));
        this.$element.on('click.load.widgster', '[data-widgster=load]', $.proxy(this.load, this));
        this.$element.on('click.fullscreen.widgster', '[data-widgster=fullscreen]', $.proxy(this.fullscreen, this));
        this.$element.on('click.restore.widgster', '[data-widgster=restore]', $.proxy(this.restore, this));
    };


    // NAMESPACED DATA ATTRIBUTES
    // =======================

    function getNamespacedData(namespace, data){
        var namespacedData = {};
        for (var key in data){
            // key starts with namespace
            if (key.slice(0, namespace.length) == namespace){
                var namespacedKey = key.slice(namespace.length, key.length);
                namespacedKey = namespacedKey.charAt(0).toLowerCase() + namespacedKey.slice(1);
                namespacedData[namespacedKey] = data[key];
            }
        }

        return namespacedData;
    }

    // WIDGSTER PLUGIN DEFINITION
    // =======================

    $.fn.widgster = function (option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('widgster');
            var options = $.extend({}, Widgster.DEFAULTS, getNamespacedData('widgster', $this.data()), typeof option == 'object' && option);

            if (!data) $this.data('widgster', new Widgster(this, options));
            if (typeof option == 'string') data[option]();
        })
    };

    $.fn.widgster.Constructor = Widgster;


}(window.jQuery);
