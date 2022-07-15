export async function weakEnvGet(
  variable: string,
): Promise<false | string | undefined> {
  const query = { name: "env" as const, variable };
  const permissionResponse = await Deno.permissions.query(query);
  const isGranted = permissionResponse.state === "granted";
  return isGranted && Deno.env.get(variable);
}
