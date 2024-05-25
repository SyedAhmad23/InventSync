// import React from "react";
// import { usePathname, useRouter } from "next/navigation";

// interface Props {
//   children?: React.ReactNode;
// }

// const ProtectedRoute: React.FC<Props> = ({ children }) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [loading, setLoading] = React.useState(true);
//   const publicRoutes = React.useMemo(
//     () => ["sign-up", "login", "forgot-password"],
//     []
//   );
//   const url = pathname.split("/")[1];

//   React.useEffect(() => {
//     const isAuthenticated = localStorage.getItem("token");
//     if (!isAuthenticated && !publicRoutes.includes(url)) {
//       router.push("/login");
//     }
//     if (isAuthenticated && publicRoutes.includes(url)) {
//       router.push("/dashboard");
//     }
//     setLoading(false);
//   }, [url, publicRoutes, router]);

//   return {children};
// };

// export default ProtectedRoute;
