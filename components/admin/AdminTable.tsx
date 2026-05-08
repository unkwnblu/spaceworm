import { ReactNode } from "react";
import AdminEmptyState from "./AdminEmptyState";

type Props = {
  columns: string[];
  children: ReactNode;
  isEmpty?: boolean;
  emptyLabel?: string;
};

export default function AdminTable({ columns, children, isEmpty, emptyLabel }: Props) {
  return (
    <div className="overflow-hidden border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          {!isEmpty && <tbody className="divide-y divide-zinc-100">{children}</tbody>}
        </table>
      </div>
      {isEmpty && (
        <AdminEmptyState message={emptyLabel ?? "No records found"} />
      )}
    </div>
  );
}
