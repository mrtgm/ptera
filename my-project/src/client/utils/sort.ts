// fractional-indexing
export const sortByFractionalIndex = (a: string, b: string) => {
	const EXTENDED_ALPHABET =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	const minLength = Math.min(a.length, b.length);

	for (let i = 0; i < minLength; i++) {
		const indexA = EXTENDED_ALPHABET.indexOf(a[i]);
		const indexB = EXTENDED_ALPHABET.indexOf(b[i]);

		if (indexA !== indexB) {
			return indexA - indexB;
		}
	}

	return a.length - b.length;
};
