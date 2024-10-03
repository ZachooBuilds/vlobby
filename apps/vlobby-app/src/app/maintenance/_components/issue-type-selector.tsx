import { BuildingIconPath, FacilityIconPath, SpacesIconPath } from "../../../../public/svg/icons";



export const IssueTypeToggle = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const options = [
    { value: "facility", icon: <FacilityIconPath />, label: "Facility" },
    { value: "space", icon: <SpacesIconPath />, label: "Space" },
    { value: "general", icon: <BuildingIconPath />, label: "General" },
  ];
  console.log("value", value);
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
            className={`h-5 w-5 ${value === option.value ? "fill-white" : ""}`}
          >
            {option.icon}
          </div>
          <span className="text-sm font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
