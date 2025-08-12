import { SitesTestResponse } from "@/server/models/interfaces";
import { parseAccessBars } from "./parser";
import { AccessBar, latencyBar, statusBar } from "@/server/models/client/bars";

export async function fetchAccessAndStatusBars(
  username: string
): Promise<{ access: AccessBar[]; status: statusBar }> {
  const params = new URLSearchParams({
    category: "all",
    username,
  });

  const res = await fetch(
    `http://localhost:3000/api/access?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  // ✅ Parse once
  let res_parse: { access: AccessBar[]; status: statusBar } = await res.json();
  console.log("this is the res_parse", res_parse);

  return res_parse;
}

export async function fetchLatencyBars(
  username: string
): Promise<latencyBar[]> {
  const params = new URLSearchParams({
    username,
  });

  const res = await fetch(
    `http://localhost:3000/api/realDelay?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  // ✅ Parse once
  let res_parse: latencyBar[] = await res.json();
  return res_parse;
}
