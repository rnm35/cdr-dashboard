import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { fieldErrors } from "@/lib/api";
import { AuthLayout, Field, FormMessage } from "./AuthLayout";

export default function LoginPage() {
  const { login, notice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setMessage(null);
    try {
      await login(form.email, form.password);
      const from = location.state?.from;
      navigate(from ? `${from.pathname}${from.search}` : "/", { replace: true });
    } catch (error) {
      setErrors(fieldErrors(error));
      setMessage(error.details ? null : error.message);
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Sign in" description="Sign in to view the call analytics dashboard.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormMessage tone="info">{!message && notice}</FormMessage>
        <FormMessage>{message}</FormMessage>
        <Field id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
        </Field>
        <Field id="password" label="Password" error={errors.password}>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={update}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            required
          />
        </Field>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
        <p className="text-sm text-muted-foreground">
          No account?{" "}
          <Link to="/signup" className="text-foreground underline underline-offset-4">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
