"use client";
import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useModal
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import { useEffect, useState } from "react";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { CONTRACTS } from "@/utils/constants";

type ExecuteResultOrUndefined = ExecuteResult | string | undefined;

export default function Page(): JSX.Element {
  // Abstraxion hooks
  const {data: { bech32Address }, isConnected, isConnecting} = useAbstraxionAccount();

  // General state hooks
  const [,setShow] = useModal();

  const [executeResult, setExecuteResult] = useState<ExecuteResultOrUndefined>(undefined);

  const {client}= useAbstraxionSigningClient();


  // to display loading state while the function executes
  const [loading, setLoading] = useState(false);

  async function mint() {
    setLoading(true);
    setExecuteResult(undefined);
    const msg = {
      mint: {
        token_id: "1",
        owner: bech32Address,
        token_uri: null,
        extension: {}
      },
    };

    try {
      const claimRes = await client?.execute(
        bech32Address,
        CONTRACTS.potato,
        msg,
        {
          amount: [{ amount: "0", denom: "uxion" }],
          gas: "500000",
        },
        "",
        [],
      );

      setExecuteResult(claimRes);
    } catch (error) {
      setExecuteResult(`there was an error (check logs): ${JSON.stringify(error)}`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  // watch isConnected and isConnecting
  // only added for testing
  useEffect(() => {
    console.log({ isConnected, isConnecting });
  }, [isConnected, isConnecting])

  return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 w-full px-12">
        <h1 className="text-2xl font-bold tracking-tighter text-black dark:text-white">
          Potato 🥔
        </h1>
        <div className="flex flex-row w-full gap-6">
        <Button
            fullWidth
            onClick={() => { setShow(true) }}
            structure="base"
        >
          {bech32Address ? (
              <div className="flex items-center justify-center">VIEW ACCOUNT</div>
          ) : (
              "CONNECT"
          )}
        </Button>
        <Button
          disabled={loading || !bech32Address}
          fullWidth
          onClick={() => mint()}
          structure="base"
        >
          {loading ? "LOADING..." : "Execute Mint"}
        </Button>
        <Button
          disabled={loading || !bech32Address}
          fullWidth
          onClick={() => setExecuteResult(undefined)}
          structure="base"
        >
          Reset
        </Button>
        </div>
        {
          bech32Address &&
            <div className="border-2 border-primary rounded-md p-4 grid grid-cols-[30%_70%] grid-flow-row gap-4 w-full">
                <div>
                  address
                </div>
                <div>
                  {bech32Address}
                </div>
                <div>
                  potato contract
                </div>
                <div>
                  {CONTRACTS.potato}
                </div>
                <div>
                  execution result
                </div>
                <div>
                  {JSON.stringify(executeResult)}
                </div>
            </div>
        }
        <Abstraxion onClose={() => setShow(false)} />
      </main>
  );
}
