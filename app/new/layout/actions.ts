'use server'
import { auth } from "@/lib/auth/server";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";

export async function saveNewLayout(payload: {
    title: string,
    data: Array<{ [index: string]: string | number }>
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
            INSERT INTO vblueprint_layouts (userId, layout)
            VALUES (
                ${userId},
                ${JSON.stringify(payload)}
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