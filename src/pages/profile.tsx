
import Layout from "../components/layout";
import { api } from "../utils/api";


  const ProfilePage = () => {
    return (<>
        <div className="flex min-h-screen justify-center ">
  <div className="w-full max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 gap-8">
      <div className="overflow-hidden rounded-lg bg-white shadow md:col-span-2">
        <div className="flex items-center justify-between px-4 py-5 sm:px-6 ">
          <h3 className="text-lg font-medium leading-6 text-gray-700">Profile Information</h3>
          <div className="h-12 w-12 rounded-full bg-gray-200">
            <img src="https://cdn.discordapp.com/avatars/182243667183009792/3082ceba2a2f7dd362d93aad30aa45e3.png" alt="" />
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900">JohnDoe</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">sumeet.padavala@gmail.com</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Provider</dt>
              <dd className="mt-1 text-sm text-gray-900">Discord</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</div>
    </>
    );
};

export default () => <Layout main={ProfilePage}></Layout>;