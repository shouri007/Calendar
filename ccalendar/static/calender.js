var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var openWeatherApikey = "&APPID=5b2b83256bb8a575f7d7f455786df3e9";
var month, date, year,appended,clickedcell,previouslyclickedcell,csrftoken;
var name,loc,starttime,endtime,description;
var editingSave=false;

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
    var maincalenderpos = $("#MainCalendar").position();
    updateMonthAndYear();
    updateMiniCalendar(date);
    updateCalendar();
    //retrieveEvents();
    displayEvents();
    // Set callbacks for up/down buttons
    $(".fa-chevron-up").click(nextMonth);
    $(".fa-chevron-down").click(previousMonth);
   //$(".fa-refresh").click(syncWithGoogle);

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            }
        }
    });

    //display event pop ups on click
    $(".col").click(function(){

        previouslyclickedcell = clickedcell;
        clickedcell = $(this);
        var c_date = $(this).text() 
        var cmy = getCurrentMonthNavigated();
        var d_date = c_date + " " + cmy;
        var position = $(this).position();
        var cellleft = parseInt(position.left);
        var celltop = parseInt(position.top);
        var cellIndex = $(this).index();
        var cellwidth = parseInt($(this).css("width"));
        $(".datepicker").datepicker();
        if(cellIndex != 6){
            var eventPosl = 190 + cellleft + cellwidth;
            $(".eventDialog").css("left",eventPosl);
            $(".eventDialog").css("top",celltop);
            $(".neweventDialog").css("top",celltop);
            $(".neweventDialog").css("left",eventPosl);
        }else{
            var eventPosl = cellleft - cellwidth/2;
            $(".eventDialog").css("left",eventPosl);
            $(".eventDialog").css("top",celltop);
            $(".neweventDialog").css("top",celltop);
            $(".neweventDialog").css("left",eventPosl);
        }
        $("#dayndate").text()
        $(".neweventDialog").show();
        $(this).css("background-color","#2ed39e");
        if(previouslyclickedcell != null){
            previouslyclickedcell.css("background-color","#ffffff");
            previouslyclickedcell.css("color","#b3b3b3");
        }
        $(this).css("color","#ffffff");
    });

    $(".cancel").click(function(){
        $(".neweventDialog").hide();
        clickedcell.css("background-color","#ffffff");
        clickedcell.css("color","#b3b3b3");
    });

    $(".save").click(function(){
        // $(".eventDialog").hide();
        clickedcell.css("background-color","#ffffff");
        createEvent();
        $(".neweventDialog").hide();

    });

    $(".close").click(function(){
        $(".eventDialog").hide();
        $(".neweventDialog").hide();
        clickedcell.css("background-color","#ffffff");
        clickedcell.css("color","#b3b3b3");
    });

    $(".edit").click(function(){
        $(".eventDialog").hide();
        $(".neweventDialog").show();
        editingSave = true;
    })

    $(".delete").click(function(){
        deleteEvent();
        $(".eventDialog").hide();
        clickedcell.css("background-color","#ffffff");
        clickedcell.css("color","#b3b3b3");
    })

    $(".fa-refresh").click(function(){
        syncWithGoogle();
    })
});

//**********************************CRSF Methods*********************************************//
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
//**********************************EndOf CRSF Methods*********************************************//


//***************************************CRUD requests******************************************//

function createEvent(){
    
    if(editingSave == true){
        editEvent();
    }
    else{
        name = $(".eventnamefield").val();
        var loc = $(".locfield").val();
        starttime = $("#startdate").val();
        endtime = $("#enddate").val();
        description = $(".description").val();

        var url = "http://localhost:8000/ccalendar/edit";
        var data = {
            "name" : name,
            "location" : loc,
            "starttime" : starttime,
            "endtime" : endtime,
            "description" : description,
            "CSRF" : csrftoken
        };
        $.ajax({
            method:'POST',
            url:url,
            contentType:"application/jsonp",
            data:data,
            success:function(){
                console.log("success");
            }
        });
    }
}

function retrieveEvents(){
    
    var url = "http://localhost:8000/ccalendar/events/";
    var locmon = month + 1;
    if(month < 10)
        locmon = '0' + locmon;
    url = url + locmon + "/" + year;
    $.ajax({
            method:'GET',
            url:url,
            contentType:"application/json",
            success:function(data){
                displayEvents(data["data"]);
            }
    });
}

function editEvent(){
    
    name = $(".eventnamefield").val();
    var loc = $(".locfield").val();
    starttime = $("#startdate").val();
    endtime = $("#enddate").val();
    description = $(".description").val();

    var url = "http://localhost:8000/ccalendar/edit";
    var data = {
        "name" : name,
        "location" : loc,
        "starttime" : starttime,
        "endtime" : endtime,
        "description" : description,
        "CSRF" : csrftoken
    };
    $.ajax({
        method:'PUT',
        url:url,
        contentType:"application/jsonp",
        data:data,
        success:function(){
            console.log("success");
        }
    });
    editingSave = false;
}

function deleteEvent(){

    name = $(".eventnamefield").val();
    var loc = $(".locfield").val();
    starttime = $("#startdate").val();
    endtime = $("#enddate").val();
    description = $(".description").val();

    var url = "http://localhost:8000/ccalendar/edit";
    var data = {
        "name" : name,
        "location" : loc,
        "starttime" : starttime,
        "endtime" : endtime,
        "description" : description,
        "CSRF" : csrftoken
    };
    $.ajax({
        method:'DELETE',
        url:url,
        contentType:"application/jsonp",
        data:data,
        success:function(){
            console.log("success");
        }
    });
}
//*****************************************EndOf CRUD Requests********************************************//

//GoogleSync Function
function syncWithGoogle(){
    window.location.replace("http://localhost:8000/ccalendar/sync");
}

//*****************************************UI setting functions*******************************************//
function updateMonthAndYear(){
    var my = months[month] + " " + year;
    $(".my").text($.trim(my));
    $("#minimonth").text($.trim(my));

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

function displayEvents(){

    events = [{"start": "2016-12-16", 
    "location": "33, Ranga Pillai Street, Next to Nilgiri's Super Market, Puducherry, 605001, India", 
    "end": "2016-12-19", 
    "description": "To see detailed information for automatically created events like this one, use the official Google Calendar app. https://g.co/calendar\n\nThis event was created from an email you received in Gmail. https://mail.google.com/mail?extsrc=cal&plid=ACUX6DNpxYOByPKuBJSa3uHF0JUfRsqLre5CiWo\n", 
    "title": "Stay at Pleasant Inn Pondicherry"},
    {"start": "2016-12-09", 
    "location": "33, Ranga Pillai Street, Next to Nilgiri's Super Market, Puducherry, 605001, India", 
    "end": "2016-12-10", 
    "description": "To see detailed information for automatically created events like this one, use the official Google Calendar app. https://g.co/calendar\n\nThis event was created from an email you received in Gmail. https://mail.google.com/mail?extsrc=cal&plid=ACUX6DNpxYOByPKuBJSa3uHF0JUfRsqLre5CiWo\n", 
    "title": "test"},
    {"start": "2016-12-22", 
    "location": "33, Ranga Pillai Street, Next to Nilgiri's Super Market, Puducherry, 605001, India", 
    "end": "2016-12-24", 
    "description": "To see detailed information for automatically created events like this one, use the official Google Calendar app. https://g.co/calendar\n\nThis event was created from an email you received in Gmail. https://mail.google.com/mail?extsrc=cal&plid=ACUX6DNpxYOByPKuBJSa3uHF0JUfRsqLre5CiWo\n", 
    "title": "test11"}
    ];
    console.log(events.length);
    var i = 0;
    for(i = 0;i < events.length; i++){        
        name = events[i]["title"];
        console.log(name);
        var location = events[i]["location"];
        var startDate = new Date(events[i]["start"]);
        console.log(startDate.getDate());
        var enddate = new Date(events[i]["end"]);
        console.log(enddate.getDate());
        description = events[i]["description"];
        var span = enddate.getDate() - startDate.getDate();
        console.log(span);
        $('#dayTable tr').children().each(function(index, item) {
            if($(item).text() == startDate.getDate()){
                var position = $(item).position();
                var w = (span + 1) * parseInt($(item).css("width"),10);
                console.log(w);
                var left = position.left;
                var top = position.top + 15;
                var st1 = "<div id='EventRectangle' style='width:" + w + "px;" 
                var l_style = "left:" + left + "px;"
                var t_style = "top:" + top + "px;'" + ">"
                var str = st1 + l_style + t_style;
                var st2 = name + "</div>";
                var fin = str + st2;
                $(item).append(fin);
            }
        });
    }
}

//*****************************************End of UI setting functions*******************************************//

//*****************************************Calendar Functions***************************************************//
function updateMiniCalendar(){
    
    var firstDay = getFirstDay();
    var daysInPrev = getDaysPrevMonth();
    var dateIncrementer = 1;
    
    if(firstDay + getDays() + 1 > 35){
        console.log("hello");
        appended = true;
        var newRow = "<tr><td class='mcol'>a</td><td class='mcol'>b</td><td class='mcol'>c</td><td class='mcol'>d</td><td class='mcol'>e</td><td class='mcol'>f</td><td class='mcol'>g</td></tr>";
        $("#MiniDayTable").append(newRow);
    }

    // Sets the first row of dates and shades the dates of the previous month
    $('#MiniDayTable tr:eq(1)').children().each(function(index, item) {
        if(index < firstDay) {
            $(item).text(daysInPrev - (firstDay - index - 1));
            $(item).removeClass("mcol");
        } else {
            $(item).text(dateIncrementer++);
            if(dateIncrementer - 1 == date){
                $(item).removeClass("mcol");
                $(item).addClass("mcolw");
            }
        }
    });

    // Sets the dates of the remaining rows
    $('#MiniDayTable tr:gt(1)').children().each(function(index, item) {
        $(item).text(dateIncrementer++);
        if(dateIncrementer - 1== date){
                $(item).removeClass("mcol");
                $(item).addClass("mcolw");
        }
    });

    // Shades the dates of the next month
    var lastDay = getLastDay();
    var nextMonthDate = 1;
    $('#MiniDayTable tr:last').children().each(function(index, item) {
        if(index > lastDay) {
            $(item).text(nextMonthDate++);
            $(item).removeClass("mcol");
        }
        if(dateIncrementer - 1 == date){
                $(item).addClass("mcolw");
                $(item).removeClass("mcol");
        }
    });
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
            $(item).removeClass("col");
            $(item).addClass("darkBackground");
        } else {
            $(item).text(dateIncrementer++);
            $(item).removeClass("darkBackground");
            $(item).addClass("col");
        }
    });
    // Sets the dates of the remaining rows
    $('#dayTable tr:gt(1)').children().each(function(index, item) {
        $(item).text(dateIncrementer++);
        $(item).removeClass("darkBackground");
        $(item).addClass("col");
    });
    // Shades the dates of the next month
    var lastDay = getLastDay();
    var nextMonthDate = 1;
    $('#dayTable tr:last').children().each(function(index, item) {
        if(index > lastDay) {
            $(item).text(nextMonthDate++);
            $(item).removeClass("col");
            $(item).addClass("darkBackground");
        } else {
            $(item).removeClass("darkBackground");
            $(item).addClass("col");
        }
    });
}
//*****************************************EndOf Calendar Functions***************************************************//

//*****************************************UI Supporting functions****************************************************//
function deleteRow(){
    if(appended){
        $("#dayTable tr:last").remove();
    }
    appended = false;
}

function getCurrentMonthNavigated(){
    var text = $(".my").text();
    return text;
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
    retrieveEvents();
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
    retrieveEvents();
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
//*****************************************EndOf UI Supporting functions****************************************************//