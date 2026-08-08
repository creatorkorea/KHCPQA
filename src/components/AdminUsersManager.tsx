"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Pencil, Save, ShieldCheck, Trash2, UserCog, UserPlus, X } from "lucide-react";
import { deleteAdminUser, saveAdminUser, type SaveAdminUserResult } from "@/app/admin/actions";
import { getCourses } from "@/lib/content";
import { countryOptions, getCountryDialCode, getCountryPhonePlaceholder } from "@/lib/countries";
import { formatPhoneNumber } from "@/lib/phone";
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
  interestedCourse: string;
  marketingOptIn: boolean;
  password: string;
  phone: string;
  preferredLocale: string;
  role: string;
  status: string;
};

const emptyForm: UserFormValue = {
  country: "",
  email: "",
  fullName: "",
  interestedCourse: "",
  marketingOptIn: false,
  password: "",
  phone: "",
  preferredLocale: "ko",
  role: "user",
  status: "active"
};

export function AdminUsersManager({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const courseOptions = getCourses("ko");
  const [mode, setMode] = useState<Mode>("create");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [formValue, setFormValue] = useState<UserFormValue>(emptyForm);
  const [result, setResult] = useState<SaveAdminUserResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;
  const activeCount = users.filter((user) => user.status === "active").length;
  const suspendedCount = users.filter((user) => user.status === "suspended").length;
  const deletedCount = users.filter((user) => user.status === "deleted").length;

  function openCreateModal() {
    setMode("create");
    setSelectedUserId("");
    setFormValue(emptyForm);
    setResult(null);
    setIsModalOpen(true);
  }

  function openEditModal(user: AdminUserRow) {
    setMode("update");
    setSelectedUserId(user.id);
    setFormValue({
      country: user.country,
      email: user.email === "-" ? "" : user.email,
      fullName: user.name === user.email ? "" : user.name,
      interestedCourse: user.interestedCourse,
      marketingOptIn: user.marketingOptIn,
      password: "",
      phone: formatPhoneNumber(user.phone, user.country),
      preferredLocale: user.preferredLocale || "ko",
      role: user.role,
      status: user.status
    });
    setResult(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isPending) {
      return;
    }

    setIsModalOpen(false);
    setResult(null);
  }

  function updateField<Key extends keyof UserFormValue>(name: Key, value: UserFormValue[Key]) {
    setFormValue((current) => ({ ...current, [name]: value }));
    setResult(null);
  }

  function updateCountry(value: string) {
    setFormValue((current) => ({
      ...current,
      country: value,
      phone: current.phone ? formatPhoneNumber(current.phone, value) : current.phone
    }));
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

      if (nextResult.ok) {
        setIsModalOpen(false);
        setFormValue(emptyForm);
        router.refresh();
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
        setIsModalOpen(false);
        setSelectedUserId("");
        setFormValue(emptyForm);
        router.refresh();
      }
    });
  }

  return (
    <section className="admin-users-manager">
      <div className="admin-users-toolbar">
        <div className="admin-users-summary" aria-label="사용자 상태 요약">
          <span><strong>{users.length}</strong>전체</span>
          <span><strong>{activeCount}</strong>활성</span>
          <span><strong>{suspendedCount}</strong>정지</span>
          <span><strong>{deletedCount}</strong>삭제</span>
        </div>
        <button className="admin-users-new-button" onClick={openCreateModal} type="button">
          <UserPlus size={15} />
          새 사용자
        </button>
      </div>

      <div className="admin-users-table-wrap">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
              <th>상태</th>
              <th>수정일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user) => (
                <tr className={user.status === "deleted" ? "is-deleted" : undefined} key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                    <span>{user.preferredLocale.toUpperCase()} · {user.country || "-"} · {user.phone ? formatPhoneNumber(user.phone, user.country) : "연락처 없음"}</span>
                  </td>
                  <td>{user.email}</td>
                  <td>{getAdminUserRoleLabel(user.role)}</td>
                  <td>
                    <span className={`admin-user-status is-${user.status}`}>{getAdminUserStatusLabel(user.status)}</span>
                  </td>
                  <td>{user.lastLoginAt}</td>
                  <td>
                    <button className="admin-users-edit-button" onClick={() => openEditModal(user)} type="button">
                      <Pencil size={14} />
                      수정
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>
                  <div className="console-empty-state" role="status">
                    <UserCog size={18} />
                    <span>등록된 사용자 데이터가 없습니다.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <div
          className="admin-users-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <form className="admin-users-modal" onSubmit={handleSubmit} noValidate role="dialog" aria-modal="true" aria-labelledby="admin-user-modal-title">
            <div className="admin-users-modal-heading">
              {mode === "create" ? <UserPlus size={22} /> : <UserCog size={22} />}
              <div>
                <h3 id="admin-user-modal-title">{mode === "create" ? "새 사용자 등록" : selectedUser?.name ?? "사용자 수정"}</h3>
                <p>
                  {mode === "create"
                    ? "로그인 가능한 회원을 만들고 기본 권한을 지정합니다."
                    : `${selectedUser?.email ?? ""} · ${selectedUser?.lastLoginAt ?? ""}`}
                </p>
              </div>
              <span className={`admin-users-mode-badge is-${mode === "create" ? "create" : formValue.status}`}>
                {mode === "create" ? "등록" : getAdminUserStatusLabel(formValue.status)}
              </span>
              <button className="admin-users-modal-close" onClick={closeModal} type="button" aria-label="닫기">
                <X size={17} />
              </button>
            </div>

            <div className="admin-users-form-section">
              <div className="admin-users-form-section-title">
                <UserCog size={16} />
                <strong>기본 정보</strong>
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
                  <select
                    name="country"
                    onChange={(event) => updateCountry(event.target.value)}
                    value={formValue.country}
                  >
                    <option value="">국가 선택</option>
                    {countryOptions.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.labels.ko}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  휴대폰
                  <div className="phone-input-group">
                    <span className="phone-dial-code">{getCountryDialCode(formValue.country) || "+"}</span>
                    <input
                      name="phone"
                      onBlur={(event) => updateField("phone", formatPhoneNumber(event.target.value, formValue.country))}
                      onChange={(event) => updateField("phone", event.target.value)}
                      placeholder={formValue.country ? getCountryPhonePlaceholder(formValue.country) : "010-0000-0000"}
                      type="tel"
                      value={formValue.phone}
                    />
                  </div>
                </label>
                <label>
                  관심 과정
                  <select
                    name="interestedCourse"
                    onChange={(event) => updateField("interestedCourse", event.target.value)}
                    value={formValue.interestedCourse}
                  >
                    <option value="">관심 과정 없음</option>
                    {courseOptions.map((course) => (
                      <option key={course.slug} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="checkbox full">
                  <input
                    checked={formValue.marketingOptIn}
                    name="marketingOptIn"
                    onChange={(event) => updateField("marketingOptIn", event.target.checked)}
                    type="checkbox"
                  />
                  <span>마케팅 정보 수신 동의</span>
                </label>
              </div>
            </div>

            <div className="admin-users-form-section">
              <div className="admin-users-form-section-title">
                <ShieldCheck size={16} />
                <strong>권한 설정</strong>
              </div>
              <div className="admin-editor-grid">
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
        </div>
      ) : null}
    </section>
  );
}
