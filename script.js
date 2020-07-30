//call for UV Index
function getAndDisplayUVIndex(lon, lat){
  let queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=c53c7a5db8feb576c94526d1ba37eee7&lat="+lat+"&lon="+lon;
  
  $.ajax({
      url: queryURL,
      method:"GET"
  }).then(function(response){
      let uvIndex = response.value
      let currentUV = $("<div></div>").text("UV Index: ")
      let spanEl = $("<span></span>").text(uvIndex);

      let uvBackground = (uvIndex<=2) ? "uvLow": 
      (uvIndex<=5 && uvIndex>2)? "uvModerate": 
      (uvIndex<=7 && uvIndex>5)? "uvHigh": 
      (uvIndex<=10 &&uvIndex>7)? "uvVeryHigh": "uvExtreme";

      spanEl.attr("class", uvBackground);

      currentUV.append(spanEl);
      $("#currentCard-stats").append(currentUV);
  })

}

//Display current weather
function displayCurrentWeather(currentData){
  $("#currentCard-img").empty();
  $("#currentCard-stats").empty();

  let imgSrc = "https://openweathermap.org/img/wn/"+currentData.weather[0].icon+"@2x.png";

  let currentImg = $("<img id='currentIcon'>");
  currentImg.attr("src", imgSrc);

  let roundedTemp = currentData.main.temp;
  roundedTemp = Math.round(parseInt(roundedTemp));
  console.log(roundedTemp);
  let currentTemp = $("<div></div>").text(`Temperature: ${roundedTemp}F`);
  
  let currentHumidity = $("<div></div>").text("Humidity: "+currentData.main.humidity+"%");

  let currentWind = $("<div></div>").text("Wind Speed: "+currentData.wind.speed+" mph")
  
  getAndDisplayUVIndex(currentData.coord.lon, currentData.coord.lat)

  let currentDate = new Date();
  currentDate = formatDate(currentDate);

  $("#currentCard-cityName").text(currentData.name + " - "+ currentDate);
  $("#currentCard-img").append(currentImg);
  $("#currentCard-img").css("text-align", "center");
  $("#currentCard-stats").append(currentTemp);
  $("#currentCard-stats").append(currentHumidity);
  $("#currentCard-stats").append(currentWind);
  
};

//put state in proper format for ajax call
function statecheck(str){
  let count = 0;
  let index;   

  for(let i = 0; i<str.length; i++){
      if(str[i]===","){
          ++count;
      };
  };
  if (count===1){
      index = str.search(",")+1;
      let subStr = str.substr(index);
      for (let i = 0; i<stateAbbreviations.length; i++){
          subStr = subStr.toUpperCase(subStr);
          if(stateAbbreviations[i]=== subStr){
              str = str.substr(0,index)+""+subStr+",us"
          };
      };
  };
  return str;
};

//format the date
function formatDate(dateStr){
  const d = new Date(dateStr)
  const year = d.getFullYear();
  const day = d.getDate();
  const month = d.getMonth()+1;

  let date = month+"/"+day+"/"+year;

  return date;
};

//format the city
function formatCityStr(str){
  let cityName = str;

  cityName=cityName.split("").join("");
  cityName=cityName.toLowerCase();
  cityName= statecheck(cityName);

  return cityName;
};

//format current date
let now = new Date("December 25, 2020");
console.log(now.getDate());
function displayForecastWeather(forecastData){
  
  let forecastArr = forecastData.list;
  let j = 0;

  //loop over returned data for img, temp, date, humidity
  for (let i =0; i<40; i+=8){
      let imgSrc = "http://openweathermap.org/img/wn/"+forecastArr[i].weather[0].icon+"@2x.png";

      let forecastImg = $("<img>");

      forecastImg.attr("src", imgSrc);
      forecastImg.css("margin", "0 auto");
      forecastImg.css("display", "block");

      let formattedDate = new Date(formatDate(forecastArr[i].dt_txt)).toDateString();
      
      let forecastDateDiv = $("<div></div>").css("font-weight", "bold");
      forecastDateDiv.text(formattedDate)

      let roundedTemp = Math.round(parseInt(forecastArr[i].main.temp));
      let forecastTemp = $("<div></div>").text("Temp: "+ roundedTemp+"F");

      let forecastHumidity = $("<div></div>").text("Humidity: "+ forecastArr[i].main.humidity+"%");

      let forecastChild = "#forcast-"+j;
      
      $(forecastChild).empty();

      $(forecastChild).append(forecastDateDiv);
      $(forecastChild).append(forecastImg);
      $(forecastChild).append(forecastTemp);
      $(forecastChild).append(forecastHumidity);
      $(forecastChild).css("text-align", "center");
      $(forecastChild).css("margin-bottom", "10px");

      j++;
  };

};

//create and display previous cities searched
function displaySearchHistory(){
  $("#pastCityList").empty();
  if("weatherSearchHistory" in localStorage){
      let jsonStr = localStorage.getItem("weatherSearchHistory");
      let cityArr = JSON.parse(jsonStr);

      for (const city in cityArr){
          let liEl = $("<li></li>");
          let aEl =$("<a></a>");
          let capCity = cityArr[city].name.split("");
          capCity[0] = capCity[0].toUpperCase();
          capCity = capCity.join("");
          aEl.text(capCity);
          aEl.attr("href", "#");
          aEl.attr("id", cityArr[city].name);
          aEl.css("text-decoration", "none");
          aEl.addClass("searchedCity");
          liEl.prepend(aEl);        
        
          liEl.attr("style", "list-style: none;");
          $("#pastCityList").prepend(liEl);
      };
  } else{
      $("#pastCityList").text("Use the Search function to get started")
  };
};

//add searched city to local storage
function updateSearchHistory(city){
  let cityArr = [];
  let isSearchedBefore = false;
  let cityObj = {name:city};

  if("weatherSearchHistory" in localStorage){
      let jsonStr = localStorage.getItem("weatherSearchHistory");
      cityArr = JSON.parse(jsonStr);

      for (let i = 0; i<cityArr.length; i++){
          if(cityArr[i].name===city){
              isSearchedBefore =true;
          }
      }

      if(isSearchedBefore === false){
          cityArr.unshift(cityObj);
      }

      if(cityArr.length>10){
          cityArr.length=10;
      };

      localStorage.setItem("weatherSearchHistory", JSON.stringify(cityArr));
  };

  if(localStorage.getItem("weatherSearchHistory")===null){
      cityArr.push(cityObj);
      localStorage.setItem("weatherSearchHistory", JSON.stringify(cityArr));
  };
  
  displaySearchHistory();
};

//ajax call for weather
function getWeatherData(cityStr){
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityStr+"&appid=c53c7a5db8feb576c94526d1ba37eee7&units=imperial"

  $.ajax({
      url:queryURL,
      method: "GET"        
  }).then(function(response){
      displayCurrentWeather(response);
  })

  let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityStr+"&appid=c53c7a5db8feb576c94526d1ba37eee7&units=imperial"

  $.ajax({
      url:forecastQueryURL,
      method:"GET"
  }).then(function(response){
      displayForecastWeather(response);
  });

};

//show recently search history from local storage
function renderRecentCitySearch(){
  if("weatherSearchHistory" in localStorage){
      let jsonStr = localStorage.getItem("weatherSearchHistory");
      let cityArr = JSON.parse(jsonStr);
      let city = cityArr[0].name;
      city = formatCityStr(city);
      getWeatherData(city);
  };
};

//create and render weather cards
function renderWeatherCards(){
  
  let flexContainerEl = $("<div></div>").attr("class", "flex-container");

  let weatherSectionEl = $("<section></section>").attr("class", "cityCurrentWeather");
  let weatherCardEl = $("<div></div>").attr("class", "currentWeatherCard");
  let citySpanEl = $("<span></span>").attr("id", "currentCard-cityName");
  let innerFlex1El = $("<div></div>").attr("class", "flex-container");
  let weatherImgDivEl= $("<div></div>").attr("id", "currentCard-img").attr("class", "flex-child");
  let weatherStatsDivEl = $("<div></div>").attr("id","currentCard-stats").attr("class", "flex-child");

  innerFlex1El.append(weatherImgDivEl);
  innerFlex1El.append(weatherStatsDivEl);
  weatherCardEl.append(citySpanEl);
  weatherCardEl.append(innerFlex1El);
  weatherSectionEl.append(weatherCardEl);
  flexContainerEl.append(weatherSectionEl);

  let forecastSectionEl = $("<section></section").attr("class", "cityForcastWeather");
  let forecastCardEl = $("<div></div>").attr("class", "forcastWeatherCard");
  let forecastDivEl = $("<div></div>").text("5 Day Forecast").attr("class", "forcastBanner");
  let innerFlexEl2 = $("<div></div>").attr("class", "flex-container");
  innerFlexEl2.attr("id", "forcastChildGroup")
  let forecastChild1El = $("<div></div>").attr("id", "forcast-0").attr("class", "forcast-child flex-child");
  let forecastChild2El = $("<div></div>").attr("id", "forcast-1").attr("class", "forcast-child flex-child");
  let forecastChild3El = $("<div></div>").attr("id", "forcast-2").attr("class", "forcast-child flex-child");
  let forecastChild4El = $("<div></div>").attr("id", "forcast-3").attr("class", "forcast-child flex-child");
  let forecastChild5El = $("<div></div>").attr("id", "forcast-4").attr("class", "forcast-child flex-child");

  innerFlexEl2.append(forecastChild1El);
  innerFlexEl2.append(forecastChild2El);
  innerFlexEl2.append(forecastChild3El);
  innerFlexEl2.append(forecastChild4El);
  innerFlexEl2.append(forecastChild5El);
  forecastCardEl.append(forecastDivEl).append(innerFlexEl2);
  forecastSectionEl.append(forecastCardEl);
  flexContainerEl.append(forecastSectionEl)

  $(".main").append(flexContainerEl)

};

displaySearchHistory();

if("weatherSearchHistory" in localStorage){
  renderWeatherCards();
  renderRecentCitySearch();
};


//listen for click on search button and run 
$('document').ready(function(){
  $("#citySearchBtn").click(function(event){
    event.preventDefault();
  
    let userinput = $("#cityName").val();
  
    city = formatCityStr(userinput);
    if("weatherSearchHistory" in localStorage){
        getWeatherData(city)
    }else{
        renderWeatherCards();
        getWeatherData(city);
    }
    updateSearchHistory(userinput);
  })
  $("#citySearchEnter").on("keypress", function(e){
    if(e.which == 13){
      $("#citySearchBtn").click();
    }
  });
});

//pull information from previously searched city
$("#pastCityList").click(function(event){
  event.preventDefault();
  let city = event.target.id;
  let jsonStr = localStorage.getItem("weatherSearchHistory");
  let cityArr = JSON.parse(jsonStr);

  cityArr.forEach(searchedCity =>{
      if(searchedCity.name===city){
          getWeatherData(formatCityStr(city));
      };
  });
});