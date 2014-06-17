(function(){
	'use strict';
	
	// Ship extends Unit
	var Ship = Unit.extend( {
		init: function( world ){
			this._super();
			
			// speed
			this.speed = Ship.speed;
			
			// world
			this.world = world;
			
			// driver
			this.driver = null;
		},
		
		setDriver: function( driverType ){
			this.driver = new driverType( this );
		},
		
		update: function( delta ){	// override
			// moving command
			var offset = new THREE.Vector3(),
			command = this.driver.getCommand(),
			toMove = command.toMove;
			toMove.forth && ( offset.z -= 1 );
			toMove.back && ( offset.z += 1 );
			toMove.left && ( offset.x -= 1 );
			toMove.right && ( offset.x += 1 );
			toMove.up && ( offset.y += 1 );
			toMove.down && ( offset.y -= 1 );
			offset.normalize();
			
			// move
			var actualOffset = offset
			.multiplyScalar( delta * this.speed );
			this.translate( actualOffset );
			// fire
			if ( command.toFire ) {
				this.fire();
			}
			// look
			this.watchBy( command.toLook );
		},
		
		fire: function(){
			var scene = this.parent;
			
			var missile = new Missile( this );
			missile.position.copy( this.position );
			missile.watchBy( this.pointing );
			missile.translateY( -25 );
			scene.add( missile );
			
			this.world.units.push( missile );
			missile.start();
		},
		
		die: function(){	// override
			this._super();
			this.driver.terminate();
		},
		
		injure: function( damage ){	// override
			this._super( damage );
			this.driver.shock();
		}
	}, {
		_name: 'ship',
		geometry: new THREE.CubeGeometry( 50, 50, 50 ),
		
		//material: new THREE.MeshBasicMaterial( { color: 0x0000ff } ),
		material: new THREE.MeshBasicMaterial(
			{
				map: THREE.ImageUtils.loadTexture( 'textures/bluewool.png' )
			}
		),
		
		hpMax: Unit.hpMax,
		speed: Unit.speed
	} );
	
	window.Ship = Ship;
})();