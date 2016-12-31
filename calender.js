months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var openWeatherApikey = "&APPID=5b2b83256bb8a575f7d7f455786df3e9";

$('document').ready(function(){
	updateTime();
	// if(!navigator.geolocation)
	// 	console.log("Geolocation not supported");	
	// else
	// 	navigator.geolocation.getCurrentPosition(success,error);
	
	$(".fa-chevron-up").click(function(){
		
		var monthAndYear = $.trim($(".my").text());
		var temp = monthAndYear.split(" ");		
		var month = $.trim(temp[0]);
		var year = parseInt(temp[1]);
		var index = months.indexOf(month);
		if(month == "December"){
			year = year + 1;
			month = months[0];
		}else{
			month = months[months.indexOf(month) + 1];
		}
		var my = month + " " + year;
		$(".my").text($.trim(my));
	});

	$(".fa-chevron-down").click(function(){
		
		var monthAndYear = $.trim($(".my").text());
		var temp = monthAndYear.split(" ");		
		var month = $.trim(temp[0]);
		var year = parseInt(temp[1]);
		var index = months.indexOf(month);
		if(month == "January"){
			year = year - 1;
			month = months[11];
		}else{
			month = months[months.indexOf(month) - 1];
		}
		var my = month + " " + year;
		$(".my").text($.trim(my));
	});


});

function updateTime(){
	
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

function success(position){
	
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

function error(){
	console.log("Not able to retrieve location");
}

function returnDays(month,year){

	if(month == "January")
		return 31;
	else if(month == "February"){
		if(year % 4 == 0)
			return 29;
		return 28;
	}
	else if(month == "March")
		return 31;
	else if(month == "April")
		return 30;
	else if(month == "May")
		return 31;
	else if(month == "June")
		return 30;
	else if(month == "July")
		return 31;
	else if(month == "August")
		return 31;
	else if(month == "September")
		return 30;
	else if(month == "October")
		return 31;
	else if(month == "November")
		return 30;
	else if(month == "December")
		return 31;
}