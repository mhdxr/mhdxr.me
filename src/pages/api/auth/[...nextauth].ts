import NextAuth, { AuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { env, isFeatureEnabled } from '@/common/libs/env';

const providers: AuthOptions['providers'] = [];

if (isFeatureEnabled.googleAuth) {
  providers.push(
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    }),
  );
}

if (isFeatureEnabled.githubAuth) {
  providers.push(
    GitHubProvider({
      clientId: env.GITHUB_ID as string,
      clientSecret: env.GITHUB_SECRET as string,
    }),
  );
}

export const authOptions: AuthOptions = {
  providers,
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
