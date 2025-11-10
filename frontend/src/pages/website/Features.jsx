import React from "react";

const featuresData = [
  {
    title: "Create Tasks",
    description:
      "Easily create new tasks with title, description, and due dates.",
  },
  {
    title: "Assign Users",
    description: "Assign tasks to team members and track responsibilities.",
  },
  {
    title: "Track Progress",
    description:
      "Monitor the status of tasks: pending, in-progress, or completed.",
  },
  {
    title: "Notifications",
    description: "Receive notifications when tasks are assigned or updated.",
  },
  {
    title: "Prioritize Tasks",
    description: "Set task priorities to focus on the most important work.",
  },
  {
    title: "Reports & Analytics",
    description: "Generate reports on task completion and team performance.",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
