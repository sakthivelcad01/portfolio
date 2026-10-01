export function resolveRoute(pathname, projects) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (path === "/work") return "work";
  const match = path.match(/^\/work\/([^/]+)(?:\/story)?$/);
  return match && projects.some(project => project.id === match[1]) ? "work" : "not-found";
}
