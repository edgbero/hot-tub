(function ($) {
  "use strict";

  // Mobile Nav toggle
  $(".menu-toggle > a").on("click", function (e) {
    e.preventDefault();
    $("#responsive-nav").toggleClass("active");
  });

  // Fix cart dropdown from closing
  $(".cart-dropdown").on("click", function (e) {
    e.stopPropagation();
  });

  /////////////////////////////////////////

  // Product Detail Modal
  $("#product-modal").on("show.bs.modal", function (e) {
    var title = $(e.relatedTarget).data("title");
    var image = $(e.relatedTarget).data("image");
    var content = $(e.relatedTarget).data("content");
    $(e.currentTarget).find("#modal-product-img").attr("src", image);
    $(e.currentTarget).find(".modal-title").text(title);

    $("#product-modal .modal-product-content").empty();
    for (var i = 0; i < content.length; i++) {
      $("#product-modal .modal-product-content").append(
        "<li>" + content[i] + "</li>"
      );
    }
  });

  /////////////////////////////////////////

  // Product Checkout
  $(".product-main").on("click", function (e) {
    var title = $(e.currentTarget).data("title");
    var price = $(e.currentTarget).data("price");
    $("#bathub-card").find(".product-main").removeClass("active");
    $(e.currentTarget).addClass("active");

    // Summary Section
    $("#summary-main").find(".summary-product").empty();
    $("#summary-main").find(".summary-price").empty();
    $("#summary-main").find(".summary-caption").empty();
    $("#summary-main-footer.text-right").empty();
    $("#summary-main").find(".summary-product").append(title);
    $("#summary-main")
      .find(".summary-price")
      .append("$" + price);
    $("#summary-main").find(".summary-caption").append("1 week");

    var totalPrice =
      parseInt($(".summary-footer.text-right").text().substr(1, 10)) || 0;
    $(".summary-footer.text-right")
      .text("")
      .append("$" + (totalPrice === 0 ? totalPrice + price : totalPrice));
  });

  /////////////////////////////////////////
  // Add Ons

  // Remove Add Ons
  (function ($) {
    $.fn.removeAddOns = function (id, totalPrice, price) {
      var element = $(`#${id}`);
      element.remove();

      $(".summary-footer.text-right")
        .text("")
        .append("$" + (totalPrice - price));
    };
  })(jQuery);

  // On Click Add Ons Checkbox
  $('input[id^="addons"]').each(function () {
    $(this).click(function () {
      var data = $(this).data("input");

      var id = data.id;
      var totalPrice =
        parseInt($(".summary-footer.text-right").text().substr(1, 10)) || 0;

      if ($(this).is(":checked")) {
        $(".summary-footer.text-right")
          .text("")
          .append("$" + (totalPrice + data.price));

        // Append Element On Add Ons - Summary Card
        var element =
          "<div id=" +
          data.title +
          '><div class="row"><div class="col-md-8"><h4 class="summary-product">' +
          data.title +
          '</h4></div><div class="col-md-4"><h4 class="summary-price">$' +
          data.price +
          '<a href="#remove-addons-modal" data-toggle="modal" data-id=' +
          id +
          " data-price=" +
          data.price +
          '><img class="icon" src="./img/trash.png" alt=""/></a> </h4></div></div><p class="summary-caption">' +
          data.caption +
          "</p></div>";
        $("#add-ons").append(element);

        $(".summary-footer.text-right")
          .text("")
          .append("$" + (totalPrice + data.price));
      } else {
        // Remove Add Ons
        $(this).removeAddOns(id, totalPrice, data.price);
        $("#myCheckbox").prop("checked", false); // Unchecks it
      }
    });
  });

  // Add Ons Modal
  $("#remove-addons-modal").on("show.bs.modal", function (e) {
    var data = $(e.relatedTarget).data();
    var id = data.id;
    var price = data.price;
    var totalPrice =
      parseInt($(".summary-footer.text-right").text().substr(1, 10)) || 0;

    // Cancel Button
    $(".modal-cancel-button").on("click", function (e) {
      $(this).removeAddOns(id, totalPrice, price);

      // Uncheck Checkbox
      $('input[id^="addons"]').each(function () {
        var element = new jQuery(this);
        if (element.data("input").id.toLowerCase() === id.toLowerCase()) {
          $(this).prop("checked", false);
        }
      });

      $("#remove-addons-modal").modal("toggle");
    });

    // Delete Button
    $(".modal-delete-button").on("click", function (e) {
      $("#remove-addons-modal").modal("toggle");
    });
  });

  /////////////////////////////////////////

  // Back & Continue Button
  var step = 0;
  $("#continue-btn").on("click", function () {
    step = step + 1;
    switch (step) {
      case 1:
        $("#bathub-card").css("display", "none");
        $("#rental-durations").css("display", "block");
        $("#rental-duration-nav").addClass("active");
        $("#back-btn").css("display", "block");
        $("#continue-btn").css("width", "60%");
        break;
      case 2:
        $("#rental-durations").css("display", "none");
        $("#delivery-address").css("display", "block");
        $("#delivery-address-nav").addClass("active");
        break;
      case 3:
        $("#delivery-address").css("display", "none");
        $("#payment").css("display", "block");
        $("#payment-nav").addClass("active");
        break;
      case 4:
        window.location.href = "./success.html";
        break;
    }
  });

  $("#back-btn").on("click", function () {
    step = step - 1;

    switch (step) {
      case 0:
        $("#bathub-card").css("display", "block");
        $("#rental-durations").css("display", "none");
        $("#rental-duration-nav").removeClass("active");
        $("#back-btn").css("display", "none");
        $("#continue-btn").css("width", "100%");
        break;
      case 1:
        $("#rental-durations").css("display", "block");
        $("#delivery-address").css("display", "none");
        $("#delivery-address-nav").removeClass("active");
        break;
      case 2:
        $("#delivery-address").css("display", "block");
        $("#payment").css("display", "none");
        $("#payment-nav").removeClass("active");
        break;
    }
  });

  /////////////////////////////////////////

  // Rental Durations
  var now = new Date();

  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + "-" + month + "-" + day;
  $("#startDate").val(today);

  now = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  day = ("0" + now.getDate()).slice(-2);
  month = ("0" + (now.getMonth() + 1)).slice(-2);
  today = now.getFullYear() + "-" + month + "-" + day;
  $("#endDate").val(today);

  // Rental Card
  $("#rental1, #rental2, #rental3").each(function () {
    $(this).on("click", function () {
      var id = $(this).attr("id");
      $(".rental-list").find(".active").removeClass("active");
      $(this).addClass("active");
      now = new Date();

      switch (id) {
        case "rental1":
          now = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          day = ("0" + now.getDate()).slice(-2);
          month = ("0" + (now.getMonth() + 1)).slice(-2);
          today = now.getFullYear() + "-" + month + "-" + day;
          $("#endDate").val(today);
          break;
        case "rental2":
          now = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
          day = ("0" + now.getDate()).slice(-2);
          month = ("0" + (now.getMonth() + 1)).slice(-2);
          today = now.getFullYear() + "-" + month + "-" + day;
          $("#endDate").val(today);
          break;
        case "rental3":
          now = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          day = ("0" + now.getDate()).slice(-2);
          month = ("0" + (now.getMonth() + 1)).slice(-2);
          today = now.getFullYear() + "-" + month + "-" + day;
          $("#endDate").val(today);
          break;
      }
    });
  });

  /////////////////////////////////////////

  // Products Slick
  $(".products-slick").each(function () {
    var $this = $(this),
      $nav = $this.attr("data-nav");

    $this.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      infinite: true,
      speed: 300,
      dots: false,
      arrows: false,
      appendArrows: $nav ? $nav : false,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  });

  /////////////////////////////////////////
})(jQuery);
