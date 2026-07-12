"use client";

import { useMemo, useState } from "react";
import { getAddress, isConnected, requestAccess, signTransaction } from "@stellar/freighter-api";
import { buildCreateTransaction, networkPassphrase, submitTransaction } from "@/lib/stellar";

type State = "idle" | "connecting" | "signing" | "submitting" | "success" | "error";

export function CreateLinkForm() {
  const [alias, setAlias] = useState("");
  const [destination, setDestination] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const origin = process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000";
  const shortUrl = useMemo(() => `${origin}/${alias || "your-name"}`, [alias, origin]);

  async function createLink(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    try {
      if (!/^[a-z0-9-]{3,32}$/.test(alias)) throw new Error("Use 3–32 lowercase letters, numbers, or hyphens.");
      const parsed = new URL(destination);
      if (!["https:", "http:"].includes(parsed.protocol)) throw new Error("Destination must be HTTP or HTTPS.");

      setState("connecting");
      const connected = await isConnected();
      if (!connected.isConnected) throw new Error("Install Freighter to continue.");
      const access = await requestAccess();
      if (access.error) throw new Error(access.error);
      const addressResult = await getAddress();
      if (addressResult.error) throw new Error(addressResult.error);

      setState("signing");
      const xdr = await buildCreateTransaction(addressResult.address, alias, destination);
      const signed = await signTransaction(xdr, { networkPassphrase });
      if (signed.error) throw new Error(signed.error);

      setState("submitting");
      const hash = await submitTransaction(signed.signedTxXdr);
      setState("success");
      setMessage(`Owned on Stellar · ${hash.slice(0, 10)}…`);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  const busy = ["connecting", "signing", "submitting"].includes(state);

  return (
    <form className="link-form" onSubmit={createLink}>
      <label>
        <span>Short link</span>
        <div className="field-combo"><b>{origin.replace(/^https?:\/\//, "")}/</b><input value={alias} onChange={(e) => setAlias(e.target.value.toLowerCase())} placeholder="stellar" maxLength={32} /></div>
      </label>
      <label>
        <span>Destination</span>
        <input className="field" type="url" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="https://your-long-link.com/campaign" required />
      </label>
      <div className="preview"><span>Preview</span><strong>{shortUrl}</strong></div>
      <button disabled={busy}>{busy ? "Confirming on Stellar…" : "Create on-chain link"}</button>
      {message && <p className={`status ${state}`}>{message}</p>}
    </form>
  );
}

