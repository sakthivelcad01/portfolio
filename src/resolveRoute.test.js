import test from "node:test";
import assert from "node:assert/strict";
import { resolveRoute } from "./resolveRoute.js";

const projects = ["01", "02", "03", "04"].map(id => ({ id }));
test("home, work and all project routes remain available", () => {
  assert.equal(resolveRoute("/", projects), "home");
  for (const path of ["/work", "/work/", ...projects.flatMap(({ id }) =>
    [`/work/${id}`, `/work/${id}/`, `/work/${id}/story`, `/work/${id}/story/`])]) {
    assert.equal(resolveRoute(path, projects), "work", path);
  }
});
test("unknown paths do not fall through to home or work", () => {
  for (const path of ["/404", "/missing", "/workshop", "/work/99", "/work/99/story", "/work/01/missing", "/work/01/story/missing"]) {
    assert.equal(resolveRoute(path, projects), "not-found", path);
  }
});
