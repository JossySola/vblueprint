import { auth } from "@/lib/auth/server";
import { neon } from "@neondatabase/serverless";

export default async function Page({ params }: {
    params: Promise<{id: string}>
}) {
    const sql = neon(process.env.DATABASE_URL!);
    const { data: session } = await auth.getSession();
    const { id } = await params;
    const userId = session?.user.id;
// http://localhost:3000/layout/0fad1533-916d-47bf-b0a2-ec2490b5bd89
    if (userId && id) {
        const payload = await sql`
        SELECT layout, title FROM vblueprint_layouts
        WHERE id = ${id} AND userId = ${userId};
        `;
        return (
            <>
            </>
        )
    }
    return (
        <h1>Unauthorized</h1>
    )
}