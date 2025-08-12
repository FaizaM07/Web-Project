"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
   const router = useRouter();

   return (
      <Image
         onClick={() => router.push("/")}
         alt="Logo"
         className="hidden md:block cursor-pointer rounded-full"
         width={80}
         height={80}
         src="/images/chill2.png"
      />
   );
};

export default Logo;
