/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Test.Uize.Templates.List.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Test.Uize.Templates.List',builder:function(){return Uize.Test.declare({title:'Test for Uize.Templates.List JavaScript Template',test:[Uize.Test.requiredModulesTest('Uize.Templates.List'),{title:'Test that calling the process static method produces a non-empty string',test:function(){return this.expectNonEmptyString(Uize.Templates.List.process({indentChars:'   ',items:[{title:'Item Title',description:'This is an item',link:'http://www.uize.com',expanded:true}]}));}}]});}});