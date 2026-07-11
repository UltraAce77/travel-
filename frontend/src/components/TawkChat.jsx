import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const PROPERTY_ID = import.meta.env.VITE_TAWK_PROPERTY_ID || "66bcbb620cca4f8a7a75ee61";
const WIDGET_ID = import.meta.env.VITE_TAWK_WIDGET_ID || "1jt8oql4c";
const SCRIPT_ID = "tawk-to-widget";

export default function TawkChat() {
  const { user, token, role } = useAuth();
  const visible = !role || role === "user";

  useEffect(() => {
    if (!visible) {
      window.Tawk_API?.hideWidget?.();
      return;
    }
    if (!PROPERTY_ID || !WIDGET_ID) return;

    let cancelled = false;
    const load = async () => {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.showWidget?.();

      if (token && user?.email) {
        const identity = await api("get", "/support/tawk-identity");
        if (identity?.data && !cancelled) {
          window.Tawk_API.visitor = identity.data;
          window.Tawk_API.setAttributes?.(identity.data, () => {});
        }
      }

      if (!document.getElementById(SCRIPT_ID) && !cancelled) {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.async = true;
        script.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");
        document.body.appendChild(script);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [visible, token, user?.email]);

  return null;
}