import Image from "next/image";
import RobinhoodBoard from "@/components/organisms/RobinhoodBoard";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[#e6e8ef] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <a
            href="https://tatum.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Image src="/tatum.svg" alt="Tatum" width={84} height={20} priority />
            <span className="hidden text-sm font-semibold text-[#111827] sm:inline">
              Robinhood Trader Info
            </span>
          </a>
          <div className="flex items-center gap-2">
            <a
              href="https://docs.tatum.io/reference/rpc-robinhood"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-xl border border-[#dfe3ee] px-3 py-2 text-sm font-semibold text-[#111827] hover:bg-[#f7f8fc] sm:inline-flex"
            >
              Read Docs
            </a>
            <a
              href="https://dashboard.tatum.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-[#4f37fd] px-3 py-2 text-sm font-semibold text-white hover:bg-[#3f2ae6]"
            >
              Get API Key
            </a>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 md:px-6 md:py-8">
        <RobinhoodBoard />
      </div>

      <footer className="border-t border-[#e6e8ef] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-[#6b7280] md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            Built with Tatum Gateway RPC · TVL and fees via DefiLlama · tokens via
            DexScreener
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 font-medium">
            <a
              href="https://docs.tatum.io/reference/rpc-robinhood"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4f37fd] hover:underline"
            >
              Robinhood RPC
            </a>
            <a
              href="https://ai.tatum.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4f37fd] hover:underline"
            >
              Tatum Builder
            </a>
            <a
              href="https://defillama.com/chain/Robinhood%20Chain"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4f37fd] hover:underline"
            >
              DefiLlama
            </a>
            <a
              href="https://dashboard.tatum.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4f37fd] hover:underline"
            >
              Dashboard
            </a>
            <a
              href="https://github.com/tatumio/example-apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4f37fd] hover:underline"
            >
              Example apps
            </a>
            <a
              href="https://status.tatum.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4f37fd] hover:underline"
            >
              Status
            </a>
          </div>
        </div>
      </footer>

      <a
        href="https://ai.tatum.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-[#d5d3fe] bg-white px-3.5 py-2 text-xs font-semibold text-[#1c1e4f] shadow-lg shadow-[#1c1e4f]/10 transition hover:-translate-y-0.5 hover:border-[#4f37fd] hover:text-[#4f37fd]"
      >
        <span className="h-2 w-2 rounded-full bg-[#2ccd9a]" />
        Built with Tatum Builder
      </a>
    </main>
  );
}
