import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/auth";
import { BsDiscord, BsGoogle } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc'
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
      <div className="w-full max-w-sm p-6 m-auto mx-auto bg-gray-50 rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-center mx-auto my-4 text-2xl font-extrabold font-sans">
          Life on Rails
        </div>
        <div className="flex justify-center text-sm mx-auto my-2">
          Sign Up or Log In
        </div>
        <hr className="w-48 h-1 mx-auto my-4 bg-gray-200 border-0 rounded dark:bg-gray-700" />

        <div className="flex flex-col items-center mt-6">
          <button
            type="button"
            aria-label={`Continue with Google`}
            role="button"
            className="flex items-center justify-center w-3/4 px-6 py-2 m-2 text-sm font-medium text-black transition-colors duration-300 transform bg-white border border-slate-400 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
            onClick={() => void signIn('google')}

          >
            <FcGoogle className="w-4 h-4 mx-2 fill-current"></FcGoogle>
            <span className="hidden mx-2 sm:inline">Continue with Google</span>
          </button>

          <button
            type="button"
            aria-label={`Continue with Discord`}
            role="button"
            className="flex items-center justify-center w-3/4 px-6 py-2 m-2 text-sm font-medium text-white transition-colors duration-300 transform bg-indigo-500 rounded-lg hover:bg-gray-400 focus:bg-gray-400 focus:outline-none"
            onClick={() => void signIn('discord')}
          >
            <BsDiscord className="w-4 h-4 mx-2 fill-current"></BsDiscord>
            <span className="hidden mx-2 sm:inline">Continue with Discord</span>
          </button>

        </div>

      </div>

    </div>
  );
}
