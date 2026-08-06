"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import type { AccountInquiry } from "@/lib/account-data";
import { getCopy, type Locale } from "@/lib/content";

function getShortReceipt(receipt: string) {
  const parts = receipt.split("-");

  return parts.length > 3 ? `${parts[0]}-${parts[1]}-${parts[2]}` : receipt;
}

export function InquiryHistoryPanel({ items, locale }: { items: AccountInquiry[]; locale: Locale }) {
  const t = getCopy(locale);
  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>([[t.account.inquiries.allLabel, items.length]]);

    items.forEach((item) => {
      counts.set(item.status, (counts.get(item.status) ?? 0) + 1);
    });

    return counts;
  }, [items, t.account.inquiries.allLabel]);
  const statuses = useMemo(() => Array.from(statusCounts.keys()), [statusCounts]);
  const [activeStatus, setActiveStatus] = useState(statuses[0]);
  const visibleItems =
    activeStatus === t.account.inquiries.allLabel
      ? items
      : items.filter((item) => item.status === activeStatus);

  return (
    <section className="inquiry-history-panel">
      <div className="inquiry-filter-tabs" role="tablist" aria-label={t.account.inquiries.statusLabel}>
        {statuses.map((status) => (
          <button
            aria-selected={activeStatus === status}
            className={activeStatus === status ? "is-active" : undefined}
            key={status}
            onClick={() => setActiveStatus(status)}
            role="tab"
            type="button"
          >
            <span>{status}</span>
            <b>{statusCounts.get(status) ?? 0}</b>
          </button>
        ))}
      </div>
      <div className="inquiry-list">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <article key={item.receipt}>
              <header>
                <ClipboardList size={20} />
                <div>
                  <strong>{item.type}</strong>
                  <span title={item.receipt}>{getShortReceipt(item.receipt)}</span>
                </div>
                <em>{item.status}</em>
              </header>
              <dl>
                <div>
                  <dt>{t.account.inquiries.receiptLabel}</dt>
                  <dd className="receipt-code">{item.receipt}</dd>
                </div>
                <div>
                  <dt>{t.account.inquiries.typeLabel}</dt>
                  <dd>{item.type}</dd>
                </div>
                <div>
                  <dt>{t.account.inquiries.submittedLabel}</dt>
                  <dd>{item.submittedAt}</dd>
                </div>
                <div>
                  <dt>{t.account.inquiries.statusLabel}</dt>
                  <dd>{item.status}</dd>
                </div>
              </dl>
              <p>
                <span>{t.account.inquiries.messageLabel}</span>
                {item.message}
              </p>
            </article>
          ))
        ) : (
          <div className="inquiry-empty-state" role="status">
            {t.account.inquiries.emptyState}
          </div>
        )}
      </div>
    </section>
  );
}
