var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var openWeatherApikey = "&APPID=5b2b83256bb8a575f7d7f455786df3e9";
var month, date, year,appended;

$('document').ready(function() {
    updateTime();
    // if(!navigator.geolocation)
    //    console.log("Geolocation not supported");
    // else
    //    navigator.geolocation.getCurrentPosition(success,error);

    var presentDate = new Date();
    date = presentDate.getDate();
    month = presentDate.getMonth();
    year = presentDate.getFullYear();
    updateMonthAndYear();
    updateCalendar();

    // Set callbacks for up/down buttons
    $(".fa-chevron-up").click(nextMonth);
    $(".fa-chevron-down").click(previousMonth);

});

function updateMonthAndYear(){
    var my = months[month] + " " + year;
    $(".my").text($.trim(my));
}

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
	var hr = hours;
	if(minutes < 10)
		min = "0" + minutes;
	if(hours < 10)
		hr = "0" + hours;
	var time = hr + ":" + min;
	var month = months[date.getMonth()];
	var year = date.getFullYear();	
	$("#Time").text(time);
	$("#moreve").text(moreve);
	setTimeout(updateTime,60*1000);
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

function success(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	updateWeather(latitude,longitude);
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

function getDaysPrevMonth() {
    // If the month is February, check for leap year and return accordingly
    // otherwise direct lookup from daysInMonth array
    if((month - 1) == 1) {
        if(((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
            return 29;
        }
    } else if(month == 0) {
        return daysInMonth[11];
    }

    return daysInMonth[month - 1];
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
    deleteRow();
    updateCalendar();
}

// Callback for clicking the down arrow
function nextMonth() {
    month = (month + 1) % 12;
    if (month == 0) {
        year++;
    }
    var my = months[month] + " " + year;
    $(".my").text($.trim(my));
    deleteRow();
    updateCalendar();

}

function deleteRow(){
    if(appended){
        $("#dayTable tr:last").remove();
    }
    appended = false;
}

// Called whenever month is changed, updates the dates on the calendar
function updateCalendar() {
    
    var firstDay = getFirstDay();
    var daysInPrev = getDaysPrevMonth();
    var dateIncrementer = 1;
    
    if(firstDay + getDays() + 1 > 35){
        appended = true;
        var newRow = "<tr><td class='col'>a</td><td class='col'>b</td><td class='col'>c</td><td class='col'>d</td><td class='col'>e</td><td class='col'>f</td><td class='col'>g</td></tr>";
        $("#dayTable").append(newRow);
    }
    // Sets the first row of dates and shades the dates of the previous month
    $('#dayTable tr:eq(1)').children().each(function(index, item) {
        if(index < firstDay) {
            $(item).text(daysInPrev - (firstDay - index - 1));
            $(item).addClass("darkBackground");
        } else {
            $(item).text(dateIncrementer++);
            $(item).removeClass("darkBackground");
        }
    });
    // Sets the dates of the remaining rows
    $('#dayTable tr:gt(1)').children().each(function(index, item) {
        $(item).text(dateIncrementer++);
        $(item).removeClass("darkBackground");
    });
    // Shades the dates of the next month
    var lastDay = getLastDay();
    var nextMonthDate = 1;
    console.log(lastDay);
    $('#dayTable tr:last').children().each(function(index, item) {
        if(index > lastDay) {
            $(item).text(nextMonthDate++);
            $(item).addClass("darkBackground");
        } else {
            $(item).removeClass("darkBackground");
        }
    });
}

// Returns first day of the month (0-6 starting with Sunday)
function getFirstDay() {
    var first = new Date();
    first.setMonth(month);
    first.setYear(year);
    first.setDate(1);
    return first.getDay();
}

function getLastDay() {
    var last = new Date();
    last.setMonth(month);
    last.setYear(year);
    last.setDate(getDays());
    return last.getDay();
}