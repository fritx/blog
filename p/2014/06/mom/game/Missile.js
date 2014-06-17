(function(){
	'use strict';
	
	// Missile extends Unit
	var Missile = Unit.extend( {
		init: function( host ){
			this._super();
			
			// host
			this.host = host;
			
			// harm, speed
			this.harm = Missile.harm;
			this.speed = Missile.speed;
			
			// deadline
			this.deadline = Date.now() + Missile.lifecycle;
		},
		
		update: function( delta ){	// override
			var quarterActualSpeed = this.speed * delta / 4;
			
			// hit testing, position updating
			for ( var i = 0; i < 4; i ++ ) {
				if ( this.hitTest() ) {
					this.toDie = true;
					break;
				}
				this.translateZ( - quarterActualSpeed );
			}
			
			// check deadline
			if ( Date.now() > this.deadline ) {
				this.toDie = true;
			}
		},
		
		hitTest: function(){
			var didHit = false;
			for ( var i = 0, units = this.host.world.units, unit; i < units.length; i ++ ) {
				unit = units[ i ];
				if ( this.hits( unit ) ) {
					unit.injure( this.harm );	// hurt the unit
					didHit = true;
				}
			}
			
			return didHit;
		},
		
		hits: function( unit ){
			var boxA = unit.geometry.boundingBox.clone(),
			boxB = this.geometry.boundingBox.clone();
			return boxA.translate( unit.position )
			.isIntersectionBox( boxB.translate( this.position ) )
			&& unit !== this && unit !== this.host;
		},
		
		die: function(){	// override
			this.toDie = false;
			if ( ! this.alive ) return;
			
			this.alive = false;
			this.stop();
			this.parent.remove( this );	// disappear at once
		},
		
		injure: function(){	// override
			this.toDie = true;	// to die when injured
		}
	}, {
		_name: 'missile',
		geometry: new THREE.CubeGeometry( 20, 20, 20 ),
		
		//material: new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
		material: new THREE.MeshBasicMaterial(
			{
				map: THREE.ImageUtils.loadTexture( 'textures/ice.png' )
			}
		),
		
		hpMax: Unit.hpMax * 0.1,
		speed: Unit.speed * 5,
		harm: 5,
		lifecycle: 1000 * 5	// 10s
	} );
	
	window.Missile = Missile;
})();