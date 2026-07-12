"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, Save, ShieldCheck, UserCog } from "lucide-react";
import { updateAdminUserRole, type UpdateAdminUserRoleResult } from "@/app/admin/actions";
import type { AdminUserRow } from "@/lib/admin-data";

const roleOptions = [
  "user",
  "viewer",
  "content_manager",
  "course_manager",
  "certification_manager",
  "inquiry_manager",
  "super_admin"
];

const statusOptions = ["active", "suspended", "deleted"];

type UserRoleDraft = {
  id: string;
  role: string;
  status: string;
};

export function AdminUserRolePreview({ users }: { users: AdminUserRow[] }) {
  const initialDrafts = useMemo(
    () =>
      users.reduce<Record<string, UserRoleDraft>>((drafts, user) => {
        drafts[user.id] = {
          id: user.id,
          role: user.role,
          status: user.status
        };
        return drafts;
      }, {}),
    [users]
  );
  const [drafts, setDrafts] = useState(initialDrafts);
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "");
  const [result, setResult] = useState<UpdateAdminUserRoleResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedUser = users.find((user) => user.id === selectedUserId) ?? users[0];
  const selectedDraft = selectedUser ? drafts[selectedUser.id] : undefined;

  function updateDraft(field: keyof Pick<UserRoleDraft, "role" | "status">, value: string) {
    if (!selectedUser) {
      return;
    }

    setDrafts((current) => ({
      ...current,
      [selectedUser.id]: {
        ...current[selectedUser.id],
        [field]: value
      }
    }));
    setResult(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser || !selectedDraft) {
      return;
    }

    startTransition(async () => {
      const nextResult = await updateAdminUserRole({
        role: selectedDraft.role,
        status: selectedDraft.status,
        userId: selectedUser.id
      });
      setResult(nextResult);
    });
  }

  if (!selectedUser || !selectedDraft) {
    return null;
  }

  return (
    <section className="admin-user-role-panel">
      <div className="admin-user-list" aria-label="회원 목록">
        {users.map((user) => (
          <button
            className={selectedUserId === user.id ? "is-active" : undefined}
            key={user.id}
            onClick={() => {
              setSelectedUserId(user.id);
              setResult(null);
            }}
            type="button"
          >
            <UserCog size={17} />
            <span>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </span>
            <em>{drafts[user.id]?.role}</em>
          </button>
        ))}
      </div>
      <form className="admin-user-role-form" onSubmit={handleSubmit}>
        <div className="admin-editor-heading">
          <ShieldCheck size={22} />
          <div>
            <h3>{selectedUser.name}</h3>
            <p>{selectedUser.email} · 최근 로그인 {selectedUser.lastLoginAt}</p>
          </div>
        </div>
        <div className="admin-editor-grid">
          <label>
            Role
            <select onChange={(event) => updateDraft("role", event.target.value)} value={selectedDraft.role}>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select onChange={(event) => updateDraft("status", event.target.value)} value={selectedDraft.status}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
        {result ? (
          <div className={result.ok ? "form-success" : "form-error full"} role="status">
            <CheckCircle2 size={20} />
            <span>{result.message}</span>
          </div>
        ) : null}
        <button className="primary-button" disabled={isPending} type="submit">
          <Save size={16} />
          <span>{isPending ? "..." : "권한 저장"}</span>
        </button>
      </form>
    </section>
  );
}
