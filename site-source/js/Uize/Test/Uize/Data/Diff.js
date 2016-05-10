/*______________
|       ______  |   U I Z E    J A V A S C R I P T    F R A M E W O R K
|     /      /  |   ---------------------------------------------------
|    /    O /   |    MODULE : Uize.Test.Uize.Data.Diff Class
|   /    / /    |
|  /    / /  /| |    ONLINE : http://www.uize.com
| /____/ /__/_| | COPYRIGHT : (c)2014-2016 UIZE
|          /___ |   LICENSE : Available under MIT License or GNU General Public License
|_______________|             http://www.uize.com/license.html
*/

/* Module Meta Data
	type: Test
	importance: 1
	codeCompleteness: 100
	docCompleteness: 100
*/

/*?
	Introduction
		The =Uize.Test.Uize.Data.Diff= module defines a suite of unit tests for the =Uize.Data.Diff= module.

		*DEVELOPERS:* `Chris van Rensburg`
*/

Uize.module ({
	name:'Uize.Test.Uize.Data.Diff',
	required:'Uize.Test',
	builder:function () {
		'use strict';

		function _addedOrModifiedValuesPropertyComparer (_object1Property,_object2Property) {
			return (
				_object2Property && (!_object1Property || _object2Property.value !== _object1Property.value)
					? _object2Property
					: undefined
			);
		}

		function _addedPropertyComparer (_object1Property,_object2Property) {
			return !_object1Property && _object2Property ? {value:'added'} : undefined;
		}

		function _modifiedPropertyComparer (_object1Property,_object2Property) {
			return (
				_object1Property && _object2Property && _object1Property.value !== _object2Property.value
					? {value:'modified'}
					: undefined
			);
		}

		function _removedPropertyComparer (_object1Property,_object2Property) {
			return _object1Property && !_object2Property ? {value:'removed'} : undefined;
		}

		function _unmodifiedPropertyComparer (_object1Property,_object2Property) {
			return (
				_object1Property && _object2Property && _object1Property.value === _object2Property.value
					? {value:'unchanged'}
					: undefined
			);
		}

		return Uize.Test.resolve ({
			title:'Test for Uize.Data.Diff Module',
			test:[
				Uize.Test.requiredModulesTest ('Uize.Data.Diff'),
				Uize.Test.staticMethodsTest ([
					['Uize.Data.Diff.diff',[
						/*** test the default property comparer ***/
							['With the default property comparer, modified properties are marked by the value "modified"',
								[
									{foo:'bar'},
									{foo:'BAR'}
								],
								{foo:'modified'}
							],
							['With the default property comparer, added properties are marked by the value "added"',
								[
									{},
									{foo:'bar'}
								],
								{foo:'added'}
							],
							['With the default property comparer, removed properties are marked by the value "removed"',
								[
									{foo:'bar'},
									{}
								],
								{foo:'removed'}
							],
							['With the default property comparer, unmodified properties are marked by the value "unchanged"',
								[
									{foo:'bar'},
									{foo:'bar'}
								],
								{foo:'unchanged'}
							],
							['An arbitrarily complex data structure can be diff\'ed',
								[
									{
										prop1:'foo',
										prop2:'bar',
										prop4:{
											prop1:'foo',
											prop2:'bar'
										},
										prop6:{
											prop1:'foo',
											prop2:'bar',
											prop3:'baz'
										}
									},
									{
										prop1:'FOO',
										prop3:'bar',
										prop5:{
											prop1:'foo',
											prop2:'bar'
										},
										prop6:{
											prop1:'foo',
											prop2:'BAR',
											prop4:'qux'
										}
									}
								],
								{
									prop1:'modified',
									prop2:'removed',
									prop3:'added',
									prop4:{
										prop1:'removed',
										prop2:'removed'
									},
									prop5:{
										prop1:'added',
										prop2:'added'
									},
									prop6:{
										prop1:'unchanged',
										prop2:'modified',
										prop3:'removed',
										prop4:'added'
									}
								}
							],

							/*** test array diffing ***/
								['When the value of a property in both objects being compared is an array, then all the elements of the two array values will be compared',
									[
										{array:['foo','bar']},
										{array:['foo','baz','qux']}
									],
									{array:['unchanged','modified','added']}
								],
								['When the value of a property is an array in the first object and missing in the second object, all the values from the array in the first object will appear to have been removed',
									[
										{array:['foo','bar','baz','qux']},
										{}
									],
									{array:['removed','removed','removed','removed']}
								],
								['When the value of a property is an array in the second object and missing in the first object, all the values from the array in the second object will appear to have been added',
									[
										{},
										{array:['foo','bar','baz','qux']}
									],
									{array:['added','added','added','added']}
								],

							/*** test the skeleton option ***/
								['When the value false is specified for the optional skeleton option, then the returned comparison result will not contain empty nodes in which there are no property comparison values',
									[
										{
											foo:{
												bar:{},
												baz:{
													qux:[]
												}
											}
										},
										{
											foo:{
												BAR:{
													BAZ:[]
												}
											},
											QUX:{}
										},
										{skeleton:false}
									],
									{}
								],
								['When the value true is specified for the optional skeleton option, then the returned comparison result will at a minimum be a skeleton object that is the union of the structures of the two objects being compared',
									[
										{
											foo:{
												bar:{},
												baz:{
													qux:[]
												}
											}
										},
										{
											foo:{
												BAR:{
													BAZ:[]
												}
											},
											QUX:{}
										},
										null,
										{skeleton:true}
									],
									{
										foo:{
											bar:{},
											baz:{
												qux:[]
											},
											BAR:{
												BAZ:[]
											}
										},
										QUX:{}
									}
								],
								['When no value is specified for the optional skeleton option, it is defaulted to false and the skeleton behavior is disabled',
									[
										{
											foo:{
												bar:{},
												baz:{
													qux:[]
												}
											}
										},
										{
											foo:{
												BAR:{
													BAZ:[]
												}
											},
											QUX:{}
										},
										null,
										{}
									],
									{}
								],

							/*** test the dual option ***/
								['When the value false is specified for the optional dual option, then the recursion is driven by the first object',
									[
										{
											foo:{
												bar:{0:'fee',2:'FO',3:'fum'},
												BAR:['fee','fi','fo'],
												baz:{
													qux:'nux',
													dux:['bux','pux']
												}
											},
											hello:5
										},
										{
											foo:{
												bar:['fee','fi','fo'],
												BAR:{0:'fee',2:'FO',3:'fum'},
												baz:'baz'
											},
											hello:{
												thebird:['is','the','word']
											}
										},
										null,
										{dual:false,skeleton:true}
									],
									{
										foo:{
											bar:{0:'removed',2:'removed',3:'removed'},
											BAR:['removed','removed','removed'],
											baz:{
												qux:'removed',
												dux:['removed','removed']
											}
										},
										hello:'modified'
									}
								],
								['When a non-dual diff is performed, properties in object B whose values are not arrays when the values of the corresponding properties in object A are arrays are treated as being empty arrays for the purpose of the diff recursion',
									[
										{
											prop1:['foo','bar'],
											prop2:['foo','bar'],
											prop3:['foo','bar'],
											prop4:['foo','bar'],
											prop5:['foo','bar'],
											prop6:['foo','bar'],
											prop7:['foo','bar']
										},
										{
											prop1:42,
											prop2:false,
											prop3:'foo',
											prop4:{foo:'bar'},
											prop5:null,
											prop6:/\d+/
										},
										null,
										{dual:false}
									],
									{
										prop1:['removed','removed'],
										prop2:['removed','removed'],
										prop3:['removed','removed'],
										prop4:['removed','removed'],
										prop5:['removed','removed'],
										prop6:['removed','removed'],
										prop7:['removed','removed']
									}
								],
								['When a non-dual diff is performed, properties in object B whose values are not plain objects when the values of the corresponding properties in object A are plain objects are treated as being empty objects for the purpose of the diff recursion',
									[
										{
											prop1:{foo:'FOO',bar:'BAR'},
											prop2:{foo:'FOO',bar:'BAR'},
											prop3:{foo:'FOO',bar:'BAR'},
											prop4:{foo:'FOO',bar:'BAR'},
											prop5:{foo:'FOO',bar:'BAR'},
											prop6:{foo:'FOO',bar:'BAR'},
											prop7:{foo:'FOO',bar:'BAR'}
										},
										{
											prop1:42,
											prop2:false,
											prop3:'foo',
											prop4:['foo','bar'],
											prop5:null,
											prop6:/\d+/
										},
										null,
										{dual:false}
									],
									{
										prop1:{foo:'removed',bar:'removed'},
										prop2:{foo:'removed',bar:'removed'},
										prop3:{foo:'removed',bar:'removed'},
										prop4:{foo:'removed',bar:'removed'},
										prop5:{foo:'removed',bar:'removed'},
										prop6:{foo:'removed',bar:'removed'},
										prop7:{foo:'removed',bar:'removed'}
									}
								],
								['When performing a non-dual diff, properties in object B whose values are arrays or objects, when the values of the corresponding properties in object A are non-object types, are not recursed and are compared directly against the values in object A',
									[
										{
											prop1:42,
											prop2:false,
											prop3:'foo',
											prop4:undefined,
											prop5:null,
											prop6:/\d+/
										},
										{
											prop1:{foo:'FOO',bar:'BAR'},
											prop2:{foo:'FOO',bar:'BAR'},
											prop3:{foo:'FOO',bar:'BAR'},
											prop4:{foo:'FOO',bar:'BAR'},
											prop5:{foo:'FOO',bar:'BAR'},
											prop6:{foo:'FOO',bar:'BAR'}
										},
										null,
										{dual:false}
									],
									{
										prop1:'modified',
										prop2:'modified',
										prop3:'modified',
										prop4:'modified',
										prop5:'modified',
										prop6:'modified'
									}
								],
								['When performing a non-dual diff, properties that are present in objects in object B that are not present in the corresponding objects in object A are not iterated over',
									[
										{
											foo:{foo:'FOO',bar:'BAR'}
										},
										{
											foo:{foo:'FOO!',bar:'BAR',baz:'BAZ',qux:'QUX'}
										},
										null,
										{dual:false}
									],
									{
										foo:{foo:'modified',bar:'unchanged'}
									}
								],
								['When performing a non-dual diff, elements that are present in arrays in object B that are not present in the corresponding arrays in object A are not iterated over',
									[
										{
											foo:['FOO','BAR']
										},
										{
											foo:['FOO!','BAR','BAZ','QUX']
										},
										null,
										{dual:false}
									],
									{
										foo:['modified','unchanged']
									}
								],
								['When the value true is specified explicitly for the optional dual option, then the standard dual diff is performed',
									[
										{
											prop1:{foo:'FOO',bar:'BAR'},
											prop2:['FOO','BAR']
										},
										{
											prop1:{foo:'FOO!',bar:'BAR',baz:'BAZ',qux:'QUX'},
											prop2:['FOO!','BAR','BAZ','QUX']
										},
										null,
										{dual:true}
									],
									{
										prop1:{foo:'modified',bar:'unchanged',baz:'added',qux:'added'},
										prop2:['modified','unchanged','added','added']
									}
								],

						/*** test a custom added-or-modified property comparer ***/
							['With a custom added-or-modified property comparer, modified properties are marked by their new value',
								[
									{foo:'bar'},
									{foo:'BAR'},
									_addedOrModifiedValuesPropertyComparer
								],
								{foo:'BAR'}
							],
							['With a custom added-or-modified property comparer, added properties are marked by their new value',
								[
									{},
									{foo:'bar'},
									_addedOrModifiedValuesPropertyComparer
								],
								{foo:'bar'}
							],
							['With a custom added-or-modified property comparer, removed properties are omitted from the result',
								[
									{foo:'bar'},
									{},
									_addedOrModifiedValuesPropertyComparer
								],
								{}
							],
							['With a custom added-or-modified property comparer, unmodified properties are omitted from the result',
								[
									{foo:'bar'},
									{foo:'bar'},
									_addedOrModifiedValuesPropertyComparer
								],
								{}
							],

						/*** test a custom added property comparer ***/
							['With a custom added property comparer, modified properties are omitted from the result',
								[
									{foo:'bar'},
									{foo:'BAR'},
									_addedPropertyComparer
								],
								{}
							],
							['With a custom added property comparer, added properties are marked by the value "added"',
								[
									{},
									{foo:'bar'},
									_addedPropertyComparer
								],
								{foo:'added'}
							],
							['With a custom added property comparer, removed properties are omitted from the result',
								[
									{foo:'bar'},
									{},
									_addedPropertyComparer
								],
								{}
							],
							['With a custom added property comparer, unmodified properties are omitted from the result',
								[
									{foo:'bar'},
									{foo:'bar'},
									_addedPropertyComparer
								],
								{}
							],

						/*** test a custom modified property comparer ***/
							['With a custom modified property comparer, modified properties are marked by the value "modified"',
								[
									{foo:'bar'},
									{foo:'BAR'},
									_modifiedPropertyComparer
								],
								{foo:'modified'}
							],
							['With a custom modified property comparer, added properties are omitted from the result',
								[
									{},
									{foo:'bar'},
									_modifiedPropertyComparer
								],
								{}
							],
							['With a custom modified property comparer, removed properties are omitted from the result',
								[
									{foo:'bar'},
									{},
									_modifiedPropertyComparer
								],
								{}
							],
							['With a custom modified property comparer, unmodified properties are omitted from the result',
								[
									{foo:'bar'},
									{foo:'bar'},
									_modifiedPropertyComparer
								],
								{}
							],

						/*** test a custom removed property comparer ***/
							['With a custom removed property comparer, modified properties are omitted from the result',
								[
									{foo:'bar'},
									{foo:'BAR'},
									_removedPropertyComparer
								],
								{}
							],
							['With a custom removed property comparer, added properties are omitted from the result',
								[
									{},
									{foo:'bar'},
									_removedPropertyComparer
								],
								{}
							],
							['With a custom removed property comparer, removed properties are marked by the value "removed"',
								[
									{foo:'bar'},
									{},
									_removedPropertyComparer
								],
								{foo:'removed'}
							],
							['With a custom removed property comparer, unmodified properties are omitted from the result',
								[
									{foo:'bar'},
									{foo:'bar'},
									_removedPropertyComparer
								],
								{}
							],

						/*** test a custom unmodified property comparer ***/
							['With a custom unmodified property comparer, modified properties are omitted from the result',
								[
									{foo:'bar'},
									{foo:'BAR'},
									_unmodifiedPropertyComparer
								],
								{}
							],
							['With a custom unmodified property comparer, added properties are omitted from the result',
								[
									{},
									{foo:'bar'},
									_unmodifiedPropertyComparer
								],
								{}
							],
							['With a custom unmodified property comparer, removed properties are omitted from the result',
								[
									{foo:'bar'},
									{},
									_unmodifiedPropertyComparer
								],
								{}
							],
							['With a custom unmodified property comparer, unmodified properties are marked by the value "unchanged"',
								[
									{foo:'bar'},
									{foo:'bar'},
									_unmodifiedPropertyComparer
								],
								{foo:'unchanged'}
							],

						/*** miscellaneous tests ***/
							['The property info arguments that are provided to the property comparer function each contain a key property which indicates the name of the current property being compared',
								[
									{
										foo:'FOO',
										bar:{baz:'BAZ'}
									},
									{
										qux:'QUX',
										hello:{world:'WORLD'}
									},
									function (_object1PropertyInfo,_object2PropertyInfo) {
										return {
											value:[
												_object1PropertyInfo && _object1PropertyInfo.key,
												_object2PropertyInfo && _object2PropertyInfo.key
											]
										};
									}
								],
								{
									foo:['foo',undefined],
									bar:{
										baz:['baz',undefined]
									},
									qux:[undefined,'qux'],
									hello:{
										world:[undefined,'world']
									}
								}
							],
							{
								title:'The property comparer function is passed a third argument, whose value is an array representing the path to the current property being compared',
								test:function () {
									var _comparedPropertiesPaths = [];
									Uize.Data.Diff.diff (
										{
											prop1:'foo',
											prop2:'bar',
											prop4:{
												prop1:'foo',
												prop2:'bar'
											},
											prop6:{
												prop1:'foo',
												prop2:'bar',
												prop3:'baz',
												prop5:['foo','bar','baz']
											}
										},
										{
											prop1:'FOO',
											prop3:'bar',
											prop5:{
												prop1:'foo',
												prop2:'bar'
											},
											prop6:{
												prop1:'foo',
												prop2:'BAR',
												prop4:'qux',
												prop5:['foo']
											},
											prop7:['foo','bar']
										},
										function (_object1PropertyInfo,_object2PropertyInfo,_path) {
											_comparedPropertiesPaths.push (_path.concat ());
										}
									);
									return this.expect (
										[
											['prop1'],
											['prop2'],
											['prop4','prop1'],
											['prop4','prop2'],
											['prop6','prop1'],
											['prop6','prop2'],
											['prop6','prop3'],
											['prop6','prop5',0],
											['prop6','prop5',1],
											['prop6','prop5',2],
											['prop6','prop4'],
											['prop3'],
											['prop5','prop1'],
											['prop5','prop2'],
											['prop7',0],
											['prop7',1]
										],
										_comparedPropertiesPaths
									);
								}
							},
							['The key property in the property profile object returned by a property comparer function is used to determine the name of the property added to the diff result',
								[
									{
										leafNode1:'foo',
										leafNode2:'bar',
										nonLeadNode1:{
											leafNode1:'foo',
											leadNode2:'bar'
										},
										nonLeafNode2:{
											leafNode1:'foo',
											leafNode2:'bar',
											nonLeafNode1:{
												leafNode1:'foo',
												leadNode2:'bar'
											}
										}
									},
									{},
									function (_propertyProfile) {
										_propertyProfile.key = _propertyProfile.key.toUpperCase ();
										return _propertyProfile;
									}
								],
								{
									LEAFNODE1:'foo',
									LEAFNODE2:'bar',
									nonLeadNode1:{
										LEAFNODE1:'foo',
										LEADNODE2:'bar'
									},
									nonLeafNode2:{
										LEAFNODE1:'foo',
										LEAFNODE2:'bar',
										nonLeafNode1:{
											LEAFNODE1:'foo',
											LEADNODE2:'bar'
										}
									}
								}
							],
							['When a property in one object is a leaf node and the corresponding property in the other object is a non-leaf node, then the non-leaf node is recursed as if the leaf node was a non-leaf node',
								[
									{
										foo:{hello:1,world:2},
										bar:{hello:1,world:2},
										baz:{hello:1,world:2},
										FOO:'foo',
										BAR:2,
										BAZ:false
									},
									{
										foo:'foo',
										bar:2,
										baz:false,
										FOO:{hello:1,world:2},
										BAR:{hello:1,world:2},
										BAZ:{hello:1,world:2}
									},
									function (_object1PropertyInfo,_object2PropertyInfo) {
										return _object1PropertyInfo || _object2PropertyInfo;
									}
								],
								{
									foo:{hello:1,world:2},
									bar:{hello:1,world:2},
									baz:{hello:1,world:2},
									FOO:{hello:1,world:2},
									BAR:{hello:1,world:2},
									BAZ:{hello:1,world:2}
								}
							]
					]]
				])
			]
		});
	}
});

