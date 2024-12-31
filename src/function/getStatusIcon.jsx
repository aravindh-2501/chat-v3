import { CheckIcon } from "@heroicons/react/24/outline";

const getStatusIcon = (status) => {
  switch (status) {
    case "sent":
      return <CheckIcon className="w-3 h-3 stroke-[4px]" />;

    case "delivered":
      return (
        <div className="flex items-center">
          <CheckIcon className="w-3 h-3 stroke-[4px]" />
          <CheckIcon className="w-3 h-3 stroke-[4px]" />
        </div>
      );

    case "read":
      return (
        <div className="flex items-center gap-1">
          <CheckIcon className="text-primary w-3 h-3 stroke-[4px]" />
          <CheckIcon className="text-primary w-3 h-3 stroke-[4px]" />
        </div>
      );

    default:
      return null;
  }
};

export default getStatusIcon;
