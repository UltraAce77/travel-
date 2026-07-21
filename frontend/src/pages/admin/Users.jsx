import { useState, useEffect } from "react";
import { Users as UsersIcon, RefreshCw, SlidersHorizontal, Pencil, Plus } from "lucide-react";
import DataTable, { EmptyState } from "../../components/ui/DataTable";
import Spinner from "../../components/ui/Spinner";
import UserTreksModal from "./UserTreksModal";
import EditUserModal from "./EditUserModal";
import AddUserModal from "./AddUserModal";
import { api } from "../../lib/api";
import { money, shortAddr } from "../../lib/utils";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rigUser, setRigUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await api("get", "/user/fetch");
    setUsers(res?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    {
      key: "user",
      header: "User",
      cell: (r) => (
        <div>
          <p className="font-600 text-sky-950">{r.UserName}</p>
          <p className="text-xs text-sky-900/50">{r.Email}</p>
        </div>
      ),
    },
    { key: "TotalBalance", header: "Balance", cell: (r) => <span className="text-sand-600">{money(r.TotalBalance)}</span> },
    { key: "Commission", header: "Commission", cell: (r) => <span className="text-ocean-600">{money(r.Commission)}</span> },
    { key: "ReferredByManager", header: "Manager", cell: (r) => r.ReferredByManager || <span className="text-sky-900/35">—</span> },
    {
      key: "cryptoAddress",
      header: "Wallet",
      cell: (r) =>
        r.cryptoAddress ? (
          <span className="font-mono text-xs text-sky-900/60">{shortAddr(r.cryptoAddress)}</span>
        ) : (
          <span className="text-sky-900/35">—</span>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => setRigUser(r)} className="btn-ghost px-2.5 py-1.5 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Rig treks
          </button>
          <button onClick={() => setEditUser(r)} className="btn-ghost px-2.5 py-1.5 text-xs">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-sky-950">Users</h1>
          <p className="text-sm text-sky-900/60">{users.length} registered users.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button onClick={() => setAddingUser(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add user
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid h-48 place-items-center">
          <Spinner className="h-8 w-8 text-ocean-600" />
        </div>
      ) : (
        <DataTable columns={columns} rows={users} rowKey={(r) => r.id} empty={<EmptyState icon={UsersIcon} title="No users yet" />} />
      )}

      <UserTreksModal user={rigUser} open={!!rigUser} onClose={() => setRigUser(null)} />
      <AddUserModal open={addingUser} onClose={() => setAddingUser(false)} onDone={load} />
      <EditUserModal user={editUser} open={!!editUser} onClose={() => setEditUser(null)} onDone={load} />
    </div>
  );
}
