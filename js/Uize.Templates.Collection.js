/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Templates.Collection.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Templates.Collection',builder:function(){var _a=function(){};_a.process=function(input){var output=[];output.push('<div id="',input.idPrefix,'-tooltipDragToReorder" class="genericTooltip">Drag and drop selected items to reorganize</div>\r\n<div id="',input.idPrefix,'-tooltipDragging" class="genericTooltip"></div>\r\n<div id="',input.idPrefix,'-insertionMarker" class="collectionInsertionMarker">&nbsp;</div>\r\n<div class="collectionToolbar">\r\n	<a id="',input.idPrefix,'_selectAll" class="button">SELECT ALL</a>\r\n	<a id="',input.idPrefix,'_selectNone" class="button">SELECT NONE</a>\r\n	<a id="',input.idPrefix,'_remove" class="button">REMOVE</a>\r\n</div>\r\n<div id="',input.idPrefix,'-items" class="collectionView">\r\n</div>\r\n\r\n');return output.join('');};_a.input={idPrefix:'string'};return _a;}});