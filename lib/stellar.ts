import {
  Address,
  BASE_FEE,
  Contract,
  Networks,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
} from "@stellar/stellar-sdk";

const rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org";
export const networkPassphrase = Networks.TESTNET;
export const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID ?? "";
export const server = new rpc.Server(rpcUrl);

export type LinkRecord = {
  owner: string;
  destination: string;
  active: boolean;
  created_at: bigint;
  updated_at: bigint;
};

export async function buildCreateTransaction(owner: string, alias: string, destination: string) {
  if (!contractId) throw new Error("NEXT_PUBLIC_CONTRACT_ID is not configured.");
  const account = await server.getAccount(owner);
  const contract = new Contract(contractId);
  let transaction = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(
      contract.call(
        "create",
        Address.fromString(owner).toScVal(),
        nativeToScVal(alias, { type: "string" }),
        nativeToScVal(destination, { type: "string" }),
      ),
    )
    .setTimeout(180)
    .build();

  const simulation = await server.simulateTransaction(transaction);
  if (rpc.Api.isSimulationError(simulation)) throw new Error(simulation.error);
  transaction = rpc.assembleTransaction(transaction, simulation).build();
  return transaction.toXDR();
}

export async function submitTransaction(signedXdr: string) {
  const tx = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  const sent = await server.sendTransaction(tx);
  if (sent.status === "ERROR") throw new Error("Transaction submission failed.");

  for (let attempt = 0; attempt < 20; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const result = await server.getTransaction(sent.hash);
    if (result.status === "SUCCESS") return sent.hash;
    if (result.status === "FAILED") throw new Error("Transaction failed on-chain.");
  }
  throw new Error("Transaction confirmation timed out.");
}

export async function resolveAlias(alias: string): Promise<LinkRecord | null> {
  if (!contractId) return null;
  const source = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
  const account = await server.getAccount(source).catch(() => null);
  if (!account) return null;
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(contract.call("resolve", nativeToScVal(alias, { type: "string" })))
    .setTimeout(30)
    .build();
  const simulation = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simulation) || !simulation.result?.retval) return null;
  return scValToNative(simulation.result.retval) as LinkRecord | null;
}

