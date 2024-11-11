export const isValidUrl = (str: any) => {
	if (typeof str !== 'string') return false;
	
	try {
		const url = new URL(str);
		if (url) {
			// console.log('url: ', url);
			return true;
		}
	} catch(err) {}

	return false;
}

export const isValidObjectId = (value: any) => {
	const regex = /^[a-f\d]{24}$/i;
	if (typeof value === 'string') return regex.test(value);

	return false;
}