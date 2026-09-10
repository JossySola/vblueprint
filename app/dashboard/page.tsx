import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
    const { data: session } = await auth.getSession();

    if (!session) redirect('/sign-in');

    return (
      <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
        <h1 className="mb-4 text-4xl">
            <span className="font-bold underline">{session.user.name}</span> Dashboard
        </h1>
      </div>
    );
}
