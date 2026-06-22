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

/* ===========================================================
   Hiệu ứng BỤI GỖ bay ở banner — JS thuần, độc lập với jQuery
   =========================================================== */
(function () {
  function initDust() {
    var canvas = document.querySelector(".hero-dust");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var hero = canvas.parentElement;
    var particles = [];
    var colors = ["rgba(214,168,98,", "rgba(196,142,74,", "rgba(232,200,142,", "rgba(168,126,72,"];
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function make(spread) {
      return {
        x: Math.random() * canvas.width,
        y: spread ? Math.random() * canvas.height : -8,
        r: rnd(1.4, 4.6),
        sx: rnd(-0.3, 0.3),
        sy: rnd(0.18, 0.8),
        a: rnd(0.4, 0.95),
        sway: rnd(0.005, 0.02),
        ph: Math.random() * Math.PI * 2,
        c: colors[Math.floor(Math.random() * colors.length)]
      };
    }
    function size() {
      canvas.width = hero.offsetWidth || window.innerWidth;
      canvas.height = hero.offsetHeight || 600;
      var count = Math.max(60, Math.round(canvas.width / 11));
      while (particles.length < count) particles.push(make(true));
      particles.length = count;
    }
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.ph += p.sway;
        p.x += p.sx + Math.sin(p.ph) * 0.3;
        p.y += p.sy;
        if (p.y > canvas.height + 6 || p.x < -6 || p.x > canvas.width + 6) {
          particles[i] = make(false);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + p.a + ")";
        ctx.shadowColor = "rgba(255,210,130,0.9)";
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      requestAnimationFrame(tick);
    }
    size();
    window.addEventListener("resize", size);
    requestAnimationFrame(tick);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDust);
  } else {
    initDust();
  }
})();
