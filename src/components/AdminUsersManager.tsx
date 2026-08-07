"use client";

import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, Save, Trash2, UserCog, UserPlus } from "lucide-react";
import { deleteAdminUser, saveAdminUser, type SaveAdminUserResult } from "@/app/admin/actions";
import {
  adminUserLocales,
  adminUserRoles,
  adminUserStatuses,
  getAdminUserRoleLabel,
  getAdminUserStatusLabel
} from "@/lib/admin-users";
import type { AdminUserRow } from "@/lib/admin-data";

type Mode = "create" | "update";

type UserFormValue = {
  country: string;
  email: string;
  fullName: string;
  password: string;
  preferredLocale: string;
  role: string;
  status: string;
};

const emptyForm: UserFormValue = {
  country: "",
  email: "",
  fullName: "",
  password: "",
  preferredLocale: "ko",
  role: "user",
  status: "active"
};

export function AdminUsersManager({ users }: { users: AdminUserRow[] }) {
  const [mode, setMode] = useState<Mode>("create");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [formValue, setFormValue] = useState<UserFormValue>(emptyForm);
  const [result, setResult] = useState<SaveAdminUserResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId, users]
  );

  function switchToCreate() {
    setMode("create");
    setSelectedUserId("");
    setFormValue(emptyForm);
    setResult(null);
  }

  function selectUser(user: AdminUserRow) {
    setMode("update");
    setSelectedUserId(user.id);
    setFormValue({
      country: user.country,
      email: user.email === "-" ? "" : user.email,
      fullName: user.name === user.email ? "" : user.name,
      password: "",
      preferredLocale: user.preferredLocale || "ko",
      role: user.role,
      status: user.status
    });
    setResult(null);
  }

  function updateField(name: keyof UserFormValue, value: string) {
    setFormValue((current) => ({ ...current, [name]: value }));
    setResult(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const nextResult = await saveAdminUser({
        ...formValue,
        mode,
        userId: selectedUserId
      });
      setResult(nextResult);

      if (nextResult.ok && mode === "create") {
        setFormValue(emptyForm);
      }
    });
  }

  function handleDelete() {
    if (!selectedUserId) {
      return;
    }

    const confirmed = window.confirm("선택한 사용자를 삭제 상태로 변경할까요?");

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const nextResult = await deleteAdminUser({ userId: selectedUserId });
      setResult(nextResult);

      if (nextResult.ok) {
        switchToCreate();
      }
    });
  }

  return (
    <section className="admin-users-crud">
      <div className="admin-user-list" aria-label="사용자 선택 목록">
        <button className={mode === "create" ? "is-active" : undefined} onClick={switchToCreate} type="button">
          <UserPlus size={17} />
          <span>
            <strong>새 사용자 등록</strong>
            <small>Auth 계정과 프로필 생성</small>
          </span>
          <em>create</em>
        </button>
        {users.map((user) => (
          <button
            className={selectedUserId === user.id ? "is-active" : undefined}
            key={user.id}
            onClick={() => selectUser(user)}
            type="button"
          >
            <UserCog size={17} />
            <span>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </span>
            <em>{getAdminUserRoleLabel(user.role)}</em>
          </button>
        ))}
      </div>

      <form className="admin-user-role-form" onSubmit={handleSubmit} noValidate>
        <div className="admin-editor-heading">
          {mode === "create" ? <UserPlus size={22} /> : <UserCog size={22} />}
          <div>
            <h3>{mode === "create" ? "새 사용자 등록" : selectedUser?.name ?? "사용자 수정"}</h3>
            <p>
              {mode === "create"
                ? "이메일/비밀번호로 로그인 가능한 회원을 만들고 기본 권한을 지정합니다."
                : `${selectedUser?.email ?? ""} · ${selectedUser?.lastLoginAt ?? ""}`}
            </p>
          </div>
        </div>

        <div className="admin-editor-grid">
          <label>
            이름
            <input
              name="fullName"
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="홍길동"
              value={formValue.fullName}
            />
          </label>
          <label>
            이메일
            <input
              name="email"
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="member@example.com"
              type="email"
              value={formValue.email}
            />
          </label>
          {mode === "create" ? (
            <label>
              임시 비밀번호
              <input
                name="password"
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="8자 이상"
                type="password"
                value={formValue.password}
              />
            </label>
          ) : null}
          <label>
            국가
            <input
              name="country"
              onChange={(event) => updateField("country", event.target.value)}
              placeholder="Korea"
              value={formValue.country}
            />
          </label>
          <label>
            선호 언어
            <select
              name="preferredLocale"
              onChange={(event) => updateField("preferredLocale", event.target.value)}
              value={formValue.preferredLocale}
            >
              {adminUserLocales.map((locale) => (
                <option key={locale} value={locale}>
                  {locale.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label>
            권한
            <select name="role" onChange={(event) => updateField("role", event.target.value)} value={formValue.role}>
              {adminUserRoles.map((role) => (
                <option key={role} value={role}>
                  {getAdminUserRoleLabel(role)}
                </option>
              ))}
            </select>
          </label>
          <label>
            상태
            <select
              name="status"
              onChange={(event) => updateField("status", event.target.value)}
              value={formValue.status}
            >
              {adminUserStatuses.map((status) => (
                <option key={status} value={status}>
                  {getAdminUserStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {result ? (
          <div className={result.ok ? "form-success" : "form-error full"} role="status">
            {result.ok ? <CheckCircle2 size={20} /> : null}
            <span>{result.message}</span>
          </div>
        ) : null}

        <div className="admin-editor-actions">
          <button className="primary-button" disabled={isPending} type="submit">
            <Save size={16} />
            <span>{isPending ? "..." : mode === "create" ? "사용자 등록" : "사용자 수정"}</span>
          </button>
          {mode === "update" ? (
            <button className="secondary-button danger" disabled={isPending} onClick={handleDelete} type="button">
              <Trash2 size={16} />
              <span>삭제 상태로 변경</span>
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
