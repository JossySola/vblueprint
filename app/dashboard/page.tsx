import { auth } from '@/lib/auth/server';
import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';
import DashboardTable from './_components/table';
import { DashboardQueryResponse } from '@/lib/types';
import Options from './_components/options';

export default async function Dashboard() {
  const { data: session } = await auth.getSession();
  const sql = neon(process.env.DATABASE_URL!);

  if (!session) redirect('/sign-in');

  const payload = (await sql`
    SELECT id, title 
    FROM vblueprint_layouts
    WHERE "userId" = ${session.user.id};
  `) as DashboardQueryResponse;
  
  return (
    <section className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900 p-5">
      <span className="font-bold underline">{session.user.name}</span> Dashboard
      <Options />
      <DashboardTable payload={payload} />
    </section>
  );
}