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
import { cx } from "@/shared/lib/styles";

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
    <header className={cx("page-header")}>
      <div>
        {eyebrow ? <p className={cx("eyebrow")}>{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className={cx("header-action")}>{action}</div> : null}
    </header>
  );
}

/**
 * @param {{ href: string, children: import("react").ReactNode }} props
 */
export function PrimaryLink({ href, children }) {
  return (
    <Link href={href} className={cx("btn btn-primary")}>
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
    <Link href={href} className={cx("btn btn-secondary")}>
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
  className = cx("field"),
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
      {description ? <p className={cx("field-hint")}>{description}</p> : null}
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
  className = cx("field"),
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
      {description ? <p className={cx("field-hint")}>{description}</p> : null}
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
  className = cx("field aria-select"),
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
      <Button className={cx("aria-select-trigger")}>
        <SelectValue />
        <span className={cx("aria-select-icon")} aria-hidden="true">⌄</span>
      </Button>
      <Popover className={cx("aria-popover")}>
        <ListBox className={cx("aria-listbox")}>{children}</ListBox>
      </Popover>
    </Select>
  );
}

/**
 * @param {{ children: import("react").ReactNode, id: string, textValue?: string }} props
 */
export function SelectItem({ children, id, textValue }) {
  return (
    <ListBoxItem className={cx("aria-listbox-item")} id={id} textValue={textValue ?? String(children)}>
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
    <div className={cx("stat-card")} style={accent ? { borderColor: accent } : undefined}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
