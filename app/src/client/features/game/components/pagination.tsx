"use client";

import { Button } from "@/client/components/shadcn/button";
import { PAGINATION_CONFIG } from "@/client/features/game/constants";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";

export const Pagination = ({
	totalPages,
	searchParams,
}: {
	totalPages: number;
	searchParams: { offset?: number };
}) => {
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const { currentPage, pageNumbers, showStartEllipsis, showEndEllipsis } =
		usePaginationData(searchParams, totalPages);

	const handlePageChange = (page: number) => {
		const params = buildUrlParams(searchParams, page);
		const queryString = params.toString();
		const url = queryString ? `${pathname}?${queryString}` : pathname;

		window.scrollTo({ top: 0, behavior: "smooth" });
		startTransition(() => {
			router.replace(url);
		});
	};

	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className="flex justify-center mt-8">
			<PaginationButton
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1 || isPending}
			>
				前へ
			</PaginationButton>

			{showStartEllipsis && <EllipsisButton />}

			{pageNumbers.map((page) => (
				<PaginationButton
					key={page}
					variant={page === currentPage ? "default" : "outline"}
					onClick={() => handlePageChange(page)}
					disabled={isPending}
				>
					{page}
				</PaginationButton>
			))}

			{showEndEllipsis && <EllipsisButton />}

			<PaginationButton
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages || isPending}
			>
				次へ
			</PaginationButton>
		</div>
	);
};

const PaginationButton = ({
	children,
	variant = "outline",
	disabled = false,
	onClick,
}: {
	children: React.ReactNode;
	variant?: "default" | "outline";
	disabled?: boolean;
	onClick?: () => void;
}) => {
	return (
		<Button
			variant={variant}
			className="mx-1"
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</Button>
	);
};

const EllipsisButton = () => {
	return (
		<Button variant="outline" className="mx-1" disabled>
			...
		</Button>
	);
};

const usePaginationData = (
	searchParams: {
		offset?: number;
	},
	totalPages: number,
) => {
	const offset = searchParams.offset || 0;
	const currentPage =
		Math.ceil(offset / PAGINATION_CONFIG.DEFAULT_PAGE_SIZE) + 1;

	const pageNumbers = useMemo(() => {
		const { MAX_PAGES_SHOWN } = PAGINATION_CONFIG;
		let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGES_SHOWN / 2));
		const endPage = Math.min(totalPages, startPage + MAX_PAGES_SHOWN - 1);

		if (endPage - startPage + 1 < MAX_PAGES_SHOWN) {
			startPage = Math.max(1, endPage - MAX_PAGES_SHOWN + 1);
		}

		return Array.from(
			{ length: endPage - startPage + 1 },
			(_, i) => startPage + i,
		);
	}, [currentPage, totalPages]);

	const showStartEllipsis = pageNumbers.length > 0 && pageNumbers[0] > 1;
	const showEndEllipsis =
		pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages;

	return {
		currentPage,
		pageNumbers,
		showStartEllipsis,
		showEndEllipsis,
	};
};

const buildUrlParams = (
	searchParams: { offset?: number },
	page: number,
): URLSearchParams => {
	const params = new URLSearchParams();

	for (const [key, value] of Object.entries(searchParams)) {
		if (key === "offset") continue;
		if (value !== undefined) {
			params.set(key, String(value));
		}
	}

	if (page > 1) {
		params.set(
			"offset",
			String((page - 1) * PAGINATION_CONFIG.DEFAULT_PAGE_SIZE),
		);
	}

	return params;
};
