/* http://keith-wood.name/localisation.html
   Localisation assistance for jQuery v1.0.4.
   Written by Keith Wood (kbwood{at}iinet.com.au) June 2007. 
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

   (function($) { // Hide scope, no $ conflict

    /* Load applicable localisation package(s) for one or more jQuery packages.
       Assumes that the localisations are named <base>-<lang>.js
       and loads them in order from least to most specific.
       For example, $.localise('mypackage');
       with the browser set to 'en-US' would attempt to load
       mypackage-en.js and mypackage-en-US.js.
       Also accepts an array of package names to process.
       Optionally specify whether or not to include the base file,
       the desired language, and/or the timeout period, e.g.
       $.localise(['mypackage1', 'yourpackage'], 
          {loadBase: true; language: 'en-AU', timeout: 300});
       @param  packages  (string or string[]) names of package(s) to load
       @param  settings  omit for the current browser language or
                         (string) code for the language to load (aa[-AA]) or
                         (object} options for the call with
                           language  (string) the code for the language
                           loadBase  (boolean) true to also load the base package or false (default) to not
                           path      (string or string[2]) the paths to the JavaScript,
                                     either as both or [base, localisations]
                           timeout   (number) the time period in milliseconds (default 500)
       @param  loadBase  (boolean, optional) true to also load the base package or false (default) to not -
                         omit this if settings is an object
       @param  path      (string or string[2], optional) the paths to the JavaScript,
                         either as both or [base, localisations] -
                         omit this if settings is an object
       @param  timeout   (number, optional) the time period in milliseconds (default 500) -
                         omit this if settings is an object */
    $.localise = function(packages, settings, loadBase, path, timeout) {
        if (typeof settings != 'object' && typeof settings != 'string') {
            timeout = path;
            path = loadBase;
            loadBase = settings;
            settings = '';
        }
        if (typeof loadBase != 'boolean') {
            timeout = path;
            path = loadBase;
            loadBase = false;
        }
        if (typeof path != 'string' && !isArray(path)) {
            timeout = path;
            path = ['', ''];
        }
        var saveSettings = {async: $.ajaxSettings.async, timeout: $.ajaxSettings.timeout};
        settings = (typeof settings != 'string' ? settings || {} :
            {language: settings, loadBase: loadBase, path: path, timeout: timeout});
        var paths = (!settings.path ? ['', ''] :
            (isArray(settings.path) ? settings.path : [settings.path, settings.path]));
        $.ajaxSetup({async: false, timeout: (settings.timeout || 500)});
        var localiseOne = function(package, lang) {
            if (settings.loadBase) {
                $.getScript(paths[0] + package + '.js');
            }
            if (lang.length >= 2) {
                $.getScript(paths[1] + package + '-' + lang.substring(0, 2) + '.js');
            }
            if (lang.length >= 5) {
                $.getScript(paths[1] + package + '-' + lang.substring(0, 5) + '.js');
            }
        };
        var lang = normaliseLang(settings.language || $.localise.defaultLanguage);
        packages = (isArray(packages) ? packages : [packages]);
        for (i = 0; i < packages.length; i++) {
            localiseOne(packages[i], lang);
        }
        $.ajaxSetup(saveSettings);
    };
    
    // Localise it!
    $.localize = $.localise;
    
    /* Retrieve the default language set for the browser. */
    $.localise.defaultLanguage = normaliseLang(navigator.language /* Mozilla */ ||
        navigator.userLanguage /* IE */);
    
    /* Ensure language code is in the format aa-AA. */
    function normaliseLang(lang) {
        lang = lang.replace(/_/, '-').toLowerCase();
        if (lang.length > 3) {
            lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
        }
        return lang;
    }
    
    /* Determine whether an object is an array. */
    function isArray(a) {
        return (a && a.constructor == Array);
    }
    
    })(jQuery);
    
    /*
     * jQuery UI selectmenu dev version
     *
     * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
     * Dual licensed under the MIT (MIT-LICENSE.txt)
     * and GPL (GPL-LICENSE.txt) licenses.
     *
     * http://docs.jquery.com/UI
     * https://github.com/fnagel/jquery-ui/wiki/Selectmenu
     */
    
    (function($) {
    
    $.widget("ui.selectmenu", {
        getter: "value",
        version: "1.8",
        eventPrefix: "selectmenu",
        options: {
            transferClasses: true,
            typeAhead: "sequential",
            style: 'dropdown',
            positionOptions: {
                my: "left top",
                at: "left bottom",
                offset: null
            },
            width: null,
            menuWidth: null,
            handleWidth: 26,
            maxHeight: null,
            icons: null,
            format: null,
            bgImage: function() {},
            wrapperElement: "<div />"
        },
    
        _create: function() {
            var self = this, o = this.options;
            this.element.addClass('invisibleselect');
            // set a default id value, generate a new random one if not set by developer
            var selectmenuId = this.element.attr( 'id' ) || 'ui-selectmenu-' + Math.random().toString( 16 ).slice( 2, 10 );
    
            // quick array of button and menu id's
            this.ids = [ selectmenuId + '-button', selectmenuId + '-menu' ];
    
            // define safe mouseup for future toggling
            this._safemouseup = true;
    
            // create menu button wrapper
            this.newelement = $( '<a />', {
                'class': this.widgetBaseClass + ' ui-widget ui-state-default ui-corner-all',
                'id' : this.ids[ 0 ],
                'role': 'button',
                'href': '#nogo',
                'tabindex': this.element.attr( 'disabled' ) ? 1 : 0,
                'aria-haspopup': true,
                'aria-owns': this.ids[ 1 ]
            });
            this.newelementWrap = $( o.wrapperElement )
                .append( this.newelement )
                .insertAfter( this.element );
            
            // transfer tabindex
            var tabindex = this.element.attr( 'tabindex' );
            if ( tabindex ) {
                this.newelement.attr( 'tabindex', tabindex );
            }
    
            // save reference to select in data for ease in calling methods
            this.newelement.data( 'selectelement', this.element );
    
            // menu icon
            this.selectmenuIcon = $( '<span class="' + this.widgetBaseClass + '-icon ui-icon"></span>' )
                .prependTo( this.newelement );
    
            // append status span to button
            this.newelement.prepend( '<span class="' + self.widgetBaseClass + '-status" />' );
    
            // make associated form label trigger focus
            $( 'label[for="' + selectmenuId + '"]' )
                .attr( 'for', this.ids[0] )
                .bind( 'click.selectmenu', function() {
                    self.newelement[0].focus();
                    return false;
                });
    
            // click toggle for menu visibility
            this.newelement
                .bind('mousedown.selectmenu', function(event) {
                    self._toggle(event, true);
                    // make sure a click won't open/close instantly
                    if (o.style == "popup") {
                        self._safemouseup = false;
                        setTimeout(function() { self._safemouseup = true; }, 300);
                    }
                    return false;
                })
                .bind('click.selectmenu', function() {
                    return false;
                })
                .bind("keydown.selectmenu", function(event) {
                    var ret = false;
                    switch (event.keyCode) {
                        case $.ui.keyCode.ENTER:
                            ret = true;
                            break;
                        case $.ui.keyCode.SPACE:
                            self._toggle(event);
                            break;
                        case $.ui.keyCode.UP:
                            if (event.altKey) {
                                self.open(event);
                            } else {
                                self._moveSelection(-1);
                            }
                            break;
                        case $.ui.keyCode.DOWN:
                            if (event.altKey) {
                                self.open(event);
                            } else {
                                self._moveSelection(1);
                            }
                            break;
                        case $.ui.keyCode.LEFT:
                            self._moveSelection(-1);
                            break;
                        case $.ui.keyCode.RIGHT:
                            self._moveSelection(1);
                            break;
                        case $.ui.keyCode.TAB:
                            ret = true;
                            break;
                        default:
                            ret = true;
                    }
                    return ret;
                })
                .bind('keypress.selectmenu', function(event) {
                    self._typeAhead(event.which, 'mouseup');
                    return true;
                })
                .bind('mouseover.selectmenu focus.selectmenu', function() {
                    if (!o.disabled) {
                        $(this).addClass(self.widgetBaseClass + '-focus ui-state-hover');
                    }
                })
                .bind('mouseout.selectmenu blur.selectmenu', function() {
                    if (!o.disabled) {
                        $(this).removeClass(self.widgetBaseClass + '-focus ui-state-hover');
                    }
                });
    
            // document click closes menu
            $(document).bind("mousedown.selectmenu", function(event) {
                self.close(event);
            });
    
            // change event on original selectmenu
            this.element
                .bind("click.selectmenu", function() {
                    self._refreshValue();
                })
                // FIXME: newelement can be null under unclear circumstances in IE8
                // TODO not sure if this is still a problem (fnagel 20.03.11)
                .bind("focus.selectmenu", function() {
                    if (self.newelement) {
                        self.newelement[0].focus();
                    }
                });
    
            // set width when not set via options
            if (!o.width) {
                o.width = this.element.outerWidth();
            }
            // set menu button width
            this.newelement.width(o.width);
    
            // hide original selectmenu element
            this.element.hide();
    
            // create menu portion, append to body		
            this.list = $( '<ul />', {
                'class': 'ui-widget ui-widget-content',
                'aria-hidden': true,
                'role': 'listbox',
                'aria-labelledby': this.ids[0],
                'id': this.ids[1]
            });
            this.listWrap = $( o.wrapperElement )
                .addClass( self.widgetBaseClass + '-menu' )
                .append( this.list )
                .appendTo( 'body' );
            
            // transfer menu click to menu button
            this.list
                .bind("keydown.selectmenu", function(event) {
                    var ret = false;
                    switch (event.keyCode) {
                        case $.ui.keyCode.UP:
                            if (event.altKey) {
                                self.close(event, true);
                            } else {
                                self._moveFocus(-1);
                            }
                            break;
                        case $.ui.keyCode.DOWN:
                            if (event.altKey) {
                                self.close(event, true);
                            } else {
                                self._moveFocus(1);
                            }
                            break;
                        case $.ui.keyCode.LEFT:
                            self._moveFocus(-1);
                            break;
                        case $.ui.keyCode.RIGHT:
                            self._moveFocus(1);
                            break;
                        case $.ui.keyCode.HOME:
                            self._moveFocus(':first');
                            break;
                        case $.ui.keyCode.PAGE_UP:
                            self._scrollPage('up');
                            break;
                        case $.ui.keyCode.PAGE_DOWN:
                            self._scrollPage('down');
                            break;
                        case $.ui.keyCode.END:
                            self._moveFocus(':last');
                            break;
                        case $.ui.keyCode.ENTER:
                        case $.ui.keyCode.SPACE:
                            self.close(event, true);
                            $(event.target).parents('li:eq(0)').trigger('mouseup');
                            break;
                        case $.ui.keyCode.TAB:
                            ret = true;
                            self.close(event, true);
                            $(event.target).parents('li:eq(0)').trigger('mouseup');
                            break;
                        case $.ui.keyCode.ESCAPE:
                            self.close(event, true);
                            break;
                        default:
                            ret = true;
                    }
                    return ret;
                })
                .bind('keypress.selectmenu', function(event) {
                    self._typeAhead(event.which, 'focus');
                    return true;
                })
                // this allows for using the scrollbar in an overflowed list
                .bind( 'mousedown.selectmenu mouseup.selectmenu', function() { return false; });
    
            // needed when window is resized
            // TODO seems to be useless, but causes errors (fnagel 01.08.11)
            // see: https://github.com/fnagel/jquery-ui/issues/147
            // $(window).bind( "resize.selectmenu", $.proxy( self._refreshPosition, this ) );
        },
    
        _init: function() {
            var self = this, o = this.options;
    
            // serialize selectmenu element options
            var selectOptionData = [];
            this.element
                .find('option')
                .each(function() {
                    var opt = $(this);
                    selectOptionData.push({
                        value: opt.attr('value'),
                        text: self._formatText(opt.text()),
                        selected: opt.attr('selected'),
                        disabled: opt.attr('disabled'),
                        classes: opt.attr('class'),
                        typeahead: opt.attr('typeahead'),
                        parentOptGroup: opt.parent('optgroup'),
                        bgImage: o.bgImage.call(opt)
                    });
                });
    
            // active state class is only used in popup style
            var activeClass = (self.options.style == "popup") ? " ui-state-active" : "";
    
            // empty list so we can refresh the selectmenu via selectmenu()
            this.list.html("");
    
            // write li's
            if (selectOptionData.length) {
                for (var i = 0; i < selectOptionData.length; i++) {
                    var thisLiAttr = { role : 'presentation' };
                    if ( selectOptionData[ i ].disabled ) {
                        thisLiAttr[ 'class' ] = this.namespace + '-state-disabled';
                    }					
                    var thisAAttr = {
                        html: selectOptionData[i].text,
                        href : '#nogo', 
                        tabindex : -1, 
                        role : 'option',
                        'aria-selected' : false
                    };
                    if ( selectOptionData[ i ].disabled ) {
                        thisAAttr[ 'aria-disabled' ] = selectOptionData[ i ].disabled;
                    }
                    if ( selectOptionData[ i ].typeahead ) {
                        thisAAttr[ 'typeahead' ] = selectOptionData[ i ].typeahead;
                    }				
                    var thisA = $('<a/>', thisAAttr);
                    var thisLi = $('<li/>', thisLiAttr)	
                        .append(thisA)				
                        .data('index', i)
                        .addClass(selectOptionData[i].classes)
                        .data('optionClasses', selectOptionData[i].classes || '')
                        .bind("mouseup.selectmenu", function(event) {
                            if (self._safemouseup && !self._disabled(event.currentTarget) && !self._disabled($( event.currentTarget ).parents( "ul>li." + self.widgetBaseClass + "-group " )) ) {
                                var changed = $(this).data('index') != self._selectedIndex();
                                self.index($(this).data('index'));
                                self.select(event);
                                if (changed) {
                                    self.change(event);
                                }
                                self.close(event, true);
                            }
                            return false;
                        })
                        .bind("click.selectmenu", function() {
                            return false;
                        })
                        .bind('mouseover.selectmenu focus.selectmenu', function(e) {
                            // no hover if diabled
                            if (!$(e.currentTarget).hasClass(self.namespace + '-state-disabled') && !$(e.currentTarget).parent("ul").parent("li").hasClass(self.namespace + '-state-disabled')) {
                                self._selectedOptionLi().addClass(activeClass);
                                self._focusedOptionLi().removeClass(self.widgetBaseClass + '-item-focus ui-state-hover');
                                $(this).removeClass('ui-state-active').addClass(self.widgetBaseClass + '-item-focus ui-state-hover');
                            }
                        })
                        .bind('mouseout.selectmenu blur.selectmenu', function() {
                            if ($(this).is(self._selectedOptionLi().selector)) {
                                $(this).addClass(activeClass);
                            }
                            $(this).removeClass(self.widgetBaseClass + '-item-focus ui-state-hover');
                        });
    
                    // optgroup or not...
                    if ( selectOptionData[i].parentOptGroup.length ) {
                        var optGroupName = self.widgetBaseClass + '-group-' + this.element.find( 'optgroup' ).index( selectOptionData[i].parentOptGroup );
                        if (this.list.find( 'li.' + optGroupName ).length ) {
                            this.list.find( 'li.' + optGroupName + ':last ul' ).append( thisLi );
                        } else {
                            $(' <li role="presentation" class="' + self.widgetBaseClass + '-group ' + optGroupName + (selectOptionData[i].parentOptGroup.attr("disabled") ? ' ' + this.namespace + '-state-disabled" aria-disabled="true"' : '"' ) + '><span class="' + self.widgetBaseClass + '-group-label">' + selectOptionData[i].parentOptGroup.attr('label') + '</span><ul></ul></li> ')
                                .appendTo( this.list )
                                .find( 'ul' )
                                .append( thisLi );
                        }
                    } else {
                        thisLi.appendTo(this.list);
                    }
    
                    // append icon if option is specified
                    if (o.icons) {
                        for (var j in o.icons) {
                            if (thisLi.is(o.icons[j].find)) {
                                thisLi
                                    .data('optionClasses', selectOptionData[i].classes + ' ' + self.widgetBaseClass + '-hasIcon')
                                    .addClass(self.widgetBaseClass + '-hasIcon');
                                var iconClass = o.icons[j].icon || "";
                                thisLi
                                    .find('a:eq(0)')
                                    .prepend('<span class="' + self.widgetBaseClass + '-item-icon ui-icon ' + iconClass + '"></span>');
                                if (selectOptionData[i].bgImage) {
                                    thisLi.find('span').css('background-image', selectOptionData[i].bgImage);
                                }
                            }
                        }
                    }
                }
            } else {
                $('<li role="presentation"><a href="#nogo" tabindex="-1" role="option"></a></li>').appendTo(this.list);
            }
            // we need to set and unset the CSS classes for dropdown and popup style
            var isDropDown = ( o.style == 'dropdown' );
            this.newelement
                .toggleClass( self.widgetBaseClass + '-dropdown', isDropDown )
                .toggleClass( self.widgetBaseClass + '-popup', !isDropDown );
            this.list
                .toggleClass( self.widgetBaseClass + '-menu-dropdown ui-corner-bottom', isDropDown )
                .toggleClass( self.widgetBaseClass + '-menu-popup ui-corner-all', !isDropDown )
                // add corners to top and bottom menu items
                .find( 'li:first' )
                .toggleClass( 'ui-corner-top', !isDropDown )
                .end().find( 'li:last' )
                .addClass( 'ui-corner-bottom' );
            this.selectmenuIcon
                .toggleClass( 'ui-icon-triangle-1-s', isDropDown )
                .toggleClass( 'ui-icon-triangle-2-n-s', !isDropDown );
    
            // transfer classes to selectmenu and list
            if ( o.transferClasses ) {
                var transferClasses = this.element.attr( 'class' ) || '';
                this.newelement.add( this.list ).addClass( transferClasses );
            }
    
            // set menu width to either menuWidth option value, width option value, or select width
            if ( o.style == 'dropdown' ) {
                this.list.width( o.menuWidth ? o.menuWidth : o.width );
            } else {
                this.list.width( o.menuWidth ? o.menuWidth : o.width - o.handleWidth );
            }
    
            // reset height to auto
            this.list.css( 'height', 'auto' );
            var listH = this.listWrap.height();
            // calculate default max height
            if ( o.maxHeight && o.maxHeight < listH ) {
                this.list.height( o.maxHeight );
            } else {
                var winH = $( window ).height() / 3;
                if ( winH < listH ) this.list.height( winH );
            }
            
            // save reference to actionable li's (not group label li's)
            this._optionLis = this.list.find( 'li:not(.' + self.widgetBaseClass + '-group)' );
    
            // transfer disabled state
            if ( this.element.attr( 'disabled' ) ) {
                this.disable();
            } else {
                this.enable()
            }
            
            // update value
            this.index( this._selectedIndex() );
    
            // needed when selectmenu is placed at the very bottom / top of the page
            window.setTimeout( function() {
                self._refreshPosition();
            }, 200 );
        },
    
        destroy: function() {
            this.element.removeData( this.widgetName )
                .removeClass( this.widgetBaseClass + '-disabled' + ' ' + this.namespace + '-state-disabled' )
                .removeAttr( 'aria-disabled' )
                .unbind( ".selectmenu" );
    
            // TODO unneded as event binding has been disabled
            // $( window ).unbind( ".selectmenu" );
            $( document ).unbind( ".selectmenu" );
    
            // unbind click on label, reset its for attr
            $( 'label[for=' + this.newelement.attr('id') + ']' )
                .attr( 'for', this.element.attr( 'id' ) )
                .unbind( '.selectmenu' );
            
            this.newelementWrap.remove();
            this.listWrap.remove();
            
            this.element.show();
    
            // call widget destroy function
            $.Widget.prototype.destroy.apply(this, arguments);
        },
    
        _typeAhead: function( code, eventType ){
            var self = this, focusFound = false, C = String.fromCharCode(code).toUpperCase();
            c = C.toLowerCase();
    
            if ( self.options.typeAhead == 'sequential' ) {
                // clear the timeout so we can use _prevChar
                window.clearTimeout('ui.selectmenu-' + self.selectmenuId);
    
                // define our find var
                var find = typeof( self._prevChar ) == 'undefined' ? '' : self._prevChar.join( '' );
    
                function focusOptSeq( elem, ind, c ){
                    focusFound = true;
                    $( elem ).trigger( eventType );
                    typeof( self._prevChar ) == 'undefined' ? self._prevChar = [ c ] : self._prevChar[ self._prevChar.length ] = c;
                }
                this.list.find( 'li a' ).each( function( i ) {
                    if ( !focusFound ) {
                        // allow the typeahead attribute on the option tag for a more specific lookup
                        var thisText = $( this ).attr( 'typeahead' ) || $(this).text();
                        if ( thisText.indexOf( find + C ) === 0 ) {
                            focusOptSeq( this, i, C );
                        } else if (thisText.indexOf(find+c) === 0 ) {
                            focusOptSeq( this, i, c );
                        }
                    }
                });
                // set a 1 second timeout for sequenctial typeahead
                // keep this set even if we have no matches so it doesnt typeahead somewhere else
                window.setTimeout( function( el ) {
                    self._prevChar = undefined;
                }, 1000, self );
    
            } else {
                // define self._prevChar if needed
                if ( !self._prevChar ) { self._prevChar = [ '' , 0 ]; }
    
                focusFound = false;
                function focusOpt( elem, ind ){
                    focusFound = true;
                    $( elem ).trigger( eventType );
                    self._prevChar[ 1 ] = ind;
                }
                this.list.find( 'li a' ).each(function( i ){
                    if (!focusFound){
                        var thisText = $(this).text();
                        if ( thisText.indexOf( C ) === 0 || thisText.indexOf( c ) === 0 ) {
                            if (self._prevChar[0] == C){
                                if ( self._prevChar[ 1 ] < i ){ focusOpt( this, i ); }
                            } else{ 
                                focusOpt( this, i ); 
                            }
                        }
                    }
                });
                this._prevChar[ 0 ] = C;
            }
        },
    
        // returns some usefull information, called by callbacks only
        _uiHash: function() {
            var index = this.index();
            return {
                index: index,
                option: $("option", this.element).get(index),
                value: this.element[0].value
            };
        },
    
        open: function(event) {
            var self = this, o = this.options;
            if ( self.newelement.attr("aria-disabled") != 'true' ) {
                self._closeOthers(event);
                self.newelement.addClass('ui-state-active');
                    
                self.listWrap.appendTo( o.appendTo );
                self.list.attr('aria-hidden', false);
                
                if ( o.style == "dropdown" ) {
                    self.newelement.removeClass('ui-corner-all').addClass('ui-corner-top');
                }
                
                self.listWrap.addClass( self.widgetBaseClass + '-open' );
                // positioning needed for IE7 (tested 01.08.11 on MS VPC Image)
                // see https://github.com/fnagel/jquery-ui/issues/147
                if ( $.browser.msie && $.browser.version.substr( 0,1 ) == 7 ) {
                    self._refreshPosition();
                }
                var selected = self.list.attr('aria-hidden', false).find('li:not(.' + self.widgetBaseClass + '-group):eq(' + self._selectedIndex() + '):visible a');
                if (selected.length) selected[0].focus();
                // positioning needed for FF, Chrome, IE8, IE7, IE6 (tested 01.08.11 on MS VPC Image)
                self._refreshPosition();			
                
                self._trigger("open", event, self._uiHash());
            }
        },
    
        close: function(event, retainFocus) {
            if ( this.newelement.is('.ui-state-active') ) {
                this.newelement
                    .removeClass('ui-state-active');
                this.listWrap.removeClass(this.widgetBaseClass + '-open');
                this.list.attr('aria-hidden', true);
                if ( this.options.style == "dropdown" ) {
                    this.newelement.removeClass('ui-corner-top').addClass('ui-corner-all');
                }
                if ( retainFocus ) {
                    this.newelement.focus();
                }
                this._trigger("close", event, this._uiHash());
            }
        },
    
        change: function(event) {
            this.element.trigger("change");
            this._trigger("change", event, this._uiHash());
        },
    
        select: function(event) {
            if (this._disabled(event.currentTarget)) { return false; }
            this._trigger("select", event, this._uiHash());
        },
    
        _closeOthers: function(event) {
            $('.' + this.widgetBaseClass + '.ui-state-active').not(this.newelement).each(function() {
                $(this).data('selectelement').selectmenu('close', event);
            });
            $('.' + this.widgetBaseClass + '.ui-state-hover').trigger('mouseout');
        },
    
        _toggle: function(event, retainFocus) {
            if ( this.list.parent().is('.' + this.widgetBaseClass + '-open') ) {
                this.close(event, retainFocus);
            } else {
                this.open(event);
            }
        },
    
        _formatText: function(text) {
            return (this.options.format ? this.options.format(text) : text);
        },
    
        _selectedIndex: function() {
            return this.element[0].selectedIndex;
        },
    
        _selectedOptionLi: function() {
            return this._optionLis.eq(this._selectedIndex());
        },
    
        _focusedOptionLi: function() {
            return this.list.find('.' + this.widgetBaseClass + '-item-focus');
        },
    
        _moveSelection: function(amt, recIndex) {
            // do nothing if disabled
            if (!this.options.disabled) {
                var currIndex = parseInt(this._selectedOptionLi().data('index') || 0, 10);
                var newIndex = currIndex + amt;
                // do not loop when using up key
    
                if (newIndex < 0) {
                    newIndex = 0;
                }
                if (newIndex > this._optionLis.size() - 1) {
                    newIndex = this._optionLis.size() - 1;
                }
                // Occurs when a full loop has been made
                if (newIndex === recIndex) { return false; }
    
                if (this._optionLis.eq(newIndex).hasClass( this.namespace + '-state-disabled' )) {
                    // if option at newIndex is disabled, call _moveFocus, incrementing amt by one
                    (amt > 0) ? ++amt : --amt;
                    this._moveSelection(amt, newIndex);
                } else {
                    return this._optionLis.eq(newIndex).trigger('mouseup');
                }
            }
        },
    
        _moveFocus: function(amt, recIndex) {
            if (!isNaN(amt)) {
                var currIndex = parseInt(this._focusedOptionLi().data('index') || 0, 10);
                var newIndex = currIndex + amt;
            } else {
                var newIndex = parseInt(this._optionLis.filter(amt).data('index'), 10);
            }
    
            if (newIndex < 0) {
                newIndex = 0;
            }
            if (newIndex > this._optionLis.size() - 1) {
                newIndex = this._optionLis.size() - 1;
            }
    
            //Occurs when a full loop has been made
            if (newIndex === recIndex) { return false; }
    
            var activeID = this.widgetBaseClass + '-item-' + Math.round(Math.random() * 1000);
    
            this._focusedOptionLi().find('a:eq(0)').attr('id', '');
    
            if (this._optionLis.eq(newIndex).hasClass( this.namespace + '-state-disabled' )) {
                // if option at newIndex is disabled, call _moveFocus, incrementing amt by one
                (amt > 0) ? ++amt : --amt;
                this._moveFocus(amt, newIndex);
            } else {
                this._optionLis.eq(newIndex).find('a:eq(0)').attr('id',activeID).focus();
            }
    
            this.list.attr('aria-activedescendant', activeID);
        },
    
        _scrollPage: function(direction) {
            var numPerPage = Math.floor(this.list.outerHeight() / this.list.find('li:first').outerHeight());
            numPerPage = (direction == 'up' ? -numPerPage : numPerPage);
            this._moveFocus(numPerPage);
        },
    
        _setOption: function(key, value) {
            this.options[key] = value;
            // set
            if (key == 'disabled') {
                this.close();
                this.element
                    .add(this.newelement)
                    .add(this.list)[value ? 'addClass' : 'removeClass'](
                        this.widgetBaseClass + '-disabled' + ' ' +
                        this.namespace + '-state-disabled')
                    .attr("aria-disabled", value);
            }
        },
    
        disable: function(index, type){
                // if options is not provided, call the parents disable function
                if ( typeof( index ) == 'undefined' ) {
                    this._setOption( 'disabled', true );
                } else {
                    if ( type == "optgroup" ) {
                        this._disableOptgroup(index);
                    } else {
                        this._disableOption(index);
                    }
                }
        },
    
        enable: function(index, type) {
                // if options is not provided, call the parents enable function
                if ( typeof( index ) == 'undefined' ) {
                    this._setOption('disabled', false);
                } else {
                    if ( type == "optgroup" ) {
                        this._enableOptgroup(index);
                    } else {
                        this._enableOption(index);
                    }
                }
        },
    
        _disabled: function(elem) {
                return $(elem).hasClass( this.namespace + '-state-disabled' );
        },
    
    
        _disableOption: function(index) {
                var optionElem = this._optionLis.eq(index);
                if (optionElem) {
                    optionElem.addClass(this.namespace + '-state-disabled')
                        .find("a").attr("aria-disabled", true);
                    this.element.find("option").eq(index).attr("disabled", "disabled");
                }
        },
    
        _enableOption: function(index) {
                var optionElem = this._optionLis.eq(index);
                if (optionElem) {
                    optionElem.removeClass( this.namespace + '-state-disabled' )
                        .find("a").attr("aria-disabled", false);
                    this.element.find("option").eq(index).removeAttr("disabled");
                }
        },
    
        _disableOptgroup: function(index) {
                var optGroupElem = this.list.find( 'li.' + this.widgetBaseClass + '-group-' + index );
                if (optGroupElem) {
                    optGroupElem.addClass(this.namespace + '-state-disabled')
                        .attr("aria-disabled", true);
                    this.element.find("optgroup").eq(index).attr("disabled", "disabled");
                }
        },
    
        _enableOptgroup: function(index) {
                var optGroupElem = this.list.find( 'li.' + this.widgetBaseClass + '-group-' + index );
                if (optGroupElem) {
                    optGroupElem.removeClass(this.namespace + '-state-disabled')
                        .attr("aria-disabled", false);
                    this.element.find("optgroup").eq(index).removeAttr("disabled");
                }
        },
    
        index: function(newValue) {
            if (arguments.length) {
                if (!this._disabled($(this._optionLis[newValue]))) {
                    this.element[0].selectedIndex = newValue;
                    this._refreshValue();
                } else {
                    return false;
                }
            } else {
                return this._selectedIndex();
            }
        },
    
        value: function(newValue) {
            if (arguments.length) {
                this.element[0].value = newValue;
                this._refreshValue();
            } else {
                return this.element[0].value;
            }
        },
    
        _refreshValue: function() {
            var activeClass = (this.options.style == "popup") ? " ui-state-active" : "";
            var activeID = this.widgetBaseClass + '-item-' + Math.round(Math.random() * 1000);
            // deselect previous
            this.list
                .find('.' + this.widgetBaseClass + '-item-selected')
                .removeClass(this.widgetBaseClass + "-item-selected" + activeClass)
                .find('a')
                .attr('aria-selected', 'false')
                .attr('id', '');
            // select new
            this._selectedOptionLi()
                .addClass(this.widgetBaseClass + "-item-selected" + activeClass)
                .find('a')
                .attr('aria-selected', 'true')
                .attr('id', activeID);
    
            // toggle any class brought in from option
            var currentOptionClasses = (this.newelement.data('optionClasses') ? this.newelement.data('optionClasses') : "");
            var newOptionClasses = (this._selectedOptionLi().data('optionClasses') ? this._selectedOptionLi().data('optionClasses') : "");
            this.newelement
                .removeClass(currentOptionClasses)
                .data('optionClasses', newOptionClasses)
                .addClass( newOptionClasses )
                .find('.' + this.widgetBaseClass + '-status')
                .html(
                    this._selectedOptionLi()
                        .find('a:eq(0)')
                        .html()
                );
    
            this.list.attr('aria-activedescendant', activeID);
        },
    
        _refreshPosition: function() {
            var o = this.options;
    
            // if its a native pop-up we need to calculate the position of the selected li
            if ( o.style == "popup" && !o.positionOptions.offset ) {
                var selected = this._selectedOptionLi();
                var _offset = "0 -" + ( selected.outerHeight() + selected.offset().top - this.list.offset().top );
            }
            // update zIndex if jQuery UI is able to process
            var zIndexElement = this.element.zIndex();
            if ( zIndexElement ) {
                this.listWrap.css( 'zIndex', zIndexElement );
            }
            this.listWrap.position({
                // set options for position plugin
                of: o.positionOptions.of || this.newelement,
                my: o.positionOptions.my,
                at: o.positionOptions.at,
                offset: o.positionOptions.offset || _offset,
                collision: o.positionOptions.collision || 'flip'
            });
        }
    });
    
    })(jQuery);
    
    /*
     * jQuery UI Multiselect
     *
     * Authors:
     *  Michael Aufreiter (quasipartikel.at)
     *  Yanick Rochon (yanick.rochon[at]gmail[dot]com)
     * 
     * Dual licensed under the MIT (MIT-LICENSE.txt)
     * and GPL (GPL-LICENSE.txt) licenses.
     * 
     * http://www.quasipartikel.at/multiselect/
     *
     * 
     * Depends:
     *	ui.core.js
     *	ui.sortable.js
     *
     * Optional:
     * localization (http://plugins.jquery.com/project/localisation)
     * scrollTo (http://plugins.jquery.com/project/ScrollTo)
     * 
     * Todo:
     *  Make batch actions faster
     *  Implement dynamic insertion through remote calls
     */
    
    
    (function($) {
    
    jQuery.widget("ui.multiselect", {
      options: {
            sortable: true,
            searchable: true,
            doubleClickable: true,
            animated: 'fast',
            show: 'slideDown',
            hide: 'slideUp',
            dividerLocation: 0.5,
            nodeComparator: function(node1,node2) {
                var text1 = node1.text(),
                    text2 = node2.text();
                return text1 == text2 ? 0 : (text1 < text2 ? -1 : 1);
            }
        },
        _create: function() {
            this.element.addClass('invisibleselect');
            this.id = this.element.attr("id");
            this.container = $('<div class="ui-multiselect ui-helper-clearfix ui-widget"></div>').insertAfter(this.element);
            this.count = 0; // number of currently selected options
            this.selectedContainer = $('<div class="selected"></div>').appendTo(this.container);
            this.availableContainer = $('<div class="available"></div>').appendTo(this.container);
            this.selectedActions = $('<div class="ui-widget-header ui-helper-clearfix"><span class="count">0 '+$.ui.multiselect.locale.itemsCount+'</span></div>').appendTo(this.selectedContainer);
            this.availableActions = $('<div class="ui-widget-header ui-helper-clearfix"><input type="text" class="search empty ui-widget-content ui-corner-all"/><span class="disponibles">Disponibles</span></div>').appendTo(this.availableContainer);
            this.selectedList = $('<ul class="selected connected-list"><li class="ui-helper-hidden-accessible"></li></ul>').bind('selectstart', function(){return false;}).appendTo(this.selectedContainer);
            this.availableList = $('<ul class="available connected-list"><li class="ui-helper-hidden-accessible"></li></ul>').bind('selectstart', function(){return false;}).appendTo(this.availableContainer);
            this.selectedActions = $('<div class="actions footer ui-widget-header ui-helper-clearfix"><a href="#" class="remove-all">'+$.ui.multiselect.locale.removeAll+'</a></div>').appendTo(this.selectedContainer);
            this.availableActions = $('<div class="actions footer ui-widget-header ui-helper-clearfix"><a href="#" class="add-all">'+$.ui.multiselect.locale.addAll+'</a></div>').appendTo(this.availableContainer);		
            
            var that = this;
    
            // set dimensions
            this.container.width(this.element.width()+1);
            this.selectedContainer.width(Math.floor(this.element.width()*this.options.dividerLocation));
            this.availableContainer.width(Math.floor(this.element.width()*(1-this.options.dividerLocation)));
    
        
            
            if ( !this.options.animated ) {
                this.options.show = 'show';
                this.options.hide = 'hide';
            }
            
            // init lists
            this._populateLists(this.element.find('option'));
            
            // make selection sortable
            if (this.options.sortable) {
                this.selectedList.sortable({
                    placeholder: 'ui-state-highlight',
                    axis: 'y',
                    update: function(event, ui) {
                        // apply the new sort order to the original selectbox
                        that.selectedList.find('li').each(function() {
                            if ($(this).data('optionLink'))
                                $(this).data('optionLink').remove().appendTo(that.element);
                        });
                    },
                    receive: function(event, ui) {
                        ui.item.data('optionLink').attr('selected', true);
                        // increment count
                        that.count += 1;
                        that._updateCount();
                        // workaround, because there's no way to reference 
                        // the new element, see http://dev.jqueryui.com/ticket/4303
                        that.selectedList.children('.ui-draggable').each(function() {
                            $(this).removeClass('ui-draggable');
                            $(this).data('optionLink', ui.item.data('optionLink'));
                            $(this).data('idx', ui.item.data('idx'));
                            that._applyItemState($(this), true);
                        });
                
                        // workaround according to http://dev.jqueryui.com/ticket/4088
                        setTimeout(function() { ui.item.remove(); }, 1);
                    }
                });
            }
            
            // set up livesearch
            if (this.options.searchable) {
                this._registerSearchEvents(this.availableContainer.find('input.search'));
            } else {
                $('.search').hide();
            }
            
            // batch actions
            this.container.find(".remove-all").click(function() {
                that._populateLists(that.element.find('option').removeAttr('selected'));
                return false;
            });
            
            this.container.find(".add-all").click(function() {
                var options = that.element.find('option').not(":selected");
                if (that.availableList.children('li:hidden').length > 1) {
                    that.availableList.children('li').each(function(i) {
                        if ($(this).is(":visible")) $(options[i-1]).attr('selected', 'selected'); 
                    });
                } else {
                    options.attr('selected', 'selected');
                }
                that._populateLists(that.element.find('option'));
                return false;
            });
        },
        destroy: function() {
            this.element.show();
            this.container.remove();
    
            $.Widget.prototype.destroy.apply(this, arguments);
        },
        _populateLists: function(options) {
            this.selectedList.children('.ui-element').remove();
            this.availableList.children('.ui-element').remove();
            this.count = 0;
    
            var that = this;
            var items = $(options.map(function(i) {
              var item = that._getOptionNode(this).appendTo(this.selected ? that.selectedList : that.availableList).show();
    
                if (this.selected) that.count += 1;
                that._applyItemState(item, this.selected);
                item.data('idx', i);
                return item[0];
        }));
            
            // update count
            this._updateCount();
            that._filter.apply(this.availableContainer.find('input.search'), [that.availableList]);
      },
        _updateCount: function() {
            this.selectedContainer.find('span.count').text(this.count+" "+$.ui.multiselect.locale.itemsCount);
        },
        _getOptionNode: function(option) {
            option = $(option);
            var node = $('<li class="ui-state-default ui-element" title="'+option.text()+'"><span class="ui-icon"/>'+option.text()+'<a href="#" class="action"><span class="ui-corner-all ui-icon"/></a></li>').hide();
            node.data('optionLink', option);
            return node;
        },
        // clones an item with associated data
        // didn't find a smarter away around this
        _cloneWithData: function(clonee) {
            var clone = clonee.clone(false,false);
            clone.data('optionLink', clonee.data('optionLink'));
            clone.data('idx', clonee.data('idx'));
            return clone;
        },
        _setSelected: function(item, selected) {
            item.data('optionLink').attr('selected', selected);
    
            if (selected) {
                var selectedItem = this._cloneWithData(item);
                item[this.options.hide](this.options.animated, function() { $(this).remove(); });
                selectedItem.appendTo(this.selectedList).hide()[this.options.show](this.options.animated);
                
                this._applyItemState(selectedItem, true);
                return selectedItem;
            } else {
                
                // look for successor based on initial option index
                var items = this.availableList.find('li'), comparator = this.options.nodeComparator;
                var succ = null, i = item.data('idx'), direction = comparator(item, $(items[i]));
    
                // TODO: test needed for dynamic list populating
                if ( direction ) {
                    while (i>=0 && i<items.length) {
                        direction > 0 ? i++ : i--;
                        if ( direction != comparator(item, $(items[i])) ) {
                            // going up, go back one item down, otherwise leave as is
                            succ = items[direction > 0 ? i : i+1];
                            break;
                        }
                    }
                } else {
                    succ = items[i];
                }
                
                var availableItem = this._cloneWithData(item);
                succ ? availableItem.insertBefore($(succ)) : availableItem.appendTo(this.availableList);
                item[this.options.hide](this.options.animated, function() { $(this).remove(); });
                availableItem.hide()[this.options.show](this.options.animated);
                
                this._applyItemState(availableItem, false);
                return availableItem;
            }
        },
        _applyItemState: function(item, selected) {
            if (selected) {
                if (this.options.sortable)
                    item.children('span').addClass('ui-icon-arrowthick-2-n-s').removeClass('ui-helper-hidden').addClass('ui-icon');
                else
                    item.children('span').removeClass('ui-icon-arrowthick-2-n-s').addClass('ui-helper-hidden').removeClass('ui-icon');
                item.find('a.action span').addClass('ui-icon-minus').removeClass('ui-icon-plus');
                this._registerRemoveEvents(item.find('a.action'));
                
            } else {
                item.children('span').removeClass('ui-icon-arrowthick-2-n-s').addClass('ui-helper-hidden').removeClass('ui-icon');
                item.find('a.action span').addClass('ui-icon-plus').removeClass('ui-icon-minus');
                this._registerAddEvents(item.find('a.action'));
            }
            
            this._registerDoubleClickEvents(item);
            this._registerHoverEvents(item);
        },
        // taken from John Resig's liveUpdate script
        _filter: function(list) {
            var input = $(this);
            var rows = list.children('li'),
                cache = rows.map(function(){
                    
                    return $(this).text().toLowerCase();
                });
            
            var term = $.trim(input.val().toLowerCase()), scores = [];
            
            if (!term) {
                rows.show();
            } else {
                rows.hide();
    
                cache.each(function(i) {
                    if (this.indexOf(term)>-1) { scores.push(i); }
                });
    
                $.each(scores, function() {
                    $(rows[this]).show();
                });
            }
        },
        _registerDoubleClickEvents: function(elements) {
            if (!this.options.doubleClickable) return;
            elements.click(function() {
                elements.find('a.action').click();
            });
        },
        _registerHoverEvents: function(elements) {
            elements.removeClass('ui-state-hover');
            elements.mouseover(function() {
                $(this).addClass('ui-state-hover');
            });
            elements.mouseout(function() {
                $(this).removeClass('ui-state-hover');
            });
        },
        _registerAddEvents: function(elements) {
            var that = this;
            elements.click(function() {
                var item = that._setSelected($(this).parent(), true);
                that.count += 1;
                that._updateCount();
                return false;
            });
            
            // make draggable
            if (this.options.sortable) {
              elements.each(function() {
                  $(this).parent().draggable({
                connectToSortable: that.selectedList,
                      helper: function() {
                          var selectedItem = that._cloneWithData($(this)).width($(this).width() - 50);
                          selectedItem.width($(this).width());
                          return selectedItem;
                      },
                      appendTo: that.container,
                      containment: that.container,
                      revert: 'invalid'
              });
              });		  
            }
        },
        _registerRemoveEvents: function(elements) {
            var that = this;
            elements.click(function() {
                that._setSelected($(this).parent(), false);
                that.count -= 1;
                that._updateCount();
                return false;
            });
         },
        _registerSearchEvents: function(input) {
            var that = this;
    
            input.focus(function() {
                $(this).addClass('ui-state-active');
            })
            .blur(function() {
                $(this).removeClass('ui-state-active');
            })
            .keypress(function(e) {
                if (e.keyCode == 13)
                    return false;
            })
            .keyup(function() {
                that._filter.apply(this, [that.availableList]);
            });
        }
    });
            
    $.extend($.ui.multiselect, {
        locale: {
            addAll:'Add all',
            removeAll:'Remove all',
            itemsCount:'items selected'
        }
    });
    
    
    })(jQuery);
    
    
    (function($) {
    
      $.fn.tagcloud = function(options) {
        var opts = $.extend({}, $.fn.tagcloud.defaults, options);
        tagWeights = this.map(function(){
          return $(this).attr("rel");
        });
        tagWeights = jQuery.makeArray(tagWeights).sort(compareWeights);
        lowest = tagWeights[0];
        highest = tagWeights.pop();
        range = highest - lowest;
        if(range === 0) {range = 1;}
        // Sizes
        if (opts.size) {
          fontIncr = (opts.size.end - opts.size.start)/range;
        }
        // Colors
        if (opts.color) {
          colorIncr = colorIncrement (opts.color, range);
        }
        return this.each(function() {
          weighting = $(this).attr("rel") - lowest;
          if (opts.size) {
            $(this).css({"font-size": opts.size.start + (weighting * fontIncr) + opts.size.unit});
          }
          if (opts.color) {
            $(this).css({"color": tagColor(opts.color, colorIncr, weighting)});
          }
        });
      };
    
      $.fn.tagcloud.defaults = {
        size: {start: 14, end: 18, unit: "pt"}
      };
    
      // Converts hex to an RGB array
      function toRGB (code) {
        if (code.length == 4) {
          code = jQuery.map(/\w+/.exec(code), function(el) {return el + el; }).join("");
        }
        hex = /(\w{2})(\w{2})(\w{2})/.exec(code);
        return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
      }
    
      // Converts an RGB array to hex
      function toHex (ary) {
        return "#" + jQuery.map(ary, function(i) {
          hex =  i.toString(16);
          hex = (hex.length == 1) ? "0" + hex : hex;
          return hex;
        }).join("");
      }
    
      function colorIncrement (color, range) {
        return jQuery.map(toRGB(color.end), function(n, i) {
          return (n - toRGB(color.start)[i])/range;
        });
      }
    
      function tagColor (color, increment, weighting) {
        rgb = jQuery.map(toRGB(color.start), function(n, i) {
          ref = Math.round(n + (increment[i] * weighting));
          if (ref > 255) {
            ref = 255;
          } else {
            if (ref < 0) {
              ref = 0;
            }
          }
          return ref;
        });
        return toHex(rgb);
      }
    
      function compareWeights(a, b)
      {
        return a - b;
      }
    
    })(jQuery);
    
    
    
    
    jQuery(document).ready(function($) {
        
        
        function equalHeight(group) {
            var tallest = 0;
            group.each(function() {
                var thisHeight = $(this).height();
                if(thisHeight > tallest) {
                    tallest = thisHeight;
                }
            });
            group.height(tallest);
        }
        
        if (jQuery('#siteSearchInput').length > 0) {
            defaultSearchValue = jQuery('#siteSearchInput')[0].value;
            jQuery('#siteSearchInput').focus(function() {
                if (jQuery(this)[0].value === defaultSearchValue) {
                    jQuery(this)[0].value = '';
                }
            });
            jQuery('#siteSearchInput').blur(function() {
                if (jQuery(this)[0].value === '') {
                    jQuery(this)[0].value = defaultSearchValue;
                }
            });
        }
    
        var maxHeight = 0;
        jQuery('.igualarhermanos > .columnGroup > .column ').each(function(){
            jQuery(this).children().each(function() {
                if (jQuery(this).height() > maxHeight) {
                    maxHeight = jQuery(this).height();
                }
            });
        });	
    
        if (maxHeight) {
            jQuery('.igualarhermanos > .columnGroup > .column ').children().each(function() {
                jQuery(this).height(maxHeight + 'px');
            });
        }
    
        maxHeight = 0;
        jQuery('.igualarhijos .columnGroup > .column ').each(function(){
            jQuery(this).children().each(function() {
                if (jQuery(this).height() > maxHeight) {
                    maxHeight = jQuery(this).height();
                }
            });
        });	
        if (maxHeight) {
            jQuery('.igualarhijos .columnGroup > .column ').children().each(function() {
                jQuery(this).height(maxHeight + 'px');
            });
        }
    
        maxHeight = 0;
        jQuery('.flotante.izquierdo > div,.flotante.derecho > div').each(function(){
            jQuery(this).each(function() {
                if (jQuery(this).height() > maxHeight) {
                    maxHeight = jQuery(this).height();
                }
            });
        });	
        if (maxHeight) {
            jQuery('.flotante.izquierdo > div,.flotante.derecho > div').each(function() {
                        jQuery(this).height(maxHeight + 'px');
            });
        }	
        
        
        /*
        if($("#f1f").length>0){
            maxHeight = 0;
            jQuery('#f1f #generatedContent-1,#f1f .centroauxiliar').each(function(){
                jQuery(this).each(function() {
                    if (jQuery(this).height() > maxHeight) {
                        maxHeight = jQuery(this).height();
                    }
                });
            });	
            if (maxHeight) {
                jQuery('f1f #generatedContent-1,#f1f .centroauxiliar').each(function() {
                            jQuery(this).height(maxHeight + 'px');
                });
            }	
            
        
        }
        if($("#f1d").length>0){
        maxHeight = 0;
            jQuery('#f1d #generatedContent-1,#f1d .centroauxiliar').each(function(){
                if (jQuery(this).height() > maxHeight) {
                    maxHeight = jQuery(this).height();
                }
            });	
            if (maxHeight) {
                jQuery('#f1d #generatedContent-1,#f1d .centroauxiliar').each(function() {
                            jQuery(this).height(maxHeight + 'px');
                });
            }
        }
        */
        
        
        
        //equalHeight(jQuery('#f1f #generatedContent-1,#f1f .centroauxiliar'))
        //equalHeight(jQuery('#f1d #generatedContent-1,#f1d .centroauxiliar'))
        
        maxHeight = 0;
        jQuery('.encuesta').each(function(){
            if (jQuery(this).height() > maxHeight) {
                maxHeight = jQuery(this).height();
            }
        });	
        if (maxHeight) {
            jQuery('.encuesta').each(function() {
                        jQuery(this).height(maxHeight + 'px');
            });
        }	
        
        
        
        
        
        
        jQuery('.quiz .encuesta_radio_inner').bind('click',function(e){
            
            if($(this).parent().next().css('display')=='none'){
                $(this).parent().parent().parent().parent().parent().parent().parent().parent().find('input').css('display','none')
                $(this).parent().parent().parent().parent().parent().parent().parent().parent().find('.encuesta_radio_inner').prepend('<img />')
                $(this).find('label').css('text-decoration','underline');
                $(this).parent().find('img').attr('src', 'fileadmin/img/wrong.png');
                $(this).parent().find('.ok').parent().find('img').attr('src', 'fileadmin/img/right.png');
                $(this).parent().next().css('display','block')
                
            }
        });
        /*
    
        jQuery('.tagCloud a').tagcloud({
            
            size: {start: 14, end: 18, unit: "px"},
            color: {start: '#000', end: '#000'}
          });
    console.log("·HHASH")
        */
        
        
        
    
     
         
        
    
        if($("#tx-srfeuserregister-pi1-gustos").length>0){
            
            if($("#gustosseleccionados").length>0){
                var gustos=$("#gustosseleccionados").val();
                gustos=gustos.split(',');
                gustos.pop();
                for(i=0;i<gustos.length;i++){
                    $("#tx-srfeuserregister-pi1-gustos").find('option[value="'+gustos[i]+'"]').attr("selected","selected")
                }
            }
    
        }
    $('#tx-srfeuserregister-pi1-date_of_birth').on('keypress',function(e){
        e.preventDefault();
    });
        
        //$('#tx-srfeuserregister-pi1-image-0').customFileInput(); 
        $( "#tx-srfeuserregister-pi1-date_of_birth" ).datepicker({ dateFormat: 'dd-mm-yy', changeMonth: true,
            changeYear: true,
            yearRange: "-99:-18"
     });
    var aux=$('.tx-srfeuserregister-pi1-file-view').attr('href');
    $("#imagenperfil").append('<img class="avatar"/>')
    $("#imagenperfil img").attr('src',aux);
    
    $("#imagenperfil img").bind('click',function(){
        
        $("body").append('<div id="dialogo"><img src="" /></div>')
    
        $("#dialogo img").attr('src',aux);
        $("#dialogo").dialog({
            modal: true,
            width: 'auto',
            resizable: false
    
        });
        
    })	
        
    });
    
    
    
    jQuery(document).ready(function($) {
        $.extend($.ui.multiselect.locale, {
            addAll:'Agregar todos',
            removeAll:'Eliminar todos',
            itemsCount:'Seleccionados'
        });
        
        $('select[multiple]:not([id=tx-srfeuserregister-pi1-gustos])').multiselect();
        
        if($("#tx-srfeuserregister-pi1-gustos").length>0){	
            $.extend($.ui.multiselect.locale, {
                addAll:'Agregar todos',
                removeAll:'Eliminar todos',
                itemsCount:'Gustos seleccionados'
            });		
            $("#tx-srfeuserregister-pi1-gustos").multiselect();	
        }	
        
    });