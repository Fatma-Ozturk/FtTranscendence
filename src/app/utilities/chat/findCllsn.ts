import { Collision } from "./collision";

export function findCllsn(a: any, b: any) {
	for (var bi in b) {
		if (Collision(a, b[bi]) && Array.isArray(b)) {
			return true;
		}
	}
	return false;
};
