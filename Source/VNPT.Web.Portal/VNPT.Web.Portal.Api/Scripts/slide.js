//slidehome
$('.carousel-home').owlCarousel({
    loop: true,
    smartSpeed: 1000,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    margin: 0,
    dots: false,
    nav: true,
    items: 1,
    autoplay: true,
    autoplayTimeout: 5000,
});

//slide-news-home
$('.slide-news-home').owlCarousel({
    loop: false,
    margin: 30,
    dots: false,
    nav: true,
    autoplay: true,
    autoplayTimeout: 5000,
    smartSpeed: 800,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 3,
            nav: true,
            loop: true,
            margin: 16,
        }
    }
});
//slide-travel-home
//$('.slide-travel-home').owlCarousel({
//    loop: false,
//    margin: 30,
//    dots: false,
//    nav: true,
//    autoplay: true,
//    autoplayTimeout: 5000,
//    smartSpeed: 800,
//    responsiveClass: true,
//    items: 1,
//});
$('.slide-video').owlCarousel({
    loop: false,
    margin: 30,
    dots: false,
    nav: true,
    autoplay: true,
    autoplayTimeout: 5000,
    smartSpeed: 800,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true
        },
        600: {
            items: 1,
            nav: true
        },
        1000: {
            items: 1,
            nav: true,
            loop: true,
            margin: 16,
        }
    }
});
