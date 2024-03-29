import NextAuth from "next-auth/next"
import GithubProvider from "next-auth/providers/github"
import TwiitterProvider from "next-auth/providers/twitter"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "database/connectDB"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import EmailProvider from "next-auth/providers/email"


export default NextAuth ({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
       TwiitterProvider({
        clientId :process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
       }),
       GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,

       }),
       EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD
          }
        },
        from: process.env.EMAIL_FROM
      }),
    ],

    pages: {
        signIn: '/auth/signing',
    },
    adapter: MongoDBAdapter(clientPromise)
})


// mongodb+srv://Bonsu:Holy1Spirit@cluster0.jr9dhcs.mongodb.net/?retryWrites=true&w=majority