(function(){
	'use strict';
	
	// Station extends Unit
	var Station = Unit.extend( {
		init: function(){
			this._super();
		},
		
		injure: function( damage ){	// override
			damage = 0;	// station receives no damage
			this._super( damage );
		}
	}, {
		_name: 'station',
		geometry: new THREE.CubeGeometry( 500, 500, 500 ),
		
		//material: new THREE.MeshBasicMaterial( { color: 0xff00ff } ),
		material: new THREE.MeshBasicMaterial(
			{
				map: THREE.ImageUtils.loadTexture( 'textures/blockDiamond.png' )
			}
		),
		
		hpMax: Unit.hpMax * 10
	} );
	
	window.Station = Station;
})();