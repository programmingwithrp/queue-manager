import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import React from "react";

const DialogCloseButton = React.memo(({ orgName }: { orgName: string }) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  useEffect(() => {
    async function fetchQrCodeImage(orgName: string) {
      if (imageSrc != ""){
        return;
      }
      const payload = {
        text: "https://gs6rbqxt-3000.inc1.devtunnels.ms/createuser/" + orgName
      };
      const response = await fetch("https://getpincode-backend.vercel.app/api/qrcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        setImageSrc(data.qrCode);
      } else {
        console.error("Failed to create QR code");
      }

    }
    fetchQrCodeImage(orgName);
  }, [orgName]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Qr Code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to register in the Queue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={`https://gs6rbqxt-3000.inc1.devtunnels.ms/createuser/${orgName}`}
              readOnly
            />
            {imageSrc && <img src={imageSrc} alt="QR code" className="w-72 h-72" />}
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
})

export default DialogCloseButton;
