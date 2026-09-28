'use server'
import { auth } from "@/lib/auth/server";
import { GarmentType, ProductCategory } from "@/lib/types";
import { neon } from "@neondatabase/serverless";

export async function saveLayoutInventory(layoutId: string, products: unknown[], categories: unknown[]) {
    const { data: session } = await auth.getSession();
    if (!session?.user) throw new Error("Unauthorized");
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
        UPDATE vblueprint_layouts
        SET products = ${JSON.stringify(products)}::jsonb,
            labels = ${JSON.stringify(categories)}::jsonb
        WHERE id = ${layoutId} AND "userId" = ${session.user.id};
    `;
}
export async function saveNewLabel(layoutId: string, newLabels: Array<ProductCategory>) {
    const { data: session } = await auth.getSession();
    if (!session?.user) throw new Error("Unauthorized");
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
        UPDATE vblueprint_layouts
        SET labels = ${JSON.stringify(newLabels)}
        WHERE id = ${layoutId} AND "userId" = ${session.user.id};
    `;
}
export async function saveNewItem(
    layoutId: string,
    item: GarmentType[]
) {
    const { data: session } = await auth.getSession();
    if (!session?.user) throw new Error("Unauthorized");
    const sql = neon(process.env.DATABASE_URL!);
    await sql`
        UPDATE vblueprint_layouts
        SET products = ${JSON.stringify(item)}
        WHERE id = ${layoutId} AND "userId" = ${session.user.id};
    `;
}