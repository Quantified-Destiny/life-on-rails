import { IceCream } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useState } from "react";

import Image from "next/image";
import { templateRouter } from "../server/api/routers/templates";
import { api } from "../utils/api";
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Step 1: State variable for modal open/closed
  const [selectedTemplateKey, setSelectedTemplateKey] = useState(""); // New state variable for selected template key

  const openModal = (key:string) => {
    setSelectedTemplateKey(key); // Set the selected template key
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); // Step 2: Function to close the modal
  };

  const context = api.useContext();
  const createFromTemplate = api.templates.createFromTemplate.useMutation({
    onSettled() {
      void context.goals.invalidate();
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg">
          Are you sure you want to create a {selectedTemplateKey} template?
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 mr-2 bg-red-500 text-white rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={(key) => {
                  // Perform the goal creation action here
                  if (selectedTemplateKey){
                    createFromTemplate.mutate({key: selectedTemplateKey});
                  }
                  closeModal(); // Close the modal after confirming
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
