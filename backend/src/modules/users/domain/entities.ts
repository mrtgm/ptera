export type User = {
	id: number;
	publicId: string;
	jwtSub: string;
	name: string;
	bio: string | null;
	avatarUrl: string | null;
	isDeleted: boolean;
};
