var formatDate = function (date, format) {
	if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
	format = format.replace(/YYYY/g, date.getFullYear());
	format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
	format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
	format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
	format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
	format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
	if (format.match(/S/g)) {
		var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
		var length = format.match(/S/g).length;
		for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
	}
	return format;
};


var isHoliday = function (date) {
	return Object.keys(UltraDate.getHolidays(date.getFullYear())).indexOf(formatDate(date, 'YYYY/MM/DD')) >= 0
};

var date2HTML = function(date, format) {
    if (format == undefined) {
        format = 'YYYY/MM/DD'
    }
    var dateString = formatDate(date, format);
    var className;
    var week = date.getDay();
    if (isHoliday(date)) {
        className = 'week week_holiday';
    }
    else {
        className = 'week week_' + week;
    }
    var dayOfWeekStr = [ "日", "月", "火", "水", "木", "金", "土" ][date.getDay()];
    return dateString + ' (<span class="' + className + '">' + dayOfWeekStr  + '</span>)';
};

var intlDateTimeFormatOptions = {
  era:'short',
  year:'2-digit',
  month:'2-digit',
  day:'2-digit',
  hour:'2-digit',
  minute:'2-digit',
  second:'2-digit',
  weekday:'short',
  hour12:false,
  timeZoneName:'short'
};
var intlDateTimeFormat = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', intlDateTimeFormatOptions);
var getEra = function(date) {
  var dt = intlDateTimeFormat.format(date);
  var ret = dt.split('年');
  return ret[0] ;
};