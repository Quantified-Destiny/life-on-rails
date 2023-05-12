import { format } from "date-fns";
import { RxRocket } from "react-icons/rx";
import { api } from "../utils/api";
import { ScoringFormat } from "@prisma/client";

const ProfilePage = () => {
  const context = api.useContext();
  const updateScoringWeeks = api.profile.updateScoringWeeks.useMutation({
    onSuccess() {
      void context.profile.invalidate();
    },
  });
  const updateScoringUnit = api.profile.updateScoringUnit.useMutation({
    onSuccess() {
      void context.profile.invalidate();
    },
  });
  const query = api.profile.getProfile.useQuery();

  if (query.isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <RxRocket className="animate-spin text-2xl"></RxRocket>
      </div>
    );
  if (query.isError) return <p>Error</p>;

  const profile = query.data;
  const joinDate = format(profile.createdAt, "MM/dd/yyyy hh:mm a");

  // joinDate.toString();

  return (
    <>
      <div className="flex justify-center">
        <div className="w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8">
            <div className="overflow-hidden rounded-sm bg-white  md:col-span-2">
              <div className="flex items-center justify-between px-4 py-4 sm:px-6 ">
                <h3 className="text-lg font-medium leading-6 text-gray-700">
                  Profile Information
                </h3>
                <div className="h-12 w-12 rounded-full bg-gray-200">
                  {profile.image == undefined ? (
                    <img src="https://media.istockphoto.com/id/1210939712/vector/user-icon-people-icon-isolated-on-white-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=vKDH9j7PPMN-AiUX8vsKlmOonwx7wjqdKiLge7PX1ZQ="></img>
                  ) : (
                    <img src={profile.image} alt="" />
                  )}
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Username
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile.name}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile.email}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Provider
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile.providers.join(", ")}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Date Joined
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{joinDate}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-sm md:col-span-2">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 ">
              <h3 className="text-lg font-medium leading-3 text-gray-700">
                User Preferences
              </h3>
            </div>

            <div className="px-4 pt-3 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Unit of Scoring
                  </dt>
                  <select
                    id="scoring"
                    className="mt-2 block w-1/2 rounded-lg border border-gray-300 bg-gray-50 px-2 py-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    value={profile.scoringUnit}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log(value);
                      updateScoringUnit.mutate({
                        scoringUnit: value as ScoringFormat,
                      });
                    }}
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="Normalized">Normalized</option>
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Scoring Time Horizon in Weeks
                  </dt>
                  <select
                    id="scoring"
                    className="mt-2 block w-1/2 rounded-lg border border-gray-300 bg-gray-50 px-2 py-0.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    value={profile.scoringWeeks}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log(value);
                      updateScoringWeeks.mutate({
                        scoringWeeks: parseInt(value),
                      });
                      // setValue({ value })
                    }}
                  >
                    {/* onChange={(value: string) => updateScoringWeeks.mutate({ scoringWeeks: parseInt(value) })}> */}
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
