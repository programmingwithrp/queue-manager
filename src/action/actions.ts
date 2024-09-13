"use server";
import { auth, signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function handleSignIn(formData: any) {
  try {
    const response = await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false
    });
    console.log("response" + response);
    return response;
  } catch (e) {
    throw new Error("Failed to sign in");
  }
}

export async function doLogout() {
  try {
    await signOut({ redirect: false });
  } catch (e) {
    throw new Error("Failed to sign our user" + e);
  }
}
