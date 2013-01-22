/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.FunctionalTest Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2005-2011 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/*?
	Introduction
		The =Uize.FunctionalTest= class serves as the base class for automated functional tests using Internet Explorer and Windows Scripting Host

		*DEVELOPERS:* `Ben Ilegbodu`

		The =Uize.FunctionalTest= module defines the =Uize.FunctionalTest= class, a subclass of the =Uize= class.

		An Abstract Class
			The =Uize.Test= class is primarily an abstract class, intended for the creation of test subclasses.
*/

Uize.module ({
	name:'Uize.FunctionalTest',
	superclass:'Uize.Class',
	required:[
		'Uize.Url',
		'Uize.Date'
	],
	builder:function (_superclass) {
		/*** Variables for Scruncher Optimization ***/
			var
				_null = null,
				_true = true,
				_false = false,
				_globalScope = (function() { return this })(),
				_navComplete = _null,
				_undefined,
				_document,
				_window
			;

		/*** Utility Functions ***/
			function _browser() {
				return (
					_browser._result ||
					(_browser._result = WScript.CreateObject('InternetExplorer.Application.1', 'UizeFunctionalTest'))
				)
			}

		/*** Class Constructor ***/
			var
				_class = _superclass.subclass (
					_null,
					function () {
						var _this = this;

						_this.tests = _this._tests = {};

						_browser().visible = _this._browserVisible;

						if (_this._initialUrl != _undefined)
							_this.navigate(_this._initialUrl)
						;
					}
				),
				_classPrototype = _class.prototype
			;

			function _getNodeBlobId(_nodeBlob) { return typeof _nodeBlob == 'string' ? _nodeBlob : _nodeBlob.id }

			// HACK! HACK! HACK! Since the browser object only fires events in the global scope
			// we have to get a reference to it and assign our handler so that we can still
			// reference things in our scope

				_globalScope.UizeFunctionalTestBeforeNavigate = function(_browserRef, _url) {
					//_navComplete = _false;

					//while (!_navComplete) WScript.Sleep(200);
					_class._log('heya');
				};

				_globalScope.UizeFunctionalTestDocumentComplete = function() {
					// Set up helper properties
					_document = _browser().document;
					_window = _document.parentWindow;

					_class._log('Finished loading document of: ' + _document.location.href, _class.LogLevels.DEBUG);

					_navComplete = _true;
				};

				_globalScope.UizeFunctionalTestDownloadBegin = function() {
					//_navComplete = _false;

					//while (!_navComplete) WScript.Sleep(200);
					_class._log('Navigating...', _class.LogLevels.DEBUG);
				};

				_globalScope.UizeFunctionalTestNavigateComplete2 = function() {
					_class._log('Finished navigating to: ' + _browser().document.location.href, _class.LogLevels.DEBUG)
				};

				_globalScope.UizeFunctionalTestOnQuit = function() {
					_class._log('quitting', _class.LogLevels.INFO);

					_navComplete = _true;
				};

		/*** Private Instance Methods ***/
			_classPrototype._fireEvent = function(_nodeBlob, _type, _documentContext) {
				var
					_this = this,
					_event = _document.createEventObject(),
					_nodeToFireEventOn = _this._getNode(_nodeBlob, _documentContext)
				;

				if (!_nodeToFireEventOn)
					_this.logError('Unable to fire ' + _type + ' event on "' + _nodeBlob + '" because it does not exist');
				else
					_this.logDebug('Firing ' + _type + ' event on ' + _nodeToFireEventOn.id);

				_nodeToFireEventOn.fireEvent('on' + _type, _event);
			};

			_classPrototype._getNode = function(_nodeBlob, _documentContext) {
				this.logDebug('Getting node: ' + _getNodeBlobId(_nodeBlob));
				return typeof _nodeBlob == 'string' ? (_documentContext || _document).getElementById(_nodeBlob) : _nodeBlob;
			};

			_classPrototype._log = function (_message, _type) {
				if (_type >= this._logLevel)
					_class._log(_message, _type)
				;
			};

			_classPrototype._waitUntilNavComplete = function() {
				var _startTime = new Date;
				_navComplete = _false;

				this.logDebug('Waiting for navigation to complete...');

				while (_navComplete === _false) {
					_class.wait(_class.PollingTime);

					if ((new Date - _startTime) > _class.Timeout) {
						this.logWarning('Navigation has not completed after 25 seconds! Proceeding...');
						break;
					}
				}

				_navComplete = _null;
				_class.wait(1000);
			};

		/*** Public Instance Methods ***/
			_classPrototype.addTest = function (_testName, _testClass, _testProperties) {
				return this._tests[_testName] = new (_testClass || _class)(
					Uize.copyInto(
						{logLevel:this._logLevel},	// use curent logLevel by default (need public name)
						_testProperties
					)
				)
			};

			_classPrototype.assert = function(_expression, _errorMessage) {
				if (!_expression) {
					this.logFatal(_errorMessage || 'Assertion Failed!');
					//this.quit();
					WScript.Quit();
				}
			};

			_classPrototype.clickNode = function(_nodeBlob, _documentContext) {
				var
					_this = this,
					_nodeToClick = _this._getNode(_nodeBlob, _documentContext)
				;

				_this._fireEvent(_nodeToClick, 'mouseover', _documentContext);	// Note: Uize buttons don't wire mouse events until mouseover

				if (!_nodeToClick)
					_this.logError('Unable to click "' + _nodeBlob + '" because it does not exist');
				else
					_this.logDebug('Clicking ' + _nodeToClick.id);

				_nodeToClick.click();
				_class.wait(100);	// just wait a lil' bit after clicking so we don't move too fast
			};

			_classPrototype.clickToNavigate = function(_nodeBlob, _documentContext) {
				this.logDebug('Clicking ' + _nodeBlob + ' to navigate');
				this.clickNode(_nodeBlob, _documentContext);
				this._waitUntilNavComplete();
			};

			_classPrototype.getBrowser = function() {
				this.logDebug('Getting browser object');
				return _browser();
			};

			_classPrototype.getDocument = function() {
				this.logDebug('Getting document object');
				return _document;
			};

			_classPrototype.getLocation = function() { return _document.location.href };

			_classPrototype.getNode = _classPrototype._getNode;

			_classPrototype.getNodeValue = function(_nodeBlob, _documentContext) {
				var
					_this = this,
					_node = _this._getNode(_nodeBlob, _documentContext),
					_value
				;

				if (!_node)
					_this.logError('Unable to get value for "' + _nodeBlob + '" because it does not exist');
				else
					_this.logDebug('Getting value for "' + _node.id + '"');

				/*** NOTE: Temporarily copied from Uize.Node.getValue until we can use it directly ***/
					var _nodeTagName = _node.tagName;
					if (_nodeTagName == 'TEXTAREA') {
						_value = _node.value;
					} else if (_nodeTagName == 'INPUT') {
						_value = _node.type == 'checkbox' ? _node.checked : _node.value;
					} else if (_nodeTagName == 'SELECT') {
						if (_node.multiple) {
							_value = [];
							for (
								var _optionNo = -1, _options = _node.options, _optionsLength = _options.length, _option;
								++_optionNo < _optionsLength;
							)
								if ((_option = _options [_optionNo]).selected) _value.push (_option.value)
							;
						} else {
							_value = _node.value;
						}
					} else if (_nodeTagName == 'IMG') {
						_value = _node.src;
					} else {
						_value = _node.innerHTML.replace (/<br\/?>/gi,'\n').replace (/&nbsp;/g,' ');
					}

				return _value;
			};

			_classPrototype.getWindow = function() {
				this.logDebug('Getting window object');
				return _window;
			};

			_classPrototype.logDebug = function(_message) { this._log(_message, _class.LogLevels.DEBUG) };
			_classPrototype.logError = function(_message) { this._log(_message, _class.LogLevels.ERROR) };
			_classPrototype.logFatal = function(_message) { this._log(_message, _class.LogLevels.FATAL) };
			_classPrototype.logInfo = function(_message) { this._log(_message, _class.LogLevels.INFO) };
			_classPrototype.logWarning = function(_message) { this._log(_message, _class.LogLevels.WARN) };

			_classPrototype.navigate = function (_path, _urlParams, _isSecure) {
				var
					_this = this,
					_http = 'http://',
					_https = 'https://'
				;

				if (!_path.indexOf(_http) || !_path.indexOf(_https))
					_path = _path.substr(_path.indexOf('://') + '://'.length)
				;

				var _url = Uize.Url.resolve((_isSecure ? _https : _http) + _path, _urlParams);

				_this.logDebug('Navigate to: ' + _url);

				_browser().navigate2(_url);

				_this._waitUntilNavComplete();
			};

			_classPrototype.quit = function () { _browser().Quit() };

			_classPrototype.setNodeValue = function(_nodeBlob, _nodeValue, _documentContext) {
				var
					_this = this,
					_node = _this._getNode(_nodeBlob, _documentContext),
					_nodeTagName = _node.tagName,
					_addEachLetter = _false
				;

				_nodeValue = _nodeValue + '';

				if (!_node)
					_this.logError('Unable to set value for "' + _nodeBlob + '" because it does not exist');
				else
					_this.logDebug('Setting value for "' + _node.id + '" to: ' + _nodeValue);

				//_this.clickNode(_node, _documentContext);

				// simulate entering field
				_this._fireEvent(_node, 'focus', _documentContext);
				_class.wait(50);

				if (_nodeTagName == 'TEXTAREA')
					_addEachLetter = _true;
				else if (_nodeTagName == 'INPUT') {
					var _nodeType = _node.type;

					if (_nodeType == 'text' || _nodeType == 'hidden' || _nodeType == 'password')
						_addEachLetter = _true;
				}

				/*** NOTE: Temporarily copied from Uize.Node.setValue until we can use it directly ***/
					function _setValue(_value) {
						var
							_oldReadOnly = _node.readOnly
						;
						if (_oldReadOnly) _node.readOnly = _false;
						if (_nodeTagName == 'TEXTAREA') {
							_node.value = _value;
						} else if (_nodeTagName == 'INPUT') {
							var _nodeType = _node.type;
							if (_nodeType == 'text' || _nodeType == 'hidden' || _nodeType == 'password') {
								_node.value = _value;
							} else if (_nodeType == 'checkbox') {
								_node.checked = _value == 'true';
							} else if (_nodeType == 'radio') {
								_node.checked = _node.value == _value;
							}
						} else if (_nodeTagName == 'SELECT') {
							if (!_value) {
								_node.selectedIndex = -1;
							} else {
								var _options = _node.options;
								if (_node.multiple && (_value == '*' || _value.indexOf (',') > -1)) {
									var _valuesMap;
									if (_value != '*') {
										/* NOTE:
											Code for creating a lookup object from an array exists in Uize.Data, but for page load reasons, I don't want Uize.Node to have a dependency on Uize.Data.
										*/
										_valuesMap = {};
										var _values = _value.split (',');
										for (var _valueNo = _values.length; --_valueNo >= 0;)
											_valuesMap [_values [_valueNo]] = 1
										;
									}
									for (var _optionNo = _options.length, _option; --_optionNo >= 0;)
										(_option = _options [_optionNo]).selected = !_valuesMap || _valuesMap [_option.value]
									;
								} else {
									_node.selectedIndex = Uize.findRecordNo (_options,{value:_value},_node.selectedIndex);
								}
							}
						} else if (_nodeTagName == 'IMG') {
							if (_value) _node.src = _value;
						} else {
							_nodeTagName == 'PRE' && _isIe
								? (_node.innerText = _value)
								: (_node.innerHTML = _value.replace (/</g,'&lt;').replace (/\n/g,'<br/>'))
							;
						}
						if (_oldReadOnly) _node.readOnly = _oldReadOnly;

						// Fire onchange after setting value
						_this._fireEvent(_node, 'change', _documentContext);
					}

				// Add the node value one letter at a time
				if (_addEachLetter && _nodeValue.length > 1) {
					for (var _length = 0; ++_length <= _nodeValue.length;) {
						_setValue(_nodeValue.substr(0, _length));
						_class.wait(50);
					}
				}
				else
					_setValue(_nodeValue);

				_class.wait(50);

				// simulate leaving field
				_this._fireEvent(_node, 'blur', _documentContext);

				_class.wait(100);	// just wait a lil' bit after setting so we don't move too fast
			};

			_classPrototype.waitUntilNodeVisible = function(_nodeBlob) {
				var
					_this = this,
					_startTime = new Date,
					_node
				;

				_this.logDebug('Waiting until ' + _getNodeBlobId(_nodeBlob) + ' is visible');

				while (!((_node = _this.getNode(_nodeBlob)) && _node.style.display != 'none' && _node.style.visibility != 'hidden')) {
					_class.wait(_class.PollingTime);

					if ((new Date - _startTime) > _class.Timeout) {
						_this.logWarning('Node was not visible after 25 seconds! Proceeding...');
						break;
					}
				}

				//_this.logDebug(_node);
				//_this.logDebug(_node.style.display);
				//_this.logDebug(_node.style.visibility);

				_class.wait(500);	// just wait a lil' bit extra to be sure
			};

			_classPrototype.waitUntilNodeChange = function(_nodeBlob) {
				var
					_this = this,
					_initialValue = _this.getNodeValue(_nodeBlob),
					_startTime = new Date
				;

				_this.logDebug('Waiting until ' + _getNodeBlobId(_nodeBlob) + ' changes. Initial value: ' + _initialValue);

				while (_initialValue == _this.getNodeValue(_nodeBlob)) {
					_class.wait(_class.PollingTime);

					if ((new Date - _startTime) > _class.Timeout) {
						_this.logWarning('Node still has not changed after 25 seconds! Proceeding...');
						break;
					}
				}

				_this.logDebug('New value: ' + _this.getNodeValue(_nodeBlob));
			};

		/*** Private Static Methods ***/
			_class._LogLevelsReverseLookup = [
				'DEBUG',
				'INFO',
				'WARN',
				'ERROR',
				'FATAL',
			];

		/*** Private Static Methods ***/
			_class._log = function(_message, _type) {
				var _logType = _class._LogLevelsReverseLookup[_type];

				WScript.StdOut.WriteLine(
					Uize.Date.format(
						new Date,
						'{YYYY}-{MM}-{DD} {hh}:{mm}:{ss}\t'
					) +
					(_logType !== _undefined ? _logType : 'MISC') + '\t' +
					_message
				)
			};

		/*** Public Static Properties ***/
			_class.LogLevels = {
				DEBUG:0,
				INFO:1,
				WARN:2,
				ERROR:3,
				FATAL:4
			};

			_class.PollingTime = 200;	// 200 milliseconds

			_class.Timeout = 25000;		// 25 seconds

		/*** Public Static Methods ***/
			_class.log = _class._log;

			_class.wait = function(_waitTime) {
				//_class._log('Waiting ' + _waitTime + ' milliseconds', _class.LogLevels.DEBUG);
				WScript.Sleep(_waitTime);
			};

			_class.waitUntilReady = function() {
				var _startTime = new Date;
				_class._log('waitUntilReady', _class.LogLevels.DEBUG);
				while (_browser().readyState < 4) {
					_class.wait(_class.PollingTime);

					if ((new Date - _startTime) > _class.Timeout) {
						_class._log('Not ready after 25 seconds! Proceeding...', _class.LogLevels.WARN);
					}
				}
			};

		/*** Register Properties ***/
			_class.registerProperties ({
				_browserVisible:{
					name:'browserVisible',
					onChange:function() { _browser().visible = this._browserVisible },
					value:_true
				},
				_initialUrl:{
					name:'initialUrl',
					value:'http://www.uize.com'
				},
				_logLevel:{
					name:'logLevel',
					conformer:function(_value) {
						var _logLevels = _class.LogLevels;
						return Uize.constrain(_value, _logLevels.DEBUG, _logLevels.FATAL);
					},
					value:_class.LogLevels.WARN
				}
			});

		return _class;
	}
});

