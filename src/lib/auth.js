import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();

        const { email, password } = credentials;

        if (!email || !password) {
          console.log('Missing email or password');
          return null;
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
          console.log('User not found:', email);
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          console.log('Password incorrect for user:', email);
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user._id?.toString();
        token.role = (user.role || '').trim().toLowerCase();
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = (token.role || '').trim().toLowerCase();
        session.user.isActive = token.isActive;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login?error=CredentialsSignin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret',
}; 