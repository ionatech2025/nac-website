"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./account.module.css";

type Props = {
  id: string;
  name: string;
  autoComplete?: string;
  required?: boolean;
};

/** Show/hide toggle for admin account password fields. */
export function PasswordInput({
  id,
  name,
  autoComplete = "current-password",
  required = true,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <span className={styles.passwordWrap}>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required={required}
      />
      <button
        type="button"
        className={styles.passwordToggle}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
      </button>
    </span>
  );
}
