/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Test.Uize.Templates.SevenSegmentDisplay.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Test.Uize.Templates.SevenSegmentDisplay',builder:function(){return Uize.Test.declare({title:'Test for Uize.Templates.SevenSegmentDisplay JavaScript Template',test:[Uize.Test.requiredModulesTest('Uize.Templates.SevenSegmentDisplay'),{title:'Test that calling the process static method produces a non-empty string',test:function(){return this.expectNonEmptyString(Uize.Templates.SevenSegmentDisplay.process({idPrefix:'page_widget'}));}}]});}});