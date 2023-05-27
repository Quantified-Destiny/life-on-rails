import { InfoIcon } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle
} from "../components/ui/card";

import Image from "next/image";
import { Button } from "../components/ui/button";
import { api } from "../utils/api";
export const templates = [
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

export const TemplatesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Step 1: State variable for modal open/closed
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(""); // New state variable for selected template key

  const openModal = (key: string) => {
    setSelectedTemplateKey(key); // Set the selected template key
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); // Step 2: Function to close the modal
  };

  const context = api.useContext();
  const createFromTemplate = api.templates.createFromTemplate.useMutation({
    onSettled() {
      void context.invalidate();
    },
  });
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
              // onClick={() => createFromTemplate.mutate({ key: template.key })}
              onClick={() => openModal(template.key)}
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
          <div className="rounded-lg bg-white p-5">
            <div className="text-md mb-5 font-semibold">
              You are about to use the{" "}
              <span className="bg-gray-200 font-mono">
                {selectedTemplateKey}
              </span>{" "}
              template.{" "}
            </div>
            <div className="font-light text-gray-500">
              This will create multiple goals, habits, and metrics. This
              operation is irreversible.
            </div>
            <div className="mt-2 whitespace-nowrap align-baseline font-light text-gray-300">
              <InfoIcon className="inline"></InfoIcon> You can delete these
              items from the `All Items` page at any time.
            </div>{" "}
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>

              <Button
                variant="default"
                onClick={() => {
                  // Perform the goal creation action here
                  if (selectedTemplateKey) {
                    createFromTemplate.mutate({ key: selectedTemplateKey });
                  }
                  closeModal(); // Close the modal after confirming
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
