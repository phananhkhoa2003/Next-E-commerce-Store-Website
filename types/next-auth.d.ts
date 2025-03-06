import { DefaultSession } from "next-auth";


// add role to session of next-auth
declare module "next-auth" {
  export interface Session {
    user:{
        role: string;
    } & DefaultSession["user"];
  }
}