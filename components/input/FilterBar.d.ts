/** @responsive */
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
export type FilterOperator = "equals" | "notEquals" | "contains";
export interface FilterField { key: string; label: string; options?: { value: string; label: string }[] }
export interface FilterToken { id: string; field: string; operator: FilterOperator; value: string }
export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  fields: FilterField[]; filters: FilterToken[]; onFiltersChange: (filters: FilterToken[]) => void;
  query: string; onQueryChange: (query: string) => void;
  fit?: "auto" | "flex" | "fixed"; width?: string | number;
}
export declare const FilterBar: ForwardRefExoticComponent<FilterBarProps & RefAttributes<HTMLInputElement>>;
