/**
 * @typedef {object} AuthAccount
 * @property {string} id
 * @property {string} username
 * @property {string} password
 * @property {string} displayName
 * @property {string} shortName
 * @property {string} role
 * @property {string} accent
 * @property {string} initials
 */

export const AUTH_STORAGE_KEY = "memory-map:active-account";

/** @type {AuthAccount[]} */
export const AUTH_ACCOUNTS = [
  {
    id: "xuan-tien",
    username: "capybara",
    password: "xuantien",
    displayName: "Xuân Tiến",
    shortName: "Tiến",
    role: "Nam",
    accent: "#2f7ee6",
    initials: "XT"
  },
  {
    id: "hieu-thao",
    username: "htxd_mmxd",
    password: "hieuthao",
    displayName: "Hiếu Thảo",
    shortName: "Thảo",
    role: "Nữ",
    accent: "#d83f87",
    initials: "HT"
  }
];

/**
 * @param {string | null | undefined} accountId
 * @returns {AuthAccount | null}
 */
export function getAuthAccount(accountId) {
  return AUTH_ACCOUNTS.find((account) => account.id === accountId) ?? null;
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {AuthAccount | null}
 */
export function authenticateAccount(username, password) {
  const normalizedUsername = String(username ?? "").trim().toLowerCase();
  const normalizedPassword = String(password ?? "").trim();

  return (
    AUTH_ACCOUNTS.find((account) => {
      return account.username === normalizedUsername && account.password === normalizedPassword;
    }) ?? null
  );
}
