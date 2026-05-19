"use client";

import { useState } from "react";
import { Button, Form, Input, Label, TextField } from "react-aria-components";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import styles from "./login-page.module.css";

export function LoginPage() {
  const { signIn } = useAuthSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const didSignIn = signIn(username, password);

    if (!didSignIn) {
      setErrorMessage("Username hoặc password chưa đúng.");
      return;
    }

    setErrorMessage("");
  }

  return (
    <main className={styles.root}>
      <section className={styles.panel} aria-labelledby="login-title">
        <div className={styles.brand}>
          <span aria-hidden="true">MM</span>
          <div>
            <p>Our Memory Map</p>
            <h1 id="login-title">Đăng nhập</h1>
          </div>
        </div>

        <Form className={styles.form} validationErrors={{ login: errorMessage }} onSubmit={handleSubmit}>
          <TextField
            className={styles.field}
            name="username"
            value={username}
            isRequired
            onChange={(value) => {
              setUsername(value);
              setErrorMessage("");
            }}
          >
            <Label>Username</Label>
            <Input autoComplete="username" placeholder="Nhập username" />
          </TextField>

          <TextField
            className={styles.field}
            name="password"
            value={password}
            isRequired
            onChange={(value) => {
              setPassword(value);
              setErrorMessage("");
            }}
          >
            <Label>Password</Label>
            <Input autoComplete="current-password" placeholder="Nhập password" type="password" />
          </TextField>

          {errorMessage ? (
            <p className={styles.error} role="alert">
              {errorMessage}
            </p>
          ) : null}

          <Button className={styles.submitButton} type="submit">
            Đăng nhập
          </Button>
        </Form>
      </section>
    </main>
  );
}
