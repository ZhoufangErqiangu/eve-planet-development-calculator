import P1Json from "../../assets/json/planet-development/p1.json";
import P2Json from "../../assets/json/planet-development/p2.json";
import { uuid } from "../../utils/uuid";

export interface Resource0 {
  r0?: string;
  value?: number;
}

export interface Planet {
  id: string;
  planetType?: string;
  r0s: Resource0[];
}

export interface PlanetP1 {
  id: string;
  p1: string;
  planetIndex: number;
  value: number;
}

export interface PlanetP2 {
  id: string;
  p2: string;
  value: number;
  p1s: PlanetP1[];
}

export interface PlanetP1Result extends Planet {
  p1s: PlanetP1[];
}

export function calculateP1(planets: Planet[]): PlanetP1Result[] {
  const plantsWithP1s = planets.map((planet) => {
    const p1s: PlanetP1[] = [];
    for (let i = 0; i < planet.r0s.length; i++) {
      const r = planet.r0s[i];
      if (!r.r0) continue;
      const p1 = P1Json.find((p) =>
        p.recipe.inputs.find((i) => i.resource === r.r0),
      );
      if (!p1) continue;
      p1s.push({
        id: uuid(),
        p1: p1.name,
        planetIndex: i + 1,
        value: r.value ?? 0,
      });
    }
    return {
      ...planet,
      p1s,
    };
  });
  return plantsWithP1s;
}

export function calculateP2(plants: PlanetP1Result[]): PlanetP2[] {
  const p12p2: Array<PlanetP1 & { planet: string }> = plants
    .map((e) => {
      return e.p1s.map((e1) => {
        return {
          ...e1,
          planet: e.id,
        };
      });
    })
    .reduce((prev, curr) => prev.concat(curr), []);
  // p2
  const p2s: PlanetP2[] = [];
  for (const p1a of p12p2) {
    for (const p1b of p12p2) {
      if (p1a.id === p1b.id) continue;
      if (p1a.planet === p1b.planet) continue;
      const p2 = P2Json.find((p) => {
        if (p.recipe.inputs.length < 2) return false;
        return (
          (p.recipe.inputs[0].resource === p1a.p1 &&
            p.recipe.inputs[1].resource === p1b.p1) ||
          (p.recipe.inputs[0].resource === p1b.p1 &&
            p.recipe.inputs[1].resource === p1a.p1)
        );
      });
      if (!p2) continue;
      const value = Math.min(p1a.value, p1b.value);
      // const e = p2s.find((e) => e.p2 === p2.name);
      // if (e && e.value >= value) continue;
      p2s.push({
        id: uuid(),
        p2: p2.name,
        p1s: [p1a, p1b],
        value,
      });
    }
  }
  return p2s;
}
