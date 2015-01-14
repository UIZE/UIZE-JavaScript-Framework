/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Node Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2004-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Node= module facilitates [[http://en.wikipedia.org/wiki/Document_Object_Model][DOM]] manipulation, with support for finding nodes, and querying and modifying their properties, CSS styling, and more.

		*DEVELOPERS:* `Chris van Rensburg`, `Vinson Chuong`
*/

Uize.module ({
	name:'Uize.Node',
	required:[
		'Uize.Dom.Basics',
		'Uize.Dom.Pos',
		'Uize.Dom.Text',
		'Uize.Dom.Util'
	],
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_Uize = Uize,
				_Uize_Dom = _Uize.Dom,
				_Uize_Dom_Basics = _Uize_Dom.Basics
		;

		return _Uize.package (
			_Uize.copyInto (
				{showClickable:_Uize_Dom.Util.showClickable},
					/*?
						Static Methods
							Uize.Node.showClickable
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Util.showClickable= method of the =Uize.Dom.Util= module.
					*/

				_Uize_Dom_Basics,
					/*?
						Static Methods
							Uize.Node.display
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.showClickable= method of the =Uize.Dom.Basics= module.

							Uize.Node.doForAll
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.doForAll= method of the =Uize.Dom.Basics= module.

							Uize.Node.getById
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.getById= method of the =Uize.Dom.Basics= module.

							Uize.Node.find
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.find= method of the =Uize.Dom.Basics= module.

							Uize.Node.getStyle
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.getStyle= method of the =Uize.Dom.Basics= module.

							Uize.Node.getValue
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.getValue= method of the =Uize.Dom.Basics= module.

							Uize.Node.injectHtml
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.injectHtml= method of the =Uize.Dom.Basics= module.

							Uize.Node.isNode
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.isNode= method of the =Uize.Dom.Basics= module.

							Uize.Node.isOnNodeTree
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.isOnNodeTree= method of the =Uize.Dom.Basics= module.

							Uize.Node.joinIdPrefixAndNodeId
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.joinIdPrefixAndNodeId= method of the =Uize.Dom.Basics= module.

							Uize.Node.setClipRect
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.setClipRect= method of the =Uize.Dom.Basics= module.

							Uize.Node.setInnerHtml
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.setInnerHtml= method of the =Uize.Dom.Basics= module.

							Uize.Node.setOpacity
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.setOpacity= method of the =Uize.Dom.Basics= module.

							Uize.Node.setProperties
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.setProperties= method of the =Uize.Dom.Basics= module.

							Uize.Node.setStyle
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.setStyle= method of the =Uize.Dom.Basics= module.

							Uize.Node.setValue
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.setValue= method of the =Uize.Dom.Basics= module.

							Uize.Node.show
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.show= method of the =Uize.Dom.Basics= module.

							Uize.Node.unwire
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.unwire= method of the =Uize.Dom.Basics= module.

							Uize.Node.unwireEventsByOwnerId
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.unwireEventsByOwnerId= method of the =Uize.Dom.Basics= module.

							Uize.Node.wire
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.wire= method of the =Uize.Dom.Basics= module.

						Static Properties
							Uize.Node.ieMajorVersion
								This static property has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.ieMajorVersion= property of the =Uize.Dom.Basics= module.

							Uize.Node.isIe
								This static property has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.isIe= property of the =Uize.Dom.Basics= module.

							Uize.Node.isSafari
								This static property has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.isSafari= property of the =Uize.Dom.Basics= module.

							Uize.Node.isMozilla
								This static property has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Basics.isMozilla= property of the =Uize.Dom.Basics= module.
					*/

				_Uize_Dom.Pos,
					/*?
						Static Methods
							Uize.Node.centerInWindow
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Pos.centerInWindo= method of the =Uize.Dom.Pos= module.

							Uize.Node.doRectanglesOverlap
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Pos.doRectanglesOverlap= method of the =Uize.Dom.Pos= module.

							Uize.Node.getCoords
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Pos.getCoords= method of the =Uize.Dom.Pos= module.

							Uize.Node.getDimensions
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Pos.getDimensions= method of the =Uize.Dom.Pos= module.

							Uize.Node.getDocumentScrollElement
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Pos.getDocumentScrollElement= method of the =Uize.Dom.Pos= module.

							Uize.Node.getEventAbsPos
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Pos.getEventAbsPos= method of the =Uize.Dom.Pos= module.

							Uize.Node.setAbsPos
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Pos.setAbsPos= method of the =Uize.Dom.Pos= module.

							Uize.Node.setAbsPosAdjacentTo
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Pos.setAbsPosAdjacentTo= method of the =Uize.Dom.Pos= module.

							Uize.Node.setCoords
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Pos.setCoords= method of the =Uize.Dom.Pos= module.
					*/

				_Uize_Dom.Text
					/*?
						Static Methods
							Uize.Node.getText
								This method has been deprecated *(DEPRECATED 2014-01-07)* in favor of the newer =Uize.Dom.Text.getText= method of the =Uize.Dom.Text= module.
					*/
			)
		);
	}
});

