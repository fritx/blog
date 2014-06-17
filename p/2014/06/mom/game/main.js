// world, user
var world = new World();
var station = world.addStation( [ 0, 0, 0 ] );
var user = world.addUserShip( [ 0, 0, 400 ], [ 0, 0, -1 ] );
world.bindCamera( user );

// npc
world.addAIShip( [ 0, 0, -400 ], [ 0, 0, 1 ] );
world.addAIShip( [ 400, 0, 0 ], [ -1, 0, 0 ] );
world.addAIShip( [ -400, 0, 0 ], [ 1, 0, 0 ] );
world.addAIShip( [ 0, 400, 0 ], [ 0, -1, 0 ] );
world.addAIShip( [ 0, -400, 0 ], [ 0, 1, 0 ] );

// for mother's day
// photosed material
var materials = [];
for ( var i = 0; i < 6; i ++ ) {
	materials.push(
		new THREE.MeshBasicMaterial( {
			map: THREE.ImageUtils.loadTexture(
				[
					'photos/', '.jpg'
				].join( ( i < 10 ? '0': '' ) + i )
			)
		} )
	);
}
station.setMaterial(
	new THREE.MeshFaceMaterial( materials )
);
// sound
world.addSound( [ 0, 0, 0 ], 4000, [
	'sounds/莫扎特 - 小星星变奏曲.mp3',
	'sounds/莫扎特 - 小星星变奏曲.ogg'
] );