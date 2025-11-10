import React from "react";
import Button from "../../components/Button";
import { HomeImage } from "../../assets/images";

const Home = () => {
  return (
    <div>
      <div className="grid place-items-center pt-24 py-12 text-center gap-4">
        <div className="text-4xl font-bold">
          Your tasks, always{" "}
          <span className="text-indigo-500">under control.</span>
        </div>
        <div className="w-lg">
          Empowers you and your team to plan, track, and complete work
          effortlessly—anytime, anywhere.
        </div>
        <Button label="Get Started" />
      </div>
      <div className="flex items-center justify-center">
        <img
          src={HomeImage}
          className="h-[500px] object-center blur-[1px] rounded-md"
          alt="Manpower illustration"
        />
      </div>
    </div>
  );
};

export default Home;
