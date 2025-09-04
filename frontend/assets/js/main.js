! function(e) {
    "use strict";

    function t(t) {
        e(t).length > 0 && e(t).each((function() {
            var t = e(this).find("a");
            e(this).find(t).each((function() {
                e(this).on("click", (function() {
                    var t = e(this.getAttribute("href"));
                    t.length && (event.preventDefault(), e("html, body").stop().animate({
                        scrollTop: t.offset().top - 10
                    }, 1e3))
                }))
            }))
        }))
    }
    if (e(window).on("load", (function() {
            e(".preloader").fadeOut(), new WOW({
                boxClass: "wow",
                animateClass: "animated",
                offset: 0,
                mobile: !1,
                live: !0
            }).init()
        })), e(".preloader").length > 0 && e(".preloaderCls").each((function() {
            e(this).on("click", (function(t) {
                t.preventDefault(), e(".preloader").css("display", "none")
            }))
        })), e.fn.thmobilemenu = function(t) {
            var a = e.extend({
                menuToggleBtn: ".th-menu-toggle",
                bodyToggleClass: "th-body-visible",
                subMenuClass: "th-submenu",
                subMenuParent: "menu-item-has-children",
                thSubMenuParent: "th-item-has-children",
                subMenuParentToggle: "th-active",
                meanExpandClass: "th-mean-expand",
                appendElement: '<span class="th-mean-expand"></span>',
                subMenuToggleClass: "th-open",
                toggleSpeed: 400
            }, t);
            return this.each((function() {
                var t = e(this);

                function n() {
                    t.toggleClass(a.bodyToggleClass);
                    var n = "." + a.subMenuClass;
                    e(n).each((function() {
                        e(this).hasClass(a.subMenuToggleClass) && (e(this).removeClass(a.subMenuToggleClass), e(this).css("display", "none"), e(this).parent().removeClass(a.subMenuParentToggle))
                    }))
                }
                t.find("." + a.subMenuParent).each((function() {
                    var t = e(this).find("ul");
                    t.addClass(a.subMenuClass), t.css("display", "none"), e(this).addClass(a.subMenuParent), e(this).addClass(a.thSubMenuParent), e(this).children("a").append(a.appendElement)
                }));
                var o = "." + a.thSubMenuParent + " > a";
                e(o).each((function() {
                    e(this).on("click", (function(t) {
                        var n, o;
                        t.preventDefault(), n = e(this).parent(), (o = n.children("ul")).length > 0 && (n.toggleClass(a.subMenuParentToggle), o.slideToggle(a.toggleSpeed), o.toggleClass(a.subMenuToggleClass))
                    }))
                })), e(a.menuToggleBtn).each((function() {
                    e(this).on("click", (function() {
                        n()
                    }))
                })), t.on("click", (function(e) {
                    e.stopPropagation(), n()
                })), t.find("div").on("click", (function(e) {
                    e.stopPropagation()
                }))
            }))
        }, e(".th-menu-wrapper").thmobilemenu(), e(window).scroll((function() {
            e(this).scrollTop() > 500 ? (e(".sticky-wrapper").addClass("sticky"), e(".category-menu").addClass("close-category")) : (e(".sticky-wrapper").removeClass("sticky"), e(".category-menu").removeClass("close-category"))
        })), e(".menu-expand").each((function() {
            e(this).on("click", (function(t) {
                t.preventDefault(), e(".category-menu").toggleClass("open-category")
            }))
        })), t(".onepage-nav"), t(".scroll-down"), e(".scroll-top").length > 0) {
        var a = document.querySelector(".scroll-top"),
            n = document.querySelector(".scroll-top path"),
            o = n.getTotalLength();
        n.style.transition = n.style.WebkitTransition = "none", n.style.strokeDasharray = o + " " + o, n.style.strokeDashoffset = o, n.getBoundingClientRect(), n.style.transition = n.style.WebkitTransition = "stroke-dashoffset 10ms linear";
        var s = function() {
            var t = e(window).scrollTop(),
                a = e(document).height() - e(window).height(),
                s = o - t * o / a;
            n.style.strokeDashoffset = s
        };
        s(), e(window).scroll(s);
        jQuery(window).on("scroll", (function() {
            jQuery(this).scrollTop() > 50 ? jQuery(a).addClass("show") : jQuery(a).removeClass("show")
        })), jQuery(a).on("click", (function(e) {
            return e.preventDefault(), jQuery("html, body").animate({
                scrollTop: 0
            }, 750), !1
        }))
    }

    function i(e) {
        const t = e.slides[e.activeIndex];
        if (!t || t.classList.contains("swiper-slide-duplicate")) return;
        t.querySelectorAll('[data-ani="spinCenter"]').forEach((e => {
            e.classList.remove("animate-active"), e.offsetWidth, setTimeout((() => {
                e.classList.add("animate-active")
            }), 10)
        }))
    }
    e("[data-bg-src]").length > 0 && e("[data-bg-src]").each((function() {
        var t = e(this).attr("data-bg-src");
        e(this).css("background-image", "url(" + t + ")"), e(this).removeAttr("data-bg-src").addClass("background-image")
    })), e("[data-bg-color]").length > 0 && e("[data-bg-color]").each((function() {
        var t = e(this).attr("data-bg-color");
        e(this).css("background-color", t), e(this).removeAttr("data-bg-color")
    })), e("[data-theme-color]").length > 0 && e("[data-theme-color]").each((function() {
        var t = e(this).attr("data-theme-color");
        e(this).get(0).style.setProperty("--theme-color", t), e(this).removeAttr("data-theme-color")
    })), e("[data-border]").each((function() {
        var t = e(this).data("border");
        e(this).css("--th-border-color", t)
    })), e("[data-mask-src]").length > 0 && e("[data-mask-src]").each((function() {
        var t = e(this).attr("data-mask-src");
        e(this).css({
            "mask-image": "url(" + t + ")",
            "-webkit-mask-image": "url(" + t + ")"
        }), e(this).addClass("bg-mask"), e(this).removeAttr("data-mask-src")
    })), e(".th-slider").each((function() {
        var t = e(this),
            a = e(this).data("slider-options"),
            n = t.find(".slider-prev"),
            o = t.find(".slider-next"),
            s = t.find(".slider-pagination").get(0),
            r = t.find(".slider-pagination2").get(0),
            l = a.paginationType || "bullets",
            c = a.autoplay,
            d = {
                slidesPerView: 1,
                spaceBetween: a.spaceBetween || 24,
                loop: !1 !== a.loop,
                speed: a.speed || 1e3,
                autoplay: c || {
                    delay: 6e3,
                    disableOnInteraction: !1
                },
                navigation: {
                    nextEl: o.get(0),
                    prevEl: n.get(0)
                },
                pagination: {
                    el: s,
                    type: l,
                    clickable: !0,
                    renderBullet: function(e, t) {
                        var a = e + 1;
                        return '<span class="' + t + '" aria-label="Go to Slide ' + (a < 10 ? "0" + a : a) + '"></span>'
                    }
                },
                on: {
                    init: function() {
                        i(this);
                        var t = this.el.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)").length;
                        r && e(r).html('<span class="current-slide">01</span> <span class="total-slides">' + (t < 10 ? "0" + t : t) + "</span>")
                    },
                    slideChange: function() {
                        i(this);
                        var t = this.realIndex + 1,
                            a = this.el.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)").length;
                        r && e(r).html('<span class="current-slide">' + (t < 10 ? "0" + t : t) + '</span> <span class="total-slides">' + (a < 10 ? "0" + a : a) + "</span>")
                    }
                }
            },
            p = e.extend({}, d, a);
        new Swiper(t.get(0), p);
        e(".slider-area").length > 0 && e(".slider-area").closest(".container").parent().addClass("arrow-wrap")
    })), e("[data-slider-prev], [data-slider-next]").on("click", (function() {
        var t = e(this).data("slider-prev") || e(this).data("slider-next"),
            a = e(t);
        if (a.length) {
            var n = a[0].swiper;
            n && (e(this).data("slider-prev") ? n.slidePrev() : n.slideNext())
        }
    })), e("[data-bs-toggle='tab']").on("shown.bs.tab", (function(t) {
        e(e(t.target).attr("href")).find(".swiper-container").each((function() {
            var e = this.swiper;
            e && e.update()
        }))
    })), e("[data-ani]").each((function() {
        var t = e(this).data("ani");
        e(this).addClass(t)
    })), e("[data-ani-delay]").each((function() {
        var t = e(this).data("ani-delay");
        e(this).css("animation-delay", t)
    })), e.fn.activateSliderThumbs = function(t) {
        var a = e.extend({
            sliderTab: !1,
            tabButton: ".tab-btn"
        }, t);
        return this.each((function() {
            var t = e(this),
                n = t.find(a.tabButton),
                o = e('<span class="indicator"></span>').appendTo(t),
                s = t.data("slider-tab"),
                i = e(s)[0].swiper;
            if (n.on("click", (function(t) {
                    t.preventDefault();
                    var n = e(this);
                    if (n.addClass("active").siblings().removeClass("active"), c(n), a.sliderTab) {
                        var o = n.index();
                        i.slideTo(o)
                    }
                })), a.sliderTab) {
                i.on("slideChange", (function() {
                    var e = i.realIndex,
                        t = n.eq(e);
                    t.addClass("active").siblings().removeClass("active"), c(t)
                }));
                var r = i.activeIndex,
                    l = n.eq(r);
                l.addClass("active").siblings().removeClass("active"), c(l)
            }

            function c(e) {
                var t = e.position(),
                    a = parseInt(e.css("margin-top")) || 0,
                    n = parseInt(e.css("margin-left")) || 0;
                o.css("--height-set", e.outerHeight() + "px"), o.css("--width-set", e.outerWidth() + "px"), o.css("--pos-y", t.top + a + "px"), o.css("--pos-x", t.left + n + "px")
            }
        }))
    }, e(".testi-grid-dots").length && e(".testi-grid-dots").activateSliderThumbs({
        sliderTab: !0,
        tabButton: ".tab-btn"
    }), e(document).ready((function() {
        e(".menuTextSlider").each((function() {
            const e = .1,
                t = .2;
            new Swiper(".menuTextSlider", {
                    slidesPerView: 3,
                    spaceBetween: 60,
                    centeredSlides: !0,
                    loop: !0,
                    grabCursor: !0,
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: !0
                    },
                    breakpoints: {
                        300: {
                            slidesPerView: 1,
                            spaceBetween: 10
                        },
                        600: {
                            slidesPerView: 2,
                            spaceBetween: 30
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 30
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 40
                        },
                        1280: {
                            slidesPerView: 3,
                            spaceBetween: 60
                        }
                    }
                }),
                function a() {
                    requestAnimationFrame(a), document.querySelectorAll(".single").forEach(((a, n) => {
                        const o = a.getBoundingClientRect(),
                            s = .5 * window.innerWidth - (o.x + .5 * o.width);
                        let i = Math.abs(s) * e - o.width * e;
                        i < 0 && (i = 0);
                        const r = s < 0 ? "left top" : "right top";
                        a.style.transform = `translate(0, ${i}px) rotate(${-s*t}deg)`, a.style.transformOrigin = r
                    }))
                }()
        }))
    })), e(".th-social .size-item").on("click", (function() {
        e(".th-social .size-item").removeClass("active"), e(this).addClass("active")
    }));
    var r, l, c, d = ".ajax-contact",
        p = "is-invalid",
        u = '[name="email"]',
        h = '[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]',
        g = e(".form-messages");

    function f() {
        var t, a = e(d).serialize();
        t = function() {
            var t, a = !0;

            function n(n) {
                n = n.split(",");
                for (var o = 0; o < n.length; o++) t = d + " " + n[o], e(t).val() ? (e(t).removeClass(p), a = !0) : (e(t).addClass(p), a = !1)
            }
            n(h), e(u).val() && e(u).val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/) ? (e(u).removeClass(p), a = !0) : (e(u).addClass(p), a = !1);
            return a
        }(), t && jQuery.ajax({
            url: e(d).attr("action"),
            data: a,
            type: "POST"
        }).done((function(t) {
            g.removeClass("error"), g.addClass("success"), g.text(t), e(d + ' input:not([type="submit"]),' + d + " textarea").val("")
        })).fail((function(e) {
            g.removeClass("success"), g.addClass("error"), "" !== e.responseText ? g.html(e.responseText) : g.html("Oops! An error occured and your message could not be sent.")
        }))
    }

    function m(t, a, n, o) {
        e(a).on("click", (function(a) {
            a.preventDefault(), e(t).addClass(o)
        })), e(t).on("click", (function(a) {
            a.stopPropagation(), e(t).removeClass(o)
        })), e(t + " > div").on("click", (function(a) {
            a.stopPropagation(), e(t).addClass(o)
        })), e(n).on("click", (function(a) {
            a.preventDefault(), a.stopPropagation(), e(t).removeClass(o)
        }))
    }

    function v(e) {
        return parseInt(e, 10)
    }
    e(d).on("submit", (function(e) {
        e.preventDefault(), f()
    })), r = ".popup-search-box", l = ".searchClose", c = "show", e(".searchBoxToggler").on("click", (function(t) {
        t.preventDefault(), e(r).addClass(c)
    })), e(r).on("click", (function(t) {
        t.stopPropagation(), e(r).removeClass(c)
    })), e(r).find("form").on("click", (function(t) {
        t.stopPropagation(), e(r).addClass(c)
    })), e(l).on("click", (function(t) {
        t.preventDefault(), t.stopPropagation(), e(r).removeClass(c)
    })), m(".sidemenu-cart", ".sideMenuToggler", ".sideMenuCls", "show"), m(".sidemenu-info", ".sideMenuInfo", ".sideMenuCls", "show"), e(".popup-image").magnificPopup({
        type: "image",
        mainClass: "mfp-zoom-in",
        removalDelay: 260,
        gallery: {
            enabled: !0
        }
    }), e(".popup-video").magnificPopup({
        type: "iframe",
        mainClass: "mfp-zoom-in"
    }), e(".popup-content").magnificPopup({
        type: "inline",
        midClick: !0
    }), e.fn.sectionPosition = function(t, a) {
        e(this).each((function() {
            var n, o, s, i, r, l = e(this);
            n = Math.floor(l.height() / 2), o = l.attr(t), s = l.attr(a), i = v(e(s).css("padding-top")), r = v(e(s).css("padding-bottom")), "top-half" === o ? (e(s).css("padding-bottom", r + n + "px"), l.css("margin-top", "-" + n + "px")) : "bottom-half" === o && (e(s).css("padding-top", i + n + "px"), l.css("margin-bottom", "-" + n + "px"))
        }))
    };
    var y = "[data-sec-pos]";
    e(y).length && e(y).imagesLoaded((function() {
        e(y).sectionPosition("data-sec-pos", "data-pos-for")
    })), e(".filter-active").imagesLoaded((function() {
        var t = ".filter-active",
            a = ".filter-menu-active";
        if (e(t).length > 0) {
            var n = e(t).isotope({
                itemSelector: ".filter-item",
                filter: "*",
                masonry: {}
            });
            e(a).on("click", "button", (function() {
                var t = e(this).attr("data-filter");
                n.isotope({
                    filter: t
                })
            })), e(a).on("click", "button", (function(t) {
                t.preventDefault(), e(this).addClass("active"), e(this).siblings(".active").removeClass("active")
            }))
        }
    })), e(".masonary-active, .woocommerce-Reviews .comment-list").imagesLoaded((function() {
        var t = ".masonary-active, .woocommerce-Reviews .comment-list";
        e(t).length > 0 && e(t).isotope({
            itemSelector: ".filter-item, .woocommerce-Reviews .comment-list li",
            filter: "*",
            masonry: {
                columnWidth: 1
            }
        }), e('[data-bs-toggle="tab"]').on("shown.bs.tab", (function(a) {
            e(t).isotope({
                filter: "*"
            })
        }))
    })), e(".counter-number").counterUp({
        delay: 10,
        time: 1e3
    }), e.fn.shapeMockup = function() {
        e(this).each((function() {
            var t = e(this),
                a = t.data("top"),
                n = t.data("right"),
                o = t.data("bottom"),
                s = t.data("left");
            t.css({
                top: a,
                right: n,
                bottom: o,
                left: s
            }).removeAttr("data-top").removeAttr("data-right").removeAttr("data-bottom").removeAttr("data-left").parent().addClass("shape-mockup-wrap")
        }))
    }, e(".shape-mockup") && e(".shape-mockup").shapeMockup(), e(".progress-bar").waypoint((function() {
        e(".progress-bar").css({
            animation: "animate-positive 1.8s",
            opacity: "1"
        })
    }), {
        offset: "75%"
    }), e.fn.countdown = function() {
        e(this).each((function() {
            var t = e(this),
                a = new Date(t.data("offer-date")).getTime();

            function n(e) {
                return t.find(e)
            }
            var o = setInterval((function() {
                var e = (new Date).getTime(),
                    s = a - e,
                    i = Math.floor(s / 864e5),
                    r = Math.floor(s % 864e5 / 36e5),
                    l = Math.floor(s % 36e5 / 6e4),
                    c = Math.floor(s % 6e4 / 1e3);
                i < 10 && (i = "0" + i), r < 10 && (r = "0" + r), l < 10 && (l = "0" + l), c < 10 && (c = "0" + c), s < 0 ? (clearInterval(o), t.addClass("expired"), t.find(".message").css("display", "block")) : (n(".day").html(i), n(".hour").html(r), n(".minute").html(l), n(".seconds").html(c))
            }), 1e3)
        }))
    }, e(".counter-list").length && e(".counter-list").countdown();
    const w = {};

    function b() {
        const t = e(this),
            a = t.attr("src");
        if (!w[a]) {
            const t = e.Deferred();
            e.get(a, (a => {
                t.resolve(e(a).find("svg"))
            })), w[a] = t.promise()
        }
        w[a].then((a => {
            const n = e(a).clone();
            t.attr("id") && n.attr("id", t.attr("id")), t.attr("class") && n.attr("class", t.attr("class")), t.attr("style") && n.attr("style", t.attr("style")), t.attr("width") && (n.attr("width", t.attr("width")), t.attr("height") || n.removeAttr("height")), t.attr("height") && (n.attr("height", t.attr("height")), t.attr("width") || n.removeAttr("width")), n.insertAfter(t), t.trigger("svgInlined", n[0]), t.remove()
        }))
    }

    function C() {
        e(".feature-circle .progressbar").each((function() {
            var t = e(this).offset().top,
                a = e(window).scrollTop(),
                n = e(this).find(".circle").attr("data-percent"),
                o = (parseInt(n, 10), parseInt(100, 10), e(this).data("animate"));
            t < a + e(window).height() - 30 && !o && (e(this).data("animate", !0), e(this).find(".circle").circleProgress({
                startAngle: -Math.PI / 2,
                value: n / 100,
                size: 100,
                thickness: 5,
                emptyFill: "#B7B7B7",
                fill: {
                    color: "#F84923"
                }
            }).on("circle-animation-progress", (function(t, a, n) {
                e(this).find(".circle-num").text((100 * n).toFixed(0) + "%")
            })).stop())
        }))
    }

    function k(t, a, n, o) {
        var s = t.text().split(a),
            i = "";
        s.length && (e(s).each((function(e, t) {
            i += '<span class="' + n + (e + 1) + '">' + t + "</span>" + o
        })), t.empty().append(i))
    }
    e.fn.inlineSvg = function() {
        return this.each(b), this
    }, e(".svg-img").inlineSvg(), C(), e(window).scroll(C), e("#ship-to-different-address-checkbox").on("change", (function() {
        e(this).is(":checked") ? e("#ship-to-different-address").next(".shipping_address").slideDown() : e("#ship-to-different-address").next(".shipping_address").slideUp()
    })), e(".woocommerce-form-login-toggle a").on("click", (function(t) {
        t.preventDefault(), e(".woocommerce-form-login").slideToggle()
    })), e(".woocommerce-form-coupon-toggle a").on("click", (function(t) {
        t.preventDefault(), e(".woocommerce-form-coupon").slideToggle()
    })), e(".shipping-calculator-button").on("click", (function(t) {
        t.preventDefault(), e(this).next(".shipping-calculator-form").slideToggle()
    })), e('.wc_payment_methods input[type="radio"]:checked').siblings(".payment_box").show(), e('.wc_payment_methods input[type="radio"]').each((function() {
        e(this).on("change", (function() {
            e(".payment_box").slideUp(), e(this).siblings(".payment_box").slideDown()
        }))
    })), e(".rating-select .stars a").each((function() {
        e(this).on("click", (function(t) {
            t.preventDefault(), e(this).siblings().removeClass("active"), e(this).parent().parent().addClass("selected"), e(this).addClass("active")
        }))
    })), e(".quantity-plus").each((function() {
        e(this).on("click", (function(t) {
            t.preventDefault();
            var a = e(this).siblings(".qty-input"),
                n = parseInt(a.val(), 10);
            isNaN(n) || a.val(n + 1)
        }))
    })), e(".quantity-minus").each((function() {
        e(this).on("click", (function(t) {
            t.preventDefault();
            var a = e(this).siblings(".qty-input"),
                n = parseInt(a.val(), 10);
            !isNaN(n) && n > 1 && a.val(n - 1)
        }))
    })), e(".color-switch-btns button").each((function() {
        const t = e(this),
            a = t.data("color");
        t.css("--theme-color", a), t.on("click", (function() {
            const t = e(this).data("color");
            e(":root").css("--theme-color", t)
        }))
    })), e(document).on("click", ".switchIcon", (function() {
        e(".color-scheme-wrap").toggleClass("active")
    })), e(".tilt-active").tilt({
        maxTilt: 7,
        perspective: 1e3
    });
    var T = {
        init: function() {
            return this.each((function() {
                k(e(this), "", "char", "")
            }))
        },
        words: function() {
            return this.each((function() {
                k(e(this), " ", "word", " ")
            }))
        },
        lines: function() {
            return this.each((function() {
                var t = "eefec303079ad17405c889e092e105b0";
                k(e(this).children("br").replaceWith(t).end(), t, "line", "")
            }))
        }
    };
    let x;
    e.fn.lettering = function(t) {
        return t && T[t] ? T[t].apply(this, [].slice.call(arguments, 1)) : "letters" !== t && t ? (e.error("Method " + t + " does not exist on jQuery.lettering"), this) : T.init.apply(this, [].slice.call(arguments, 0))
    }, e(".logo-animation").lettering(), e.fn.countdown = function() {
        e(this).each((function() {
            var t = e(this),
                a = new Date(t.data("offer-date")).getTime();

            function n(e) {
                return t.find(e)
            }
            var o = setInterval((function() {
                var e = (new Date).getTime(),
                    s = a - e,
                    i = Math.floor(s / 864e5),
                    r = Math.floor(s % 864e5 / 36e5),
                    l = Math.floor(s % 36e5 / 6e4),
                    c = Math.floor(s % 6e4 / 1e3);
                i < 10 && (i = "0" + i), r < 10 && (r = "0" + r), l < 10 && (l = "0" + l), c < 10 && (c = "0" + c), s < 0 ? (clearInterval(o), t.addClass("expired"), t.find(".message").css("display", "block")) : (n(".day").html(i), n(".hour").html(r), n(".minute").html(l), n(".seconds").html(c))
            }), 1e3)
        }))
    }, e(".counter-list").length && e(".counter-list").countdown(), e("#slider").on("input change", (t => {
        const a = t.target.value;
        e(".foreground-img").css("width", `${a}%`), e(".slider-button").css("left", `calc(${a}% - 43px)`)
    })), e(".date-pick").datetimepicker({
        timepicker: !1,
        datepicker: !0,
        format: "d-m-y",
        step: 10
    }), e(".time-pick").datetimepicker({
        datepicker: !1,
        format: "H:i",
        step: 30
    }), e(".date-time-pick").datetimepicker({}), gsap.registerPlugin(ScrollTrigger);
    let A = null;
    const S = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function M() {
        S || (window.innerWidth > 991 ? (x || (x = new Lenis({
            lerp: .07,
            smooth: !0
        }), x.on("scroll", ScrollTrigger.update), A = gsap.ticker.add((e => {
            x && x.raf(1e3 * e)
        })), document.querySelectorAll(".allow-natural-scroll").forEach((e => {
            e.addEventListener("wheel", (e => e.stopPropagation()), {
                passive: !0
            }), e.addEventListener("touchmove", (e => e.stopPropagation()), {
                passive: !0
            })
        }))), x.start()) : (x && (x.stop(), x = null), A && (gsap.ticker.remove(A), A = null)))
    }
    if (M(), window.addEventListener("resize", (() => {
            M()
        })), window.innerWidth > 575) {
        gsap.utils.toArray(".gsap-scroll-float-down").forEach((e => {
            gsap.to(e, {
                y: 80,
                ease: "none",
                scrollTrigger: {
                    trigger: e,
                    start: "top 20%",
                    end: "bottom top",
                    scrub: 2
                }
            })
        })), gsap.utils.toArray(".gsap-scroll-float-down2").forEach((e => {
            gsap.to(e, {
                y: 250,
                ease: "none",
                scrollTrigger: {
                    trigger: e,
                    start: "top 30%",
                    end: "bottom top",
                    scrub: 2
                }
            })
        })), gsap.utils.toArray(".gsap-scroll-float-up").forEach((e => {
            gsap.to(e, {
                y: -250,
                ease: "none",
                scrollTrigger: {
                    trigger: e,
                    start: "top 100%",
                    end: "bottom top",
                    scrub: 2
                }
            })
        })), gsap.utils.toArray(".gsap-fade-left").forEach((e => {
            gsap.from(e, {
                x: -150,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: e,
                    start: "top 80%",
                    end: "bottom top",
                    toggleActions: "play none none none"
                }
            })
        })), document.querySelector(".gsap-scroll-rotate") && gsap.to(".gsap-scroll-rotate", {
            rotate: 30,
            ease: "none",
            scrollTrigger: {
                trigger: ".gsap-scroll-rotate",
                start: "top 30%",
                end: "bottom top",
                scrub: 2
            }
        });
        let e = gsap.timeline({
            defaults: {
                ease: "power3.out"
            }
        });
        document.querySelector(".gsap-scale-down-fade") && e.from(".gsap-scale-down-fade", {
            y: -500,
            scale: 0,
            opacity: 0,
            duration: 1,
            delay: .5
        }), document.querySelector(".gsap-scale-up-fade") && e.from(".gsap-scale-up-fade", {
            y: 400,
            scale: 0,
            opacity: 0,
            duration: 1,
            delay: .3
        }, "<"), document.querySelector(".gsap-fade-up") && e.from(".gsap-fade-up", {
            y: 100,
            opacity: 0,
            duration: .3
        }), document.querySelector(".gsap-width-up") && e.from(".gsap-width-up", {
            width: 0,
            opacity: 0,
            duration: .4
        }), document.querySelectorAll(".text-anime-style-1").forEach((e => {
            gsap.from(e, {
                y: 50,
                opacity: 0,
                duration: .6,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: e,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            })
        })), document.querySelectorAll(".text-anime-style-2").forEach((e => {
            const t = Array.from(e.childNodes);
            let a = "";
            t.forEach((e => {
                if (e.nodeType === Node.TEXT_NODE) {
                    e.textContent.split("").forEach((e => {
                        a += `<span>${" "===e?"&nbsp;":e}</span>`
                    }))
                } else a += e.outerHTML
            })), e.innerHTML = a, gsap.from(e.querySelectorAll(":scope > span"), {
                y: 20,
                opacity: 0,
                stagger: .03,
                duration: .7,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: e,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            })
        })), document.querySelectorAll(".text-anime-style-3").forEach((e => {
            gsap.from(e, {
                y: 80,
                scale: .8,
                opacity: 0,
                duration: .8,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: e,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            })
        })), document.querySelectorAll(".img-anime-style-1").forEach((e => {
            gsap.from(e, {
                y: 80,
                scale: .8,
                opacity: 0,
                duration: .8,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: e,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            })
        })), document.querySelectorAll("[data-delay]").forEach((e => {
            const t = parseInt(e.getAttribute("data-delay"), 10) || 0;
            gsap.from(e, {
                opacity: 0,
                y: 50,
                duration: 1,
                delay: t,
                scrollTrigger: {
                    trigger: e,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            })
        }))
    }
    M(), window.addEventListener("resize", M), window.addEventListener("contextmenu", (function(e) {
        e.preventDefault()
    }), !1), document.onkeydown = function(e) {
        return 123 != event.keyCode && ((!e.ctrlKey || !e.shiftKey || e.keyCode != "I".charCodeAt(0)) && ((!e.ctrlKey || !e.shiftKey || e.keyCode != "C".charCodeAt(0)) && ((!e.ctrlKey || !e.shiftKey || e.keyCode != "J".charCodeAt(0)) && ((!e.ctrlKey || e.keyCode != "U".charCodeAt(0)) && void 0))))
    }
}(jQuery);