import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-auto my-auto">
      <Input/>
        <Button>
          Test Button shadcn
        </Button>
    </div>
  );
}
