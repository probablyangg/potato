"use client";
import {
  Abstraxion,
  useAbstraxionAccount,
  useModal
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";

export default function Page(): JSX.Element {
  // Abstraxion hooks
  const allStuff = useAbstraxionAccount();

  // General state hooks
  const [show, setShow] = useModal();
  console.log(show);
  console.log(allStuff)
  return (
      <main className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tighter text-black dark:text-white">
          ABSTRAXION
        </h1>
        <Button
            fullWidth
            onClick={() => { setShow(true) }}
            structure="base"
        >
          {allStuff.data.bech32Address ? (
              <div className="flex items-center justify-center">VIEW ACCOUNT</div>
          ) : (
              "CONNECT"
          )}
        </Button>
        <Abstraxion onClose={() => setShow(false)} />
      </main>
  );
}
