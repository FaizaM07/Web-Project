"use client";
import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
   data: SafeListing | null;
   reservation?: SafeReservation;
   onAction?: (id: string) => void;
   disabled?: boolean;
   actionLabel?: string;
   actionId?: string;
   currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
   data,
   reservation,
   onAction,
   disabled,
   actionLabel,
   actionId = "",
   currentUser,
}) => {
   const router = useRouter();
   const { getByValue } = useCountries();
   
   const handleCancel = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
         e.stopPropagation();

         if (disabled) return;

         onAction?.(actionId);
      },
      [onAction, actionId, disabled]
   );

   const price = useMemo(() => {
      if (!data) return 0;
      if (reservation) {
         return reservation.totalPrice;
      }
      return data.price;
   }, [reservation, data]);

   const reservationDate = useMemo(() => {
      if (!reservation) {
         return null;
      }

      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);

      return `${format(start, "PP")} - ${format(end, "PP")}`;
   }, [reservation]);
   
   // Return null if data is null
   if (!data) {
     return null;
   }
   
   const location = getByValue(data.locationValue);

   return (
      <div
         onClick={() => router.push(`/listings/${data.id}`)}
         className="col-span-1 cursor-pointer group"
      >
         <div className="flex flex-col gap-2 w-full">
            <div className="aspect-square w-ful relative overflow-hidden rounded-xl">
               <Image
                  alt="Listing"
                  src={data.imageSrc}
                  className="object-cover h-full w-full group-hover:scale-110 transition"
                  fill
               />
               <div className="absolute top-3 right-3">
                  <HeartButton listingId={data.id} currentUser={currentUser} />
               </div>
            </div>
            <div className="font-semibold text-lg truncate">
               {data.city 
                  ? `${data.city}, ${location?.label}`
                  : location?.label
               }
            </div>
            
            <div className="text-sm text-neutral-500 font-light">
               {reservationDate || data.category}
            </div>
            
            <div className="flex justify-between items-center mt-2">
               <div className="flex flex-col">
                  {reservation?.user?.name && (
                     <span className="font-medium text-neutral-700 text-sm">{reservation.user.name}</span>
                  )}
               </div>
               <div className="flex items-center gap-1">
                  <span className="font-semibold text-lg">${price}</span>
                  {!reservation && <span className="font-light text-neutral-500 text-sm">night</span>}
                  {reservation && <span className="font-light text-neutral-500 text-sm">total</span>}
               </div>
            </div>
            {onAction && actionLabel && (
               <div className="mt-2">
                  <Button disabled={disabled} small label={actionLabel} onClick={handleCancel} />
               </div>
            )}
         </div>
      </div>
   );
};

export default ListingCard;
