import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/auth";
import { BsDiscord } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#5ef4ca5a] to-[#4389faab] ">
      {/* from-[#5215a8] to-[#2b33d7] */}
      <div className="m-auto mx-auto w-full max-w-sm rounded-lg bg-gray-50 p-6 shadow-md dark:bg-gray-800">
        <div className="mx-auto my-4 flex justify-center font-sans text-2xl font-extrabold">
          Life on Rails
        </div>
        <div className="mx-auto my-2 flex justify-center text-sm">
          Sign Up or Log In
        </div>
        <hr className="mx-auto my-4 h-1 w-48 rounded border-0 bg-gray-200 dark:bg-gray-700" />

        <div className="mt-6 flex flex-col items-center">
          <button
            type="button"
            aria-label={`Continue with Google`}
            role="button"
            className="m-2 flex w-3/4 transform items-center justify-center rounded-lg border border-slate-400 bg-white px-6 py-2 text-sm font-medium text-black transition-colors duration-300 focus:bg-blue-400 focus:outline-none hover:bg-blue-400"
            onClick={() => void signIn("google")}
          >
            <FcGoogle className="mx-2 h-4 w-4 fill-current"></FcGoogle>
            <span className="mx-2 hidden sm:inline">Continue with Google</span>
          </button>

          <button
            type="button"
            aria-label={`Continue with Discord`}
            role="button"
            className="m-2 flex w-3/4 transform items-center justify-center rounded-lg bg-indigo-500 px-6 py-2 text-sm font-medium text-white transition-colors duration-300 focus:bg-gray-400 focus:outline-none hover:bg-gray-400"
            onClick={() => void signIn("discord")}
          >
            <BsDiscord className="mx-2 h-4 w-4 fill-current"></BsDiscord>
            <span className="mx-2 hidden sm:inline">Continue with Discord</span>
          </button>
        </div>
      </div>
    </div>
  );
}
