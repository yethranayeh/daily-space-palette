import { Navigate } from "react-router";

import { getFormattedDate } from "@/lib/getFormattedDate";
import { readPrerenderedRecord } from "@/lib/prerendered";

export function HomeRoute() {
  // ? The build's newest record is the latest picture NASA has published, which
  //   may be yesterday if the build ran before the midnight Eastern update
  const prerendered = readPrerenderedRecord();
  const date = prerendered?.picture?.date ?? getFormattedDate();

  return <Navigate to={`/${date}`} replace />;
}
