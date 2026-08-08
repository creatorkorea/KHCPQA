import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("signup collects structured profile metadata with country select", async () => {
  const source = await readFile("src/components/SignupForm.tsx", "utf8");

  assert.match(source, /name="phone"/);
  assert.match(source, /name="country"/);
  assert.match(source, /countryOptions\.map/);
  assert.match(source, /name="interestedCourse"/);
  assert.match(source, /name="marketingOptIn"/);
  assert.match(source, /interested_course: form\.interestedCourse/);
  assert.match(source, /marketing_opt_in: form\.marketingOptIn/);
  assert.match(source, /phone: form\.phone/);
});

test("profile edit persists the same structured fields", async () => {
  const source = await readFile("src/components/ProfileEditForm.tsx", "utf8");

  assert.match(source, /name="phone"/);
  assert.match(source, /name="country"/);
  assert.match(source, /countryOptions\.map/);
  assert.match(source, /name="interestedCourse"/);
  assert.match(source, /name="marketingOptIn"/);
  assert.match(source, /interested_course: form\.interestedCourse\.trim\(\) \|\| null/);
  assert.match(source, /marketing_opt_in: form\.marketingOptIn/);
  assert.match(source, /phone: form\.phone\.trim\(\)/);
});

test("profile migration stores signup metadata in public profiles", async () => {
  const migration = await readFile("supabase/migrations/202608080001_extend_profile_registration_fields.sql", "utf8");

  assert.match(migration, /add column if not exists phone text/);
  assert.match(migration, /add column if not exists interested_course text/);
  assert.match(migration, /add column if not exists marketing_opt_in boolean not null default false/);
  assert.match(migration, /new\.raw_user_meta_data ->> 'phone'/);
  assert.match(migration, /new\.raw_user_meta_data ->> 'interested_course'/);
  assert.match(migration, /new\.raw_user_meta_data ->> 'marketing_opt_in'/);
});
