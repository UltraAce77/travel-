import { useState, useEffect, useCallback } from "react";
import { MessageSquare, RefreshCw, ExternalLink, Ticket, Mail } from "lucide-react";
import Spinner from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/DataTable";
import { api } from "../../lib/api";
import { cn } from "../../lib/utils";

const TAWK_DASHBOARD = "https://dashboard.tawk.to/";

function when(d) {
  if (!d) return "";
  const t = new Date(d);
  const diff = (Date.now() - t.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return t.toLocaleDateString();
}

export default function AdminSupport() {
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);
  const [active, setActive] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api("get", "/support/conversations");
    setConvos(Array.isArray(res?.data) ? res.data : []);
    const u = await api("get", "/support/unread-count");
    setUnread(u?.data?.count || 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const open = async (c) => {
    setLoadingMsg(true);
    const wasUnread = !c.read;
    const res = await api("get", `/support/conversations/${c.id}`);
    setActive(res?.data || null);
    setLoadingMsg(false);
    setConvos((cs) => cs.map((x) => (x.id === c.id ? { ...x, read: true } : x)));
    if (wasUnread) setUnread((n) => Math.max(0, n - 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-sky-950">Support inbox</h1>
          <p className="text-sm text-sky-900/60">
            {convos.length} conversation{convos.length === 1 ? "" : "s"}
            {unread > 0 && <span className="ml-1 font-600 text-sand-600">· {unread} unread</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <a href={TAWK_DASHBOARD} target="_blank" rel="noreferrer" className="btn-primary">
            Reply in Tawk <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Read-only note */}
      <div className="flex items-start gap-2.5 rounded-xl border border-ocean-200 bg-ocean-50 p-3 text-xs text-sky-900/70">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-ocean-600" />
        This is a read-only view of chats and offline messages captured from Tawk.to. To reply,
        open the Tawk dashboard or app. (Tawk delivers the opening message + offline tickets to
        webhooks; full live transcripts stay in Tawk.)
      </div>

      {loading ? (
        <div className="grid h-48 place-items-center">
          <Spinner className="h-8 w-8 text-ocean-600" />
        </div>
      ) : convos.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No conversations yet" text="Chats and offline messages will appear here once your Tawk webhook is configured." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          {/* List */}
          <div className="card max-h-[65vh] overflow-y-auto p-1.5">
            {convos.map((c) => (
              <button
                key={c.id}
                onClick={() => open(c)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors",
                  active?._id === c.id ? "bg-ocean-100" : "hover:bg-ocean-50"
                )}
              >
                <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-iris text-xs font-700 text-white">
                  {(c.visitorName || "V").slice(0, 2).toUpperCase()}
                  {!c.read && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-sand-500 ring-2 ring-white" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("truncate text-sm", c.read ? "font-600 text-sky-950" : "font-800 text-sky-950")}>
                      {c.visitorName || "Visitor"}
                    </p>
                    <span className="shrink-0 text-[11px] text-sky-900/45">{when(c.lastMessageAt)}</span>
                  </div>
                  <p className="truncate text-xs text-sky-900/55">{c.lastMessage || c.subject || "—"}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={cn(
                        "chip px-2 py-0.5 text-[10px]",
                        c.kind === "ticket"
                          ? "border-iris-300 bg-iris-100 text-iris-700"
                          : c.status === "ended"
                          ? "border-ocean-200 bg-white text-sky-900/60"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      )}
                    >
                      {c.kind === "ticket" ? "Offline" : c.status}
                    </span>
                    <span className="text-[10px] text-sky-900/40">{c.messageCount} msg</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="card flex max-h-[65vh] flex-col overflow-hidden">
            {loadingMsg ? (
              <div className="grid flex-1 place-items-center">
                <Spinner className="h-7 w-7 text-ocean-600" />
              </div>
            ) : !active ? (
              <div className="grid flex-1 place-items-center p-8 text-center text-sm text-sky-900/50">
                Select a conversation to read it.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-ocean-100 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-700 text-sky-950">{active.visitorName || "Visitor"}</p>
                    {active.visitorEmail && (
                      <p className="flex items-center gap-1 truncate text-xs text-sky-900/55">
                        <Mail className="h-3 w-3" /> {active.visitorEmail}
                      </p>
                    )}
                  </div>
                  {active.kind === "ticket" && (
                    <span className="chip border-iris-300 bg-iris-100 text-iris-700">
                      <Ticket className="h-3 w-3" /> Offline
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {active.subject && (
                    <p className="text-xs font-600 uppercase tracking-wide text-sky-900/50">
                      {active.subject}
                    </p>
                  )}
                  {(active.messages || []).length === 0 ? (
                    <p className="text-sm text-sky-900/50">No message content captured.</p>
                  ) : (
                    active.messages.map((m, i) => (
                      <div
                        key={i}
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                          m.sender === "agent"
                            ? "ml-auto bg-ocean-600 text-white"
                            : "bg-ocean-50 text-sky-900"
                        )}
                      >
                        {m.text}
                        <div className={cn("mt-1 text-[10px]", m.sender === "agent" ? "text-white/70" : "text-sky-900/40")}>
                          {when(m.time)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-ocean-100 p-3">
                  <a href={TAWK_DASHBOARD} target="_blank" rel="noreferrer" className="btn-ghost w-full">
                    Reply to this chat in Tawk <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
