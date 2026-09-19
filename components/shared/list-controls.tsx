"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_OPTIONS } from "@/lib/list-params";

export interface ListFilterOption {
  value: string;
  label: string;
}

export interface ListFilterConfig {
  key: string;
  label: string;
  options: ListFilterOption[];
}

export function ListControls({
  searchKey = "q",
  searchPlaceholder,
  filters = [],
  totalItems,
  page,
  pageSize,
}: {
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: ListFilterConfig[];
  totalItems: number;
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get(searchKey) ?? "");
  const isFirstRender = useRef(true);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      updateParams({ [searchKey]: searchValue || null });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3">
      {searchPlaceholder || filters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          {searchPlaceholder ? (
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="max-w-xs"
            />
          ) : null}
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={searchParams.get(filter.key) ?? ""}
              onChange={(e) => updateParams({ [filter.key]: e.target.value || null })}
              className="w-auto"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>{totalItems === 0 ? "Tidak ada data" : `Menampilkan ${from}–${to} dari ${totalItems}`}</span>
        <div className="flex items-center gap-3">
          <Select
            value={String(pageSize)}
            onChange={(e) => updateParams({ pageSize: e.target.value })}
            className="w-auto"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} / halaman
              </option>
            ))}
          </Select>
          <div className="flex items-center gap-1">
            <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(1)}>
              First
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
              Prev
            </Button>
            <span className="px-2">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Next
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => goToPage(totalPages)}
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
