var lineResize,
    lineChart;
function lineChartOperaHack(){
    //lineChart is somehow not rendered correctly after updates. Need to reupdate
    if ($.browser.opera){
        clearTimeout(lineResize);
        lineResize = setTimeout(lineChart.update, 300);
    }
}
nv.addGraph(function() {
    var chart = nv.models.lineChart()
        .margin({top: 0, bottom: 25, left: 25, right: 0})
        //.showLegend(false)
        .color([
            $orange, '#cf6d51'
            //'#618fb0', '#61b082'
        ]);

    chart.legend.margin({top: 3});

    chart.yAxis
        .showMaxMin(false)
        .tickFormat(d3.format(',.f'));

    chart.xAxis
        .showMaxMin(false)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });
    /**
     * Copyright (c)2005-2009 Matt Kruse (javascripttoolbox.com)
     *
     * Dual licensed under the MIT and GPL licenses.
     * This basically means you can use this code however you want for
     * free, but don't claim to have written it yourself!
     * Donations always accepted: http://www.JavascriptToolbox.com/donate/
     *
     * Please do not link to the .js files on javascripttoolbox.com from
     * your site. Copy the files locally to your server instead.
     *
     */
    /*
     Date functions

     These functions are used to parse, format, and manipulate Date objects.
     See documentation and examples at http://www.JavascriptToolbox.com/lib/date/

     */
    Date.$VERSION = 1.02;

// Utility function to append a 0 to single-digit numbers
    Date.LZ = function(x) {return(x<0||x>9?"":"0")+x};
// Full month names. Change this for local month names
    Date.monthNames = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
// Month abbreviations. Change this for local month names
    Date.monthAbbreviations = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
// Full day names. Change this for local month names
    Date.dayNames = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
// Day abbreviations. Change this for local month names
    Date.dayAbbreviations = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
// Used for parsing ambiguous dates like 1/2/2000 - default to preferring 'American' format meaning Jan 2.
// Set to false to prefer 'European' format meaning Feb 1
    Date.preferAmericanFormat = true;

// If the getFullYear() method is not defined, create it
    if (!Date.prototype.getFullYear) {
        Date.prototype.getFullYear = function() { var yy=this.getYear(); return (yy<1900?yy+1900:yy); } ;
    }

// Parse a string and convert it to a Date object.
// If no format is passed, try a list of common formats.
// If string cannot be parsed, return null.
// Avoids regular expressions to be more portable.
    Date.parseString = function(val, format) {
        // If no format is specified, try a few common formats
        if (typeof(format)=="undefined" || format==null || format=="") {
            var generalFormats=new Array('y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d','MMM-d','d-MMM');
            var monthFirst=new Array('M/d/y','M-d-y','M.d.y','M/d','M-d');
            var dateFirst =new Array('d/M/y','d-M-y','d.M.y','d/M','d-M');
            var checkList=new Array(generalFormats,Date.preferAmericanFormat?monthFirst:dateFirst,Date.preferAmericanFormat?dateFirst:monthFirst);
            for (var i=0; i<checkList.length; i++) {
                var l=checkList[i];
                for (var j=0; j<l.length; j++) {
                    var d=Date.parseString(val,l[j]);
                    if (d!=null) {
                        return d;
                    }
                }
            }
            return null;
        };

        this.isInteger = function(val) {
            for (var i=0; i < val.length; i++) {
                if ("1234567890".indexOf(val.charAt(i))==-1) {
                    return false;
                }
            }
            return true;
        };
        this.getInt = function(str,i,minlength,maxlength) {
            for (var x=maxlength; x>=minlength; x--) {
                var token=str.substring(i,i+x);
                if (token.length < minlength) {
                    return null;
                }
                if (this.isInteger(token)) {
                    return token;
                }
            }
            return null;
        };
        val=val+"";
        format=format+"";
        var i_val=0;
        var i_format=0;
        var c="";
        var token="";
        var token2="";
        var x,y;
        var year=new Date().getFullYear();
        var month=1;
        var date=1;
        var hh=0;
        var mm=0;
        var ss=0;
        var ampm="";
        while (i_format < format.length) {
            // Get next token from format string
            c=format.charAt(i_format);
            token="";
            while ((format.charAt(i_format)==c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            // Extract contents of value based on format token
            if (token=="yyyy" || token=="yy" || token=="y") {
                if (token=="yyyy") {
                    x=4;y=4;
                }
                if (token=="yy") {
                    x=2;y=2;
                }
                if (token=="y") {
                    x=2;y=4;
                }
                year=this.getInt(val,i_val,x,y);
                if (year==null) {
                    return null;
                }
                i_val += year.length;
                if (year.length==2) {
                    if (year > 70) {
                        year=1900+(year-0);
                    }
                    else {
                        year=2000+(year-0);
                    }
                }
            }
            else if (token=="MMM" || token=="NNN"){
                month=0;
                var names = (token=="MMM"?(Date.monthNames.concat(Date.monthAbbreviations)):Date.monthAbbreviations);
                for (var i=0; i<names.length; i++) {
                    var month_name=names[i];
                    if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
                        month=(i%12)+1;
                        i_val += month_name.length;
                        break;
                    }
                }
                if ((month < 1)||(month>12)){
                    return null;
                }
            }
            else if (token=="EE"||token=="E"){
                var names = (token=="EE"?Date.dayNames:Date.dayAbbreviations);
                for (var i=0; i<names.length; i++) {
                    var day_name=names[i];
                    if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            }
            else if (token=="MM"||token=="M") {
                month=this.getInt(val,i_val,token.length,2);
                if(month==null||(month<1)||(month>12)){
                    return null;
                }
                i_val+=month.length;
            }
            else if (token=="dd"||token=="d") {
                date=this.getInt(val,i_val,token.length,2);
                if(date==null||(date<1)||(date>31)){
                    return null;
                }
                i_val+=date.length;
            }
            else if (token=="hh"||token=="h") {
                hh=this.getInt(val,i_val,token.length,2);
                if(hh==null||(hh<1)||(hh>12)){
                    return null;
                }
                i_val+=hh.length;
            }
            else if (token=="HH"||token=="H") {
                hh=this.getInt(val,i_val,token.length,2);
                if(hh==null||(hh<0)||(hh>23)){
                    return null;
                }
                i_val+=hh.length;
            }
            else if (token=="KK"||token=="K") {
                hh=this.getInt(val,i_val,token.length,2);
                if(hh==null||(hh<0)||(hh>11)){
                    return null;
                }
                i_val+=hh.length;
                hh++;
            }
            else if (token=="kk"||token=="k") {
                hh=this.getInt(val,i_val,token.length,2);
                if(hh==null||(hh<1)||(hh>24)){
                    return null;
                }
                i_val+=hh.length;
                hh--;
            }
            else if (token=="mm"||token=="m") {
                mm=this.getInt(val,i_val,token.length,2);
                if(mm==null||(mm<0)||(mm>59)){
                    return null;
                }
                i_val+=mm.length;
            }
            else if (token=="ss"||token=="s") {
                ss=this.getInt(val,i_val,token.length,2);
                if(ss==null||(ss<0)||(ss>59)){
                    return null;
                }
                i_val+=ss.length;
            }
            else if (token=="a") {
                if (val.substring(i_val,i_val+2).toLowerCase()=="am") {
                    ampm="AM";
                }
                else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {
                    ampm="PM";
                }
                else {
                    return null;
                }
                i_val+=2;
            }
            else {
                if (val.substring(i_val,i_val+token.length)!=token) {
                    return null;
                }
                else {
                    i_val+=token.length;
                }
            }
        }
        // If there are any trailing characters left in the value, it doesn't match
        if (i_val != val.length) {
            return null;
        }
        // Is date valid for month?
        if (month==2) {
            // Check for leap year
            if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
                if (date > 29){
                    return null;
                }
            }
            else {
                if (date > 28) {
                    return null;
                }
            }
        }
        if ((month==4)||(month==6)||(month==9)||(month==11)) {
            if (date > 30) {
                return null;
            }
        }
        // Correct hours value
        if (hh<12 && ampm=="PM") {
            hh=hh-0+12;
        }
        else if (hh>11 && ampm=="AM") {
            hh-=12;
        }
        return new Date(year,month-1,date,hh,mm,ss);
    };

// Check if a date string is valid
    Date.isValid = function(val,format) {
        return (Date.parseString(val,format) != null);
    };

// Check if a date object is before another date object
    Date.prototype.isBefore = function(date2) {
        if (date2==null) {
            return false;
        }
        return (this.getTime()<date2.getTime());
    };

// Check if a date object is after another date object
    Date.prototype.isAfter = function(date2) {
        if (date2==null) {
            return false;
        }
        return (this.getTime()>date2.getTime());
    };

// Check if two date objects have equal dates and times
    Date.prototype.equals = function(date2) {
        if (date2==null) {
            return false;
        }
        return (this.getTime()==date2.getTime());
    };

// Check if two date objects have equal dates, disregarding times
    Date.prototype.equalsIgnoreTime = function(date2) {
        if (date2==null) {
            return false;
        }
        var d1 = new Date(this.getTime()).clearTime();
        var d2 = new Date(date2.getTime()).clearTime();
        return (d1.getTime()==d2.getTime());
    };

// Format a date into a string using a given format string
    Date.prototype.format = function(format) {
        format=format+"";
        var result="";
        var i_format=0;
        var c="";
        var token="";
        var y=this.getYear()+"";
        var M=this.getMonth()+1;
        var d=this.getDate();
        var E=this.getDay();
        var H=this.getHours();
        var m=this.getMinutes();
        var s=this.getSeconds();
        var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
        // Convert real date parts into formatted versions
        var value=new Object();
        if (y.length < 4) {
            y=""+(+y+1900);
        }
        value["y"]=""+y;
        value["yyyy"]=y;
        value["yy"]=y.substring(2,4);
        value["M"]=M;
        value["MM"]=Date.LZ(M);
        value["MMM"]=Date.monthNames[M-1];
        value["NNN"]=Date.monthAbbreviations[M-1];
        value["d"]=d;
        value["dd"]=Date.LZ(d);
        value["E"]=Date.dayAbbreviations[E];
        value["EE"]=Date.dayNames[E];
        value["H"]=H;
        value["HH"]=Date.LZ(H);
        if (H==0){
            value["h"]=12;
        }
        else if (H>12){
            value["h"]=H-12;
        }
        else {
            value["h"]=H;
        }
        value["hh"]=Date.LZ(value["h"]);
        value["K"]=value["h"]-1;
        value["k"]=value["H"]+1;
        value["KK"]=Date.LZ(value["K"]);
        value["kk"]=Date.LZ(value["k"]);
        if (H > 11) {
            value["a"]="PM";
        }
        else {
            value["a"]="AM";
        }
        value["m"]=m;
        value["mm"]=Date.LZ(m);
        value["s"]=s;
        value["ss"]=Date.LZ(s);
        while (i_format < format.length) {
            c=format.charAt(i_format);
            token="";
            while ((format.charAt(i_format)==c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (typeof(value[token])!="undefined") {
                result=result + value[token];
            }
            else {
                result=result + token;
            }
        }
        return result;
    };

// Get the full name of the day for a date
    Date.prototype.getDayName = function() {
        return Date.dayNames[this.getDay()];
    };

// Get the abbreviation of the day for a date
    Date.prototype.getDayAbbreviation = function() {
        return Date.dayAbbreviations[this.getDay()];
    };

// Get the full name of the month for a date
    Date.prototype.getMonthName = function() {
        return Date.monthNames[this.getMonth()];
    };

// Get the abbreviation of the month for a date
    Date.prototype.getMonthAbbreviation = function() {
        return Date.monthAbbreviations[this.getMonth()];
    };

// Clear all time information in a date object
    Date.prototype.clearTime = function() {
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        this.setMilliseconds(0);
        return this;
    };

// Add an amount of time to a date. Negative numbers can be passed to subtract time.
    Date.prototype.add = function(interval, number) {
        if (typeof(interval)=="undefined" || interval==null || typeof(number)=="undefined" || number==null) {
            return this;
        }
        number = +number;
        if (interval=='y') { // year
            this.setFullYear(this.getFullYear()+number);
        }
        else if (interval=='M') { // Month
            this.setMonth(this.getMonth()+number);
        }
        else if (interval=='d') { // Day
            this.setDate(this.getDate()+number);
        }
        else if (interval=='w') { // Weekday
            var step = (number>0)?1:-1;
            while (number!=0) {
                this.add('d',step);
                while(this.getDay()==0 || this.getDay()==6) {
                    this.add('d',step);
                }
                number -= step;
            }
        }
        else if (interval=='h') { // Hour
            this.setHours(this.getHours() + number);
        }
        else if (interval=='m') { // Minute
            this.setMinutes(this.getMinutes() + number);
        }
        else if (interval=='s') { // Second
            this.setSeconds(this.getSeconds() + number);
        }
        return this;
    };

    function extractDay(date){
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function printStats(sales){
        var average = d3.mean(sales, function(el){
            return el.y
        });
        var total = d3.sum(sales, function(el){
            return el.y
        });
        $('.visits-info .span3:first-child .key').html("<i class='eicon-chart-line'></i> Average per Day");
        $('.visits-info .span3:first-child .value').html(Number((average).toFixed(2)));
        $('.visits-info .span3:nth-child(2) .key').html("<i class='icon-money'></i> Average $ per Day");
        $('.visits-info .span3:nth-child(2) .value').html('$' + Number((average * 18 * 0.55).toFixed(2)));
        $('.visits-info .span3:nth-child(3) .key').html("<i class='eicon-database'></i> Total");
        $('.visits-info .span3:nth-child(3) .value').html(total);
        $('.visits-info .span3:nth-child(4) .key').html("<i class='icon-map-marker'></i> Sold Today");
        $('.visits-info .span3:nth-child(4) .value').html(todaySalesCount);
    }

    var stringDates = [{"date":"2013-09-24 18:33:59","price":18,"amount":10.26},{"date":"2013-09-24 16:15:15","price":18,"amount":10.26},{"date":"2013-09-24 12:32:58","price":18,"amount":10.26},{"date":"2013-09-24 09:10:46","price":18,"amount":10.26},{"date":"2013-09-24 04:12:16","price":18,"amount":10.26},{"date":"2013-09-24 03:06:01","price":18,"amount":10.26},{"date":"2013-09-23 23:18:06","price":18,"amount":10.26},{"date":"2013-09-23 21:45:20","price":18,"amount":10.26},{"date":"2013-09-23 21:44:13","price":18,"amount":10.26},{"date":"2013-09-23 20:16:43","price":18,"amount":10.26},{"date":"2013-09-23 17:18:32","price":18,"amount":10.26},{"date":"2013-09-23 17:12:36","price":18,"amount":10.26},{"date":"2013-09-23 16:07:59","price":18,"amount":10.26},{"date":"2013-09-23 03:42:02","price":18,"amount":10.26},{"date":"2013-09-23 03:22:01","price":18,"amount":10.26},{"date":"2013-09-22 19:16:36","price":18,"amount":10.26},{"date":"2013-09-22 13:18:05","price":18,"amount":10.26},{"date":"2013-09-22 06:17:14","price":18,"amount":10.26},{"date":"2013-09-22 05:19:15","price":18,"amount":10.26},{"date":"2013-09-22 03:19:12","price":18,"amount":10.26},{"date":"2013-09-21 23:47:01","price":18,"amount":10.26},{"date":"2013-09-21 20:16:10","price":18,"amount":10.26},{"date":"2013-09-21 15:03:40","price":18,"amount":10.26},{"date":"2013-09-21 13:56:58","price":18,"amount":10.26},{"date":"2013-09-21 12:48:16","price":18,"amount":10.26},{"date":"2013-09-21 12:42:37","price":18,"amount":10.26},{"date":"2013-09-21 12:23:42","price":18,"amount":10.26},{"date":"2013-09-21 05:00:52","price":18,"amount":10.26},{"date":"2013-09-20 21:32:16","price":18,"amount":10.26},{"date":"2013-09-20 19:22:00","price":18,"amount":10.26}, {"date":"2013-09-20 18:09:03","price":18,"amount":10.26},{"date":"2013-09-20 17:35:42","price":18,"amount":10.26},{"date":"2013-09-20 15:25:27","price":18,"amount":10.26},{"date":"2013-09-20 13:43:05","price":18,"amount":10.26},{"date":"2013-09-20 12:45:11","price":18,"amount":10.26},{"date":"2013-09-20 12:19:53","price":18,"amount":10.26},{"date":"2013-09-20 11:55:57","price":18,"amount":10.26},{"date":"2013-09-20 10:57:57","price":18,"amount":10.26},{"date":"2013-09-20 10:02:16","price":18,"amount":10.26},{"date":"2013-09-20 09:29:24","price":18,"amount":10.26},{"date":"2013-09-20 05:16:44","price":18,"amount":10.26},{"date":"2013-09-20 00:31:30","price":18,"amount":10.26},{"date":"2013-09-19 23:13:27","price":18,"amount":10.26},{"date":"2013-09-19 19:09:21","price":18,"amount":10.26},{"date":"2013-09-19 16:33:22","price":18,"amount":10.26},{"date":"2013-09-19 16:29:44","price":18,"amount":10.26},{"date":"2013-09-19 15:13:26","price":18,"amount":10.26},{"date":"2013-09-19 15:09:09","price":18,"amount":10.26},{"date":"2013-09-19 13:29:48","price":18,"amount":10.26},{"date":"2013-09-19 13:01:41","price":18,"amount":10.26},{"date":"2013-09-19 06:15:00","price":18,"amount":10.26},{"date":"2013-09-19 00:33:15","price":18,"amount":10.26},{"date":"2013-09-18 23:15:03","price":18,"amount":10.26},{"date":"2013-09-18 22:28:46","price":18,"amount":10.26},{"date":"2013-09-18 16:46:11","price":18,"amount":10.26},{"date":"2013-09-18 16:17:55","price":18,"amount":10.26},{"date":"2013-09-18 14:36:39","price":18,"amount":10.26},{"date":"2013-09-18 12:14:47","price":18,"amount":10.26},{"date":"2013-09-18 11:54:18","price":18,"amount":10.26},{"date":"2013-09-18 06:30:05","price":18,"amount":10.26},{"date":"2013-09-18 00:44:33","price":18,"amount":10.26},{"date":"2013-09-17 23:08:01","price":18,"amount":10.26},{"date":"2013-09-17 19:24:24","price":18,"amount":10.26},{"date":"2013-09-17 17:18:21","price":18,"amount":10.26},{"date":"2013-09-17 13:05:03","price":18,"amount":10.26},{"date":"2013-09-17 12:11:26","price":18,"amount":10.26},{"date":"2013-09-17 05:13:37","price":18,"amount":10.26},{"date":"2013-09-17 04:28:20","price":18,"amount":10.26},{"date":"2013-09-17 02:29:49","price":18,"amount":10.26},{"date":"2013-09-17 00:23:47","price":18,"amount":10.26},{"date":"2013-09-16 22:12:04","price":18,"amount":10.26},{"date":"2013-09-16 18:17:46","price":18,"amount":10.26},{"date":"2013-09-16 17:56:59","price":18,"amount":10.26},{"date":"2013-09-16 15:51:30","price":18,"amount":10.26},{"date":"2013-09-16 14:29:27","price":18,"amount":10.26},{"date":"2013-09-16 14:24:48","price":18,"amount":10.26},{"date":"2013-09-16 09:37:25","price":18,"amount":10.26},{"date":"2013-09-16 05:20:58","price":18,"amount":10.26},{"date":"2013-09-15 12:47:41","price":18,"amount":10.26},{"date":"2013-09-15 10:15:13","price":18,"amount":10.26},{"date":"2013-09-15 03:43:32","price":18,"amount":10.26},{"date":"2013-09-14 20:31:14","price":18,"amount":10.26},{"date":"2013-09-14 18:05:42","price":18,"amount":10.26},{"date":"2013-09-13 23:54:25","price":18,"amount":10.26},{"date":"2013-09-13 21:16:36","price":18,"amount":10.08},{"date":"2013-09-13 18:06:37","price":18,"amount":10.08},{"date":"2013-09-13 12:37:16","price":18,"amount":10.08},{"date":"2013-09-13 01:23:00","price":18,"amount":10.08},{"date":"2013-09-13 00:05:01","price":18,"amount":10.08}, {"date":"2013-09-12 20:36:39","price":18,"amount":10.08},{"date":"2013-09-12 20:34:53","price":18,"amount":10.08},{"date":"2013-09-12 20:33:47","price":18,"amount":10.08},{"date":"2013-09-12 20:33:01","price":18,"amount":10.08},{"date":"2013-09-12 19:11:19","price":18,"amount":10.08},{"date":"2013-09-12 17:13:12","price":18,"amount":10.08},{"date":"2013-09-12 15:36:33","price":18,"amount":10.08},{"date":"2013-09-12 13:26:13","price":18,"amount":10.08},{"date":"2013-09-12 09:40:15","price":18,"amount":10.08},{"date":"2013-09-12 04:48:24","price":18,"amount":10.08},{"date":"2013-09-11 20:28:38","price":18,"amount":10.08},{"date":"2013-09-11 16:20:29","price":18,"amount":10.08},{"date":"2013-09-11 13:49:28","price":18,"amount":10.08},{"date":"2013-09-11 11:24:59","price":18,"amount":10.08},{"date":"2013-09-10 21:34:41","price":18,"amount":10.08},{"date":"2013-09-10 19:05:30","price":18,"amount":10.08},{"date":"2013-09-10 15:09:18","price":18,"amount":10.08},{"date":"2013-09-10 14:03:25","price":18,"amount":10.08},{"date":"2013-09-10 05:52:27","price":18,"amount":10.08},{"date":"2013-09-09 19:45:04","price":18,"amount":10.08},{"date":"2013-09-09 08:56:39","price":18,"amount":10.08},{"date":"2013-09-09 07:40:16","price":18,"amount":10.08},{"date":"2013-09-09 05:13:46","price":18,"amount":10.08},{"date":"2013-09-09 00:53:56","price":18,"amount":10.08},{"date":"2013-09-08 14:52:22","price":18,"amount":10.08},{"date":"2013-09-08 13:08:12","price":18,"amount":10.08},{"date":"2013-09-08 00:05:54","price":18,"amount":10.08},{"date":"2013-09-07 23:50:28","price":18,"amount":10.08},{"date":"2013-09-07 22:16:30","price":18,"amount":10.08},{"date":"2013-09-07 22:09:15","price":18,"amount":10.08},{"date":"2013-09-07 11:28:43","price":18,"amount":10.08},{"date":"2013-09-06 20:36:29","price":18,"amount":10.08},{"date":"2013-09-06 16:20:11","price":18,"amount":10.08},{"date":"2013-09-06 15:13:46","price":18,"amount":10.08},{"date":"2013-09-06 09:15:46","price":18,"amount":10.08},{"date":"2013-09-05 19:45:48","price":18,"amount":10.08},{"date":"2013-09-05 18:17:07","price":18,"amount":10.08},{"date":"2013-09-05 15:27:41","price":18,"amount":10.08},{"date":"2013-09-05 13:49:13","price":18,"amount":10.08},{"date":"2013-09-05 12:44:58","price":18,"amount":10.08},{"date":"2013-09-05 02:15:44","price":18,"amount":10.08},{"date":"2013-09-04 22:52:15","price":18,"amount":10.08},{"date":"2013-09-04 22:45:36","price":18,"amount":10.08},{"date":"2013-09-04 22:35:26","price":18,"amount":10.08},{"date":"2013-09-04 21:30:51","price":18,"amount":10.08},{"date":"2013-09-04 21:07:07","price":18,"amount":10.08},{"date":"2013-09-04 19:53:15","price":18,"amount":10.08},{"date":"2013-09-04 19:12:43","price":18,"amount":10.08},{"date":"2013-09-04 12:53:58","price":18,"amount":10.08}, {"date":"2013-09-04 08:15:47","price":18,"amount":10.08},{"date":"2013-09-03 21:30:16","price":18,"amount":10.08},{"date":"2013-09-03 20:37:37","price":18,"amount":10.08},{"date":"2013-09-03 20:15:08","price":18,"amount":10.08},{"date":"2013-09-03 18:20:48","price":18,"amount":10.08},{"date":"2013-09-03 15:03:21","price":18,"amount":10.08},{"date":"2013-09-03 09:59:19","price":18,"amount":10.08},{"date":"2013-09-03 08:27:45","price":18,"amount":10.08},{"date":"2013-09-03 06:53:29","price":18,"amount":10.08},{"date":"2013-09-03 03:25:46","price":18,"amount":10.08},{"date":"2013-09-03 02:49:31","price":18,"amount":10.08},{"date":"2013-09-02 22:57:16","price":18,"amount":10.08},{"date":"2013-09-02 21:05:05","price":18,"amount":10.08},{"date":"2013-09-02 13:02:52","price":18,"amount":10.08},{"date":"2013-09-02 08:22:08","price":18,"amount":10.08},{"date":"2013-09-02 08:06:30","price":18,"amount":10.08},{"date":"2013-09-02 06:03:02","price":18,"amount":10.08},{"date":"2013-09-01 19:09:16","price":18,"amount":10.08},{"date":"2013-09-01 16:54:52","price":18,"amount":10.08},{"date":"2013-09-01 16:45:47","price":18,"amount":10.08},{"date":"2013-09-01 15:26:34","price":18,"amount":10.08},{"date":"2013-09-01 14:25:09","price":18,"amount":10.08},{"date":"2013-08-31 19:52:45","price":18,"amount":10.08},{"date":"2013-08-31 19:20:42","price":18,"amount":10.08},{"date":"2013-08-31 13:28:59","price":18,"amount":10.08},{"date":"2013-08-31 06:23:43","price":18,"amount":10.08},{"date":"2013-08-30 14:04:52","price":18,"amount":10.08},{"date":"2013-08-30 13:32:16","price":50,"amount":28},{"date":"2013-08-30 10:22:02","price":18,"amount":10.08},{"date":"2013-08-30 08:01:35","price":18,"amount":10.08},{"date":"2013-08-30 01:31:39","price":18,"amount":10.08},{"date":"2013-08-29 23:33:28","price":18,"amount":10.08},{"date":"2013-08-29 22:24:51","price":18,"amount":10.08},{"date":"2013-08-29 13:22:11","price":18,"amount":10.08},{"date":"2013-08-28 20:15:06","price":18,"amount":10.08},{"date":"2013-08-28 19:50:20","price":18,"amount":10.08},{"date":"2013-08-28 14:30:01","price":18,"amount":10.08},{"date":"2013-08-28 12:10:13","price":18,"amount":10.08},{"date":"2013-08-28 09:35:36","price":18,"amount":10.08},{"date":"2013-08-28 09:05:27","price":18,"amount":10.08},{"date":"2013-08-28 06:37:50","price":50,"amount":28},{"date":"2013-08-27 22:40:44","price":18,"amount":10.08},{"date":"2013-08-27 21:17:26","price":18,"amount":10.08}, {"date":"2013-08-27 20:49:35","price":18,"amount":10.08},{"date":"2013-08-27 18:44:02","price":18,"amount":10.08},{"date":"2013-08-27 16:51:20","price":18,"amount":10.08},{"date":"2013-08-27 13:44:29","price":18,"amount":10.08},{"date":"2013-08-27 13:38:46","price":18,"amount":10.08},{"date":"2013-08-27 12:54:45","price":18,"amount":10.08},{"date":"2013-08-27 08:30:22","price":18,"amount":10.08},{"date":"2013-08-26 19:42:25","price":18,"amount":10.08},{"date":"2013-08-26 15:53:44","price":18,"amount":10.08},{"date":"2013-08-26 12:40:32","price":18,"amount":10.08},{"date":"2013-08-26 08:38:38","price":18,"amount":10.08},{"date":"2013-08-25 23:10:28","price":18,"amount":10.08},{"date":"2013-08-25 17:41:25","price":18,"amount":10.08},{"date":"2013-08-25 15:14:30","price":18,"amount":10.08},{"date":"2013-08-24 19:46:31","price":18,"amount":10.08},{"date":"2013-08-24 12:49:26","price":18,"amount":10.08},{"date":"2013-08-23 17:45:37","price":18,"amount":10.08},{"date":"2013-08-23 12:51:59","price":18,"amount":10.08},{"date":"2013-08-22 18:19:25","price":18,"amount":10.08},{"date":"2013-08-22 12:06:34","price":18,"amount":10.08},{"date":"2013-08-22 08:16:57","price":18,"amount":10.08},{"date":"2013-08-22 02:53:29","price":18,"amount":10.08},{"date":"2013-08-22 00:07:56","price":50,"amount":28},{"date":"2013-08-21 21:19:56","price":18,"amount":10.08},{"date":"2013-08-21 19:30:13","price":18,"amount":10.08},{"date":"2013-08-21 12:46:48","price":18,"amount":10.08},{"date":"2013-08-21 09:08:52","price":18,"amount":10.08},{"date":"2013-08-20 21:35:12","price":18,"amount":10.08},{"date":"2013-08-20 19:55:14","price":18,"amount":10.08},{"date":"2013-08-20 19:10:39","price":18,"amount":10.08},{"date":"2013-08-20 16:23:11","price":18,"amount":10.08},{"date":"2013-08-20 13:52:17","price":18,"amount":10.08},{"date":"2013-08-20 10:35:09","price":18,"amount":10.08},{"date":"2013-08-20 09:09:31","price":18,"amount":10.08},{"date":"2013-08-20 07:10:00","price":18,"amount":10.08},{"date":"2013-08-20 04:05:43","price":18,"amount":10.08},{"date":"2013-08-19 22:45:02","price":18,"amount":10.08},{"date":"2013-08-19 19:50:12","price":18,"amount":10.08},{"date":"2013-08-19 05:37:47","price":18,"amount":10.08},{"date":"2013-08-18 22:10:00","price":18,"amount":10.08},{"date":"2013-08-18 13:48:28","price":18,"amount":10.08},{"date":"2013-08-17 23:20:23","price":18,"amount":10.08},{"date":"2013-08-17 17:39:18","price":18,"amount":10.08},{"date":"2013-08-16 22:21:17","price":18,"amount":10.08},{"date":"2013-08-16 17:47:06","price":18,"amount":10.08},{"date":"2013-08-16 14:29:08","price":18,"amount":10.08},{"date":"2013-08-16 13:47:27","price":18,"amount":10.08},{"date":"2013-08-16 10:57:02","price":18,"amount":10.08},{"date":"2013-08-16 02:49:12","price":18,"amount":10.08},{"date":"2013-08-15 17:44:21","price":18,"amount":10.08},{"date":"2013-08-15 16:36:53","price":18,"amount":10.08},{"date":"2013-06-22 04:06:52","price":18,"amount":9.9},{"date":"2013-06-21 20:39:11","price":18,"amount":9.9},{"date":"2013-06-29 10:25:22","price":18,"amount":9.9},{"date":"2013-06-29 02:35:42","price":18,"amount":9.9},{"date":"2013-06-28 23:51:12","price":18,"amount":9.9},{"date":"2013-06-28 22:37:20","price":18,"amount":9.9},{"date":"2013-06-28 21:51:48","price":18,"amount":9.9},{"date":"2013-06-28 21:41:56","price":18,"amount":9.9},{"date":"2013-06-28 18:54:31","price":18,"amount":9.9},{"date":"2013-06-28 18:03:43","price":18,"amount":9.9},{"date":"2013-06-28 13:00:10","price":18,"amount":9.9},{"date":"2013-06-28 12:19:08","price":18,"amount":9.9},{"date":"2013-06-28 02:11:01","price":18,"amount":9.9},{"date":"2013-06-27 17:34:56","price":18,"amount":9.9},{"date":"2013-06-27 11:46:56","price":18,"amount":9.9},{"date":"2013-06-27 07:15:34","price":18,"amount":9.9},{"date":"2013-06-27 00:53:06","price":18,"amount":9.9},{"date":"2013-06-27 00:39:18","price":18,"amount":9.9},{"date":"2013-06-26 20:22:45","price":18,"amount":9.9},{"date":"2013-06-26 10:45:08","price":18,"amount":9.9},{"date":"2013-06-26 08:47:37","price":18,"amount":9.9},{"date":"2013-06-25 21:05:40","price":18,"amount":9.9},{"date":"2013-06-25 20:44:50","price":18,"amount":9.9},{"date":"2013-06-25 19:27:41","price":18,"amount":9.9},{"date":"2013-06-25 06:56:57","price":18,"amount":9.9},{"date":"2013-06-24 22:24:49","price":18,"amount":9.9},{"date":"2013-06-24 22:12:38","price":18,"amount":9.9},{"date":"2013-06-24 12:30:31","price":18,"amount":9.9},{"date":"2013-06-24 08:12:50","price":18,"amount":9.9},{"date":"2013-06-23 11:28:15","price":18,"amount":9.9},{"date":"2013-06-23 03:06:18","price":18,"amount":9.9},{"date":"2013-06-22 05:44:46","price":18,"amount":9.9},{"date":"2013-07-04 16:25:46","price":18,"amount":9.9},{"date":"2013-07-04 16:05:01","price":18,"amount":9.9},{"date":"2013-07-04 12:32:06","price":18,"amount":9.9},{"date":"2013-07-04 11:01:33","price":18,"amount":9.9},{"date":"2013-07-04 08:36:04","price":18,"amount":9.9},{"date":"2013-07-04 05:24:11","price":18,"amount":9.9},{"date":"2013-07-03 19:49:14","price":18,"amount":9.9},{"date":"2013-07-03 13:38:34","price":18,"amount":9.9},{"date":"2013-07-03 07:42:19","price":18,"amount":9.9},{"date":"2013-07-02 22:21:38","price":18,"amount":9.9},{"date":"2013-07-02 21:14:07","price":18,"amount":9.9},{"date":"2013-07-02 17:46:00","price":18,"amount":9.9},{"date":"2013-07-02 14:25:31","price":18,"amount":9.9},{"date":"2013-07-02 13:24:08","price":18,"amount":9.9},{"date":"2013-07-02 12:51:39","price":18,"amount":9.9},{"date":"2013-07-02 10:29:29","price":18,"amount":9.9},{"date":"2013-07-02 06:20:01","price":18,"amount":9.9},{"date":"2013-07-02 01:54:23","price":18,"amount":9.9},{"date":"2013-07-01 11:41:30","price":18,"amount":9.9},{"date":"2013-07-01 08:40:07","price":18,"amount":9.9},{"date":"2013-07-01 04:27:55","price":18,"amount":9.9},{"date":"2013-07-01 01:44:31","price":18,"amount":9.9},{"date":"2013-07-01 01:19:35","price":18,"amount":9.9},{"date":"2013-06-30 22:40:14","price":18,"amount":9.9},{"date":"2013-06-30 21:48:05","price":18,"amount":9.9},{"date":"2013-06-30 18:16:14","price":18,"amount":9.9},{"date":"2013-06-30 13:18:09","price":18,"amount":9.9},{"date":"2013-06-30 10:48:42","price":18,"amount":9.9},{"date":"2013-06-29 18:43:46","price":18,"amount":9.9},{"date":"2013-06-29 12:36:52","price":18,"amount":9.9},{"date":"2013-07-11 21:41:28","price":18,"amount":9.9},{"date":"2013-07-11 20:30:54","price":18,"amount":9.9},{"date":"2013-07-11 16:52:56","price":18,"amount":9.9},{"date":"2013-07-11 12:54:36","price":18,"amount":9.9},{"date":"2013-07-11 05:40:43","price":18,"amount":9.9},{"date":"2013-07-10 19:44:53","price":18,"amount":9.9},{"date":"2013-07-10 18:48:28","price":50,"amount":27.5},{"date":"2013-07-10 16:55:06","price":18,"amount":9.9},{"date":"2013-07-10 00:46:34","price":18,"amount":9.9},{"date":"2013-07-09 05:43:12","price":18,"amount":9.9},{"date":"2013-07-08 23:46:32","price":18,"amount":9.9},{"date":"2013-07-08 22:58:08","price":18,"amount":9.9},{"date":"2013-07-08 20:58:15","price":18,"amount":9.9},{"date":"2013-07-08 10:55:24","price":18,"amount":9.9},{"date":"2013-07-08 09:23:20","price":18,"amount":9.9},{"date":"2013-07-07 16:47:13","price":18,"amount":9.9},{"date":"2013-07-07 14:19:03","price":18,"amount":9.9},{"date":"2013-07-07 02:29:55","price":18,"amount":9.9},{"date":"2013-07-06 16:27:38","price":18,"amount":9.9},{"date":"2013-07-06 13:04:40","price":18,"amount":9.9},{"date":"2013-07-05 23:18:16","price":18,"amount":9.9},{"date":"2013-07-05 22:47:35","price":18,"amount":9.9},{"date":"2013-07-05 18:12:42","price":18,"amount":9.9},{"date":"2013-07-05 14:00:18","price":18,"amount":9.9},{"date":"2013-07-05 13:23:10","price":18,"amount":9.9},{"date":"2013-07-05 11:33:55","price":18,"amount":9.9},{"date":"2013-07-05 03:25:10","price":18,"amount":9.9},{"date":"2013-07-05 01:27:33","price":18,"amount":9.9},{"date":"2013-07-04 18:37:37","price":18,"amount":9.9},{"date":"2013-07-04 17:45:14","price":18,"amount":9.9},{"date":"2013-07-19 02:37:22","price":18,"amount":9.9},{"date":"2013-07-18 18:14:51","price":18,"amount":9.9},{"date":"2013-07-18 16:29:30","price":18,"amount":9.9},{"date":"2013-07-18 04:11:55","price":18,"amount":9.9},{"date":"2013-07-17 23:14:59","price":18,"amount":9.9},{"date":"2013-07-17 16:55:27","price":18,"amount":9.9},{"date":"2013-07-16 23:08:50","price":18,"amount":9.9},{"date":"2013-07-16 21:13:43","price":18,"amount":9.9},{"date":"2013-07-16 18:49:50","price":18,"amount":9.9},{"date":"2013-07-16 11:41:52","price":18,"amount":9.9},{"date":"2013-07-16 07:43:40","price":18,"amount":9.9},{"date":"2013-07-16 02:23:59","price":18,"amount":9.9},{"date":"2013-07-16 01:40:57","price":18,"amount":9.9},{"date":"2013-07-14 22:58:56","price":18,"amount":9.9},{"date":"2013-07-14 22:05:46","price":18,"amount":9.9},{"date":"2013-07-14 13:41:33","price":18,"amount":9.9},{"date":"2013-07-14 09:21:30","price":18,"amount":9.9},{"date":"2013-07-14 05:19:55","price":18,"amount":9.9},{"date":"2013-07-14 04:34:23","price":18,"amount":9.9},{"date":"2013-07-14 01:24:42","price":18,"amount":9.9},{"date":"2013-07-13 18:09:47","price":18,"amount":9.9},{"date":"2013-07-13 17:46:08","price":18,"amount":9.9},{"date":"2013-07-13 17:05:41","price":18,"amount":9.9},{"date":"2013-07-13 17:02:17","price":18,"amount":9.9},{"date":"2013-07-13 11:46:50","price":18,"amount":9.9},{"date":"2013-07-13 08:44:52","price":18,"amount":9.9},{"date":"2013-07-13 05:56:41","price":18,"amount":9.9},{"date":"2013-07-12 09:08:28","price":18,"amount":9.9},{"date":"2013-07-12 05:03:16","price":18,"amount":9.9},{"date":"2013-07-11 23:03:57","price":18,"amount":9.9},{"date":"2013-07-25 00:11:28","price":18,"amount":9.9},{"date":"2013-07-24 17:25:14","price":18,"amount":9.9},{"date":"2013-07-24 13:58:10","price":18,"amount":9.9},{"date":"2013-07-24 11:12:53","price":18,"amount":9.9},{"date":"2013-07-23 23:47:44","price":18,"amount":9.9},{"date":"2013-07-23 21:25:11","price":18,"amount":9.9},{"date":"2013-07-23 08:22:22","price":18,"amount":9.9},{"date":"2013-07-22 20:35:17","price":18,"amount":9.9},{"date":"2013-07-22 19:22:12","price":18,"amount":9.9},{"date":"2013-07-22 13:55:12","price":18,"amount":9.9},{"date":"2013-07-22 08:34:56","price":18,"amount":9.9},{"date":"2013-07-22 06:35:04","price":18,"amount":9.9},{"date":"2013-07-21 23:14:16","price":18,"amount":9.9},{"date":"2013-07-21 21:05:54","price":18,"amount":9.9},{"date":"2013-07-21 19:22:58","price":18,"amount":9.9},{"date":"2013-07-21 19:15:09","price":18,"amount":9.9},{"date":"2013-07-21 17:58:19","price":18,"amount":9.9},{"date":"2013-07-21 11:48:16","price":18,"amount":9.9},{"date":"2013-07-20 17:27:20","price":18,"amount":9.9},{"date":"2013-07-20 13:43:14","price":18,"amount":9.9},{"date":"2013-07-20 13:28:47","price":18,"amount":9.9},{"date":"2013-07-20 11:19:07","price":18,"amount":9.9},{"date":"2013-07-20 04:28:57","price":18,"amount":9.9},{"date":"2013-07-20 01:39:01","price":18,"amount":9.9},{"date":"2013-07-20 01:26:59","price":18,"amount":9.9},{"date":"2013-07-19 20:52:20","price":18,"amount":9.9},{"date":"2013-07-19 20:02:14","price":18,"amount":9.9},{"date":"2013-07-19 13:12:48","price":18,"amount":9.9},{"date":"2013-07-19 05:41:35","price":18,"amount":9.9},{"date":"2013-07-19 05:25:48","price":18,"amount":9.9},{"date":"2013-07-30 14:09:50","price":18,"amount":9.9},{"date":"2013-07-30 11:36:53","price":18,"amount":9.9},{"date":"2013-07-30 10:38:53","price":18,"amount":9.9},{"date":"2013-07-29 20:04:22","price":18,"amount":9.9},{"date":"2013-07-29 13:54:41","price":18,"amount":9.9},{"date":"2013-07-29 05:42:42","price":18,"amount":9.9},{"date":"2013-07-29 02:52:24","price":18,"amount":9.9},{"date":"2013-07-28 15:18:07","price":18,"amount":9.9},{"date":"2013-07-28 14:32:05","price":18,"amount":9.9},{"date":"2013-07-28 13:14:02","price":18,"amount":9.9},{"date":"2013-07-27 14:49:14","price":18,"amount":9.9},{"date":"2013-07-27 14:48:01","price":18,"amount":9.9},{"date":"2013-07-27 14:14:15","price":18,"amount":9.9},{"date":"2013-07-27 09:13:23","price":18,"amount":9.9},{"date":"2013-07-27 09:02:21","price":18,"amount":9.9},{"date":"2013-07-27 05:11:47","price":18,"amount":9.9},{"date":"2013-07-27 01:30:12","price":18,"amount":9.9},{"date":"2013-07-27 01:25:12","price":18,"amount":9.9},{"date":"2013-07-26 20:40:11","price":18,"amount":9.9},{"date":"2013-07-26 19:27:51","price":18,"amount":9.9},{"date":"2013-07-26 15:05:22","price":18,"amount":9.9},{"date":"2013-07-26 09:11:25","price":18,"amount":9.9},{"date":"2013-07-26 08:57:52","price":18,"amount":9.9},{"date":"2013-07-26 05:12:51","price":18,"amount":9.9},{"date":"2013-07-26 04:53:37","price":18,"amount":9.9},{"date":"2013-07-25 21:17:20","price":18,"amount":9.9},{"date":"2013-07-25 20:11:48","price":18,"amount":9.9},{"date":"2013-07-25 12:26:47","price":18,"amount":9.9},{"date":"2013-07-25 12:14:40","price":18,"amount":9.9},{"date":"2013-07-25 07:04:34","price":50,"amount":27.5},{"date":"2013-08-08 04:26:44","price":50,"amount":28},{"date":"2013-08-08 02:15:36","price":18,"amount":10.08},{"date":"2013-08-07 23:05:33","price":18,"amount":10.08},{"date":"2013-08-07 22:55:17","price":18,"amount":10.08},{"date":"2013-08-07 15:42:28","price":18,"amount":10.08},{"date":"2013-08-06 18:06:54","price":18,"amount":10.08},{"date":"2013-08-06 15:33:14","price":18,"amount":10.08},{"date":"2013-08-05 21:20:53","price":18,"amount":10.08},{"date":"2013-08-05 15:14:31","price":18,"amount":10.08},{"date":"2013-08-05 14:49:13","price":18,"amount":10.08},{"date":"2013-08-05 10:05:44","price":18,"amount":10.08},{"date":"2013-08-04 12:46:01","price":18,"amount":10.08},{"date":"2013-08-04 08:28:57","price":18,"amount":10.08},{"date":"2013-08-03 14:23:12","price":18,"amount":10.08},{"date":"2013-08-03 02:19:20","price":18,"amount":10.08},{"date":"2013-08-02 15:27:18","price":18,"amount":10.08},{"date":"2013-08-02 13:18:27","price":18,"amount":10.08},{"date":"2013-08-02 08:58:39","price":18,"amount":10.08},{"date":"2013-08-01 22:57:56","price":18,"amount":10.08},{"date":"2013-08-01 19:07:27","price":18,"amount":10.08},{"date":"2013-08-01 18:46:09","price":18,"amount":10.08},{"date":"2013-08-01 15:02:17","price":18,"amount":10.08},{"date":"2013-08-01 11:26:33","price":18,"amount":9.9},{"date":"2013-08-01 08:49:23","price":18,"amount":9.9},{"date":"2013-07-31 00:39:35","price":18,"amount":9.9},{"date":"2013-07-30 20:53:00","price":18,"amount":9.9},{"date":"2013-07-30 19:45:32","price":18,"amount":9.9},{"date":"2013-07-30 19:09:21","price":18,"amount":9.9},{"date":"2013-07-30 16:53:08","price":18,"amount":9.9},{"date":"2013-07-30 16:18:25","price":18,"amount":9.9},{"date":"2013-08-15 12:03:15","price":18,"amount":10.08},{"date":"2013-08-15 03:55:04","price":18,"amount":10.08},{"date":"2013-08-14 23:24:18","price":18,"amount":10.08},{"date":"2013-08-14 21:37:14","price":18,"amount":10.08},{"date":"2013-08-14 19:01:02","price":18,"amount":10.08},{"date":"2013-08-14 14:27:06","price":18,"amount":10.08},{"date":"2013-08-14 07:00:37","price":18,"amount":10.08},{"date":"2013-08-14 05:24:07","price":18,"amount":10.08},{"date":"2013-08-13 18:06:22","price":18,"amount":10.08},{"date":"2013-08-13 12:37:09","price":18,"amount":10.08},{"date":"2013-08-13 04:21:57","price":18,"amount":10.08},{"date":"2013-08-13 01:55:40","price":18,"amount":10.08},{"date":"2013-08-12 22:22:01","price":18,"amount":10.08},{"date":"2013-08-12 07:57:56","price":18,"amount":10.08},{"date":"2013-08-12 07:03:53","price":18,"amount":10.08},{"date":"2013-08-12 06:52:58","price":50,"amount":28},{"date":"2013-08-11 20:15:10","price":18,"amount":10.08},{"date":"2013-08-11 16:46:25","price":18,"amount":10.08},{"date":"2013-08-11 06:41:26","price":18,"amount":10.08},{"date":"2013-08-11 03:56:11","price":18,"amount":10.08},{"date":"2013-08-10 22:27:53","price":18,"amount":10.08},{"date":"2013-08-10 03:46:24","price":18,"amount":10.08},{"date":"2013-08-10 00:15:57","price":18,"amount":10.08},{"date":"2013-08-09 20:23:04","price":18,"amount":10.08},{"date":"2013-08-09 18:51:00","price":18,"amount":10.08},{"date":"2013-08-09 17:33:33","price":18,"amount":10.08},{"date":"2013-08-09 14:01:05","price":18,"amount":10.08},{"date":"2013-08-09 11:29:44","price":18,"amount":10.08},{"date":"2013-08-09 00:49:13","price":18,"amount":10.08},{"date":"2013-08-08 19:05:43","price":18,"amount":10.08}],
        sales = {},
        todaySalesCount = 0,
        intDates = [],
        todayInt = extractDay(new Date()).getTime(),
        oneDayMillis = 1000 * 60 * 60 * 24;
    for (var i = 0; i < stringDates.length; i++){
        var date = Date.parseString(stringDates[i].date, 'yyyy-MM-dd HH:mm:ss'),
            dayInt = extractDay(date).getTime();
        intDates.push(dayInt);
    }
    var min = d3.min(intDates),
        max = d3.max(intDates),
        val = min;
    if (max == todayInt){
        max -= oneDayMillis;
    }
    while (val <= max){
        sales[val] = 0;
        val += oneDayMillis; //next day
    }
    for (i = 0; i < intDates.length; i++){
        dayInt = intDates[i];
        if (dayInt == todayInt){
            todaySalesCount ++;
            continue
        }
        sales[dayInt] ++
    }
    var salesData = [];
    for(var key in sales) {
        if (sales.hasOwnProperty(key)){
            salesData.push({
                x: new Date(parseInt(key)),
                y: sales[key]
            })
        }
    }

    printStats(salesData);

    var data = [{
        key: 'Sales per Day',
        values: salesData
    }];

    function addWeekends(data){
        var weekends = {
                key: 'Weekends',
                values: function(){
                    var copy = [];
                    for (var i = 0; i < data[0].values.length; i++){
                        copy.push({
                            x: data[0].values[i].x,
                            y: data[0].values[i].y
                        })
                    }
                    return copy;
                }()
            },
            average = d3.mean(data[0].values, function(el){
                return el.y
            });
        for (var i = 0; i < weekends.values.length; i++){
            var day = weekends.values[i].x.getDay(),
                isWeekend = (day == 6) || (day == 0);
            if (isWeekend){
                weekends.values[i].y = average;
            } else {
                weekends.values[i].y = 0
            }
        }
        data.push(weekends);
    }

    addWeekends(data);
    d3.select('#visits-chart svg')
        .datum(data)
        .transition().duration(500)
        .call(chart);

//    var sales = localStorage.getItem('sales') ? JSON.parse(localStorage.getItem('sales')) : [];
//    $('.zebra-striped tbody tr').each(function(){
//        sales.push({
//            date: $(this).find('td:nth-child(5) span').attr('title'),
//            price: parseInt($(this).find('td:nth-child(2)').text().slice(1,100)),
//            amount: parseFloat($(this).find('td:nth-child(3) span:first-child').text().slice(1,100))
//        });
//    });
//    console.log(JSON.stringify(sales));
//    localStorage.setItem('sales', JSON.stringify(sales));

    nv.utils.windowResize(chart.update);

    chart.legend.dispatch.on('legendClick.updateExamples', function() {
        lineChartOperaHack();
    });

    lineChart = chart;

    lineChartOperaHack();

    return chart;
});

$(function(){
    /* Sparklines can also take their values from the first argument
     passed to the sparkline() function */
    function randomValue(){
        return Math.floor( Math.random() * 40 );
    }
    var values = [[],[],[],[],[]],
        options = {
            width: '150px',
            height: '30px',
            lineColor: $white,
            lineWidth: '2',
            spotRadius: '2',
            highlightLineColor: $gray,
            highlightSpotColor: $gray,
            spotColor: false,
            minSpotColor: false,
            maxSpotColor: false
        };
    for (var i = 0; i < values.length; i++){
        values[i] = [10 + randomValue(), 15 + randomValue(), 20 + randomValue(), 15 + randomValue(), 25 + randomValue(),
            25 + randomValue(), 30 + randomValue(), 30 + randomValue(), 40 + randomValue()]
    }

    function drawSparkLines(){
        options.lineColor = $green;
        options.fillColor = 'rgba(86, 188, 118, 0.1)';
        $('#direct-trend').sparkline(values[0], options );
        options.lineColor = $orange;
        options.fillColor = 'rgba(234, 200, 94, 0.1)';
        $('#refer-trend').sparkline(values[1], options );
        options.lineColor = $blue;
        options.fillColor = 'rgba(106, 141, 167, 0.1)';
        $('#social-trend').sparkline(values[2], options );
        options.lineColor = $red;
        options.fillColor = 'rgba(229, 96, 59, 0.1)';
        $('#search-trend').sparkline(values[3], options );
        options.lineColor = $white;
        options.fillColor = 'rgba(255, 255, 255, 0.1)';
        $('#internal-trend').sparkline(values[4], options );
    }
    var sparkResize;

    $(window).resize(function(e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(drawSparkLines, 200);
    });
    drawSparkLines();

    $("input:checkbox").uniform();

    // Notification link click handler.
    // JUST FOR DEMO.
    // Can be removed.

    function close(e){
        var $settings = $("#settings"),
            $popover = $settings.siblings(".popover");
        if(!$.contains($popover[0], e.target)){
            $settings.popover('hide');
            $(document).off("click", close);
        }
    }
    $("#notification-link").click(function(){
        if ( $(window).width() > 767){
            $("#settings").popover('show');
            $(document).on("click", close);
            return false;
        }
    });

    $("#feed").slimscroll({
        height: 'auto',
        size: '5px',
        alwaysVisible: true,
        railVisible: true
    });

    $("#chat-messages").slimscroll({
        height: '240px',
        size: '5px',
        alwaysVisible: true,
        railVisible: true
    });
});

