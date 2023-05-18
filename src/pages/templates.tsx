import { IceCream } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import Image from "next/image";

const templates = [
  {
    key: "fitness",
    title: "Fitness",
    image: "/illustrations/personal-training.svg",
    description:
      "Achieve your fitness goals with a collection of fitness habits and goals.",
  },
  {
    key: "productivity",
    title: "Productivity",
    image: "/illustrations/factory.svg",
    description:
      "Become more productive with a bunch of productivity habits and goals.",
  },
  {
    key: "peace",
    title: "Peace",
    image: "/illustrations/mindfulness.svg",
    description: "Make your life calmer and more mindful with these habits.",
  },
];

const TemplatesPage = () => {
  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-8">
      <h1 className="my-5 text-2xl font-bold">Templates</h1>
      <p className="text-gray-600">
        Feeling overwhelmed? These templates can get you started on just about
        anything.
      </p>
      <div className="relative mt-10 flex flex-col items-center gap-y-5 rounded-xl">
        {templates.map((template) => {
          return (
            <Card
              className="h-[156px] w-2/3 cursor-pointer hover:shadow-md"
              key={template.key}
            >
              <div className="relative flex h-full flex-row items-center">
                <div className="flex h-[156px] w-[156px] flex-col items-center justify-center bg-gray-200 text-white">
                  <Image
                    width="120"
                    height="120"
                    src={template.image}
                    alt=""
                  ></Image>
                </div>
                <CardHeader className="space-y-3">
                  <CardTitle>{template.title}</CardTitle>
                  <p className="text-md text-gray-500">
                    {template.description}
                  </p>
                </CardHeader>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TemplatesPage;
