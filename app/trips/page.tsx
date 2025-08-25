import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservation";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";

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
                  title="No trips found"
                  subTitle="Looks like you haven't reserved any trips."
               />
            </ClientOnly>
         );
      }


   } catch (error) {
      console.error("Error fetching trips:", error);
      return (
         <ClientOnly>
            <EmptyState
               title="Something went wrong"
               subTitle="Failed to load your trips. Please try again later."
            />
         </ClientOnly>
      );
   }
};



export default TripsPage;
