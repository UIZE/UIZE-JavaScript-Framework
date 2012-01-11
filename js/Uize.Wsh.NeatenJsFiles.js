/*
	UIZE JAVASCRIPT FRAMEWORK 2012-01-10

	http://www.uize.com/reference/Uize.Wsh.NeatenJsFiles.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Wsh.NeatenJsFiles',required:['Uize.String.Lines','Uize.Wsh.AutoScruncher'],builder:function(){var _a=function(){};_a.perform=function(_b){Uize.Wsh.buildFiles(Uize.copyInto({targetFolderPathCreator:function(_c){return(Uize.Wsh.AutoScruncher.getScrunchedFolderPath(_c,_b.buildFolderPath,_b.sourceFolderName)&&_c);},targetFilenameCreator:function(_d){return/\.js$/.test(_d)?_d:null;},fileBuilder:function(_d,_e){var _f=Uize.String.Lines.trimRight(_e);return(_f!=_e?{outputText:_f,logDetails:'\t\tTrailing Whitespace Characters Removed: '+(_e.length-_f.length)+'\n'}:{logDetails:'\t\tFILE ALREADY OK\n'});}},_b,{alwaysBuild:true}));};return _a;}});