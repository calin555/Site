import type { ConnectorFilter, PowerFilter, SortOption } from "@/types/catalog";

export const CATALOG_PAGE_SIZE = 9;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Cele mai populare" },
  { value: "pret-asc", label: "Preț crescător" },
  { value: "pret-desc", label: "Preț descrescător" },
  { value: "nou", label: "Cele mai noi" },
  { value: "putere-asc", label: "Putere crescătoare" },
  { value: "putere-desc", label: "Putere descrescătoare" },
];

export const POWER_OPTIONS: { value: PowerFilter; label: string }[] = [
  { value: "7.4", label: "7.4 kW" },
  { value: "11", label: "11 kW" },
  { value: "22", label: "22 kW" },
  { value: "60+", label: "60 kW+" },
];

export const CONNECTOR_OPTIONS: { value: ConnectorFilter; label: string }[] = [
  { value: "type2", label: "Type 2" },
  { value: "ccs2", label: "CCS2" },
  { value: "type1", label: "Type 1" },
  { value: "chademo", label: "CHAdeMO" },
  { value: "tesla", label: "Tesla" },
];

export const CONNECTOR_LABELS: Record<ConnectorFilter, string> = {
  type1: "Type 1",
  type2: "Type 2",
  ccs2: "CCS2",
  chademo: "CHAdeMO",
  tesla: "Tesla",
};

export const SORT_LABELS: Record<SortOption, string> = {
  popular: "Cele mai populare",
  "pret-asc": "Preț crescător",
  "pret-desc": "Preț descrescător",
  nou: "Cele mai noi",
  "putere-asc": "Putere crescătoare",
  "putere-desc": "Putere descrescătoare",
};
