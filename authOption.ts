import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import prisma from '@/db/client'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from 'next-auth';


export const authOption: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', placeholder: 'Email@gmail.com' },
                password: {
                    label: 'Password',
                    placeholder: '********',
                    type: 'password',
                },
            },
            async authorize(credentials, req) {
                const userFound = await prisma?.users.findUnique({
                    where: {
                        email: credentials?.email,
                    },
                })
                if(!userFound){
                    throw new Error('sign in invalid')
                }
                if(!credentials?.password){
                    throw new Error('sign in invalid')
                }
                const passwordMatch = await bcrypt.compare(credentials?.password, userFound.password)
                if(!passwordMatch){
                    throw new Error('sign in invalid')
                }
                return new Promise((resolve, reject) => resolve({
                    id:String(userFound.id),
                    email: userFound.email,
                    name: userFound.username,
                }))
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60
    }
}