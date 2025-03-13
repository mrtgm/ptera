import { omit } from "remeda";

export const domainToPersitence = <
	T extends {
		id: number;
		publicId: string;
		createdAt?: string;
		updatedAt?: string;
	},
>(
	domain: T,
) => omit(domain, ["id", "publicId", "createdAt", "updatedAt"]);
