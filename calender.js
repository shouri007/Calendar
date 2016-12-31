var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var openWeatherApikey = "&APPID=5b2b83256bb8a575f7d7f455786df3e9";
var month, date, year;

$('document').ready(function() {
    updateTime();
    //if(!navigator.geolocation)
    //    console.log("Geolocation not supported");
    //else
    //    navigator.geolocation.getCurrentPosition(success,error);

    var presentDate = new Date();
    date = presentDate.getDate();
    month = presentDate.getMonth();
    year = presentDate.getFullYear();

    // Set callbacks for up/down buttons
    $(".fa-chevron-up").click(previousMonth);
    $(".fa-chevron-down").click(nextMonth);
});

function updateTime() {
	var date = new Date($.now());
	var hours = date.getHours();
	var moreve = "am";
	if(hours >= 12){
		moreve = "pm";
		if(hours != 12)
			hours = hours % 12;
	}
	var minutes = date.getMinutes();
	var min = minutes;
	if(minutes < 10)
		min = "0" + minutes;
	var time = hours + ":" + min;
	var month = months[date.getMonth()];
	var year = date.getFullYear();
	var my = month + " " + year;
	$(".my").text($.trim(my));
	$("#Time").text(time);
	$("#moreve").text(moreve);
	setTimeout(updateTime,60*1000);
}

function success(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	updateWeather(latitude,longitude);
}

function updateWeather(latitude,longitude){
	var base_url = "http://api.openweathermap.org/data/2.5/weather?";
	var latlon = "lat=" + latitude + "&" + "lon=" + longitude;
	var url = base_url + latlon + openWeatherApikey;
	$.get(url,function(data,status){
		var weather = data["weather"];
		var weatherType = weather[0].main;
		var main = data["main"];
		var maxTemp = Math.round(main["temp_max"] - 273);
		var minTemp = Math.round(main["temp_min"] - 273);
		minTemp = minTemp + " " + String.fromCharCode(176) + "C";
		console.log(weatherType);
		if(weatherType == "cloudy"){
			$("#weatherIcon").replaceWith("<i  id='weatherIcon' class='fa fa-cloud fa-2x'></i>");
		}
		else if(weatherType == "Haze"){
			$("#weatherIcon").replaceWith("<i class='fa fa-bolt fa-2x' id='weatherIcon'></i>");
		}else if(weatherType == "Sunny"){
			$("#weatherIcon").replaceWith("<i class='fa fa-sun-o fa-2x' id='weatherIcon'></i>");
		}
		$("#maxtemp").text(maxTemp);
		$("#mintemp").text(minTemp);
		$("#weatherType").text(weatherType);
	});
}

function error() {
	console.log("Not able to retrieve location");
}

function getDays() {
    // If the month is February, check for leap year and return accordingly
    // otherwise direct lookup from daysInMonth array
    if(month == 1) {
        if(((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
            return 29;
        }
    }

    return daysInMonth[month];
}

// Callback for clicking the up arrow
function previousMonth() {
    month--;
    if (month == -1) {
        month = 11;
        year--;
    }
    var my = months[month] + " " + year;
    $(".my").text($.trim(my));
}

// Callback for clicking the down arrow
function nextMonth() {
    month = (month + 1) % 12;
    if (month == 0) {
        year++;
    }
    var my = months[month] + " " + year;
    $(".my").text($.trim(my));
}
