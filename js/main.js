/* ===========================================================
   CÔNG TY TNHH LƯU BẢO ANH — main.js (jQuery)
   =========================================================== */
$(function () {
  "use strict";

  /* ---- Sticky header shadow on scroll ---- */
  var $header = $(".site-header");
  function onScroll() {
    var top = $(window).scrollTop();
    $header.toggleClass("scrolled", top > 50);
    $(".to-top").toggleClass("show", top > 400);
    revealOnScroll();
  }
  $(window).on("scroll", onScroll);

  /* ---- Mobile menu toggle ---- */
  $(".nav-toggle").on("click", function () {
    $(this).toggleClass("open");
    $(".main-nav").slideToggle(220);
  });
  // Đóng menu mobile khi resize lớn lại
  $(window).on("resize", function () {
    if ($(window).width() > 768) {
      $(".main-nav").removeAttr("style");
      $(".nav-toggle").removeClass("open");
    }
  });

  /* ---- Smooth scroll cho anchor nội trang ---- */
  $('a[href^="#"]').on("click", function (e) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: target.offset().top - 80 }, 500);
    }
  });

  /* ---- Back to top ---- */
  $(".to-top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });

  /* ---- Scroll reveal ---- */
  function revealOnScroll() {
    var winBottom = $(window).scrollTop() + $(window).height();
    $(".reveal:not(.in-view)").each(function () {
      if (winBottom - 80 > $(this).offset().top) {
        $(this).addClass("in-view");
      }
    });
  }
  revealOnScroll();

  /* ---- Chuyển ngôn ngữ (cờ Việt - Trung) ---- */
  var savedLang = null;
  try { savedLang = window.localStorage.getItem("lba_lang"); } catch (e) {}
  if (savedLang) {
    $(".lang-btn").removeClass("active");
    $('.lang-btn[data-lang="' + savedLang + '"]').addClass("active");
  }
  $(".lang-btn").on("click", function () {
    var lang = $(this).data("lang");
    $(".lang-btn").removeClass("active");
    $(this).addClass("active");
    try { window.localStorage.setItem("lba_lang", lang); } catch (e) {}
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh" : "vi");
  });

  /* ---- Lightbox cho gallery sản phẩm ---- */
  var $items = $(".gallery .g-item");
  if ($items.length) {
    var current = 0;
    var $lb = $(
      '<div class="lightbox">' +
        '<button class="lb-close" aria-label="Đóng">&times;</button>' +
        '<button class="lb-nav lb-prev" aria-label="Trước">&#10094;</button>' +
        '<img alt="Ảnh sản phẩm Lưu Bảo Anh">' +
        '<button class="lb-nav lb-next" aria-label="Sau">&#10095;</button>' +
      "</div>"
    ).appendTo("body");
    var $lbImg = $lb.find("img");

    function show(i) {
      current = (i + $items.length) % $items.length;
      var src = $items.eq(current).data("full") || $items.eq(current).find("img").attr("src");
      $lbImg.attr("src", src);
    }

    $items.on("click", function () {
      show($items.index(this));
      $lb.addClass("open");
    });
    $lb.find(".lb-close").on("click", function () { $lb.removeClass("open"); });
    $lb.find(".lb-next").on("click", function (e) { e.stopPropagation(); show(current + 1); });
    $lb.find(".lb-prev").on("click", function (e) { e.stopPropagation(); show(current - 1); });
    $lb.on("click", function (e) { if (e.target === this) $lb.removeClass("open"); });
    $(document).on("keydown", function (e) {
      if (!$lb.hasClass("open")) return;
      if (e.key === "Escape") $lb.removeClass("open");
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
  }
});
