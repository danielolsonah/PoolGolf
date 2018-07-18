export const impulse = (speed, direction) => {
	return {
		type: 'IMPULSE',
		payload: {
			speed: speed,
			direction: direction
		}
	}
}

export const xtransform = (magnitude) => {
	return {
		type: 'X_TRANSFORM',
		payload: magnitude
	}
}

export const ytransform = (magnitude) => {
	return {
		type: 'Y_TRANSFORM',
		payload: magnitude
	}
}

export const xpush = (value) => {
	return {
		type: 'X_PUSH',
		payload: value
	}
}

export const ypush = (value) => {
	return {
		type: 'Y_PUSH',
		payload: value
	}
}

export const slowDown = (value) => {
	return {
		type: 'SLOW_DOWN',
		payload: value
	}
}
