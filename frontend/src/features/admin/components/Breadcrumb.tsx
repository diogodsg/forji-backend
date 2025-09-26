import { FiChevronRight, FiHome } from "react-icons/fi";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface Props {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: Props) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      <FiHome className="w-4 h-4" />
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          {index > 0 && <FiChevronRight className="w-4 h-4" />}
          {item.current ? (
            <span className="font-medium text-gray-900">{item.label}</span>
          ) : item.href ? (
            <a
              href={item.href}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
