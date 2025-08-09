import prisma from "@/app/libs/prismadb";
import { SafeReservation } from "../types";

interface IParams {
   listingId?: string;
   userId?: string;
   authorId?: string;
}

export default async function getReservations(params: IParams) {

}
