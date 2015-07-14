/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Build.Deploy Namespace
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2008-2015 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 5
	codeCompleteness: 100
	docCompleteness: 30
*/

/*?
	Introduction
		The =Uize.Build.Deploy= package provides a method for deploying the built UIZE Web site to the s production environment.

		*DEVELOPERS:* `Chris van Rensburg`

		EXAMPLE
		...............................
		node build.js Uize.Build.Deploy
		...............................
*/

Uize.module ({
	name:'Uize.Build.Deploy',
	required:[
		'Uize.Build.Wsh',
		'Uize.Array.Join',
		'Uize.Services.FileSystem',
		'Uize.Json'
	],
	builder:function () {
		'use strict';

		return Uize.package ({
			perform:function (_params) {
				var
					_fileSystem = Uize.Services.FileSystem.singleton (),
					_deployConfig = Uize.Json.from (_fileSystem.readFile ({path:_params.deployConfigPath})),
					_site = _deployConfig.site,
					_siteRootFolder = _site.rootFolder || '',
					_builtPath = _params.builtPath,
					_tempPath = _params.tempPath,
					_builtZipFilename = 'built.zip',
					_sshCommandsFilename = 'ssh-commands.js'
				;

				/*** Utility Functions ***/
					var _ftpCommandsFilename = 'ftp-commands.txt';
					function _ftp (_ftpCommands) {
						_fileSystem.writeFile ({
							path:_ftpCommandsFilename,
							contents:Uize.isArray (_ftpCommands) ? _ftpCommands.join ('\r\n') : _ftpCommands
						});
						Uize.Build.Wsh.exec ('ftp -s:' + _ftpCommandsFilename);
						_fileSystem.deleteFile ({path:_ftpCommandsFilename});
					}

					function _ftpActions (_site,_actions) {
						_ftp ([
							'open ' + _site.domain,
							_site.user,
							_site.password,
							_actions.join ('\r\n'),
							'quit'
						]);
					}

					var _sshCommandsPath = _tempPath + '/' + _sshCommandsFilename;
					function _ssh (_sshCommands) {
						_fileSystem.writeFile ({
							path:_sshCommandsPath,
							contents:Uize.isArray (_sshCommands) ? _sshCommands.join ('\r\n') : _sshCommands
						});
						Uize.Build.Wsh.exec ('"' + _deployConfig.appPaths.SecureCRT + '" /SCRIPT "' + _sshCommandsPath + '"');
						_fileSystem.deleteFile ({path:_sshCommandsPath});
					}

					function _sshActions (_site,_actions) {
						_ssh ([
							'# $language = "JScript"',
							'# $interface = "1.0"',
							'',
							'crt.Session.Connect(\'/SSH2 ' +
								'/L ' + _site.user + ' ' +
								'/PASSWORD ' + _site.password + ' ' +
								'/C 3DES ' +
								'/M MD5 ' +
								_site.domain +
							'\');',
							Uize.Array.Join.hugJoin (_actions,'crt.Screen.Send(\'','\\n\');'),
							'crt.Screen.Send(\'exit\\n\');',
							'if (crt.Screen.WaitForString(\'logout\',60)) crt.Quit();'
						]);
					}

				/*** do the deploy ***/
					/*** delete old .zip archive ***/
						_fileSystem.deleteFile ({path:_tempPath + '/' + _builtZipFilename});

					/*** create built zip archive ***/
						Uize.Build.Wsh.exec (
							'"' + _deployConfig.appPaths ['7-Zip'] + '" a ' + _tempPath + '/' + _builtZipFilename + ' ' + _builtPath + ' -r'
						);

					/*** FTP zip archive to Web site ***/
						_ftpActions (
							_site,
							[
								_siteRootFolder ? 'mkdir ' + _siteRootFolder : '',
								'binary',
								'put ' + _tempPath + '/' + _builtZipFilename + ' ' + _siteRootFolder + (_siteRootFolder && '/') + _builtZipFilename
							]
						);

					/*** using SSH, extract built zip archive and then remove it ***/
						_sshActions (
							_site,
							[
								'cd ' + (_siteRootFolder || '.'),
								'unzip --L ' + _builtZipFilename,
								'rm ' + _builtZipFilename,
								'rm *.* .htaccess',
								'rm -r ' + _fileSystem.getFolders ({path:_builtPath}).join (' '),
								'mv ' + _builtPath + '/* ~' + (_siteRootFolder && '/') + _siteRootFolder,
								'mv ' + _builtPath + '/.htaccess ~' + (_siteRootFolder && '/') + _siteRootFolder + '/.htaccess',
								'rm -rf ' + _builtPath
							]
						);

				alert ('DEPLOY COMPLETE!!!');
			}
		});
	}
});

