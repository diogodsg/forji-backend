interface JsonViewerProps {
  data: any;
  title: string;
  maxHeight?: string;
}

export function JsonViewer({
  data,
  title,
  maxHeight = "max-h-48",
}: JsonViewerProps) {
  return (
    <div>
      <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
      <pre
        className={`bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto ${maxHeight}`}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
