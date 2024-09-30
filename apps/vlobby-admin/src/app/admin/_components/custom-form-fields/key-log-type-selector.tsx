import { UserIcon, HardHatIcon, UserPlusIcon } from "lucide-react";

const options = [
  { value: "Visitor", icon: <UserPlusIcon />, label: "Visitor" },
  { value: "Occupant", icon: <UserIcon />, label: "Occupant" },
  { value: "Contractor", icon: <HardHatIcon />, label: "Contractor" },
];

export const KeyLogTypeToggle = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg p-4 transition-colors ${
            value === option.value
              ? "bg-primary text-white"
              : "bg-white hover:bg-muted"
          }`}
        >
          <div
            className={`h-5 w-5 ${value === option.value ? "text-white" : "text-primary"}`}
          >
            {option.icon}
          </div>
          <span className="text-sm font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
