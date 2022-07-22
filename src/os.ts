export async function weakEnvGet(
  variable: string,
): Promise<false | string | undefined> {
  const query: Deno.PermissionDescriptor = { name: "env" as const, variable };
  const permissionResponse: Deno.PermissionStatus = await Deno.permissions
    .query(query);
  const isGranted: boolean = permissionResponse.state === "granted";
  return isGranted && Deno.env.get(variable);
}
