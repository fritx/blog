( function(){
	'use strict';
	
	var Sound = Class.extend( {
		init: function( radius, sources, loop ){
			// dom
			var audio = document.createElement( 'audio' );
			for ( var i = 0, source; i < sources.length; i ++ ) {
				source = document.createElement( 'source' );
				source.src = sources[ i ];
				audio.appendChild( source );
			}
			audio.volume = 1;
			audio.loop = true;
			
			this.audio = audio;
			
			// radius, position
			this.radius = radius;
			this.position = new THREE.Vector3();
		},
		
		update: function( position ){
			var distance = this.position.distanceTo( position );
			
			if ( distance > this.radius ) {	// too far
				this.audio.volume = 0;
			} else {
				this.audio.volume = 1 - Math.pow( distance / this.radius, 2 );
			}
		},
		
		play: function(){
			this.audio.play();
		},
		
		pause: function(){
			this.audio.pause();
		}
	}, {
		
	} );
	
	window.Sound = Sound;
} )();