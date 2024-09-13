import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function EditForm({
  cardTitle,
  cardDescription,
  cardFormContent,
  onSave,
  Icon,
  triggerButton,
  openStatus,
  setOpenStatus
}: {
  cardTitle: string;
  cardDescription: string;
  cardFormContent: React.ReactNode;
  onSave: () => void;
  Icon: React.ReactNode;
  triggerButton?: React.ReactNode;
  openStatus: boolean;
  setOpenStatus: (status: boolean) => void;
}) {
  console.log("   cardFormContent :>> ", cardFormContent);
  return (
    <Dialog open={openStatus} onOpenChange={setOpenStatus}>
      <DialogTrigger asChild>
        {/* <Button variant="outline" className="ml-4">{Icon}</Button> */}
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{cardTitle}</DialogTitle>
          <DialogDescription>{cardDescription}</DialogDescription>
        </DialogHeader>
        {/* <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" value="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" value="@peduarte" className="col-span-3" />
        </div>
      </div>
       */}
        {cardFormContent}
        <DialogFooter>
          <Button type="submit" onClick={onSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
