import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const cardData = [
  { title: "Card 1", content: "Card 1 content" },
  { title: "Card 2", content: "Card 2 content" },
  { title: "Card 3", content: "Card 3 content" },
  { title: "Card 4", content: "Card 4 content" },
  { title: "Card 5", content: "Card 5 content" },
  { title: "Card 6", content: "Card 6 content" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between px-20">
        <h1 className="text-4xl font-bold">Welcome back, username</h1>
        <Button>+</Button>
      </div>
      <div className="grid grid-cols-3 gap-4 px-20">
        {cardData.map((card, index) => (
          <Card key={index}>
            <h2>{card.title}</h2>
            <p>{card.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
