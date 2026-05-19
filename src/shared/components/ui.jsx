"use client";

import {
  Button,
  Input,
  Label,
  Link,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  TextArea,
  TextField
} from "react-aria-components";
import { cx } from "@/shared/lib/cx";
import styles from "./ui.module.css";

/**
 * @typedef {object} PageHeaderProps
 * @property {string} [eyebrow]
 * @property {string} title
 * @property {string} [description]
 * @property {import("react").ReactNode} [action]
 */

/**
 * @param {PageHeaderProps} props
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  action
}) {
  return (
    <header className={cx(styles.pageHeader, "gap-4")}>
      <div>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.pageTitle}>{title}</h1>
        {description ? <p className={styles.pageDescription}>{description}</p> : null}
      </div>
      {action ? <div className={cx(styles.headerAction, "shrink-0")}>{action}</div> : null}
    </header>
  );
}

/**
 * @param {{ href: string, children: import("react").ReactNode }} props
 */
export function PrimaryLink({ href, children }) {
  return (
    <Link href={href} className={cx(styles.button, styles.primaryButton, "gap-2")}>
      <span aria-hidden="true">+</span>
      {children}
    </Link>
  );
}

/**
 * @param {{ href: string, children: import("react").ReactNode }} props
 */
export function SecondaryLink({ href, children }) {
  return (
    <Link href={href} className={cx(styles.button, styles.secondaryButton)}>
      {children}
    </Link>
  );
}

/**
 * @typedef {object} FieldProps
 * @property {string} ["aria-label"]
 * @property {string} [className]
 * @property {string} [defaultValue]
 * @property {string} [description]
 * @property {string} [inputClassName]
 * @property {boolean} [isRequired]
 * @property {string} [label]
 * @property {function(string): void} [onChange]
 * @property {string} [placeholder]
 * @property {string} [type]
 * @property {string} [value]
 */

/**
 * @param {FieldProps} props
 */
export function Field({
  "aria-label": ariaLabel,
  className = cx(styles.field, "gap-2"),
  defaultValue,
  description,
  inputClassName,
  isRequired,
  label,
  onChange,
  placeholder,
  type = "text",
  value
}) {
  return (
    <TextField
      className={className}
      defaultValue={defaultValue}
      isRequired={isRequired}
      onChange={onChange}
      value={value}
    >
      {label ? <Label>{label}</Label> : null}
      <Input
        aria-label={ariaLabel}
        className={inputClassName}
        placeholder={placeholder}
        type={type}
      />
      {description ? <p className={styles.fieldHint}>{description}</p> : null}
    </TextField>
  );
}

/**
 * @typedef {object} TextAreaFieldProps
 * @property {string} ["aria-label"]
 * @property {string} [className]
 * @property {string} [defaultValue]
 * @property {string} [description]
 * @property {boolean} [isRequired]
 * @property {string} [label]
 * @property {function(string): void} [onChange]
 * @property {string} [placeholder]
 * @property {number} [rows]
 * @property {string} [value]
 */

/**
 * @param {TextAreaFieldProps} props
 */
export function TextAreaField({
  "aria-label": ariaLabel,
  className = cx(styles.field, "gap-2"),
  defaultValue,
  description,
  isRequired,
  label,
  onChange,
  placeholder,
  rows,
  value
}) {
  return (
    <TextField
      className={className}
      defaultValue={defaultValue}
      isRequired={isRequired}
      onChange={onChange}
      value={value}
    >
      {label ? <Label>{label}</Label> : null}
      <TextArea aria-label={ariaLabel} placeholder={placeholder} rows={rows} />
      {description ? <p className={styles.fieldHint}>{description}</p> : null}
    </TextField>
  );
}

/**
 * @typedef {object} SelectFieldProps
 * @property {import("react").ReactNode} children
 * @property {string} [className]
 * @property {string} [defaultSelectedKey]
 * @property {string} [label]
 * @property {function(string): void} [onSelectionChange]
 * @property {string} [selectedKey]
 */

/**
 * @param {SelectFieldProps} props
 */
export function SelectField({
  children,
  className = cx(styles.field, styles.selectField, "min-w-0 gap-2"),
  defaultSelectedKey,
  label,
  onSelectionChange,
  selectedKey
}) {
  return (
    <Select
      className={className}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={(key) => onSelectionChange?.(String(key))}
      selectedKey={selectedKey}
    >
      {label ? <Label>{label}</Label> : null}
      <Button className={cx(styles.selectTrigger, "min-h-[42px] w-full gap-2")}>
        <SelectValue />
        <span className={cx(styles.selectIcon, "size-[18px] shrink-0")} aria-hidden="true">⌄</span>
      </Button>
      <Popover className={styles.popover}>
        <ListBox className={styles.listbox}>{children}</ListBox>
      </Popover>
    </Select>
  );
}

/**
 * @param {{ children: import("react").ReactNode, id: string, textValue?: string }} props
 */
export function SelectItem({ children, id, textValue }) {
  return (
    <ListBoxItem className={styles.listboxItem} id={id} textValue={textValue ?? String(children)}>
      {children}
    </ListBoxItem>
  );
}

/**
 * @param {{ label: string, value: string | number, accent?: string }} props
 */
export function StatCard({
  label,
  value,
  accent
}) {
  return (
    <div className={cx(styles.statCard, "min-h-[94px] p-4")} style={accent ? { borderColor: accent } : undefined}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
