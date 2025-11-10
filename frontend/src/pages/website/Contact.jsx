import React from "react";

const Contact = () => {
  return (
    <div className="w-full">
      <div className="w-full flex pt-20 px-20">
        <div className="w-full">
          <div className="text-4xl font-bold text-gray-900 ">
            How can we help you today?
          </div>
          <div className="text-gray-500">
            Submit your info and we'll get back to you as soon as possible.
          </div>
        </div>
        <form className="w-full grid grid-cols-2 gap-4 bg-gray-50 shadow-sm rounded-2xl p-8">
          <div>
            <label className="block text-sm font-medium mb-1">First name</label>
            <input
              type="text"
              placeholder="First name"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input
              type="text"
              placeholder="Last name"
              className="w-full border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="sarina@gmail.com"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone number
            </label>
            <input
              type="number"
              placeholder="+977"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300"
            />
          </div>
          <div className="col-span-2">
            <label>Message</label>
            <textarea
              rows="3"
              placeholder="Enter your message"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-300 resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer py-2  text-white bg-[#7D3BEC] rounded-md col-span-2 font-semibold"
          >
            Submit
          </button>
          <div className="col-span-2">
            We process your information in accordance with our{" "}
            <span className="text-[#7D3BEC] font-medium">Privacy Policy</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
