(function(){
	'use strict';
	
	// World
	var World = Class.extend( {
		init: function(){
			// clock, scene, light
			this.clock = new THREE.Clock( false );
			this.scene = new THREE.Scene();
			this.scene.add( new THREE.AmbientLight( 0xaaaaaa ) );
			
			// camera
			this.camera = new THREE.PerspectiveCamera( 50,
			World.windowRatio, 1, 20000 );
			this.scene.add( this.camera );
			
			// renderer
			this.renderer = new THREE.WebGLRenderer( { antialias: true } );
			this.renderer.setClearColor( 0x000000, 1 );
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			
			// dom, events
			this.locked = false;
			this.$container = $( '#container' );
			this.$screen = $( '#screen' );
			var _this = this;
			this.$container.on( 'click', function( event ){
				if ( ! _this.locked ) {
					event.preventDefault();
					Locker.lockPointer( this );
					return false;
				}
			} );
			Locker.setHandler( function( locked ){
				_this.locked = locked;
			} );
			$( window ).on( 'resize', function(){
				_this.onWindowResize();
			} );
			
			// units
			this.units = [];
			// sounds
			this.sounds = [];
			
			// start
			this.$screen.html( '' );
			this.$screen.append( this.renderer.domElement );
			this.stats = new Stats();
			this.$container.append( this.stats.domElement );
			this.clock.start();
			this.animate();
		},
		
		setCamera: function( position, pointing ){
			position = World.parseVector( position );
			pointing = World.parseVector( pointing );
			
			this.scene.add( this.camera );
			this.camera.position = position;
			Unit.prototype.watchBy.call(
				this.camera,
				
				// XXX: negated for camera, dont know why
				pointing.clone().negate()
			);
		},
		
		bindCamera: function( ship ){
			ship.add( this.camera );	// should be at center
		},
		
		update: function(){
			// apply dying first
			var units = this.units;
			for ( var i = 0, unit; i < units.length; i ++) {
				unit = units[ i ];
				if ( unit.toDie ) {
					unit.die();
					units.splice( i--, 1 );	// remove from the units list
				}
			}
			
			// update all
			var delta = this.clock.getDelta();
			$( units ).each( function( i, v ){
				v.toUpdate && v.update( delta );
			} );
			
			// sound
			var camera = this.camera,
			position = camera.parent instanceof THREE.Scene ?
			camera.position : camera.parent.position;
			$( this.sounds ).each( function( i, v ){
				v.update( position );
			} );
			
			this.renderer.render( this.scene, this.camera );
			this.stats.update();
		},
		
		animate: function(){
			var _this = this;
			requestAnimationFrame( function(){
				_this.animate();
			} );
			
			this.update();
		},
		
		addUserShip: function( position, pointing ){
			var ship = this._makeShip( position, pointing );
			ship.setDriver( UserDriver );
			ship.start();
			return ship;
		},
		addAIShip: function( position, pointing ){
			var ship = this._makeShip( position, pointing );
			ship.setDriver( AIDriver );
			ship.start();
			return ship;
		},
		_makeShip: function( position, pointing ){
			position = World.parseVector( position );
			pointing = World.parseVector( pointing );
			
			var ship = new Ship( this );
			ship.position = position;
			ship.watchBy( pointing );
			this.scene.add( ship );
			
			this.units.push( ship );
			return ship;
		},
		
		addStation: function( position ){	// array to pass in
			position = World.parseVector( position );
			
			var station = new Station();
			station.position = position;
			this.scene.add( station );
			
			this.units.push( station );
			return station;
		},
		
		addSound: function( position, radius, sources ){
			position = World.parseVector( position );
			
			var sound = new Sound( radius, sources );
			sound.position = position;
			sound.play();
			
			this.sounds.push( sound );
			return sound;
		},
		
		onWindowResize: function(){
			World.windowRatio = window.innerWidth / window.innerHeight;
			this.camera.aspect = World.windowRatio;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
		}
	}, {
		windowRatio: window.innerWidth / window.innerHeight,
		
		parseVector: function( array ){
			var vector = new THREE.Vector3();
			return vector.fromArray( array );
		}
	} );
	
	window.World = World;
})();