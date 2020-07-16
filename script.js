//Get date and time from Moment
$("p#displayMoment").text(moment().format('MMMM Do YYYY, h:mm:ss a'));
//$("#btn2").click(function(){
//   $(".app").append('<input class="input-block-level" type="text" name="newfield" id="newField" placeholder="New Field">'
 
// $(".btn-outline-secondary").click(function(){
//     $(".dropdown-item").append("<button class="dropdown-item"type="button">"$("input")"</button>")
//});
$("#searchButton").click(() =>{
var searchValue = $("#citySearch").val()
console.log(searchValue);
$.ajax({url:"http://api.openweathermap.org/data/2.5/forecast?q="+ searchValue +"&appid=4b8f42495b386811122e257360fc18ce&units=metric", method: "GET"})



    .then(function (response) {
      for (var i = 0; i < response.list.length; i++) {
        console.log(response.list[i].dt_txt);
        //if statement using .includes
      }
      $('.city').text(response.name)
      $('.wind').text(response.wind.speed + " m/h")
      $('.humidity').text(response.main.humidity + " %")
      $('.temp').text(response.main.temp +" Celcius")
});
});
//Ajax call




// $(document).ready(function() {
//     $("#search-button").on("click", function() {
//         var searchValue = $("#search-value").val();
//         //clear input box
//         $("#search-value").val("");
//         searchWeather(searchValue);
//     });
//     $(".history").on("click", "li", function() {
//         searchWeather($(this).text());
//       });
//     function makeRow(text) {
//         var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
//         $(".history").append(li);
//     }
//     function searchWeater(searchValue) {
//       $.ajax({
//         type: "GET",
//         url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=7ba67ac190f85fdba2e2dc6b9d32e93c&units=imperial", 
//         dataType: "json",
//         success: function(data) {
//                 //create history link for this search
//             if (history.indexOf(searchValue) === -1) {
//               history.push(searchValue);
//               window.localStorage.setItem("history", JSON.stringify(history));
//               makeRow(searchValue);
//             }
//                 //clear any old content
//                 $("#today").empty();
//                 //create html content for current weather
//                 var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
//                 var card = $("<div>").addClass("card");
//                 var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + "MPH");
//                 var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
//                 var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + "°F");
//                 var cardBody = $("<div>").addClass("card-body");
//                 var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
//                 //merge and add to page...connects returned data to page
//                 title.append(img);
//                 cardBody.append(title, temp, humid, wind);
//                 card.append(cardBody);
//                 $("#today").append(card);
//                 //call follow-up API endpoints
//                 getForecast(searchValue);
//                 getUVIndex(data.coord.lat, data.coord.lon);
//             }
//         });
//     }
//     function getForecast(searchValue) {
//       $.ajax({
//         type: "GET",
//         url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=7ba67ac190f85fdba2e2dc6b9d32e93c&units=imperial",
//         dataType: "json",
//         success: function(data) {
//           //overwrite any existing content with title and empty row
//           $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
//           //loop over all forecasts (by 3-hour increments)
//           for (var i = 0; i < data.list.length; i++) {
//                 //only look at forecasts around 3pm
//                 if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
//                   //create html elements for bootstrap card
//                   var col = $("<div>").addClass("col-md-2");
//                   var card = $("<div>").addClass("card bg-primary text-white");
//                   var body = $("<div>").addClass("card-body p-2");
//                   var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
//                   var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
//                   var p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + "°F");
//                   var p2 = $("<p>").addClass("card-text")("Humidity: " + data.list[i].main.humidity + "%");
//                   //merge together and put onto page
//                   col.append(card.append(body.append(title, img, p1, p2)));
//                   $("#forecast .row").append(col);
//                 }
//             }
//         }
//     });
// }
// function getUVIndex(lat, lon) {
//   $.ajax({
//     type: "GET",
//     url: "http://api.openweathermap.org/data/2.5/uvi?appid=7ba67ac190f85fdba2e2dc6b9d32e93c&lat=" + lat - "&lon=" + lon, 
//     dataType: "json",
//     success: function(data) {
//         var uv = $("<p>").text("UV Index: ");
//         var btn = $("<span>").addClass("btn btn-sm").text(data.value);
//         //change color depending on UV value
//         if (data.value < 3) {
//             btn.addClass("btn-success");
//         }
//         else if (data.value < 7) {
//             btn.addClass("btn-warning");
//         }
//         else {
//             btn.addClass("btn-danger");
//         }
//         $("#today .card-body").append(uv.append(btn));
//        }
//      });
//    }
 
//    //get current history, if any
//    var history = JSON.parse(window.localStorage.getItem("history")) || [];
//    if (history.length > 0) {
//        searchWeather(history[history.length-1]);
//    }
//    for (var i = 0; i < history.length; i++) {
//        makeRow(history[i]);
//    }
// });
// Collapse








