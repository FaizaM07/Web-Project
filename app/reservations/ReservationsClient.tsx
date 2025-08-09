"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SafeReservation, SafeUser } from "../types";
import Heading from "../components/Heading";
import Container from "../components/Container";

interface ReservationsClientProps {
   reservations: SafeReservation[];
   currentUser: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({ reservations, currentUser }) => {
   const router = useRouter();
   const [deletingId, setDeletingId] = useState("");

   return (
      <Container>
         <Heading title="Reservations" subtitle="Bookings on your properties" />
        
      </Container>
   );
};

export default ReservationsClient;
