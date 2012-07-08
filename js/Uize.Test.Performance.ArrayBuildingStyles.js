/*
	UIZE JAVASCRIPT FRAMEWORK 2012-07-07

	http://www.uize.com/reference/Uize.Test.Performance.ArrayBuildingStyles.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Test.Performance.ArrayBuildingStyles',builder:function(){var c_a=2000000;return Uize.Test.declare({title:'Test the performance of different approaches to building arrays',test:[{title:'Test the performance of building an array by adding elements with the push method',test:function(){for(var c_b= -1,c_c=[];++c_b<c_a;)c_c.push(c_b);return true;}},{title:'Test the performance of building an array by assigning to an element beyond the last element of the array',test:function(){for(var c_b= -1,c_c=[];++c_b<c_a;)c_c[c_b]=c_b;return true;}}]});}});