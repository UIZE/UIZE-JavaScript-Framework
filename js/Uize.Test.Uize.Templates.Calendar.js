/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Test.Uize.Templates.Calendar.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Test.Uize.Templates.Calendar',builder:function(){return Uize.Test.declare({title:'Test for Uize.Templates.Calendar JavaScript Template',test:[Uize.Test.requiredModulesTest('Uize.Templates.Calendar'),{title:'Test that calling the process static method produces a non-empty string',test:function(){return this.expectNonEmptyString(Uize.Templates.Calendar.process({idPrefix:'page_widget'}));}}]});}});