
(function ($) {
    $.fn.Hotnews = function (options) {
        var self = $(this);
        var defaults = { time: 5000, effect: 'default', count: 4 };
        var opts = jQuery.extend(defaults, options);
        var itemContainer = self.find('.HotnewsScroll');
        var container = $(this).find(".HotnewsScroll").first();
        var list = container.children(".HotnewsList").first();
        var items = list.children(".HotnewsItem");

        
        var n = 0;
        for (var i = 0; i < items.length; i++) {
            n += items[i].scrollHeight;
        }
        //-----------------------------------------------
        var buttonState = function () {
            if (itemContainer.scrollTop() <= 0) {
                btnDown.hide();
                btnUp.show();
            }
            else if ($(".HotnewsScroll").scrollTop() + $(".HotnewsScroll").outerHeight(true) >= n) {
                btnUp.hide();
                btnDown.show();
            }
            else {
                btnDown.show();
                btnUp.show();
            }
            
        }
        var createScrollButton = function () {
            btnUp = $('<div class="scrollup"></div>').appendTo(itemContainer);
            btnDown =$('<div class="scrolldown"></div>').appendTo(itemContainer);

/*            
btnUp = itemContainer.find('.scrollup').css({ top: itemContainer.position().top + itemContainer.height() - 25, left: itemContainer.width() - 22 });
            btnDown = itemContainer.find('.scrolldown').css({ top: itemContainer.position().top + 15, left: itemContainer.width() - 22 });

*/
            btnUp.click(function () {
                var targetOffset = $(itemContainer).scrollTop();
                $(itemContainer).animate({ scrollTop: targetOffset + itemContainer.innerHeight() / 2 }, 100);
                buttonState();
            });
            btnDown.click(function () {
                var targetOffset = $(itemContainer).scrollTop();
                $(itemContainer).animate({ scrollTop: targetOffset - itemContainer.innerHeight() / 2 }, 100);
                buttonState();
            });
            btnDown.hide();
            btnUp.hide();

        };
        //------------------------------------end button scroll
        if (items.length > opts.count) {
            container.height($(items.first()).outerHeight() * opts.count);
            if (opts.effect == "fade") {
                var startIndex = 0;
                if (items.length == startIndex)
                    startIndex = items.length - opts.count;
                var getNextIndex = function (i, s) {
                    return (s + i) % items.length;
                }

                items.each(function (i, j) {
                    if (i >= opts.count)
                        $(this).fadeOut(0);
                });

                var changeFade = function () {
                    var i = startIndex;
                    var k = i;
                    while (i != getNextIndex(startIndex, opts.count)) {
                        $(items[i]).fadeOut(500, function () {
                            $(items[getNextIndex(k, opts.count)]).fadeIn(500);
                            k++;
                        });
                        i = getNextIndex(i, 1);
                    }
                    startIndex = i;
                }
                var call = setInterval(changeFade, 5000);
                container.hover(function () {
                    clearInterval(call);
                }, function () {
                    call = setInterval(changeFade, 5000);
                });
            }
            else {
                list.height(list.height() + container.height());
                var items = list.children(".HotnewsItem");
                list.height(Math.ceil(list.height() / container.height()) * container.height());
                var backward = (Math.ceil(items.length / opts.count) - 1) * opts.count;
                var position = 0;
                var i = 1;
                var tmpHeight = 0;
                var first = true;
                var scrollStep = function () {
                    var scroll = 0;
                    position += i * opts.count;
                    for (var j = 0; j < position; j++) {
                        scroll += $(items[j]).outerHeight();
                    }
                    list.animate({ opacity: 0.4 }, 100);
                    container.animate({ scrollTop: scroll }, 500, function () {
                        list.animate({ opacity: 1 }, 100);
                        //scrollStop();
                    });
                    if ((position == 0 && !first) || position == backward) {
                        i = -1 * i;
                        first = false;
                    }
                };

                var call = setInterval(scrollStep, opts.time);
                container.hover(function () {
                    clearInterval(call);
                }, function () {
                    call = setInterval(scrollStep, opts.time);
                });
            }

        }

        itemContainer.mouseover(function () {
            buttonState();

/*            
btnUp.css({ bottom: itemContainer.position().top + 5, left: (container.position().left + container.width() / 2) });
            btnDown.css({ bottom: itemContainer.position().top + container.height(), left: (container.position().left + container.width() / 2) });
*/
        });
        itemContainer.mouseout(function (ev) {
            e = (window.event) ? window.event : ev;
            if (e.clientX <= $(this).offset().left || e.clientX >= ($(this).offset().left + $(this).width()) || e.clientY <= $(this).offset().top || e.clientY >= ($(this).offset().top + $(this).height())) {
                btnDown.hide();
                btnUp.hide();
            }

        });
        createScrollButton();
    };
})(jQuery);
