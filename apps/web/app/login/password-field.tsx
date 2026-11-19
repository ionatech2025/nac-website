"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./login.module.css";

type Props = {
  id?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  label?: string;
};

export function PasswordField({
  id = "password",
  name = "password",
  autoComplete = "current-password",
  required = true,
  label = "Password",
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <label className={styles.label} htmlFor={id}>
      {label}
      <span className={styles.passwordWrap}>
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          className={styles.input}
        />
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      </span>
    </label>
  );
}
