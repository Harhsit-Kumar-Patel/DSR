import React from 'react';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends object>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No records found',
  className = ''
}: DataTableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse" style={{ background: 'transparent' }}>
        <thead>
          <tr 
            style={{
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-def)'
            }}
          >
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  padding: '10px 14px',
                  fontSize: '10px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                  width: col.width,
                  textAlign: col.align || 'left'
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="text-center py-10"
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--border-def)'
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => {
              const rowKey = (row as any).id ?? (row as any).channel ?? (row as any).code ?? rowIdx;
              return (
                <tr
                  key={String(rowKey)}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  borderBottom: '1px solid var(--border-def)',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease'
                }}
                className="hover:bg-[var(--bg-element)]"
              >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      style={{
                        padding: '12px 14px',
                        fontSize: '13px',
                        fontWeight: 400,
                        color: 'var(--text-pri)',
                        textAlign: col.align || 'left'
                      }}
                    >
                      {col.cell ? col.cell(row) : col.accessorKey ? String((row as any)[col.accessorKey] ?? '') : null}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
