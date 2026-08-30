const FALLBACK_ADMIN_EMAILS = [
  "williamdunnagan1957@gmail.com",
  "motarabo99@gmail.com",
];

export function getAdminEmails() {
  const fromEnv = process.env.ADMIN_EMAILS?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return fromEnv && fromEnv.length > 0 ? fromEnv : FALLBACK_ADMIN_EMAILS;
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export function isAdminUser(
  user: { email?: string | null },
  profile?: { role?: string | null } | null,
) {
  return isAdminEmail(user.email) || profile?.role === "admin";
}
