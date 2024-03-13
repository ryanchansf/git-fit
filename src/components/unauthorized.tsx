import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl">Hold up!</h1>
      <h2 className="text-lg text-muted-foreground">
        Sign in to view this page
      </h2>
      <br />
      <Link href="/register">
        <Button>Sign in to GitFit</Button>
      </Link>
      <br />
      <Image
        src="/unauthorized.svg"
        alt="Unauthorized Image"
        width={1000}
        height={1000}
        className="rounded-lg"
      />
    </div>
  );
}
