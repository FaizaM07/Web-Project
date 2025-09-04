"use client";

interface HeadingProps {
   title: string;
   subtitle?: string;
   center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, center }) => {
   return (
      <div className={`pt-6 mb-8 ${center ? "text-center" : "text-start"}`}>
         <div className="text-3xl font-bold text-neutral-800 mb-2">{title}</div>
         {subtitle && (
            <div className="font-normal text-neutral-600 text-lg max-w-2xl">
               {subtitle}
            </div>
         )}
      </div>
   );
};
export default Heading;
