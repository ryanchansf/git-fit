import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const followerData = [
  {
    first_name: "Ananya",
    last_name: "Thapar",
    user_name: "ananya_cool",
  },
  {
    first_name: "Felicia",
    last_name: "Thapar",
    user_name: "felicia_pilates",
  },
];

export default function Followers() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between px-100">
        <h1 className="text-4xl font-bold">Followers</h1>
      </div>
      <div className="grid grid-cols-3 gap-4 px-20">
        <Avatar>
          <AvatarImage src="https://spiritdogtraining.com/wp-content/uploads/2021/01/mini-goldendoodle.jpg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Button variant="outline">Ananya</Button>
      </div>
    </div>
  );
}
