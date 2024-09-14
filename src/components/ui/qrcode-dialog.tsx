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
import { useToast } from "./use-toast";

const DialogCloseButton = React.memo(
  ({ orgId, triggerElement }: { orgId: string; triggerElement: React.ReactNode }) => {
    const [imageSrc, setImageSrc] = useState<string>("");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = baseUrl + "/createuser/" + orgId;
    const {toast} = useToast();
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(apiUrl);
        toast({
          title: "Copied",
          description: "Link copied to clipboard"
        });
      } catch (e) {
        console.error("Failed to copy to clipboard", e);
      }
    };
    console.log("baseUrl" + baseUrl);
    console.log("apiUrl" + apiUrl);
    useEffect(() => {
      async function fetchQrCodeImage(orgId: string) {
        if (imageSrc != "") {
          return;
        }
        const payload = {
          text: apiUrl
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
      fetchQrCodeImage(orgId);
    }, [orgId]);
    return (
      <Dialog>
        <DialogTrigger asChild>{triggerElement}</DialogTrigger>
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
              <Input id="link" defaultValue={apiUrl} readOnly />
              {imageSrc && <img src={imageSrc} alt="QR code" className="w-72 h-72" />}
            </div>
            <div>
              <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                <span className="sr-only">Copy</span>
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
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
  }
);

// Add display name here
DialogCloseButton.displayName = "DialogCloseButton";

export default DialogCloseButton;
