"use client";

import { Input } from "@/client/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/shadcn/select";
import { DEFAULT_STATES, SORT_OPTIONS } from "@/client/features/game/constants";
import type { Category, GetGamesRequest } from "@ptera/schema";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

export default function GameFilterBar({
  initialSearchParams,
  categories,
}: {
  initialSearchParams: GetGamesRequest;
  categories: Category[] | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(initialSearchParams.q || "");
  const [sortBy, setSortBy] = useState<GetGamesRequest["sort"]>(
    initialSearchParams.sort || DEFAULT_STATES.SORT_BY,
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialSearchParams.categoryId || DEFAULT_STATES.CATEGORY_ID,
  );

  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const updateUrlParams = useCallback(
    (newParams: GetGamesRequest) => {
      const params = new URLSearchParams();
      if (newParams.sort) {
        params.set("sort", newParams.sort);
      }
      if (newParams.categoryId) {
        params.set("categoryId", String(newParams.categoryId));
      }
      if (newParams.q) {
        params.set("q", newParams.q);
      }
      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.replace(url);
      });
    },
    [pathname, router],
  );

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = window.setTimeout(() => {
      updateUrlParams({
        ...initialSearchParams,
        q: search,
        offset: 0,
      });
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleSortChange = (sort: GetGamesRequest["sort"]) => {
    setSortBy(sort);
    updateUrlParams({
      ...initialSearchParams,
      sort,
      offset: 0,
    });
  };

  const handleGenreChange = (categoryId: number | "all") => {
    setSelectedCategoryId(categoryId);
    updateUrlParams(
      categoryId !== "all"
        ? { ...initialSearchParams, categoryId, offset: 0 }
        : { ...initialSearchParams, offset: 0, categoryId: undefined },
    );
  };

  return (
    <>
      <div
        className={`flex flex-col md:flex-row gap-4 mb-6 ${isPending ? "opacity-70" : ""}`}
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ゲームやクリエイターを検索..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={String(selectedCategoryId)}
            onValueChange={(value) => {
              if (value === "all") {
                handleGenreChange("all");
                return;
              }
              handleGenreChange(Number(value));
            }}
            disabled={isPending}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="ジャンル" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのジャンル</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) =>
              handleSortChange(value as GetGamesRequest["sort"])
            }
            disabled={isPending}
          >
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="並び替え" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
