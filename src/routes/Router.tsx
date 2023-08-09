import { useRoutes } from "react-router-dom";
import Events from "components/events/Events";
import AuthGuard from "components/auth/AuthGuard";

export default function Router() {
  return useRoutes([
    {
      path: "/events",
      element: (
        <AuthGuard>
          <Events />
        </AuthGuard>
      ),
    },
    // {
    //     path: "/event/:eventId",
    //     element: (
    //         <AuthGuard>
    //             <EventDetails/>
    //         </AuthGuard>
    //     )
    // },
  ]);
}