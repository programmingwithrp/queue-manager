import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// Your own logic for dealing with plaintext password strings; be careful!
import { verifyOrganizationUser } from "@/pages/api/organizationusers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {}
      },
      authorize: async (credentials) => {
        if (credentials === null) return null;
        let user = null;
        console.log("Credentials" + credentials.username);
        console.log("Credentials" + credentials.password);
        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password)

        // logic to verify if user exists
        user = await verifyOrganizationUser(
          credentials.username as string,
          credentials.password as string
        );

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("Org User not found.");
        }

        // return user object with the their profile data
        console.log("Org user" + user);
        return user;
      }
    })
  ],
    callbacks: {
    async jwt({ token, user, session }) {
      // @ts-ignore
      const { _id, username, role, organization } = user;
      if (user) {
        token.userId  = _id;
        token.username = username;
        token.role = role;
        token.organization  = organization; 
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user = token;
      return session;
    }
  }
});
