import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-auto my-auto">
      <DarkModeToggle />
      <Input />
      <Button className="bg-blue-400 dark:bg-amber-300">
        Test Button shadcn
      </Button>
    </div>
  );
}
