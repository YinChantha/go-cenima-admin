import { useMemo } from "react";

// Put this near the top of your file
interface SelectOption {
  _id: string;
  id?: string;
  name: string | { en: string; kh?: string; ch?: string };
}

function useSelectOptions<T extends Record<string, any>>(
  raw: T[] | undefined,
  idKeys: Array<keyof T | string> = ["_id", "id", "value", "code"],
  nameKeys: Array<keyof T | string> = ["name", "label", "title", "displayName"]
) {
  return useMemo<SelectOption[]>(() => {
    const arr = raw ?? [];
    return arr.map((it) => {
      const idKey = idKeys.find((k) => (it as any)?.[k] != null);
      const nameKey = nameKeys.find((k) => (it as any)?.[k] != null);
      const rawId = idKey ? (it as any)[idKey] : undefined;
      const rawName = nameKey ? (it as any)[nameKey] : undefined;
      const _id = String(rawId ?? "");
      const name =
        rawName == null
          ? ""
          : typeof rawName === "string"
          ? rawName
          : (rawName as any);
      return { _id, name };
    });
  }, [raw, idKeys, nameKeys]);
}
