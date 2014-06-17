(function(){
	'use strict';
	
	// UserDriver extends Driver
	var UserDriver = Driver.extend( {
		init: function( ship ){
			this._super( ship );
			
			// looking parameters
			this.lon = 0;
			this.lat = 0;
			this.phi = 0;
			this.theta = 0;
			
			// listen events
			$( document ).on(
				'keydown keyup',
				bind( UserDriver.onKeyChange, this )
			).on(
				'mousemove',
				bind( UserDriver.onMouseMove, this )
			).on(
				'mousedown',
				bind( UserDriver.onMouseDown, this )
			);
			
			function bind( fn, scope ) {
				return function(){
					fn.apply(scope, arguments);
				}
			}
		},
		
		terminate: function(){	// override
			this.ship.world.setCamera(
				[ 2000, 2000, 2000 ],
				[ -1, -1, -1 ]
			);
		},
		
		shock: function(){	// override
			this._super();
			
			// notify the user
			console.log( 'damaged' );
		}
	}, {
		onMouseMove: function( event ){
			if ( ! this.ship.world.locked ) return;
			event = event.originalEvent;
			var dx = event.webkitMovementX || event.mozMovementX || 0,
			dy = event.webkitMovementY || event.mozMovementY || 0;
			
			this.lon += dx * UserDriver.lookingSpeed;
			this.lat += dy * UserDriver.lookingSpeed * World.windowRatio;
			
			this.lat = Math.max( - 240, Math.min( 240, this.lat ) );
			this.phi = THREE.Math.degToRad( 90 - this.lat );
			this.phi = THREE.Math.mapLinear( this.phi, 0,
			Math.PI, UserDriver.verticalMin, UserDriver.verticalMax );
			this.theta = THREE.Math.degToRad( this.lon );
			
			this.toLook.set(
				Math.sin( this.phi ) * Math.cos( this.theta ),
				- Math.cos( this.phi ),
				Math.sin( this.phi ) * Math.sin( this.theta )
			);
		},
		
		onMouseDown: function( event ){
			if ( ! this.ship.world.locked ) return;
			
			if ( event.which === 1 ) {
				this.toFire = true;
			}
		},
		
		onKeyChange: function( event ){
			if ( ! this.ship.world.locked ) return;
			var flag = event.type === 'keydown',
			key = event.which,
			keyTable = UserDriver.keyTable;
			
			if ( key === keyTable.W ) {
				this.toMove.forth = flag;
			} else if ( key === keyTable.S ) {
				this.toMove.back = flag;
			} else if ( key === keyTable.A ) {
				this.toMove.left = flag;
			} else if ( key === keyTable.D ) {
				this.toMove.right = flag;
			} else if ( key === keyTable.R ) {
				this.toMove.up = flag;
			} else if ( key === keyTable.F ) {
				this.toMove.down = flag;
			}
		},
		
		lookingSpeed: 0.1,
		verticalMin: 1.1,
		verticalMax: 2.2,
		
		keyTable: {
			W: 87, S: 83, A: 65, D: 68, R: 82, F: 70
		}
	} );
	
	window.UserDriver = UserDriver;
})();