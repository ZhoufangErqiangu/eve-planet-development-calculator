import { type Item } from ".";

export interface PlanetResource extends Item {}

export interface R0Resource extends PlanetResource {
  from: string[];
}

export interface PxResource extends PlanetResource {
  recipe: PlanetRecipe;
}

export interface PlanetRecipeItem {
  resource: PlanetResource;
  quantity: number;
}
export interface PlanetRecipe {
  inputs: PlanetRecipeItem[];
  outputQuantity: number;
}
