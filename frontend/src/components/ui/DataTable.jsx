import { Inbox } from "lucide-react";
import { cn } from "../../lib/utils";

export function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", text }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ocean-100 ring-1 ring-ocean-200">
        <Icon className="h-6 w-6 text-ocean-700" />
      </span>
      <p className="font-700 text-sky-950">{title}</p>
      {text && <p className="max-w-xs text-sm text-sky-900/55">{text}</p>}
    </div>
  );
}

export default function DataTable({ columns, rows, rowKey, empty }) {
  if (!rows?.length) return empty || <EmptyState />;
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ocean-100 bg-ocean-50/60 text-left text-xs uppercase tracking-wider text-sky-900/50">
              {columns.map((c) => (
                <th key={c.key} className={cn("px-4 py-3 font-medium", c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={rowKey ? rowKey(r) : i}
                className="border-b border-ocean-100/70 transition-colors last:border-0 hover:bg-ocean-50/70"
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-3 text-sky-900/75", c.className)}>
                    {c.cell ? c.cell(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
