"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import type { AdminPublishEventRow } from "@/lib/admin-data";

type FilterName = "all" | string;

export function AdminPublishEventsTable({ rows }: { rows: AdminPublishEventRow[] }) {
  const [action, setAction] = useState<FilterName>("all");
  const [itemType, setItemType] = useState<FilterName>("all");
  const [status, setStatus] = useState<FilterName>("all");

  const actionOptions = useMemo(() => getOptions(rows.map((row) => row.action)), [rows]);
  const itemTypeOptions = useMemo(() => getOptions(rows.map((row) => row.itemType)), [rows]);
  const statusOptions = useMemo(() => getOptions(rows.map((row) => row.status)), [rows]);

  const filteredRows = rows.filter((row) =>
    (action === "all" || row.action === action) &&
    (itemType === "all" || row.itemType === itemType) &&
    (status === "all" || row.status === status)
  );

  return (
    <section className="admin-table-card">
      <div className="admin-table-header">
        <h3>발행 이력</h3>
        <div className="admin-publish-filters" aria-label="발행 이력 필터">
          <Filter size={15} />
          <select aria-label="작업 필터" onChange={(event) => setAction(event.target.value)} value={action}>
            <option value="all">전체 작업</option>
            {actionOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select aria-label="대상 필터" onChange={(event) => setItemType(event.target.value)} value={itemType}>
            <option value="all">전체 대상</option>
            {itemTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <select aria-label="상태 필터" onChange={(event) => setStatus(event.target.value)} value={status}>
            <option value="all">전체 상태</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="admin-table-scroll">
        <table>
          <thead>
            <tr>
              {["대상", "작업", "제목", "상태", "작업자", "일시"].map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <tr key={`${row.itemType}-${row.action}-${row.title}-${row.updatedAt}-${row.actor}`}>
                  <td>{row.itemType}</td>
                  <td>{row.action}</td>
                  <td>{row.title}</td>
                  <td>{row.status}</td>
                  <td>{row.actor}</td>
                  <td>{row.updatedAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>선택한 조건에 맞는 발행 이력이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function getOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}
