import { readFileSync } from "fs";
import { join } from "path";

function readJson(path) {
  const r = readFileSync(join(process.cwd(), path));
  return JSON.parse(r.toString("ascii"));
}

function buildLang() {
  const p1Json = readJson("src/assets/json/planet-development/p1.json");
  const p2Json = readJson("src/assets/json/planet-development/p2.json");
  const ps = p1Json.concat(p2Json);
  const r = {};
  ps.forEach((e) => {
    r[e.name] = e.name;
  });
  console.log("lang json", JSON.stringify(r));
}

buildLang();
