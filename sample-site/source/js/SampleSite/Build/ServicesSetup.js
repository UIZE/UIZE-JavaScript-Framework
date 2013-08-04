Uize.module ({
	name:'SampleSite.Build.ServicesSetup',
	required:[
		'Uize.Build.ServicesSetup',
		'Uize.Services.Setup'
	],
	builder:function () {
		'use strict';

		return {
			setup:function () {
				Uize.Build.ServicesSetup.setup (); // get base level of services setup
				Uize.Services.Setup.provideServiceSetup (
					'Uize.Services.FileBuilder',
					'Uize.Services.FileBuilderAdapter.Basic'
				);
			}
		};
	}
});

