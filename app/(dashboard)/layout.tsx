'use client'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'


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

    if (loading) return <div className="p-6">Chargement FiziTech...</div>;
    if (!user) return null;

    return (
        <div>
            <main className="min-h-screen w-full p-4">
                <div>{children}</div>
            </main>
        </div>
    )
}