
import Layout from "../components/layout";
import { api } from "../utils/api";
import { format } from 'date-fns';


const ProfilePage = () => {
  const query = api.profile.getProfile.useQuery();

  if (query.isLoading) return <p>Loading</p>;
  if (query.isError) return <p>Error</p>;

  const profile = query.data;
  const joinDate = format(profile.createdAt, 'yyyy/MM/dd');
  joinDate.toString();

  return (<>
    <div className="flex min-h-screen justify-center ">
      <div className="w-full max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="overflow-hidden rounded-lg bg-white shadow md:col-span-2">
            <div className="flex items-center justify-between px-4 py-5 sm:px-6 ">
              <h3 className="text-lg font-medium leading-6 text-gray-700">Profile Information</h3>
              <div className="h-12 w-12 rounded-full bg-gray-200">
                {
                  (profile.image == undefined)
                    ? <img src="https://media.istockphoto.com/id/1210939712/vector/user-icon-people-icon-isolated-on-white-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=vKDH9j7PPMN-AiUX8vsKlmOonwx7wjqdKiLge7PX1ZQ="></img>
                    : <img src={profile.image} alt="" />
                }
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">User name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Provider</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.providers.join(", ")}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Join date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{joinDate}</dd>
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