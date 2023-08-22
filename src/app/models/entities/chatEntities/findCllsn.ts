import { collision } from "./collision";

export function findCllsn(a: any, b: any){
			for (var bi in b) {
				if (collision(a, b[bi]) && Array.isArray(b)) {
					return true;
				}
			}
			return false;
  };