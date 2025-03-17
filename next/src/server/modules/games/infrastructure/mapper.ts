import { omit } from "remeda";

export const domainToPersitence = <
	T extends {
		id: number;
		createdAt?: string;
		updatedAt?: string;
	},
>(
	domain: T,
) => omit(domain, ["id", "createdAt", "updatedAt"]);
