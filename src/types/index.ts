export interface ItemGroup {
  name: string;
  parent?: string;
}

export interface Item {
  group: string;
  name: string;
  desc?: string;
  price?: number;
  skill?: unknown;
}

export * from "./planetDevelopment";
