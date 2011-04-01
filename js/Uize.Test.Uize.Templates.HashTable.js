/*
	UIZE JAVASCRIPT FRAMEWORK 2011-04-01

	http://www.uize.com/reference/Uize.Test.Uize.Templates.HashTable.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Test.Uize.Templates.HashTable',builder:function(){return Uize.Test.declare({title:'Test for Uize.Templates.HashTable JavaScript Template',test:[Uize.Test.requiredModulesTest('Uize.Templates.HashTable'),{title:'Test that calling the process static method produces a non-empty string',test:function(){return this.expectNonEmptyString(Uize.Templates.HashTable.process({}));}}]});}});