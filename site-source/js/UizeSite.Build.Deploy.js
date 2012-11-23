/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : UizeSite.Build.Deploy Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2012 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Namespace
	importance: 5
	codeCompleteness: 100
	testCompleteness: 100
	docCompleteness: 30
*/

/*?
	Introduction
		The =UizeSite.Build.Deploy= package provides a method for deploying the built UIZE Web site to the s production environment.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'UizeSite.Build.Deploy',
	required:[
		'Uize.Wsh',
		'Uize.String',
		'Uize.Services.FileSystem'
	],
	builder:function () {
		/*** Variables for Scruncher Optimization ***/
			var _package = function () {};

		/*** General Variables ***/
			var _fileSystem = Uize.Services.FileSystem.singleton ();

		/*** Public Static Methods ***/
			_package.perform = function (_params) {
				var
					_deployConfig = eval ('(' + _fileSystem.readFile ({path:_params.deployConfigPath}) + ')'),
					_uizeSite = _deployConfig.site
				;

				/*** Utility Functions ***/
					var _ftpCommandsFilename = 'ftp-commands.txt';
					function _ftp (_ftpCommands) {
						_fileSystem.writeFile ({
							path:_ftpCommandsFilename,
							contents:Uize.isArray (_ftpCommands) ? _ftpCommands.join ('\r\n') : _ftpCommands
						});
						Uize.Wsh.execute ('ftp -s:' + _ftpCommandsFilename);
						_fileSystem.deleteFile ({path:_ftpCommandsFilename});
					}

					function _ftpActions (_siteInfo,_actions) {
						_ftp ([
							'open ' + _siteInfo.domain,
							_siteInfo.user,
							_siteInfo.password,
							_actions.join ('\r\n'),
							'quit'
						]);
					}

					var _sshCommandsFilename = 'ssh-commands.js';
					function _ssh (_sshCommands) {
						_fileSystem.writeFile ({
							path:_sshCommandsFilename,
							contents:Uize.isArray (_sshCommands) ? _sshCommands.join ('\r\n') : _sshCommands
						});
						Uize.Wsh.execute ('"' + _deployConfig.appPaths.SecureCRT + '" /SCRIPT "' + _sshCommandsFilename + '"');
						_fileSystem.deleteFile ({path:_sshCommandsFilename});
					}

					function _sshActions (_siteInfo,_actions) {
						_ssh ([
							'# $language = "JScript"',
							'# $interface = "1.0"',
							'',
							'crt.Session.Connect(\'/SSH2 ' +
								'/L ' + _siteInfo.user + ' ' +
								'/PASSWORD ' + _siteInfo.password + ' ' +
								'/C 3DES ' +
								'/M MD5 ' +
								_siteInfo.domain +
							'\');',
							Uize.String.hugJoin (_actions,'crt.Screen.Send(\'','\\n\');'),
							'crt.Screen.Send(\'exit\\n\');',
							'if (crt.Screen.WaitForString(\'logout\',60)) crt.Quit();'
						]);
					}

				/*** do the deploy ***/
					/*** delete old .zip archive ***/
						_fileSystem.deleteFile ({path:'uize-site-built.zip'});

					/*** create uize-site-built.zip, and create dated copy in archives ***/
						Uize.Wsh.execute (
							'"' + _deployConfig.appPaths ['7-Zip'] + '" a uize-site-built.zip site-built -r'
						);

					/*** FTP zip archive to Web site ***/
						_ftpActions (
							_uizeSite,
							[
								'binary',
								'put uize-site-built.zip'
							]
						);

					/*** using SSH, extract uize-site-built.zip archive and then remove it ***/
						_sshActions (
							_uizeSite,
							[
								'unzip --L uize-site-built.zip',
								'rm uize-site-built.zip',
								'rm *.* .htaccess',
								'rm -r appendixes css examples explainers images javascript-reference js news reference tests widgets widgetstogo',
								'mv site-built/* ~',
								'mv site-built/.htaccess ~/.htaccess',
								'rm -rf site-built'
							]
						);

				alert ('DEPLOY COMPLETE!!!');
			};

		return _package;
	}
});

