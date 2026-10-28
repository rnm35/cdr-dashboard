import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";

export function AuthLayout({ title, description, children }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <span className="font-serif text-lg">Call Analytics</span>
          <Button size="sm" variant="outline" onClick={toggleTheme}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </main>
    </div>
  );
}

export function Field({ id, label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormMessage({ tone = "error", children }) {
  if (!children) return null;
  const styles = tone === "error" ? "border-destructive/40 text-destructive" : "border-border text-muted-foreground";
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`border px-3 py-2 text-sm ${styles}`}>
      {children}
    </p>
  );
}
