import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservation";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import TripsClient from "./TripsClient";

const TripsPage = async () => {
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return (
         <ClientOnly>
            <EmptyState title="Unauthorized" subTitle="Please Login" />
         </ClientOnly>
      );
   }

   try {
      const reservations = await getReservations({ userId: currentUser.id });

      if (reservations.length === 0) {
         return (
            <ClientOnly>
               <EmptyState
                  title="No bookings found"
                  subTitle="Looks like you haven't made any bookings yet."
               />
            </ClientOnly>
         );
      }

      
      const validReservations = reservations.filter(reservation => reservation.listing !== null);

      if (validReservations.length === 0) {
         return (
            <ClientOnly>
               <EmptyState
                  title="No valid bookings found"
                  subTitle="Some of your booked properties may no longer be available"
               />
            </ClientOnly>
         );
      }


      return (
         <ClientOnly>
            <TripsClient reservations={validReservations} currentUser={currentUser} />
         </ClientOnly>
      );


   } catch (error) {
      console.error("Error fetching trips:", error);
      return (
         <ClientOnly>
            <EmptyState
               title="Something went wrong"
               subTitle="Failed to load your bookings. Please try again later."
            />
         </ClientOnly>
      );
   }
};



export default TripsPage;
