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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-white/80">
              {percentage} - {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">{children}</div>
    </div>
  );
}
