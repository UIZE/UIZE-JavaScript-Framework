/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Cookie Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2013 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Package
	importance: 2
	codeCompleteness: 100
	docCompleteness: 20
*/

/*?
	Introduction
		The =Uize.Cookie= module is a package under the =Uize= namespace, and provides a couple of methods for managing browser cookies.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Cookie',
	builder:function () {
		'use strict';

		/*** Variables for Scruncher Optimization ***/
			var
				_undefined,
				_null = null,
				_package = function () {}
			;

		/*** Public Static Methods ***/
			_package.setCookie = function (_name,_value,_path,_expiration) {
				if (_value === _undefined || _value == _null) {
					_value = '';
					_expiration = 'Mon, 1 Jan 1990 12:00:00 UTC';
				} else {
					if (_expiration === _undefined) {
						var _expirationDate = new Date;
						_expirationDate.setFullYear (_expirationDate.getFullYear () + 1);
						_expiration = _expirationDate.toGMTString ();
					}
				}
				document.cookie = escape (_name) + '=' + escape (_value) + ';' + ((_path !== _undefined && _path != _null) ? ('path=' + _path + ';') : '') + ((_expiration !== _null) ? ('expires=' + _expiration + ';') : '');
				/*?
					Static Methods
						Uize.Cookie.setCookie
							SYNTAX
							...........................................................................
							Uize.Cookie.setCookie (cookieNameSTR,cookieValueSTR,pathSTR,expirationSTR);
							...........................................................................

							VARIATIONS

							.............................................................
							Uize.Cookie.setCookie (cookieNameSTR,cookieValueSTR,pathSTR);
							.............................................................

							When no =expirationSTR= parameter is specified, the expiration will be set to one year from the time that the cookie value is set.

							.....................................................
							Uize.Cookie.setCookie (cookieNameSTR,cookieValueSTR);
							.....................................................

							When no =pathSTR= parameter is specified, then the path of the current page being used.

							......................................
							Uize.Cookie.setCookie (cookieNameSTR);
							......................................

							When only a =cookieNameSTR= parameter is specified, the cookie specified by that parameter will be cleared.
				*/
			};

			_package.getCookie = function (_name) {
				var
					_value = '',
					_cookieStr = document.cookie
				;
				if (typeof _cookieStr == 'string') {
					_cookieStr = _cookieStr.replace (/ /g,'');
					for (
						var _cookieNo = -1, _cookies = _cookieStr.split (';'), _cookiesLength = _cookies.length;
						++_cookieNo < _cookiesLength;
					) {
						var _cookie = _cookies [_cookieNo].split ('=');
						if (unescape (_cookie [0]) == _name) {
							_value = (typeof _cookie [1] == 'string') ? unescape (_cookie [1]) : '';
							break;
						}
					}
				}
				return _value;
				/*?
					Static Methods
						Uize.Cookie.getCookie
							SYNTAX
							.......................................................
							cookieValueSTR = Uize.Cookie.getCookie (cookieNameSTR);
							.......................................................

							NOTES
							- if there is no cookie stored by the specified name, then an empty string will be returned
				*/
			};

		return _package;
	}
});

