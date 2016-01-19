/// <reference path="jquery-2.0.3.js"/>
// Uses CommonJS, AMD or browser globals to create a jQuery plugin.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    function Textifyed(el, options) {
        var opts = $.extend({}, $.fn.textifyed.defaults, options);
        this.text = opts.text;
        this.placeholder = opts.placeholder;
        this.div = $(opts.div);
        this.textarea = $(el);
        this.$el = $(el);
        this.btnDone = this.div.siblings('.btnDone');
        this.btnCancel = this.div.siblings('.btnCancel');
        this.trigger = opts.trigger;
        this.Editor = opts.Editor;
        this.init();
    };

    Textifyed.prototype = {
        lessText: ' Less...',
        moreText: ' More...',
        constructor: Textifyed,
        _events: [],
        _attachEvents: function () {
            var divEventObj = {};
            divEventObj[$(this.trigger).selector] = $.proxy(this.notesDivClick, this);
            this._events = [
                [this.div, divEventObj],
                [this.btnDone, { click: $.proxy(this.done, this) }],
                [this.btnCancel, { click: $.proxy(this.cancel, this) }]
            ];
            
            for (var i = 0, el, ev; i < this._events.length; i++) {
                el = this._events[i][0];
                ev = this._events[i][1];
                el.on(ev);
            }
        },
        init: function () {
            if (this.Editor) {
                this.attachEditor();
                //The custom even takes some time to fire so let's hide all the textarea controls right away rather than waiting 
                this.showDivHideTextarea();
            } else {
                this.setNotes();
            }
            
            this._attachEvents();
        },
        setTextarea: function() {
            this.editorId = this.textarea ? $(this.textarea).attr('id') : this.$el.attr('id');
            this.textarea = tinymce.get(this.editorId);
            this.setNotes();
        },
        getTextareaVal: function() {
            return this.editor != null ? this.textarea.getContent() : this.textarea.val();
        },
        setTextareaVal: function() {
            if ($.isFunction(this.textarea.setContent)) {
                this.textarea.setContent(this.text);
            } else {
                this.textarea.val(this.text);
            }
        },
        attachEditor: function () {
            this.textarea.on('custom:init', $.proxy(this.setTextarea, this));
            this.editor = new this.Editor(this.textarea);
        },
        setNotes: function () {
            if (this.text !== '' && this.text != null) {
                this.div.html($('<pre>').append(this.text)).removeClass('muted');
                this.setTextareaVal();
            } else {
                this.div.show().addClass('muted').html(this.placeholder);
            }

            this.showDivHideTextarea();
            this.collapse();
        },
        showDivHideTextarea: function () {
            this.btnDone.hide();
            this.btnCancel.hide();
            this.div.show().css({ 'height': 'auto', 'padding-top': '5px' });
            this.textarea.hide();
        },
        hideDivShowTextarea: function () {
            //If there is an Editor constructor but this.textarea still the element (not the tinyMCE instance) then attach the tinyMCE editor instance to this.textarea
            if (this.Editor && this.textarea === this.$el) {
                //this.attachEditor ends up collapsing the div, and throws off div.height. 
                //So if the div was expanded, we will expand it again by firing the click event on the more button
                var expanded = this.btnMore != null && this.btnMore.text() === this.lessText;
                this.attachEditor();

                if (expanded) {
                    this.btnMore.text(this.moreText).click();
                }
            }

            var div = this.div,
                divHeight = div.height(),
                textareaHeight = divHeight > 100 ? divHeight : '100';

            div.hide();
            this.textarea.show();
            
            if (this.editor == null) {
                this.textarea.height(textareaHeight + 'px').focus();
            } else {
                this.textarea.theme.resizeTo('100%', textareaHeight);
                this.div.next('.mce-container').css({ 'max-width': '800px' });
                this.textarea.focus();
            }

            this.btnDone.show();
            this.btnCancel.show();
            this.div.siblings('.moreLink').hide();
        },
        notesDivClick : function() {
            this.hideDivShowTextarea();
            this.div.trigger('textifyed:notesDivClick');
        },
        done : function (e) {
            var val = this.getTextareaVal(),
            $el = $(e.currentTarget);
            $el.trigger('textifyed:done', val);

            this.text = $.trim(val);
            
            this.showDivHideTextarea();
            this.setNotes();
            this.collapse();
        },
        cancel: function (e) {
            //Reset the content on cancel
            this.setTextareaVal();

            var $el = $(e.currentTarget);
            $el.trigger('textifyed:cancel');

            this.showDivHideTextarea();
            this.setNotes();
            this.collapse();
        },
        collapse : function () {
            var item = this.div;
            var lineHeight = parseInt(item.css('line-height')) * 3;
            var height = item.height();
            if (lineHeight < height) {
                item.css({ 'height': lineHeight + 'px', overflow: 'hidden' });

                if (item.siblings('.moreLink').length == 0) {
                    var actualTextarea = this.editor ? this.textarea : this.div.nextAll('textarea').first();
                    actualTextarea.after("<a href='#' class='moreLink'> More...</a>");
                } else {
                    item.siblings('.moreLink').text(this.moreText).show();
                }
            }
            this.btnMore = item.siblings('.moreLink').length > 0 ? item.siblings('.moreLink') : null;
            
            if (this.btnMore != null) {
                this.btnMore
                    .off('click', this.moreLessToggle)
                    .on('click', $.proxy(this.moreLessToggle, this));
            }
        },
        moreLessToggle: function (e) {
            e.preventDefault();
            var toggle = $(e.currentTarget);
            var item = this.div;
            if (toggle.text() === this.moreText) {
                toggle.text(this.lessText);
                item.css({ 'overflow': 'auto', 'height': 'auto' });
                this.expanded = true;
            } else {
                toggle.text(this.moreText);
                this.collapse();
            }
        }
    };

    $.fn.textifyed = function (option) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
                data = $this.data('textifyed'),
                options = typeof option == 'object' && option;
            if (!data) {
                $this.data('textifyed', (data = new Textifyed(this, options)));
            }

            if (typeof option == 'string' && typeof data[option] == 'function') {
                data[option].apply(data, args);
            }
        });
    };

    $.fn.textifyed.defaults = {
        trigger: 'click',
        placeholder: 'Click to add text..',
        text: '',
        div: null,
        Editor: null
    };
}));
