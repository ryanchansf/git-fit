import GoogleProvider from "next-auth/providers/google";
import { AuthOptions, RequestInternal } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getBaseUrl from "@/database/path";

const options: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
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
      async authorize(
        credentials:
          | Record<"username" | "email" | "password", string>
          | undefined,
      ) {
        // Your authorization logic here
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
              return null;
            }

            console.log("User exists", data);
            // create a user object to be returned to session
            const user = {
              email: data.data[0].email,
              name: data.data[0].username,
            };
            return user; // to be returned to session
          } else {
            // user does not exist
            console.log("User does not exist");
            return null;
          }
        } catch (error) {
          console.log("Error in authorize callback: ", error);
          return null;
        }
      },
    }),
  ],
  // callbacks: {
  //   async signIn(params: {
  //     token: JWT;
  //     user: User | AdapterUser;
  //     account: Account | null;
  //     profile?: Profile | undefined;
  //     trigger?: "signIn" | "signUp" | "update" | undefined;
  //     isNewUser?: boolean | undefined;
  //     session?: any;
  //   }) {
  //     const { token, user } = params;
  //     const session = { ...params.session, user: token }; // Include the token in the session
  //     return session;
  //   },
  //   async session(params) {
  //     const { session, token } = params;
  //     session.user = token; // Include the token in the session
  //     return session;
  //   },
  // },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/register",
  },
};

export default options;
