import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { fieldErrors } from "@/lib/api";
import { AuthLayout, Field, FormMessage } from "./AuthLayout";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);
    if (form.password !== form.confirm) {
      setErrors({ confirm: "The passwords don't match." });
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      await signup(form.name, form.email, form.password);
      navigate("/", { replace: true });
    } catch (error) {
      setErrors(fieldErrors(error));
      setMessage(error.details ? null : error.message);
      setSubmitting(false);
    }
  }

  const describedBy = (field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <AuthLayout title="Create an account" description="New accounts have analyst access. An admin can change your role.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormMessage>{message}</FormMessage>
        <Field id="name" label="Name" error={errors.name}>
          <Input id="name" name="name" autoComplete="name" value={form.name} onChange={update}
            aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} required />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={update}
            aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} required />
        </Field>
        <Field id="password" label="Password" error={errors.password}>
          <Input id="password" name="password" type="password" autoComplete="new-password" value={form.password}
            onChange={update} aria-invalid={Boolean(errors.password)} aria-describedby={describedBy("password")} required />
          {!errors.password && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
        </Field>
        <Field id="confirm" label="Confirm password" error={errors.confirm}>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" value={form.confirm}
            onChange={update} aria-invalid={Boolean(errors.confirm)} aria-describedby={describedBy("confirm")} required />
        </Field>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
