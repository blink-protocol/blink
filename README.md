# Blink — Stellar on-chain link registry

Blink is an MVP for wallet-owned short links. A Soroban contract stores alias ownership, destination, activation status, and timestamps. The Next.js app creates signed records through Freighter and resolves aliases through Stellar RPC.

## Why on-chain?

The durable value is portable ownership: a creator can prove control of a public alias and update its destination without depending on a platform account. Redirect traffic stays off-chain; ownership and routing authority stay verifiable.

## Run locally

```bash
npm install
cargo test -p link-registry
npm run dev
```

Copy `.env.example` to `.env.local` and add a deployed Testnet contract ID.

## Build and deploy the contract

```bash
stellar contract build
stellar contract deploy \
  --wasm target/wasm32v1-none/release/link_registry.wasm \
  --source YOUR_IDENTITY \
  --network testnet
```

Set the returned contract ID as `NEXT_PUBLIC_CONTRACT_ID`, then restart the web app.

## MVP scope

- Wallet-authenticated alias creation
- On-chain ownership and mutable destination
- Alias resolution and HTTP redirect
- Deactivation and contract events
- Persistent storage TTL extension

Next product increment: owner dashboard, link update/deactivation UI, click analytics, custom domains, and paid premium aliases.
