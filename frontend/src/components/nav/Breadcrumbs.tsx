// Breadcrumbs component
import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return null;

  const acc: { label: string; to: string }[] = [];
  parts.forEach((seg, idx) => {
    const to = "/" + parts.slice(0, idx + 1).join("/");
    acc.push({ label: labelFor(seg), to });
  });

  return (
    <nav
      className="text-[11px] text-gray-500 flex items-center gap-1"
      aria-label="Breadcrumb"
    >
      {acc.map((p, i) => {
        const last = i === acc.length - 1;
        return (
          <span key={p.to} className="flex items-center gap-1">
            {!last ? (
              <Link
                to={p.to}
                className="hover:text-gray-700 transition-colors underline-offset-2 hover:underline"
              >
                {p.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{p.label}</span>
            )}
            {!last && <span className="text-gray-400">/</span>}
          </span>
        );
      })}
    </nav>
  );
}

function labelFor(seg: string) {
  if (seg === "me") return "Me";
  if (seg === "prs") return "PRs";
  if (seg === "pdi") return "PDI";
  if (seg === "users") return "Users";
  if (/^\d+$/.test(seg)) return `#${seg}`;
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}
