import { auth } from "@/lib/auth/server";
import { neon } from "@neondatabase/serverless";
import Layout from "./_components/Layout";
import { LocationItemsJSON, SHAPE_TYPE } from "@/lib/types";

type QueryRow = {
    "layout": Array<SHAPE_TYPE> | null,
    "title": string | null,
    "floorLocations": LocationItemsJSON | null,
    "otherLocations": LocationItemsJSON | null,
};
type QueryResponse = QueryRow[];

export default async function Page({ params }: {
    params: Promise<{id: string}>
}) {
    const sql = neon(process.env.DATABASE_URL!);
    const { data: session } = await auth.getSession();
    const { id } = await params;
    const userId = session?.user.id;
    // http://localhost:3000/layout/0fad1533-916d-47bf-b0a2-ec2490b5bd89
    if (userId && id) {
        const payload = (await sql`
        SELECT layout, title, "floorLocations", "otherLocations" 
        FROM vblueprint_layouts
        WHERE id = ${id} AND "userId" = ${userId};
        `) as QueryResponse;

        if (!payload[0]) {
            return <h1>Layout not found</h1>
        }

        return <Layout 
        storedTitle={payload[0].title ?? "Untitled"} 
        storedLayouts={payload[0].layout ?? []} 
        storedFloorLocations={new Map(payload[0].floorLocations ?? [])} 
        storedOtherLocations={new Map(payload[0].otherLocations ?? [])}
        />
    }
    return (
        <h1>Unauthorized</h1>
    )
}