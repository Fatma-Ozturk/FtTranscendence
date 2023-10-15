export const Collision = (a: any, b: any): boolean => {
	// top hits bottom, bottom hits top, left hits right, right hits left
	if (((a.y < b.y + b.h + 6 - b.backArea && a.y > b.y) || (a.y > b.y && a.y < b.y + b.h - b.backArea)) &&
		((a.x + a.w > b.x && a.x + a.w < b.x + b.w) || (a.x < b.x + b.w && a.x > b.x))) {
		return true;
	} else {
		return false;
	}
};