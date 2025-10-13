import { TypeH1, TypeP, TypeTextBlock } from "@/components/ui/typography";
import Footer from "@/components/ui/footer";
/*--------------------------------------------------------------------------------------------------------------------*/

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-between h-screen text-center space-y-6 p-8">
      <main className="h-full flex flex-col items-center justify-center">
        <TypeTextBlock>
          <TypeH1 className={"font-light"}>
            Welcome to <span className={"font-bold"}>Prism</span>
          </TypeH1>
          <TypeP>
            Dissect full spectrum of blockchain data into narrow spectrum you
            explore
          </TypeP>
        </TypeTextBlock>
      </main>

      <Footer />
    </div>
  );
}
