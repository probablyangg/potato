"use client";
import {
  Abstraxion,
  useAbstraxionAccount,
  useModal
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";

export default function Page(): JSX.Element {
  // Abstraxion hooks
  const stuff = useAbstraxionAccount();

  // General state hooks
  const [show, setShow] = useModal();
  console.log(show);
  console.log(stuff)
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
          {stuff.data.bech32Address ? (
              <div className="flex items-center justify-center">VIEW ACCOUNT</div>
          ) : (
              "CONNECT"
          )}
        </Button>
        {
          stuff.data.bech32Address &&
            <div className="border-2 border-black rounded-md p-4 flex flex-row gap-4">
              <div className="flex flex-row gap-6">
                <div>
                  address
                </div>
                <div>
                  {stuff.data.bech32Address}
                </div>
              </div>
            </div>
        }
        <Abstraxion onClose={() => setShow(false)} />
      </main>
  );
}
