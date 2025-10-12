interface XpCategoryProps {
  title: string;
  percentage: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  children: React.ReactNode;
}

export function XpCategory({
  title,
  percentage,
  description,
  icon,
  gradient,
  children,
}: XpCategoryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-300 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} p-5 text-white`}>
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-white/90">
              {percentage} - {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}
