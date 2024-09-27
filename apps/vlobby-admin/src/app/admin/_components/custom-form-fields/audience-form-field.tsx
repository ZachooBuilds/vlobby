// import { useFormContext, Controller } from "react-hook-form";

// import { useQuery } from "convex/react";
// import { api } from "@repo/backend/convex/_generated/api";
// import { Id } from "@repo/backend/convex/_generated/dataModel";


type AudienceFieldProps = {
  index: number;
  buildingId?: string;
};

const AudienceField = ({ index, buildingId }: AudienceFieldProps) => {
  return (
    <div>
      Placeholder for AudienceField component
    </div>
  );
};

export default AudienceField;

// // Remaining code commented out:
// /*
// const AudienceField = ({ index, buildingId }: AudienceFieldProps) => {
//   const { control, watch } = useFormContext();
//   const selectedType = watch(`audience.${index}.type`) as string;

//   const occupants = useQuery(api.occupants.getAll);
//   const buildings = useQuery(api.site.getAllSites);
//   const spaces = useQuery(api.spaces.getAllSpaces);
//   const spaceTypes = useQuery(api.spaces.getAllSpaceTypes);

//   console.log("building ID in audience field :", buildingId);

//   //get floor list based on if a building has been selected
//   const getFloorList = useQuery(
//     api.site.getFloorList,
//     watch("buildingId") || buildingId
//       ? { id: (watch("buildingId") || buildingId) as Id<"sites"> }
//       : "skip",
//   ) as { index: number; name: string }[] | undefined;

//   const fetchEntities = (type: string): { _id: string; name: string }[] => {
//     switch (type) {
//       case "floor":
//         if (!buildingId) return [];
//         return (
//           getFloorList?.map((floor: { index: number; name: string }) => ({
//             _id: floor.index.toString(),
//             name: floor.name,
//           })) ?? []
//         );
//       case "occupant":
//         return (
//           occupants?.map((occupant: Occupant) => ({
//             _id: occupant._id,
//             name: occupant.firstName + " " + occupant.lastName,
//           })) ?? []
//         );
//       case "building":
//         return (
//           buildings?.map((building: BuildingFormValues) => ({
//             _id: building._id!,
//             name: building.name,
//           })) ?? []
//         );
//       case "space":
//         return (
//           spaces?.map((space: SpaceSummary) => ({
//             _id: space._id,
//             name: space.spaceName,
//           })) ?? []
//         );
//       case "spaceType":
//         return (
//           spaceTypes?.map((spaceType: SpaceType) => ({
//             _id: spaceType._id,
//             name: spaceType.name,
//           })) ?? []
//         );
//       default:
//         return [];
//     }
//   };

//   const entities = fetchEntities(selectedType);

//   return (
//     <div className="flex w-full flex-row items-end justify-start gap-2">
//       {/* Audience Type Field */}
//       <Controller
//         control={control}
//         name={`audience.${index}.type`}
//         render={({ field }) => (
//           <FormItem className="w-full">
//             {index === 0 && <FormLabel>Type</FormLabel>}
//             <Select
//               onValueChange={(value) => {
//                 field.onChange(value);
//               }}
//               defaultValue={field.value as string}
//             >
//               <FormControl>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select type" />
//                 </SelectTrigger>
//               </FormControl>
//               <SelectContent>
//                 <SelectItem value="floor">Floor</SelectItem>
//                 <SelectItem value="occupant">User</SelectItem>
//                 <SelectItem value="building">Building</SelectItem>
//                 <SelectItem value="space">Space</SelectItem>
//                 <SelectItem value="spaceType">Space Type</SelectItem>
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )}
//       />

//       {/* Audience Entity Field */}
//       <Controller
//         control={control}
//         name={`audience.${index}.entity`}
//         render={({ field }) => (
//           <FormItem className="w-full">
//             {index === 0 && <FormLabel>Entity</FormLabel>}
//             <Select
//               onValueChange={field.onChange}
//               defaultValue={field.value as string}
//             >
//               <FormControl>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select entity" />
//                 </SelectTrigger>
//               </FormControl>
//               <SelectContent>
//                 {entities ? (
//                   entities.map((entity) => (
//                     <SelectItem key={entity._id} value={entity._id}>
//                       {entity.name}
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <Skeleton className="h-10 w-full" />
//                 )}
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </div>
//   );
// };
// */
