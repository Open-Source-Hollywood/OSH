var maxCount;

var resetGridMasonFunction = function(t) {
        var e = t("html"),
            i = t("body"),
            n = "ontouchstart" in window;
        n && i.removeClass("no-touch").addClass("touch"), i.removeClass("no-js");
        var o = "",
            r = t(".krown-id-grid");
        if (0 < t(".krown-id-grid").length) {
            i.append('<div id="responsive-test"><div id="p780"></div><div id="p580"></div><div>');
            var s = t("#p780"),
                a = t("#p580");
            t(".krown-id-grid").imagesLoaded(function() {
                r.each(function() {
                    var e = "#" + t(this).attr("id");
                    if (t(".krown-tabs").children(".contents").children("div").css("display", "block"), t(this).hasClass("carousel")) {
                        var i = t(this),
                            n = t(this).find(".carousel-holder"),
                            o = t(this).find(".krown-id-item"),
                            r = t(this).find(".btn-next"),
                            h = t(this).find(".btn-prev"),
                            c = "block" == a.css("display") ? 2 : "block" == s.css("display") ? 3 : parseInt(n.data("visible"));
                        i.width(), parseInt(o.eq(0).css("marginLeft"));
                        var l = !0;
                        n.css("position", "absolute"), o.css("left", 0), i.data({
                            items: o,
                            visNo: n.data("visible"),
                            visWidth: i.width() + 2 * parseInt(o.eq(0).css("marginLeft")),
                            page: 0,
                            pages: Math.ceil(o.length / c) - 1
                        }), (i = new Hammer(i[0])).on("swipeleft", function(t) {
                            r.trigger("click")
                        }), i.on("swiperight", function(t) {
                            h.trigger("click")
                        }), r.on("click", function(e) {
                            var i = t(this).closest(".carousel"),
                                n = i.data("items"),
                                o = i.data("page"),
                                s = i.data("pages"),
                                a = i.data("visNo"),
                                c = i.data("visWidth");
                            if (l && o + 1 <= s) {
                                l = !1, i.data("page", ++o), o + 1 <= s ? r.removeClass("disabled") : r.addClass("disabled"), 0 <= o - 1 ? h.removeClass("disabled") : h.addClass("disabled");
                                var d = 0,
                                    u = (o - 1) * a;
                                t.grep(n, function(t, e) {
                                    e >= u ? n.eq(e).stop().delay(50 * d++).animate({
                                        left: -c * o
                                    }, 200, "easeInQuint") : n.eq(e).stop().animate({
                                        left: -c * o
                                    }, 0)
                                }), setTimeout(function() {
                                    l = !0
                                }, 100 * a + 200)
                            }
                            e.preventDefault()
                        }), h.on("click", function(e) {
                            var i = t(this).closest(".carousel"),
                                n = i.data("items"),
                                o = i.data("page"),
                                s = i.data("pages"),
                                a = i.data("visNo"),
                                c = i.data("visWidth");
                            if (l && 0 <= o - 1) {
                                l = !1, i.data("page", --o), o + 1 <= s ? r.removeClass("disabled") : r.addClass("disabled"), 0 <= o - 1 ? h.removeClass("disabled") : h.addClass("disabled");
                                var d = (o + 2) * a - 1,
                                    u = d + 1;
                                t.grep(n, function(t, e) {
                                    e < u ? n.eq(e).stop().delay(50 * d--).animate({
                                        left: -c * o
                                    }, 200, "easeInQuint") : n.eq(e).stop().animate({
                                        left: -c * o
                                    }, 0)
                                }), setTimeout(function() {
                                    l = !0
                                }, 100 * a + 200)
                            }
                            e.preventDefault()
                        }).addClass("disabled")
                    } else t(this).imagesLoaded(function() {
                        t(e).isotope({
                            itemSelector: ".krown-id-item",
                            layoutMode: "masonry"
                        })
                    });
                    setTimeout(function() {
                        t(".krown-tabs").children(".contents").children("div:nth-child(1n+2)").css("display", "none")
                    }, t(this).hasClass("carousel") ? 100 : 1e3)
                })
            });
            var h = t(window).width();
            t(window).on("resize", function() {
                h != t(window).width() && (h = t(window).width(), r.each(function() {
                    if (t(this).hasClass("carousel")) {
                        var e = t(this).find(".carousel-holder"),
                            i = t(this).find(".krown-id-item"),
                            n = 0,
                            o = (n = t(this).closest(".krown-tabs")).children(".contents").children("div");
                        o.each(function() {
                            t(this).data("display", t(this).css("display")).css("display", "block")
                        }), e.css("position", "absolute"), e.parent().css("height", e.height()), n = "block" == a.css("display") ? 2 : "block" == s.css("display") ? 3 : parseInt(e.data("visible")), t(this).data({
                            items: i,
                            visNo: n,
                            visWidth: t(this).width() + 2 * parseInt(i.eq(0).css("marginLeft")),
                            page: 0,
                            pages: Math.ceil(i.length / n) - 1
                        }), i.css("left", 0), t(this).find(".btn-prev").addClass("disabled"), t(this).find(".btn-next").removeClass("disabled"), o.each(function() {
                            t(this).css("display", t(this).data("display"))
                        })
                    } else n = t(this).closest(".krown-tabs"), o = n.children(".contents").children("div"), o.each(function() {
                        "yes" != t(this).data("lock") && (t(this).data("lock", "yes"), t(this).data("display", t(this).css("display")).css("display", "block"))
                    }), setTimeout(function() {
                        o.each(function() {
                            t(this).css("display", t(this).data("display")).data("lock", "no")
                        })
                    }, 1e3)
                }))
            })
        }
        if (i.hasClass("single-ignition_product")) {
            var c = t("#project-sidebar");
            c.find(".product-wrapper, .id-product-proposed-end, .btn-container").wrapAll('<div class="panel clearfix">'), c.find(".id-widget.ignitiondeck").removeClass("ignitiondeck"), c.find("#project-p-author").appendTo(c.find(".separator")), c.find(".poweredbyID").appendTo(c), c.find(".main-btn").addClass("krown-button medium color"), c.find(".id-progress-raised, .id-product-funding, .id-product-total, .id-product-pledges, .id-product-days, .id-product-days-to-go").wrapAll('<div class="rholder">'), c.find(".id-progress-raised, .id-product-funding").wrapAll('<div class="rpdata">'), c.find(".id-product-total, .id-product-pledges").wrapAll('<div class="rpdata">'), c.find(".id-product-days, .id-product-days-to-go").wrapAll('<div class="rpdata">'), c.find(".product-wrapper").addClass("clearfix"), t(".id-level-desc:empty").remove(), t(".ignitiondeck.idstretch").prev().addClass("idst"), t(".id-widget .progress-percentage, .idstretch-percentage").each(function() {
                var e = parseFloat(t(this).text().replace(",", ""));
            }), c.find(".id-widget .krown-pie").clone().prependTo(c.find(".rtitle")), c.find(".rtitle").find(".krown-pie").removeClass("large").addClass("small");
            var l = t("#page-title"),
                d = c.find(".btn-container"),
                u = 0 < d.find("a").length,
                p = 90,
                f = !1,
                m = !0;
            i.append('<div id="responsive-test"><div id="p780"></div><div id="p580"></div><div>'), s = t("#p780"), a = t("#p580"), u || (c.css("paddingBottom", "0"), p = -10), c.find(".rtitle").click(function() {
                if (m)
                    if (m = !1, f) t(this).removeClass("opened"), d.css("display", "none"), c.stop().animate({
                        height: 100
                    }, {
                        duration: 250,
                        easing: "easeInQuad",
                        step: function(t) {
                            l.css("paddingTop", t - 10)
                        },
                        complete: function() {
                            m = !0
                        }
                    }), f = !1;
                    else {
                        t(this).addClass("opened"), c.css("height", "auto");
                        var e = c.outerHeight();
                        c.css("height", 100), c.stop().animate({
                            height: e
                        }, {
                            duration: 350,
                            easing: "easeInQuad",
                            step: function(t) {
                                l.css("paddingTop", t - 10)
                            },
                            complete: function() {
                                m = !0, d.css({
                                    top: c.outerHeight() - 225,
                                    display: "block"
                                })
                            }
                        }), f = !0
                    }
            }), t(window).resize(function() {
                "block" == s.css("display") || "block" == a.css("display") ? (u || (c.css("paddingBottom", "0"), p = -10), f ? (c.css("height", "auto"), l.css("paddingTop", c.height() + p), d.css("top", c.height() - 125), d.css("display", "block")) : (c.css("height", 100), l.css("paddingTop", 90), d.css("display", "none"))) : (l.css("paddingTop", 0), c.css("height", "auto"), d.css("display", "block")), m = !0
            })
        }
        if (i.hasClass("archive") || (t(".backer_data .id-backer-links").insertAfter(".backer_title h3"), t(".backer_info .backer_title > p").appendTo(".backer_info")), 0 < t(".dashboardmenu").length) {
            var g = t(".dashboardmenu").find("li");
            o = '<div class="tabs-select"><select>';
            g.each(function() {
                o += "<option>" + t(this).find("a").text() + "</option>"
            }), o += "</select></div>", t(".dashboardmenu").append(o).find(".tabs-select").find("select").change(function() {
                document.location.href = g.eq(t(this).find("option:selected").index()).find("a").prop("href")
            }), t("#edit-profile").find(".form-row:nth-of-type(1), .form-row:nth-of-type(4), .form-row:nth-of-type(6), .form-row:nth-of-type(8), .form-row:nth-of-type(10)").addClass("first")
        }
        0 < t(".insert-map").length && t(".insert-map").each(function() {
            var e, i = t(this),
                o = [{
                    featureType: "all",
                    elementType: "all",
                    stylers: [{
                        saturation: -100
                    }]
                }];
            e = {
                zoom: i.data("zoom"),
                center: new google.maps.LatLng(i.data("map-lat"), i.data("map-long")),
                streetViewControl: !1,
                scrollwheel: !1,
                panControl: !0,
                mapTypeControl: !1,
                overviewMapControl: !1,
                zoomControl: !1,
                draggable: !n,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE
                },
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, "krownMap"]
                }
            }, e = new google.maps.Map(document.getElementById(i.attr("id")), e), "d-true" == i.data("greyscale") && (o = new google.maps.StyledMapType(o, {
                name: "Grayscale"
            }), e.mapTypes.set("krownMap", o), e.setMapTypeId("krownMap")), "d-true" == i.data("marker") && (o = new google.maps.LatLng(i.data("map-lat"), i.data("map-long")), new google.maps.Marker({
                position: o,
                map: e,
                icon: i.data("marker-img")
            })), setTimeout(function() {
                i.animate({
                    opacity: 1
                }, 400).parent().addClass("remove-preloader")
            }, 2e3)
        }), t("p:empty").remove(), 0 < (i = t(".project-header").find(".video-container").children("iframe")).length && 0 < i.attr("src").indexOf("youtube") && (q = 0 < i.attr("src").indexOf("?") ? i.attr("src") + "&wmode=opaque" : i.attr("src") + "?wmode=opaque", i.attr("src", q)), t("#content").fitVids(), t(".touch #header #searchform").on("click.search", function(e) {
            t(this).addClass("hover").off("click.search"), e.preventDefault()
        }), t(".krown-accordion").each(function() {
            var e = !!t(this).hasClass("toggle"),
                i = t(this).children("section"),
                n = "-1" == t(this).data("opened") ? null : i.eq(parseInt(t(this).data("opened")));
            null != n && (n.addClass("opened"), n.children("div").slideDown(0)), t(this).children("section").children("h5").click(function() {
                var i = t(this).parent();
                e || null == n || (n.removeClass("opened"), n.children("div").stop().slideUp(300)), i.hasClass("opened") && e ? (i.removeClass("opened"), i.children("div").stop().slideUp(300)) : i.hasClass("opened") || (n = i, i.addClass("opened"), i.children("div").stop().slideDown(300))
            })
        }), t(".krown-form").each(function() {
            function e(t) {
                t.removeClass("contact-error-border"), h.fadeOut()
            }
            var i = t(this).find("form"),
                n = t(this).find(".name"),
                o = t(this).find(".email"),
                r = t(this).find(".subject"),
                s = t(this).find(".message"),
                a = t(this).find(".success-message"),
                h = t(this).find(".error-message");
            n.focus(function() {
                e(t(this))
            }), o.focus(function() {
                e(t(this))
            }), r.focus(function() {
                e(t(this))
            }), s.focus(function() {
                e(t(this))
            }), i.submit(function(e) {
                function c(t) {
                    t.val(t.data("value")), t.addClass("contact-error-border"), h.fadeIn()
                }
                var l = !0;
                (3 > n.val().length || n.val() == n.data("value")) && (c(n), l = !1), "" != o.val() && o.val() != o.data("value") && /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(o.val()) || (c(o), l = !1), (5 > s.val().length || s.val() == s.data("value")) && (c(s), l = !1), t(this).hasClass("full") && (3 > r.val().length || r.val() == r.data("value")) && (c(r), l = !1), l && (i.fadeOut(), t.ajax({
                    type: i.prop("method"),
                    url: i.prop("action"),
                    data: i.serialize(),
                    success: function() {
                        a.fadeIn()
                    }
                })), e.preventDefault()
            })
        }), t("img.alignleft, img.alignright, img.aligncenter").parent("a").each(function() {
            t(this).attr("class", "fancybox fancybox-thumb " + t(this).children("img").attr("class"))
        }), (0 < t(".fancybox").length || 0 < t('div[id*="attachment"]').length) && (t('.fancybox:not(.inline), div[id*="attachment"] > a').fancybox({
            padding: 0,
            margin: 50,
            aspectRatio: !0,
            scrolling: "no",
            mouseWheel: !1,
            openMethod: "zoomIn",
            closeMethod: "zoomOut",
            nextEasing: "easeInQuad",
            prevEasing: "easeInQuad"
        }).append("<span></span>"), t(".fancybox.inline").fancybox({
            padding: 0,
            maxWidth: 250,
            maxHeight: 300,
            fitToView: !1,
            width: "250px",
            height: "350px",
            autoSize: !1,
            closeClick: !1,
            openEffect: "none",
            closeEffect: "none"
        })), 0 < t(".krown-pie").length && !e.hasClass("ie8") && (t(".krown-pie").each(function() {
            var e = t(this).hasClass("large") ? 274 : 122;
            t(this).find(".holder").append('<div class="pie-holder"><canvas class="pie-canvas" width="' + e + '" height="' + e + '"></canvas></div>')
        }), t(".krown-pie").each(function() {
            var e, i = t(this).find(".value"),
                n = t(this).find(".pie-canvas")[0],
                o = t(this).data("color"),
                r = t(this).hasClass("large") ? new ProgressCircle({
                    canvas: n,
                    minRadius: 115,
                    arcWidth: 18,
                    centerX: 136,
                    centerY: 136
                }) : new ProgressCircle({
                    canvas: n,
                    minRadius: 52,
                    arcWidth: 6,
                    centerX: 62,
                    centerY: 60
                }),
                s = 0;
            r.addEntry({
                fillColor: o,
                progressListener: function() {
                    return s
                }
            }), "0" != parseFloat(i.data("percent")) && function(t, n) {
                s = 0, clearInterval(e), r.stop();
                var o = 0,
                    a = n / t;
                r.start(5), e = setInterval(function() {
                    s += .0025, o = Math.round(100 * s * a), s >= t / 100 && (r.stop(), clearInterval(e), s = 0), i.html(o + "<sup>%</sup>")
                }, 5)
            }(Math.min(parseFloat(i.data("percent")), 100), parseFloat(i.text()))
        })), t(".krown-tabs").each(function() {
            var e = t(this).children(".titles").children("li"),
                i = t(this).children(".contents").children("div"),
                n = e.eq(0),
                o = i.eq(0),
                r = t(this).hasClass("fade") ? "fade" : "tab";
            if (n.addClass("opened"), o.stop().slideDown(0), e.find("a").prop("href", "#").off("click"), e.click(function(e) {
                    n.removeClass("opened"), (n = t(this)).addClass("opened"), "fade" == r ? (o.stop().fadeOut(250), (o = i.eq(t(this).index())).stop().delay(250).fadeIn(300)) : (o.stop().slideUp(250), (o = i.eq(t(this).index())).stop().delay(250).slideDown(300)), h && a.val(t(this).text()), e.preventDefault()
                }), t(this).hasClass("responsive-on")) {
                var s = '<div class="tabs-select"><select>';
                e.each(function() {
                    s += "<option>" + t(this).find("h5").text() + "</option>"
                }), s += "</select></div>", t(this).children(".titles").append(s).find(".tabs-select").find("select").change(function() {
                    e.eq(t(this).find("option:selected").index()).trigger("click")
                })
            }
            var a = t(this).find(".tabs-select").find("select"),
                h = !!t(this).hasClass("responsive-on")
        }), t(".krown-twitter.rotenabled").each(function() {
            var e = t(this).children("ul").children("li"),
                i = 0;
            setInterval(function() {
                e.eq(i).fadeOut(250), ++i == e.length && (i = 0), e.eq(i).delay(260).fadeIn(300)
            }, 6e3)
        }), t(".flexslider.mini").each(function() {
            var e = t(this);
            1 < e.find("li").length ? t(this).fitVids().flexslider({
                animation: "slide",
                easing: "easeInQuad",
                animationSpeed: 300,
                slideshow: !0,
                directionNav: !0,
                controlNav: !1,
                keyboard: !1,
                start: function(t) {
                    t.container && t.container.delay(131).animate({
                        opacity: 1
                    }, 300)
                }
            }) : e.removeClass("flexslider")
        }), t(".rev_slider_wrapper").find("video").data("no-mejs", "true"), 0 < t("#content").find("audio, video").length && (t("#content").find("video").attr({
            width: "100%",
            height: "100%",
            style: "width:100%;height:100%"
        }), t("#content").find("audio, video").each(function() {

        })), t(window).on("scroll.menu", function() {
            500 > t(this).scrollTop() || t(this).scrollTop()
        }), t(window).trigger("scroll")
};

/** show roles dialog */
function displayRoleTypeDialog(list, options) {
  vex.closeTop();
  // console.log(list, options)
  // console.log(new Array(10).join('1 2  '))
  var title = 'Available Roles';
  var isMeteorUser = Meteor.user&&Meteor.user()||false;
  var inputHTML = list.map(function(c, idx) {
    var typeofRole = c.ctx === 'crew' ? 'a crew position' : c.ctx === 'cast' ? 'a cast position' : 'a resource needed';
    var _html = '<div class="vex-custom-field-wrapper" id="displayroles">';
    _html += '<div class="row"><div class="col-sm-12"><div class="thumbnail"><div class="caption"><h3 style="margin-bottom: 10px;">' + (c.title||c.role||c.category) + '</h3><p style="margin-bottom: 13px;font-weight:200">'+ typeofRole +'</p><p style="margin-bottom: 5px">' + c.description + '</p>';
    _html += '</div></div></div></div>';
    _html += '</div>';
    return _html;
  }).join('');
  if (list.length===0) inputHTML='<p>&nbsp;</p><h3>&nbsp;&nbsp;There are no roles available.</h3>';
  vex.dialog.alert({
      message: title,
      input: [
          '<style>',
              '.vex-custom-field-wrapper {',
                  'margin: 1em 0;',
              '}',
              '.vex-custom-field-wrapper > label {',
                  'display: inline-block;',
                  'margin-bottom: .2em;',
              '}',
          '</style>',
          inputHTML
      ].join('')
  })
};

function doResetGrid(t) {
    setTimeout(function() {
        resetGridMasonFunction(t);
    }, 144);
};

var selectOptionsQueryGenres = {
  Feature: 'mixedgenres',
  Indie: 'mixedgenres',
  Series: 'mixedgenres',
  Sketch: 'mixedgenres',
  Animations: 'mixedgenres',
  Theater: 'mixedgenres',
  Ensemble: 'audiogenres',
  Performance: 'performancegenres',
  'Music Video': 'audiogenres',
  Podcast: 'podcastgenres',
  Other: 'audiogenres'
};

Template.projectTabs.onRendered(function() {
    $(document).ready(function() {

        if (localStorage.getItem('doShowLock')==='true'||localStorage.getItem('doShowLock')===true) {
          setTimeout(function() {
            localStorage.setItem('doShowLock', false);
            lock.show();
          }, 1597); 
        };

        setTimeout(function() { $('#createyourownbutton').removeClass('animated'); }, 2999);
    });
});

Template.projectTabs.helpers({
  defaultQ: function() {
    return this.logline||this.descriptionText||'click <code>DETAILS</code> for more info';
  },

  producerReady: function() {
    return !(Meteor.user() && Meteor.user().didSetProfile);
  },
  formattedTitle: function() {
    if (this.title.length>25) return this.title.substr(0, 23)+'..';
    return this.title;
  },
  counts3: function() {
    var x = Session.get('pCount');
    x = x || 0;
    return x > 3 && Meteor.user();
  },
  counts30: function() {
    var myId = Meteor.user&&Meteor.user()&&Meteor.user()._id||'aaa';
    var p = Projects.find( {archived: false, ownerId: {$ne: myId}} );
    return p.count() > 30;
  },
  needsReset: function() {
    return Session.get('needsResetOption') || false;
  },
  projects: function () {
    var myId = Meteor.user&&Meteor.user()&&Meteor.user()._id||'aaa';
    var pLimit = Session.get('pLimit') || 30;
    Session.set('pLimit', pLimit);
    if (Session.equals('order', 'hot')) {
      /** remove all els, & init grid */
      var p = Projects.find({archived: false/*, ownerId: {$ne: myId}*/}, {sort: {count: -1, createTimeActual: -1, title: 1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      Session.set('pCount', p.count());
      return p;
    }
    else if (Session.equals('order', 'top')){
      /** remove all els, & init grid */
      var p = Projects.find({archived: false/*, ownerId: {$ne: myId}*/}, {sort: {count: -1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      Session.set('pCount', p.count());
      return p;
    }
    else if (Session.equals('order', 'newest')) {
      /** remove all els, & init grid */
      var p = Projects.find({archived: false/*, ownerId: {$ne: myId}*/}, {sort: {createTimeActual: -1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      Session.set('pCount', p.count());
      return p;
    }
    else if (Session.equals('order', 'alphabetical')) {
      /** remove all els, & init grid */
      var p = Projects.find({archived: false/*, ownerId: {$ne: myId}*/}, {sort: {title: 1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      Session.set('pCount', p.count());
      return p;
    }
    else if (Session.equals('order', 'flavor')) {
      /** remove all els, & init grid */
      var query = {
        archived: false
      }
      var cat = Session.get('selectedCategory');
      var gen = Session.get('selectedGenre');
      if (cat) query.purpose = cat;
      if (gen) query.genre = gen;
      var p = Projects.find(query, {sort: {createTimeActual: -1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      Session.set('pCount', p.count());
      return p;
    }
    else if (Session.equals('order', 'distance')) {
      /** remove all els, & init grid */
      /** get location coords, search project by distance */
      var METERS_PER_MILE = 1609.34
      var query = {
        archived: false,
        ownerId: {$ne: myId},
        location: { 
          $near: { 
            $geometry: { 
              type: "Point", coordinates: Session.get('locationFilter') 
            }, 
            $maxDistance: 50 * METERS_PER_MILE 
          } 
        }
      }
      /** has cat? */

      /** has genre? */
      var cat = Session.get('selectedCategory');
      var gen = Session.get('selectedGenre');
      if (cat) query.purpose = cat;
      if (gen) query.genre = gen;
      var p = Projects.find(query, {sort: {createTimeActual: -1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      Session.set('pCount', p.count());
      return p;
    }
    else { /*by default the tab is on hot, in hot order */
      var p = Projects.find({archived: false/*, ownerId: {$ne: myId}*/}, {sort: {count: -1, createTimeActual: -1, title: 1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      Session.set('pCount', p.count());
      return p;
    }
  }
});

Template.projectTabs.events({
  'click .create': function() {
    if (Meteor.user()) {
      return
    };
    localStorage.setItem('redirectURL', '/create');
    lock.show();
  },
  "click .next": function() {
    if (Session.get('pCount')<Session.get('pLimit')) return;
    var s = Session.get('pSkip');
    s = s + 30;
    Session.set('pSkip', s);
    doResetGrid($);
  },
  "click .previous": function() {
    var s = Session.get('pSkip');
    if (s !== 0 && s > 0) {
      s = s - 30;
      Session.set('pSkip', s);
      doResetGrid($);
    }
  },
  'change #categories_select': function(e) {
    e.preventDefault();
    $('.subtype_genres').removeClass('opened');
    $('.subtype_genres').hide();
    var selectedCat = $('#categories_select').find(":selected").text();
    if (selectedCat.indexOf('Category')===-1) {
      $('#'+selectOptionsQueryGenres[selectedCat]).show();
    }
  },
  'click #clear_query_filter': function(e) {
    e.preventDefault();
    Session.set('order', 'hot');
    Session.set('needsResetOption', false);
    Session.set('locationFilter', null);
    Session.set('selectedCategory', null);
    Session.set('selectedGenre', null);
    /** reset all options */
    $('#categories_select').val('Select Category');
    $('#postal_code').val('');
    $('#mmg').val('Select Genre');
    $('#aug').val('Select Genre');
    $('#tpg').val('Select Genre');
    $('#prg').val('Select Genre');
    $('.subtype_genres').removeClass('opened');
    $('.subtype_genres').hide();
  },
  'click #query_filter': function(e) {
    e.preventDefault();
    Session.set('doShowFilterOptions', true);
    setTimeout(function() {
      Session.set('needsResetOption', true);
    }, 610);
    Session.set('order', null);
    Session.set('locationFilter', null);
    Session.set('selectedCategory', null);
    Session.set('selectedGenre', null);
    var query = {};
    var foundVal = false;

    /** has cat? */
    var selectedCat = $('#categories_select').find(":selected").text();
    if (selectedCat.indexOf('Category')===-1) {
      Session.set('selectedCategory', selectedCat);
      foundVal = true;
    };

    /** has genre? */
    var selectedGen = $('.subtype_genres.opened').find(":selected").text();
    if (selectedGen&&selectedGen.indexOf('Genre')===-1) {
      Session.set('selectedGenre', selectedGen);
      foundVal = true;
    };

    var zip = $('#postal_code').val();
    if (zip.match(/\d{5}/)) {
      query.zip = zip;
      Meteor.call('locationFromZip', {
        zip: $('#postal_code').val()
      }, function(err, location) {
        if (location) {
          Session.set('locationFilter', location);
          $('.krown-id-item').remove();
          Session.set('order', 'distance');
          resetGridMasonFunction($);
        } else {
          if (foundVal) {
            $('.krown-id-item').remove();
            Session.set('order', 'flavor');
            resetGridMasonFunction($);
          }
        }
      })
    } else {
      if (foundVal) {
        $('.krown-id-item').remove();
        Session.set('order', 'flavor');
        resetGridMasonFunction($);
      };
    }
  }
});

Template.projectTab.events({
    'click .view_roles_conv': function(e) {
        e.preventDefault();
        displayRoleTypeDialog( 
          (
            (this.crew||[]).map(function(r){ 
              r.ctx='crew' 
              return r
            }).concat((this.cast||[]).map(function(r){ 
              r.ctx='cast' 
              return r
            }))).concat((this.needs||[]).map(function(r){ 
              r.ctx='need' 
              return r
        })));
    }
})

Template.projectTab.helpers({
  isHomePage: function() {
    if (window.location.href.indexOf('discover')===-1) return true
    return false
  },
  projectDonated: function() {
    return '$'+(Number.isInteger(parseInt(this.funded)) ? this.funded : 0)+' BUDGET';
  },
  defaultQ: function() {
    return this.logline||this.descriptionText||'click <code>DETAILS</code> for more info';
  },
  applicantLN: function() {
    var x = this.cast.length;
    var y = this.crew.length;
    return (x + y);
  },
  formattedTitle: function() {
    if (this.title.length>25) return this.title.substr(0, 23)+'..';
    return this.title;
  }
});

Template.settingsTab.helpers({
  projectDonated: function() {
    return '$'+(Number.isInteger(parseInt(this.funded)) ? this.funded : 0)+' RAISED';
  },
  defaultQ: function() {
    return this.logline||this.descriptionText||'click <code>DETAILS</code> for more info';
  },
  applicantLN: function() {
    var x = this.cast.filter(function(e){if(e.status==='needed')return true}).length;
    var y = this.crew.filter(function(e){if(e.status==='needed')return true}).length;
    return (x + y);
  },
  formattedTitle: function() {
    if (this.title.length>25) return this.title.substr(0, 23)+'..';
    return this.title;
  }
});

Template.settingsTab.events({
    'click .editcampconv': function(e) {
        // these nasty doubles are because of CSS artifacts
        // dirty workaround for intended behavior
        setTimeout(function() {
          simulateClick(document.getElementsByClassName('gotoedit')[0])
          setTimeout(function() {
              simulateClick(document.getElementsByClassName('gotoedit')[0])
              setTimeout(function() {
                  simulateClick(document.getElementsByClassName('gotoedit')[0])
                }, 144)
            }, 667)
        }, 987)
    }
})

Template.approvedTab.helpers({
  projectDonated: function() {
    return '$'+(Number.isInteger(parseInt(this.funded)) ? this.funded : 0)+' BUDGET';
  },
  defaultQ: function() {
    return this.logline||this.descriptionText||'click <code>DETAILS</code> for more info';
  },
  applicantLN: function() {
    var x = this.cast.filter(function(e){if(e.status==='needed')return true}).length;
    var y = this.crew.filter(function(e){if(e.status==='needed')return true}).length;
    return (x + y);
  },
  formattedTitle: function() {
    if (this.title.length>25) return this.title.substr(0, 23)+'..';
    return this.title;
  }
});

Template.projTab.helpers({
  defaultQ: function() {
    return this.logline||this.descriptionText||'click <code>DETAILS</code> for more info';
  },
  applicantLN: function() {
    var x = this.cast.filter(function(e){if(e.status==='needed')return true}).length;
    var y = this.crew.filter(function(e){if(e.status==='needed')return true}).length;
    return (x + y);
  },
  producerReady: function() {
    return !(Meteor.user() && Meteor.user().didSetProfile);
  },
  formattedTitle: function() {
    if (this.title.length>25) return this.title.substr(0, 23)+'..';
    return this.title;
  }
});

Template.projTab.events({
  'click .toProj': function(e) {
    e.preventDefault();
    var proj = $(this)[0];
    lock.show();
  }
});

