'use client'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CircleLoader } from 'react-spinners'


export default function CustomerLayout({
    children
}: Readonly<{ children: React.ReactNode }>) {

    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) return <div className="flex justify-center items-center p-6 absolute z-[1000] h-screen bg-white inset-0 text-[60px]"><CircleLoader/></div>;
    if (!user) return null;

    return (
        <div>
            <main className="w-full">
                <div>{children}</div>
            </main>
        </div>
    )
}