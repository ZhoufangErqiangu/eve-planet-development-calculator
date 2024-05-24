export interface PlanetR0Form {
  id: string;
  r0?: string;
  value?: number;
}
export interface PlanetForm {
  id: string;
  planetType?: string;
  r0s: PlanetR0Form[];
}
