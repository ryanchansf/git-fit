import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const followerData = [
  {
    img: "https://spiritdogtraining.com/wp-content/uploads/2021/01/mini-goldendoodle.jpg",
    user_name: "ananya_cool",
    first_name: "Ananya",
  },
  {
    img: "https://media.licdn.com/dms/image/C5603AQGoNK4iqKLkJQ/profile-displayphoto-shrink_800_800/0/1619014750840?e=2147483647&v=beta&t=shtQoIP58TlkxLDlBU--ndMdXKdy-9DE9iOw_8AsP1U",
    user_name: "felicia_pilates",
    first_name: "Felicia",
  },
  {
    img: "",
    user_name: "caroline_calves",
    first_name: "Caroline",
  },
];

export default function Followers() {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex justify-between px-100"
        style={{ marginBottom: "20px" }}
      >
        <h1 className="text-4xl font-bold">Followers</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 px-20">
        {followerData.map((follower, index) => (
          <div
            className="flex items-center"
            style={{ marginBottom: "20px" }}
            key={index}
          >
            <div style={{ marginRight: "15px" }}>
              <Avatar>
                <AvatarImage src={follower.img} />
                <AvatarFallback style={{ color: "white" }}>
                  {follower.first_name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div style={{ marginLeft: "25px" }}>
              <Button type="submit">
                <i style={{ color: "hsl(var(--primary)" }} />
                <span style={{ color: "hsl(var(--accent))" }}>
                  {follower.user_name}
                </span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
