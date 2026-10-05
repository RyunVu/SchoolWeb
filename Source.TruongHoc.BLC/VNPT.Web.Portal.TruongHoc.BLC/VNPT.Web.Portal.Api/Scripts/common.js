$(document).ready(function () {

    $('.open_tab').change(function () {
        window.open($(this).val(), '_blank');
    });

    //// Bring sidebar ontop on mobile
    //if ($(window).width() < 992 && $(".sidebar-mobile-ontop").length > 0) {
    //    $(".sidebar-mobile-ontop").insertBefore('.body-page');

    //    //// button đặt bàn trang chi tiết ẩm thực
    //    //$(".order-form .btn--mobile-fixed").click(function (e) {
    //    //    e.preventDefault();
    //    //    $('body,html').animate({ scrollTop: $('.aside-order').offset().top - $("header").height() - 26 }, 300);
    //    //});
    //};
    //$(window).resize(function () {
    //    if ($(window).width() < 992 && $(".sidebar-mobile-ontop").length > 0) {
    //        $(".sidebar-mobile-ontop").insertBefore('.body-page');
    //    } else {
    //        $(".sidebar-mobile-ontop").insertAfter('.body-page');
    //    };

    //});

    /* wow animation put it after Document.ready  */
    wow = new WOW({
        mobile: false
    });
    wow.init();

    //mmenu
    $('.icon-reponsive').click(function(event) {
        event.preventDefault();
        $("#menu-mobile").mmenu({
            /*extensions: ['pagedim-black'],*/
        });
    });
    $(window).scroll(function() {
        if ($(window).scrollTop() > 147) {
            $('nav.menu').addClass('scroll');
        } else {
            $('nav.menu').removeClass('scroll');
        }
    });
    if (window.innerWidth <= 1199) {
        $(window).scroll(function() {
            if ($(window).scrollTop() > 0) {
                $('header').addClass('scroll');
            } else {
                $('header').removeClass('scroll');
            }
        });
    }
    if (window.innerWidth <= 767) {
        $('.search-mobile').click(function(event) {
            $(this).children().toggleClass('fa-search').toggleClass('fa-times');
            $('.search-home').toggleClass('goIn');
        });
    }
    //thong tin can biet 
    $('.header-box').click(function(event) {
        $(this).find('.fa').toggleClass('rotate');
        $(this).next().slideToggle();
    });
    //show more news and project
    /*var showChar = 160;
    $('span.desc-primary').each(function() {
        var content = $(this).html();
        var c = content.substr(0, showChar);
        if (content.length > 1) {
            var html = c + '... <a href="news-details.html" title="">Xem thêm <i class="fa fa-angle-right"></i></a>';
            $(this).html(html);
        }
    });*/
    //menu cate du lich
    if (window.innerWidth <= 1199) {
        if ($('.heading-direct').length > 0) {
            $('.heading-direct .icon').click(function(event) {
                $(this).find('.menu-cate').toggleClass('goIn');
            });
        }
    } else {
        if ($('.heading-direct').length > 0) {
            $('.heading-direct .icon').hover(function() {
                $(this).find('.menu-cate').addClass('goIn');
            }, function() {
                $(this).find('.menu-cate').removeClass('goIn');
            });
        }
    }
    show_more(160, 'span.desc-primary', '... <a href="', '" title="">Xem thêm <i class="fa fa-angle-right"></i></a>');
    show_more(190, 'span.desc-answer', '... <a href="', '" title="">Xem chi tiết <i class="fa fa-angle-right"></i></a>');
    //show_more(190,'span.desc-QA','...');
});
//function show_more(number,className,htmlplus) {
//    var showChar = number;
//    $(className).each(function() {
//        var content = $(this).html();
//        var c = content.substr(0, showChar);
//        if (content.length > 1) {
//            var html = c + htmlplus;
//            $(this).html(html);
//        }
//    });
//}
function show_more(number, className, htmlplus, htmlplus1) {
    var showChar = number;
    $(className).each(function () {
        var url = $(this).closest(".box-news-cate").find("a.img").attr("href");
        var content = $(this).html();
        var c = content.substr(0, showChar);
        if (content.length > 1) {
            if (url != undefined) {
                var html = c + htmlplus + url + htmlplus1;
                $(this).html(html);
            } else {
                var html = c + htmlplus + htmlplus1;
                $(this).html(html);
            }
        }
    });
}
var config = {
    UrlImage: function (url) {
        var regExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        var value = "";
        if (!regExp.test(url)) {
            //value = "https://media.baoloctructuyen.vn/" + url;
            //value = "https://mediabaolam.baoloctructuyen.vn/" + url;
            //value = "https://mediadilinh.lamdongtructuyen.vn/" + url;
            value = '@System.Configuration.ConfigurationManager.AppSettings["DomainMedia"]' + url;
        } else {
            value = url;
        }
        return value;
    }
}
var loading = {
    
    showLoading: function () {
        $('.loading-box').show();
        $("body").css({ "pointer-events": "none" });
    },
    hideLoading: function () {
        $('.loading-box').hide();
        $("body").css({ "pointer-events": "auto" });
    },
    
}
function reply_click()
{
    alert("Thủ tục hành chính này đã được bãi bỏ bởi quyết định số 1454/QĐ-UBND ngày 04 tháng 07 năm 2019 của Chủ tịch UBND tỉnh Lâm Đồng");
}

