import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col px-20 gap-20">
        <h1>Home</h1>
        <Button>Click me</Button>
        <Card>
          <h2>Card</h2>
          <p>Card content</p>
        </Card>
      </div>
    </main>
  );
}
