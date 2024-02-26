import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getBaseUrl from "@/database/path";

const options: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "jsmith@email.com",
        },
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@email.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          const username = credentials?.username;

          // get absolute path for server side component
          const path = getBaseUrl();
          const response = await fetch(
            `${path}/api/users?username=${username}`,
          );
          // user already exists
          if (response.status === 200) {
            const data = await response.json();

            // check if password matches
            const password = data.data[0].password;
            if (password != credentials?.password) {
              console.log("Password does not match");
              console.log("Fetched password: ", password);
              console.log("Input password: ", credentials?.password);
              return null;
            }

            console.log("User exists", data);
            console.log("Email: ", data.data[0].email);
            console.log("Username: ", data.data[0].username);
            return data.data[0].email; // to be returned to session
          } else {
            // user does not exist
            console.log("User does not exist");
            return null;
          }
        } catch (error) {
          console.log("Error in authorize callback: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/register",
  },
};

export default options;
