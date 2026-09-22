import { auth } from '@/lib/auth/server';
import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';
import DashboardTable from './_components/table';
import { DashboardQueryResponse } from '@/lib/types';

export default async function Dashboard() {
  const { data: session } = await auth.getSession();
  const sql = neon(process.env.DATABASE_URL!);

  if (!session) redirect('/sign-in');

  const payload = (await sql`
    SELECT id, title 
    FROM vblueprint_layouts
    WHERE "userId" = ${session.user.id};
  `) as DashboardQueryResponse;

  if (!payload[0]) {
    return <h1>No layouts available</h1>
  }
  
  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
      <h1 className="mb-4 text-4xl">
        <span className="font-bold underline">{session.user.name}</span> Dashboard
        <DashboardTable payload={payload} />
      </h1>
    </div>
  );
}