import stylesModule from "@/shared/styles/styles.module.css";

export { default as styles } from "@/shared/styles/styles.module.css";

export function cx(...values) {
  const tokens = [];

  for (const value of values.flat(Infinity)) {
    if (!value) {
      continue;
    }

    if (typeof value === "string") {
      tokens.push(...value.split(/\s+/).filter(Boolean));
      continue;
    }

    if (typeof value === "object") {
      for (const [token, enabled] of Object.entries(value)) {
        if (enabled) {
          tokens.push(token);
        }
      }
    }
  }

  return tokens.map((token) => stylesModule[token] ?? token).join(" ");
}
