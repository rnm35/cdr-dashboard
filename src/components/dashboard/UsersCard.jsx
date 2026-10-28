import { useEffect, useState } from "react";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

const joined = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

// admin only
export function UsersCard({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .users(controller.signal)
      .then(({ data }) => {
        setUsers(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setMessage(error.message);
        setStatus("error");
      });
    return () => controller.abort();
  }, []);

  async function changeRole(user, role) {
    setSavingId(user.id);
    setMessage(null);
    try {
      const { data } = await api.updateUserRole(user.id, role);
      setUsers((current) => current.map((u) => (u.id === data.id ? data : u)));
      setMessage(`${data.name} is now ${data.role === "admin" ? "an admin" : "an analyst"}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      {message && (
        <p role="status" className="mb-4 border px-4 py-2 text-sm">
          {message}
        </p>
      )}
      {status === "loading" ? (
        <p className="text-sm text-muted-foreground">Loading users...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-40">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                    {isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="tabular-nums">{joined.format(new Date(user.createdAt))}</TableCell>
                  <TableCell>
                    <NativeSelect
                      aria-label={`Role for ${user.name}`}
                      value={user.role}
                      disabled={isSelf || savingId === user.id}
                      title={isSelf ? "You can't change your own role" : undefined}
                      onChange={(event) => changeRole(user, event.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="analyst">Analyst</option>
                    </NativeSelect>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
