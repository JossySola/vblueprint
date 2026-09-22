'use server'
import { auth } from "@/lib/auth/server";
import { LocationItems } from "@/lib/types";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";

export async function saveNewLayout(payload: {
    title: string,
    data: Array<{ [index: string]: string | number}>,
    floorLocations: LocationItems,
}) {
    let layoutId = null;
    const { data: session } = await auth.getSession();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    const userId = session.user.id;
    try {
        const sql = neon(process.env.DATABASE_URL!);
        const result = await sql`
            INSERT INTO vblueprint_layouts (userId, title, layout, floorLocations)
            VALUES (
                ${userId},
                ${payload.title},
                ${JSON.stringify(payload.data)},
                ${JSON.stringify(Array.from(payload.floorLocations))}
            )
            RETURNING id;
        `;
        layoutId = result;
    } catch (e: unknown) {
        console.error(e);
        throw new Error('Unknown error');
    }
    if (layoutId !== null) {
        redirect(`/layout/${layoutId[0].id}`);
    }
}