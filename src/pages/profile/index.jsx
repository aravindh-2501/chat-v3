import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { avatars } from "../../content/data";
import apiClient from "../../api/apiInstance";
import { UPDATE_PROFILE } from "../../api/endPoints";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const setAvatar = useUserStore((state) => state.setAvatar);
  const navigate = useNavigate();

  // console.log({ currentUser });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: currentUser?.username || "",
    },
  });

  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar);

  const onSubmit = async (data) => {
    if (!selectedAvatar) {
      alert("Please select an avatar.");
      return;
    }

    try {
      const response = await apiClient.put(
        `${UPDATE_PROFILE}/${currentUser?._id}`,
        {
          avatar: selectedAvatar,
          username: data.username,
        }
      );
      const updatedAvatar = response.data.user;
      const { username, avatar } = updatedAvatar;
      console.log({ updatedAvatar });
      setAvatar({ username, avatar });
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-base-200 p-6">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-[26rem] border border-base-300 p-6 rounded-lg shadow-lg bg-base-100">
        <div className="flex items-center justify-between mb-6">
          <button
            className="text-base-content hover:text-base-content"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h3 className="font-medium text-xl text-base-content">Profile</h3>
          <p></p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 text-base-content">
            Select Avatar
          </h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`relative w-14 h-14 rounded-full overflow-hidden cursor-pointer border-2 ${
                  selectedAvatar === avatar
                    ? "border-primary"
                    : "border-base-300"
                }`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <img
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {selectedAvatar === avatar && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center text-white text-xl">
                    ✔
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            {/* <label
              htmlFor="username"
              className="block text-sm font-medium text-base-content"
            >
              Username
            </label> */}
            <input
              id="username"
              type="text"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required",
                },
                maxLength: {
                  value: 20,
                  message: "Maximum 20 characters allowed",
                },
              })}
              placeholder="enter use classy name"
              className="w-full p-3 mt-2 border border-base-300 rounded-md shadow-sm bg-base-200 text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded-md text-lg font-medium hover:bg-primary-focus transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export { Profile };
