(function(){
	'use strict';
	
	// AIDriver extends Driver
	var AIDriver = Driver.extend( {
		init: function( ship ){
			this._super( ship );
			
			// target, strategy
			this.target = new THREE.Vector3();
			this.strategy = AIDriver.strategies[ 0 ];
			
			// switching strategy
			var _this = this;
			this.think.timer = setInterval( function(){
				_this.think();
			}, 1000 );
			this.think();
		},
		
		think: function(){
			// moving
			var r = Math.floor( Math.random() * AIDriver.strategies.length );
			this.strategy = AIDriver.strategies[ r ];
			
			// looking
			var r1 = Math.random(),
			r2 = Math.random(),
			r3 = Math.random();
			this.target.set(
				1000 * ( r1 < 0.33 ? 1 : ( r1 < 0.66 ? -1 : 0 ) ),
				1000 * ( r2 < 0.33 ? 1 : ( r2 < 0.66 ? -1 : 0 ) ),
				1000 * ( r3 < 0.33 ? 1 : ( r3 < 0.66 ? -1 : 0 ) )
			);
			
			// firing
			this.toFire = Math.random() < 0.33;
		},
		
		update: function(){
			var strategy = this.strategy,
			target = this.target;
			
			// toMove
			this.toMove.forth = this.toMove.back = false;
			if ( strategy === 'forth' ) {
				this.toMove.forth = true;
			} else if ( strategy === 'back' ) {
				this.toMove.back = true;
			}
			
			// toLook
			this.toLook = target.clone().sub( this.ship.position );
		},
		
		getCommand: function(){
			this.update();
			
			return this._super();
		}
	}, {
		strategies: [ 'wait', 'forth', 'back' ]
	} );
	
	window.AIDriver = AIDriver;
})();