import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/auth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#5215a8] to-[#2b33d7]">
      <div className="mt-16 w-full rounded bg-gray-50 p-10 shadow md:w-1/2 lg:w-1/3">
        <p className="text-center text-xl font-extrabold leading-6 text-gray-800 focus:outline-none">
          Life on Rails
        </p>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              aria-label={`Continue with ${provider.name}`}
              role="button"
              className="mt-8 flex w-full items-center rounded-lg border border-gray-700 py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-1"
              onClick={() => void signIn(provider.id)}
            >
              <img
                src="/discord-circle-blue-logo-16640.png" className="w-7"
                alt="discord"
              />
              <p className="ml-4 text-base font-medium text-gray-700">
                Continue with {provider.name}
              </p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
