import React from "react";
import { EbishaProfile, PrakritiProfile, SarinaProfile } from "../../assets/images";

const About = () => {
  const teamMembers = [
    {
      name: "Sarina Shrestha",
      role: "CEO & Founder",
      image: SarinaProfile,
    },
    {
      name: "Ebisha Dahal",
      role: "Co-Founder",
      image: EbishaProfile,
    },
    {
      name: "Prakriti Khadka",
      role: "COO",
      image: PrakritiProfile,
    },
  ];

  return (
    <div className=" mx-auto px-6 py-16 bg-gradient-to-br from-purple-100 to-white min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Meet our team</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Our team has designed and delivered robust project management systems
          that simplify complex workflows, improve collaboration, and drive
          efficiency across teams.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center px-24">
        {teamMembers.map((member, index) => (
          <div key={index} className="text-center group">
            {/* Profile Image Container */}
            <div
              className={`w-48 h-48 rounded-full bg-green-200 p-2 mx-auto mb-6 shadow-md group-hover:shadow-xl transition-shadow duration-300`}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* Name and Role */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {member.name}
            </h3>
            <p className="text-gray-600 text-lg">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
