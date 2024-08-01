import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!
import { verifyOrganization } from "@/pages/api/organizations"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (credentials === null) return null;
        let user = null;
        console.log('Credentials'+credentials.email);
        console.log('Credentials'+credentials.password);
        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password)
 
        // logic to verify if user exists
        user = await verifyOrganization(credentials.email as string, credentials.password as string)
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.")
        }
 
        // return user object with the their profile data
        console.log('Org user'+user);
        return user
      },
    }),
  ],
})