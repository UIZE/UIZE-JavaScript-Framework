/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Templates.Calendar.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Templates.Calendar',builder:function(){var _a=function(){};_a.process=function(input){var output=[];
output.push('<div class="calendarContainer">\r\n	<div id="',input.idPrefix,'-controls" class="calendarControls">\r\n		<div id="',input.idPrefix,'-indicator" class="calendarIndicator">\r\n			<span id="',input.idPrefix,'-month" class="monthIndicator">Month</span>\r\n			<span id="',input.idPrefix,'-year" class="yearIndicator">Year</span>\r\n		</div>\r\n		<a href="javascript://" id="',input.idPrefix,'_previousMonth" class="calendarControl previousMonth" title="previous month">&#9668;</a>\r\n		<a href="javascript://" id="',input.idPrefix,'_nextMonth" class="calendarControl nextMonth" title="next month">&#9658;</a>\r\n		<a href="javascript://" id="',input.idPrefix,'_previousYear" class="calendarControl previousYear" title="previous year">&laquo;</a>\r\n		<a href="javascript://" id="',input.idPrefix,'_nextYear" class="calendarControl nextYear" title="next year">&raquo;</a>\r\n	</div>\r\n	<div id="',input.idPrefix,'-grid" class="calendarGrid"></div>\r\n</div>\r\n');return output.join('');};_a.input={idPrefix:'string'
};return _a;}});