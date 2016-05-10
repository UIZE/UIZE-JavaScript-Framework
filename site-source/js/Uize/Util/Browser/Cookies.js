/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Util.Browser.Cookies Package
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2016 UIZE
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
		The =Uize.Util.Browser.Cookies= module is a package under the =Uize= namespace, and provides a couple of methods for managing browser cookies.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Util.Browser.Cookies',
	builder:function () {
		'use strict';

		var
			/*** Variables for Scruncher Optimization ***/
				_undefined,
				_null = null
		;

		return Uize.package ({
			setCookie:function (_name,_value,_path,_expiration) {
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
						Uize.Util.Browser.Cookies.setCookie
							SYNTAX
							.........................................................................................
							Uize.Util.Browser.Cookies.setCookie (cookieNameSTR,cookieValueSTR,pathSTR,expirationSTR);
							.........................................................................................

							VARIATIONS

							...........................................................................
							Uize.Util.Browser.Cookies.setCookie (cookieNameSTR,cookieValueSTR,pathSTR);
							...........................................................................

							When no =expirationSTR= parameter is specified, the expiration will be set to one year from the time that the cookie value is set.

							...................................................................
							Uize.Util.Browser.Cookies.setCookie (cookieNameSTR,cookieValueSTR);
							...................................................................

							When no =pathSTR= parameter is specified, then the path of the current page being used.

							....................................................
							Uize.Util.Browser.Cookies.setCookie (cookieNameSTR);
							....................................................

							When only a =cookieNameSTR= parameter is specified, the cookie specified by that parameter will be cleared.
				*/
			},

			getCookie:function (_name) {
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
						Uize.Util.Browser.Cookies.getCookie
							SYNTAX
							.....................................................................
							cookieValueSTR = Uize.Util.Browser.Cookies.getCookie (cookieNameSTR);
							.....................................................................

							NOTES
							- if there is no cookie stored by the specified name, then an empty string will be returned
				*/
			}
		});
	}
});

