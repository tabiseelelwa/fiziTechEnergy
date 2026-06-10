import { Navbar } from '@/app/components/Navbar'
import style from '@/app/styles/acccueil.module.scss'

export default function UserLayout({
    children
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            <Navbar />
            <main className={style.accueilClient}>
                <div>{children}</div>
            </main>
        </div>
    )
}