export const dynamic = "force-dynamic";
import getCurrentUser from "./actions/getCurrentUser";




const Home = async () => {
 
   const currentUser = await getCurrentUser();

}
export default Home;
