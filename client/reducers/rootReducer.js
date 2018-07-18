const coolState = {
	targetBall: {
		position: {
			x: 0,
			y: -2,
			z: 0
		},
		velocity: {
			speed: 0,
			x: 0,
			y: 0,
			z: 0
		}
	},
	cue: {
		position: {
			x: 2,
			y: -2,
			z: 0
		},
		velocity: {
			speed: 0.03,
			x: 0,
			y: 0,
			z: 0
		}
	},
	walls: [
		{
			height: 1,
			width: 10,
			position: [0, 4]
		},
		{
			height: 1,
			width: 10,
			position: [0, -4]
		},
		{
			height: 0.5,
			width: 5,
			position: [2, 0]
		},
		{
			height: 7,
			width: 1,
			position: [5, 0]
		},
		{
			height: 7,
			width: 1,
			position: [-5, 0]
		}
	]
}

const reducer = (state = coolState, action) => {
	switch (action.type) {
		case 'IMPULSE' : 
			return {
				targetBall: {
					position: state.targetBall.position,
					velocity: {
						speed: action.payload.speed,
						x: action.payload.direction.x,
						y: action.payload.direction.y,
						z: action.payload.direction.z
					}
				},
				cue: state.cue,
				walls: state.walls
			};
		case 'X_TRANSFORM' : 
			return {
				targetBall: state.targetBall,
				cue: {
						position: state.cue.position,
						velocity: {
						speed: state.cue.velocity.speed,
						x: action.payload,
						y: state.cue.velocity.y,
						z: state.cue.velocity.z
					}
				},
				walls: state.walls
			}
		case 'Y_TRANSFORM' : 
			return {
				targetBall: state.targetBall,
				cue: {
					position: state.position,
					velocity: {
						speed: state.cue.velocity.speed,
						x: state.cue.velocity.x,
						y: action.payload,
						z: state.cue.velocity.z
					}
				},
				walls: state.walls
			}
		case 'X_PUSH' : 
			return {
				position: state.position,
				velocity: {
					speed: state.speed,
					x: state.velocity.x += action.payload,
					y: state.velocity.y,
					z: state.velocity.z
				}
			}
		case 'Y_PUSH' : 
			return {
				position: state.position,
				velocity: {
					speed: state.speed,
					x: state.velocity.x,
					y: state.velocity.y += action.payload,
					z: state.velocity.z
				}
			}
		case 'SLOW_DOWN' : 
			return {
				targetBall: {
					position: state.position,
					velocity: {
						speed: state.targetBall.velocity.speed -= action.payload,
						x: state.targetBall.velocity.x,
						y: state.targetBall.velocity.y,
						z: state.targetBall.velocity.z,
					}
				},
				cue: state.cue,
				walls: state.walls
			}
		default : 
			return state;
	}
}

export default reducer;