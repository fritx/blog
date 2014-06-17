(function( _ ){
	'use strict';
	
	// Unit extends Mesh
	var Unit = Class.extend.call( THREE.Mesh, {
		init: function(){
			// from the constructor of Mesh
			THREE.Object3D.call( this );
			
			// name, pointing, geometry, material
			this.name = this._class._name;	// _name
			this.pointing = Unit.pointing.clone();
			this.setGeometry( this._class.geometry.clone() );
			this.setMaterial( this._class.material.clone() );
			
			// compute boundingBox
			this.geometry.computeBoundingBox();
			
			// hpMax, hp, alive
			this.hpMax = this._class.hpMax;
			this.hp = this.hpMax;
			
			// injuring timer
			this.injure.timer = -1;
			
			// flags
			this.alive = true;
			this.toUpdate = false;
			this.toDie = false;
		},
		
		// update to call only when 'toUpdate' is true
		update: function( delta ){
			// no update
		},
		
		start: function(){
			this.toUpdate = true;
		},
		
		stop: function(){
			this.toUpdate = false;
		},
		
		// called only by controller
		die: function(){
			this.toDie = false;
			if ( ! this.alive ) return;
			
			// prevent restore
			if ( this.injure.timer !== -1 ) {
				clearTimeout( this.injure.timer );
			}
			
			this.alive = false;
			this.stop();
			this.material.wireframe = true;
			
			var _this = this;
			setTimeout( function(){
				_this.parent.remove( _this );
			}, 2000 );
		},
		
		injure: function( damage ){
			if ( ! this.alive ) return;
			
			// prevent restore
			if ( this.injure.timer !== -1 ) {
				clearTimeout( this.injure.timer );
			}
			
			// drop the hp
			this.hp = Math.max( 0, this.hp - damage );
			if ( this.hp === 0 ) {
				this.toDie = true;
				return;
			}
			
			// show the injury
			this._setOpacity( 0.4 );
			
			// restore later
			var _this = this;
			this.injure.timer = setTimeout( function(){
				_this._setOpacity( 1 );
				_this.injure.timer = -1;
			}, 100 );
		},
		
		_setOpacity: function( opacity ){
			if ( this.material.materials ) {
				$( this.material.materials ).each( function( i, v ){
					v.opacity = opacity;
				} );
			} else {
				this.material.opacity = opacity;
			}
		},
		
		// no support for objects in rotated or translated parents
		watchBy: function( direction ){
			this.pointing = direction.normalize();	// normalized pointing
			this.lookAt( this.position.clone().sub( this.pointing ) );
		},
		
		translate: function( offset ){
			this.translateX( offset.x );
			this.translateY( offset.y );
			this.translateZ( offset.z );
		}
	}, {
		_name: 'unit',	// use '_name', 'name' is natively occupied
		geometry: new THREE.CubeGeometry( 50, 50, 50 ),
		material: new THREE.MeshBasicMaterial( { color: 0xaaaaaa } ),
		pointing: new THREE.Vector3( 0, 0, -1 ),
		hpMax: 100,
		speed: 800
	} );
	
	window.Unit = Unit;
})();