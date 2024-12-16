'use client';

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/Theming/theme-provider"; // Make sure this path is correct

export default function Navbar() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleJournalClick = () => {
    router.push("/journal");
  };

  const handleMedicationsClick = () => {
    router.push("/medications");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu color={theme === 'dark' ? '#ffffff' : '#000000'} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end" side="bottom" sideOffset={8}>
        <div className="space-y-2">
          <Button variant="ghost" onClick={handleJournalClick} className="w-full justify-start">Journal</Button>
          <Button variant="ghost" onClick={handleMedicationsClick} className="w-full justify-start">Medications</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}