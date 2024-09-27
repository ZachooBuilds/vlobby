import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { addMinutes, format, isBefore, isWithinInterval } from "date-fns";
import { BookingFormDataWithNames } from "../../../lib/app-data/app-types";
import { Button } from "@repo/ui/components/ui/button";

const generateTimeSlots = (
  startTime: Date,
  endTime: Date,
  interval: number,
  date: Date,
) => {
  const slots = [];
  let current = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    new Date(startTime).getHours(),
    new Date(startTime).getMinutes(),
  );
  const end = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    new Date(endTime).getHours(),
    new Date(endTime).getMinutes(),
  );

  while (isBefore(current, end)) {
    slots.push(current);
    current = addMinutes(current, interval);
  }
  return slots;
};

interface BookingSlotsProps {
  startTime: Date;
  bookingSlots?: {
    slotIndex: number;
    slotTime: Date;
  }[];
  endTime: Date;
  date: Date;
  interval: number;
  maxSlots: number;
  bookings: BookingFormDataWithNames[];
}

const BookingSlots = ({
  bookingSlots,
  startTime,
  date,
  endTime,
  interval,
  maxSlots,
  bookings,
}: BookingSlotsProps) => {
  const { setValue } = useFormContext();

  console.log("in slot creation date:", date);

  const slots = generateTimeSlots(startTime, endTime, interval, date).map(
    (slot, index) => ({
      id: index,
      startTime: slot,
      isBooked: bookings?.some((booking) =>
        isWithinInterval(slot, {
          start: booking.startTime,
          end: booking.endTime,
        }),
      ),
    }),
  );

  const [selectedSlots, setSelectedSlots] = useState<
    { id: number; slotTime: Date }[]
  >([]);
  useEffect(() => {
    // Reset selected slots if startTime or endTime changes
    const initialSlots =
      bookingSlots?.map((slot) => ({
        id: slot.slotIndex,
        slotTime: new Date(slot.slotTime),
      })) ?? [];

    setSelectedSlots(initialSlots);

    // Update form values
    setValue(
      "slots",
      initialSlots.map((slot) => ({
        slotIndex: slot.id,
        slotTime: slot.slotTime,
      })),
    );
  }, [startTime, endTime, bookingSlots, setValue]);

  const handleSlotClick = (id: number) => {
    setSelectedSlots((prev) => {
      // If the slot is already selected, remove it
      if (prev.some((slot) => slot.id === id)) {
        const newSlots = prev.filter((slot) => slot.id !== id);
        setValue(
          "slots",
          newSlots.map((slot) => ({
            slotIndex: slot.id,
            slotTime: slot.slotTime,
          })),
        ); // Update form field value
        return newSlots;
      }

      const isNeighbouring = prev.some((slot) => Math.abs(slot.id - id) === 1);
      const isBelowRange =
        prev.length > 0 && id < Math.min(...prev.map((slot) => slot.id));

      // Add the new slot if it meets any of the conditions
      if (isNeighbouring) {
        const newSlots = [...prev, { id, slotTime: slots[id]!.startTime }].sort(
          (a, b) => a.id - b.id,
        );

        // Ensure we don't exceed maxSlots
        if (newSlots.length > maxSlots) {
          if (isBelowRange) {
            newSlots.pop(); // Remove the last (latest) slot
          } else {
            newSlots.shift(); // Remove the first (earliest) slot
          }
        }

        setValue(
          "slots",
          newSlots.map((slot) => ({
            slotIndex: slot.id,
            slotTime: slot.slotTime,
          })),
        ); // Update form field value
        return newSlots;
      }

      // If none of the conditions are met, start a new selection
      const newSelection = [{ id, slotTime: slots[id]!.startTime }];
      setValue(
        "slots",
        newSelection.map((slot) => ({
          slotIndex: slot.id,
          slotTime: slot.slotTime,
        })),
      ); // Update form field value
      return newSelection;
    });
  };

  return (
    <div>
      <div className="flex w-full flex-col items-start justify-start gap-2 pb-4">
        <p className="text-sm font-medium">Slots</p>
        <p className="text-xs text-muted-foreground">
          Select the slots for this booking.
        </p>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {slots.map((slot) => (
          <Button
            key={slot.id}
            disabled={slot.isBooked}
            type="button"
            onClick={() => handleSlotClick(slot.id)}
            variant={
              slot.isBooked
                ? "secondary"
                : selectedSlots.some((s) => s.id === slot.id)
                  ? "default"
                  : "outline"
            }
          >
            {format(slot.startTime, "h:mm aa")}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BookingSlots;
