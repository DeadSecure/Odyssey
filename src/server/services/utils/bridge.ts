import { AccessBar, latencyBar, statusBar } from "@/server/models/client/bars";

export async function fetchAccessAndStatusBars(
  username: string
): Promise<{ access: AccessBar[]; status: statusBar }> {
  const params = new URLSearchParams({
    category: "all",
    username,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/access?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  // ✅ Parse once
  let res_parse: { access: AccessBar[]; status: statusBar } = await res.json();
  console.log(
    "these are the bars from the fetchAccessBars, they are: ",
    res,
    res_parse
  );
  return res_parse;
}

export async function fetchLatencyBars(
  username: string
): Promise<latencyBar[]> {
  const params = new URLSearchParams({
    username,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/realDelay?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  // ✅ Parse once
  let res_parse: latencyBar[] = await res.json();
  console.log(
    "these are the bars from the fetchLatencyBars, they are: ",
    res,
    res_parse
  );
  return res_parse;
}
