/*
	UIZE JAVASCRIPT FRAMEWORK

	http://www.uize.com/reference/Uize.Services.FileSystemWsh.html
	Available under MIT License or GNU General Public License -- http://www.uize.com/license.html
*/
Uize.module({name:'Uize.Services.FileSystemWsh',superclass:'Uize.Service.Adapter',builder:function(c_a){var c_b=c_a.subclass(),c_c=c_b.prototype;c_c.readFile=function(c_d,c_e){var c_f=this.c_f,c_g=c_d.path,c_h='';if(c_f.GetFile(c_g).Size){var c_i=c_f.OpenTextFile(c_g,1);c_h=c_i.ReadAll();c_i.Close();}c_e(c_h);};c_c.writeFile=function(c_d,c_e){var c_g=c_d.path,c_f=this.c_f;var c_j=c_g.substr(0,c_g.lastIndexOf('\\'));if(!c_f.FolderExists(c_j)){var c_k=c_j.split('\\'),c_l=c_k[0];for(var c_m=0,c_n=c_k.length;++c_m<c_n;){c_l+='\\'+c_k[c_m];c_f.FolderExists(c_l)||c_f.CreateFolder(c_l);}}var c_i=c_f.CreateTextFile(c_g);c_i.Write(c_d.contents);c_i.Close();c_e();};c_c.init=function(c_d,c_e){this.c_f=new ActiveXObject('Scripting.FileSystemObject');c_e();};return c_b;}});