import type { ScoringFormat } from "@prisma/client";
import { format } from "date-fns";
import range from "lodash/range";
import { RxRocket } from "react-icons/rx";
import { HelpIcon } from "../components/ui/help-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../utils/api";
import { ItemText } from "@radix-ui/react-select";

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
                  <div className="mb-4 flex flex-row items-center gap-2 text-sm font-medium text-gray-500">
                    <span>Scoring Format</span>
                    <HelpIcon>How scores should be formatted.</HelpIcon>
                  </div>
                  <Select
                    onValueChange={(value) => {
                      updateScoringUnit.mutate({
                        scoringUnit: value as ScoringFormat,
                      });
                    }}
                    defaultValue={profile.scoringUnit}
                  >
                    <SelectTrigger className="h-fit w-fit outline-none">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">
                        <div className="px-4 py-2">
                          <span className="text-xs uppercase text-gray-700">
                            Percentage
                          </span>
                          <br></br>
                          <span className="text-md text-black">
                            Represent scores as percentages (0-100%)
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Normalized">
                        <div className="px-4 py-2">
                          <span className="text-xs uppercase text-gray-700">
                            Normalized
                          </span>
                          <br></br>
                          <span className="text-md text-black">
                            Normalize scores to a range of 0-1.
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-1">
                  <div className="mb-4 flex flex-row items-center gap-2 text-sm font-medium text-gray-500">
                    <span>Scoring Time Horizon</span>
                    <HelpIcon>
                      The number of weeks used to calculate scores. <br /> A
                      smaller number of weeks will bias the scores towards more
                      recent data,
                      <br /> while longer numbers will better reflect older
                      trends.
                    </HelpIcon>
                  </div>
                  <Select
                    onValueChange={(value) => {
                      updateScoringWeeks.mutate({
                        scoringWeeks: parseInt(value),
                      });
                    }}
                    defaultValue={profile.scoringWeeks.toString()}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {range(2, 13).map((value) => (
                        <SelectItem key={value} value={value.toString()}>
                          <span className="font-semibold">{value}</span> weeks
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
