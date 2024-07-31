Array.prototype.serilize = function () {
	return this.map((item) => {
		if (item instanceof Object) {
			return { ...item };
		}
		return item;
	});
};
