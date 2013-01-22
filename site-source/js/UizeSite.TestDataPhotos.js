Uize.module ({
	name:'UizeSite.TestDataPhotos',
	builder:function () {
		'use strict';

		var _cachedData;

		return function (_getCopy) {
			if (_cachedData && !_getCopy) return _cachedData;

			var _data = [
				{
					title:'A Lighted Spot',
					category:'Trees Among Us',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228277244419896914&max_dim=500',
					description:'An intimate patch of wet pebbled ground is lighted by the dull winter sun in Metuchen, New Jersey. Fallen autumn leaves are scattered sparsely about in this scene dominated by various shades of brown.',
					rating:3
				},
				{
					title:'Braving the Onslaught',
					category:'The Winter Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228109666540948246&max_dim=500',
					description:'One lonely tree on a hillside faces the onslaught of monstrous looming clouds that threaten rain. It leans back, as if in fear. Captured while hiking in the late afternoon at Milagra Ridge, Pacifica.',
					rating:7
				},
				{
					title:'Companion to a Sunset',
					category:'The Sunset Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228745103279879745&max_dim=500',
					description:'A solitary plant is the only companion to this sunset seen from a Milagra Ridge hillside in Pacifica, California. The sunset seems to mirror the plant\'s form, with the path of lit ocean like its stem. Milagra Ridge is part of the Golden Gate National Recreational Area, and is a favorite hiking spot.',
					rating:5
				},
				{
					title:'Concrete Eternity',
					category:'The Somber Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228866001826566384&max_dim=500',
					description:'A heavy concrete grave slab accompanied by an empty concrete vase hints at a rather bleak, cold and lonely way to spend all of eternity. The scene is dominated by gray and devoid of any bright colors.',
					rating:3
				},
				{
					title:'Corrugate It',
					category:'Context Lost',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228321774790917687&max_dim=500',
					description:'A rusty old corrugated iron wall is taken out of context to create a perspective abstract. The perspective lines of one corrugated panel\'s ridges draw your eye to where that panel meets another panel.',
					rating:2
				},
				{
					title:'Crank it Up',
					category:'Context Lost',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228463251413365530&max_dim=500',
					description:'A rusty old crank taken out of context makes you wonder what would be moved by turning it and makes its appearance ever the more mysterious.',
					rating:1
				},
				{
					title:'Driving Through the Rain',
					category:'The Winter Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228507796122097730&max_dim=500',
					description:'[ NO DESCRIPTION ]',
					rating:6
				},
				{
					title:'Flock of Clouds',
					category:'The Photographic Orphanage',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228267745724726415&max_dim=500',
					description:'An aerial view of a flock of fluffy white clouds travelling across the oceans of the Caribbean. The beautiful turquoise water is so clear and the landmass so shallow that you can see the sand banks.',
					rating:5
				},
				{
					title:'Hail to the Opening',
					category:'Trees Among Us',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228937676589416694&max_dim=500',
					description:'A gathering of tall leafless trees encircle a small blue opening of a cloudy winter sky in Metuchen, New Jersey. They seem to raise their bare branches in solemn reverence to the vast majestic sky.',
					rating:4
				},
				{
					title:'Heavens Open Over Pedro',
					category:'The Winter Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228483162492178759&max_dim=500',
					description:'A black, stormy sky is breached for a moment by a shaft of sunlight that shines down on Pedro Point\'s Shelter Cove in Pacifica. The deep green ocean is ominously flat - the calm before the storm.',
					rating:9
				},
				{
					title:'Hook in the Wall',
					category:'Context Lost',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228855435929294206&max_dim=500',
					description:'A single lonely hook is lost amongst a matrix of bricks. An outdoor lamp dimly lights the nighttime air and casts a gold hue over the scene. The unused hook stands out like a weed in a dirt field.',
					rating:7
				},
				{
					title:'Huddling Together',
					category:'Trees Among Us',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228496639998196479&max_dim=500',
					description:'A small group of conifers huddle closely together, silhouetted like obelisks against an imposing sky. The mid afternoon sun is obscured by clouds that seem to emanate from some spot behind the trees.',
					rating:5
				},
				{
					title:'Just a Visitor',
					category:'The Somber Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228623703668130129&max_dim=500',
					description:'A parking lot sign in Ferndale, California takes on a deep existential meaning when it is taken out of context. Perhaps the human body is no more than a visitor\'s parking space to be temporarily used?',
					rating:6
				},
				{
					title:'Ocean\'s Kiss',
					category:'By the Seaside',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228760841280004992&max_dim=500',
					description:'The Pacific ocean gently caresses glistening wet rocks on the pebble beach near Point Bonita lighthouse in Marin (San Francisco Bay Area), California. Small pools of water remain from a previous wave.',
					rating:4
				},
				{
					title:'Out the Bus Window',
					category:'Context Lost',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228897217554746467&max_dim=500',
					description:'The view through a window of a moving bus at night provides the subject for a motion abstract. The lights outside create streaks while the light from inside reflects on the window as a subtle overlay.',
					rating:4
				},
				{
					title:'Pacifica Pier from Milagra',
					category:'The Winter Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228554379238024970&max_dim=500',
					description:'Pacifica Pier is seen from the lower hills of Milagra Ridge in the late afternoon. An approaching bank of clouds mirrors the shape of the shoreline, while fluffy clouds higher up blend with blue.',
					rating:5
				},
				{
					title:'Pier Before the Storm',
					category:'The Winter Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228550194293355740&max_dim=500',
					description:'A wave starts to break at the rust-stained concrete Pacifica Pier. In the foreground, the frothy remains of an earlier wave break churns away. The dramatic winter sky looks ready to burst with rain.',
					rating:8
				},
				{
					title:'Rain Fall',
					category:'Trees Among Us',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228234695931308619&max_dim=500',
					description:'Fallen autumn leaves drown in the pooling winter rainwater of a muddy forest floor in Metuchen, New Jersey, and are overlayed on the reflections of slender leafless trees in some kind of ironic twist.',
					rating:7
				},
				{
					title:'Retirement Home',
					category:'The Photographic Orphanage',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228580091324147918&max_dim=500',
					description:'A motley crew of dejected and spent car tires while away their final days in this retirement home. One old geezer stands out from the crowd. An odd angle lends a rather surreal quality to this scene.',
					rating:9
				},
				{
					title:'San Fran Sunset',
					category:'The Sunset Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228074575082103294&max_dim=500',
					description:'The setting sun flares through a gap between buildings at the Civic Center in San Francisco, California. Silhouetted buildings evoke mystery, while rows of lights echo the line of the sun flare.',
					rating:10
				},
				{
					title:'San Mateo Sunset',
					category:'The Sunset Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228118804591686444&max_dim=500',
					description:'The sun sets behind buildings in San Mateo, California, lighting up the unusual clouds with rich colors. The sky is complex, with different levels of clouds that catch the light in different ways.',
					rating:8
				},
				{
					title:'Setting Below Clouds',
					category:'The Sunset Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228948359037055649&max_dim=500',
					description:'The winter sun sets below a dramatic bank of heavy clouds that head an incoming storm, while a solitary tree on a hillside watches on. The ocean is set alight with a path of shimmering orange.',
					rating:9
				},
				{
					title:'Shadow of the Past',
					category:'The Photographic Orphanage',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228026937512483785&max_dim=500',
					description:'On the island of St. Croix, in the U.S. Virgin Islands in the Caribbean, a sad and delapidated structure stands deserted in a neighborhood that never quite fully recovered from the many insults of hurricanes past. All that remains of a once glorious home is a decaying skeleton that serves as a cautious reminder to those who still live in its midst.',
					rating:7
				},
				{
					title:'Stacks of Steel',
					category:'Context Lost',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228586025680090150&max_dim=500',
					description:'Partially rusted steel reinforcing bars are heaped against each other to form a huge stack. They lean over, and we see a window into the stack that results in wonderful diagonal lines of rusty blue.',
					rating:5
				},
				{
					title:'Sun Sets Soon at Sweeney',
					category:'The Sunset Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228888824201666423&max_dim=500',
					description:'The sun bursts out beneath a bank of clouds in this sunset, seen from Sweeney Ridge in San Bruno, California. It casts a path of shimmering orange on the ocean and lights up the air between two hills.',
					rating:8
				},
				{
					title:'Sun Through a Tree',
					category:'Trees Among Us',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228484030353525473&max_dim=500',
					description:'A muffled sun shines through on overcast wintery sky in San Mateo, California. Its dimmed soft and warm glow is enclosed by the twisted branches of a leafless tree, which appear as cracks in a window.',
					rating:4
				},
				{
					title:'Sweeney Ridge Sunset',
					category:'The Sunset Collection',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228859576507617417&max_dim=500',
					description:'A gorgeous sunset is seen from Sweeney Ridge in San Bruno, California. A ship passes by the sun on its way into the San Francisco Bay. A highlight in the sky parallels the hillside in the foreground.',
					rating:7
				},
				{
					title:'Trees Meet Sky',
					category:'Trees Among Us',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228620264277935845&max_dim=500',
					description:'A silhouetted stand of tall leafless trees meet the eerily iridescent winter sky in Metuchen, New Jersey. A sleak plane of clouds thinly blankets the glowing and silvery aqua sky.',
					rating:6
				},
				{
					title:'Twins',
					category:'Context Lost',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228786228006249323&max_dim=500',
					description:'Two locks guard the entrance to a deserted building at Fort Cronkite in Marin (San Francisco Bay Area), California. Two openings in the rusted steel door mirror the locks and are suggestive of eyes.',
					rating:8
				},
				{
					title:'Urban Heavens',
					category:'The Photographic Orphanage',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228225341102196754&max_dim=500',
					description:'A city building, like a giant monolith, looks up to the heavens. Its matrix of windows reflect the deep blue sky with its puffy white clouds, making the building appear as no more than a skeleton.',
					rating:9
				},
				{
					title:'Wave Abstract',
					category:'Context Lost',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228568520270882657&max_dim=500',
					description:'A wave that is meeting the shore is taken completely out of context to produce an abstract. Color depth and detail are reduced to further strengthen the composition, while the awkward angle confounds.',
					rating:4
				},
				{
					title:'Window Lean',
					category:'Context Lost',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228213464916914087&max_dim=500',
					description:'A row of windows on a building in San Francisco, California provides a perfect subject for an abstract perspective piece that plays with lines. The angle suggests a leaning building and adds tension.',
					rating:5
				},
				{
					title:'Windswept and Alone',
					category:'Trees Among Us',
					image:'http://rlv.zcache.com/isapi/designall.dll?action=realview&rvtype=pre&view=front&pid=228734547884666866&max_dim=500',
					description:'A windswept tree stands lonely on a lush green hillside. Captured while hiking one afternoon at Milagra Ridge, Pacifica.',
					rating:8
				}
			];

			return _getCopy ? _data : (_cachedData = _data);
		};
	}
});

