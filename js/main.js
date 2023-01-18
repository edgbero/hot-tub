(function ($) {
  "use strict";
  
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
  
  // Price & Rental Durations

  var totalAddOnsPrice = 0;
  var totalHotTubPrice = 0;
  var totalPrice = 0;
  var totalWeeks = 1;

  var now = new Date();

  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + "-" + month + "-" + day;
  // $("#startDate").val(today);
  $("#startDate, #startDate-resp").val(moment(now).format("MMMM DD, YYYY"));

  now = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  day = ("0" + now.getDate()).slice(-2);
  month = ("0" + (now.getMonth() + 1)).slice(-2);
  today = now.getFullYear() + "-" + month + "-" + day;
  $("#endDate, #endDate-resp").val(moment(now).format("MMMM DD, YYYY"));

  // Rental Card
  $("#rental1, #rental2, #rental3").each(function () {
    $(this).on("click", function (e) {
      var data = $(e.currentTarget).data("rental");
      totalWeeks = data.week;
      totalHotTubPrice = data.price;

      // Active Product Card
      $("#bathub-card, #bathub-card-resp").find(".product-main").removeClass("active");
      $(this).closest(".product-main").addClass("active");

      // Summary Section
      $("#summary-main")
        .find(".summary-product, .summary-price, .summary-caption")
        .empty();
      $("#summary-main").find(".summary-product").append(data.title);
      $("#summary-main")
        .find(".summary-price")
        .append("$" + data.price);
      $("#summary-main")
        .find(".summary-caption.duration")
        .append("Rental Duration: " + data.duration);

      // Update Price of Add ons
      var temp = 0;
      $("#add-ons")
        .find(".summary-price a")
        .each(function () {
          var price = $(this).data("price");
          temp += price * data.week;
          $(this)
            .siblings("span")
            .text("$" + price * data.week);
        });

      totalPrice = data.price + temp;
      $(".summary-footer.text-right")
        .text("")
        .append("$" + totalPrice);

      // Update Calendar Durations
      var id = $(this).attr("id");
      $(".rental").find(".active").removeClass("active");
      $(this).addClass("active");
      now = new Date();

      switch (id) {
        case "rental1":
          now = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          day = ("0" + now.getDate()).slice(-2);
          month = ("0" + (now.getMonth() + 1)).slice(-2);
          today = now.getFullYear() + "-" + month + "-" + day;
          break;
        case "rental2":
          now = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
          day = ("0" + now.getDate()).slice(-2);
          month = ("0" + (now.getMonth() + 1)).slice(-2);
          today = now.getFullYear() + "-" + month + "-" + day;

          break;
        case "rental3":
          now = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          day = ("0" + now.getDate()).slice(-2);
          month = ("0" + (now.getMonth() + 1)).slice(-2);
          today = now.getFullYear() + "-" + month + "-" + day;
          break;
      }

      $("#endDate, #endDate-resp").val(moment(now).format("MMMM DD, YYYY"));
      $("#summary-main")
        .find("#start-date")
        .text(moment(new Date()).format("MMMM DD, YYYY"));
      $("#summary-main")
        .find("#end-date")
        .text(moment(new Date(today)).format("MMMM DD, YYYY"));
    });
  });

  /////////////////////////////////////////

  // Input Date

  $(".rental-calendar").datepicker({
    minDate: new Date(),
    dateFormat: "MM dd, yy",
    altFormat: "MM dd, yy",
  });
  $.datepicker.formatDate("MM dd, yy", new Date());

  $("#startDate").on("change", function () {
    var date = $(this).val();
    $("#summary-main").find("#start-date").text(date);
  });

  $("#endDate").on("change", function () {
    var date = $(this).val();
    $("#summary-main").find("#end-date").text(date);
  });

  /////////////////////////////////////////

  // Add Ons

  // Remove Add Ons
  $.fn.removeAddOns = function (id, totalPrice, price) {
    var element = $(`#${id}`);
    element.remove();

    totalAddOnsPrice = totalAddOnsPrice - price;
    totalPrice = totalPrice - price;
    $(".summary-footer.text-right")
      .text("")
      .append("$" + totalPrice);
  };

  // On Click Add Ons Checkbox
  $('input[id^="addons"]').each(function () {
    $(this).on("click", function () {
      var data = $(this).data("input");
      var addOnsPrice = data.price * totalWeeks;

      var id = data.id;
      if ($(this).is(":checked")) {
        // Append Element On Add Ons - Summary Card
        var element =
          "<div id=" +
          data.title +
          '><div class="row"><div class="col-xs-8"><h4 class="summary-product">' +
          data.title +
          '</h4></div><div class="col-xs-4"><h4 class="summary-price"><span>$' +
          data.price * totalWeeks +
          '</span><a href="#remove-addons-modal" data-toggle="modal" data-id=' +
          id +
          " data-price=" +
          data.price +
          '><img class="icon" src="./img/trash.png" alt=""/></a> </h4></div></div><p class="summary-caption">' +
          data.caption +
          "</p></div>";
        $("#add-ons").append(element);

        totalAddOnsPrice = totalAddOnsPrice + addOnsPrice;
        totalPrice = totalHotTubPrice + totalAddOnsPrice;
        $(".summary-footer.text-right")
          .text("")
          .append("$" + (totalHotTubPrice + totalAddOnsPrice));
      } else {
        // Remove Add Ons
        // $(this).removeAddOns(id, totalPrice, addOnsPrice);
        var element = $(`#${id}`);
        element.remove();
        totalAddOnsPrice = totalAddOnsPrice - addOnsPrice;
        totalPrice = totalPrice - addOnsPrice;
        $("#myCheckbox").prop("checked", false); // Uncheck
        $(".summary-footer.text-right").text("$" + totalPrice);
      }
    });
  });

  // Add Ons Modal
  $("#remove-addons-modal").on("show.bs.modal", function (e) {
    var data = $(e.relatedTarget).data();

    var id = data.id;
    var price = data.price;

    // Delete Button
    $(".modal-delete-button")
      .off("click")
      .on("click", function () {
        var element = $(`#${id}`);
        element.remove();

        totalAddOnsPrice = totalAddOnsPrice - price * totalWeeks;
        totalPrice = totalPrice - price * totalWeeks;

        $(".summary-footer.text-right").text("$" + totalPrice);

        // Uncheck Checkbox
        $('input[id^="addons"]').each(function () {
          var element = new jQuery(this);
          if (element.data("input").id.toLowerCase() === id.toLowerCase()) {
            $(this).prop("checked", false);
          }
        });

        $("#remove-addons-modal").modal("hide");
      });

    // Cancel Button
    $(".modal-cancel-button").on("click", function (e) {
      $("#remove-addons-modal").modal("hide");
    });
  });

  /////////////////////////////////////////

  // Back & Continue Button
  var step = 0;
  $("#continue-btn, #continue-btn-resp").on("click", function () {
    step = step + 1;
    switch (step) {
      case 1:
        $("#bathub-card, #bathub-card-resp").css("display", "none");
        $("#delivery-address, #delivery-address-resp").css("display", "block");
        $("#delivery-address-nav, #delivery-address-nav-resp").addClass("active");
        $("#back-btn, #back-btn-resp").css("display", "block");
        $("#continue-btn, #continue-btn-resp").css("width", "60%");
        break;
      case 2:
        $("#delivery-address, #delivery-address-resp").css("display", "none");
        $("#payment, #payment-resp").css("display", "block");
        $("#payment-nav, #payment-nav-resp").addClass("active");
        break;
      case 3:
        window.location.href = "./success.html";
        break;
    }
  });

  $("#back-btn, #back-btn-resp").on("click", function () {
    step = step - 1;

    switch (step) {
      case 0:
        $("#bathub-card, #bathub-card-resp").css("display", "block");
        $("#delivery-address, #delivery-address-resp").css("display", "none");
        $("#delivery-address-nav, #delivery-address-nav-resp").removeClass("active");
        $("#back-btn, #back-btn-resp").css("display", "none");
        $("#continue-btn, #continue-btn-resp").css("width", "100%");
        break;
      case 1:
        $("#delivery-address, #delivery-address-resp").css("display", "block");
        $("#payment, #payment-resp").css("display", "none");
        $("#payment-nav, #payment-nav-resp").removeClass("active");
        break;
    }
  });

  /////////////////////////////////////////

  // Products Slick
  $(".products-slick").each(function () {
    var $this = $(this),
      $nav = $this.attr("data-nav");
    
      console.log()

    $this.slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: false,
      infinite: true,
      speed: 300,
      dots: true,
      arrows: false,
      responsive: [
        {
          breakpoint: 991,
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
