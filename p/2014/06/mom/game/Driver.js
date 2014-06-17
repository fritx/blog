(function(){
	'use strict';
	
	// Driver
	var Driver = Class.extend( {
		init: function( ship ){
			this.ship = ship;
			
			// ejectors
			this.toMove = {
				forth: false, back: false,
				left: false, right: false,
				up: false, down: false,
			}
			// weapon
			this.toFire = false;
			// pointing
			this.toLook = ship.pointing.clone();
		},
		
		terminate: function(){
			// tell driver the ship is dying
		},
		
		shock: function(){
			// tell driver the ship is being injured
		},
		
		getCommand: function(){
			var command = {
				toMove: this.toMove,
				toFire: this.toFire,
				toLook: this.toLook
			}
			this.toFire = false;
			return command;
		}
	}, {
		
	} );
	
	window.Driver = Driver;
})();