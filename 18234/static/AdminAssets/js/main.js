(function ($) {
  "use strict";

  // Spinner hide
  setTimeout(function () {
    $('#spinner').removeClass('show');
  }, 1);

  // Back to top
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) $('.back-to-top').fadeIn('slow');
    else $('.back-to-top').fadeOut('slow');
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
    return false;
  });

  // Sidebar toggle
  $('.sidebar-toggler').click(function () {
    $('.sidebar, .content').toggleClass("open");
    return false;
  });

  // Progress bars (waypoints)
  $('.pg-bar').waypoint(function () {
    $('.progress .progress-bar').each(function () {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, { offset: '80%' });

  // Calendar
  if ($('#calender').length) {
    $('#calender').datetimepicker({ inline: true, format: 'L' });
  }

  // Carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    items: 1,
    dots: true,
    loop: true,
    nav: false
  });

  // Charts
  Chart.defaults.color = "#6C7293";
  Chart.defaults.borderColor = "#000";

  const chartData = {
    labels: ["2016","2017","2018","2019","2020","2021","2022"],
    datasets: [
      { label: "USA", backgroundColor: "rgba(235,22,22, .7)", data: [15,30,55,65,60,80,95] },
      { label: "UK", backgroundColor: "rgba(235,22,22, .5)", data: [8,35,40,60,70,55,75] },
      { label: "AU", backgroundColor: "rgba(235,22,22, .3)", data: [12,25,45,55,65,70,60] }
    ]
  };

  if ($("#worldwide-sales").length) {
    new Chart($("#worldwide-sales").get(0).getContext("2d"), { type: "bar", data: chartData, options: { responsive: true } });
  }

  if ($("#salse-revenue").length) {
    new Chart($("#salse-revenue").get(0).getContext("2d"), {
      type: "line", data: {
        labels: chartData.labels,
        datasets: [
          { label: "Salse", data: [15,30,55,45,70,65,85], backgroundColor: "rgba(235,22,22, .7)", fill: true },
          { label: "Revenue", data: [99,135,170,130,190,180,270], backgroundColor: "rgba(235,22,22, .5)", fill: true }
        ]
      },
      options: { responsive: true }
    });
  }

  const singleLineData = { labels:[50,60,70,80,90,100,110,120,130,140,150], datasets:[{label:"Salse", data:[7,8,8,9,9,9,10,11,14,14,15], backgroundColor:"rgba(235,22,22, .7)", fill:false}]};
  if ($("#line-chart").length) {
    new Chart($("#line-chart").get(0).getContext("2d"), { type:"line", data: singleLineData, options:{ responsive:true } });
  }

  if ($("#bar-chart").length) {
    new Chart($("#bar-chart").get(0).getContext("2d"), {
      type:"bar", data: { labels:["Italy","France","Spain","USA","Argentina"], datasets:[{ data:[55,49,44,24,15], backgroundColor:["rgba(235,22,22,.7)","rgba(235,22,22,.6)","rgba(235,22,22,.5)","rgba(235,22,22,.4)","rgba(235,22,22,.3)"] }] },
      options:{ responsive:true }
    });
  }

  if ($("#pie-chart").length) {
    new Chart($("#pie-chart").get(0).getContext("2d"), {
      type:"pie", data: { labels:["Italy","France","Spain","USA","Argentina"], datasets:[{ data:[55,49,44,24,15], backgroundColor:["rgba(235,22,22,.7)","rgba(235,22,22,.6)","rgba(235,22,22,.5)","rgba(235,22,22,.4)","rgba(235,22,22,.3)"] }] },
      options:{ responsive:true }
    });
  }

  if ($("#doughnut-chart").length) {
    new Chart($("#doughnut-chart").get(0).getContext("2d"), {
      type:"doughnut", data: { labels:["Italy","France","Spain","USA","Argentina"], datasets:[{ data:[55,49,44,24,15], backgroundColor:["rgba(235,22,22,.7)","rgba(235,22,22,.6)","rgba(235,22,22,.5)","rgba(235,22,22,.4)","rgba(235,22,22,.3)"] }] },
      options:{ responsive:true }
    });
  }

})(jQuery);
