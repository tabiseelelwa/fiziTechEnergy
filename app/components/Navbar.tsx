import style from "@/app/styles/client/navbar.module.scss"
import Link from "next/link"

export const Navbar = () => {
    return (
        <div className={style.navbarContainer}>
            <div className={style.menuItems}>
                <Link href={"/"}>Accueil</Link>
                <Link href={"/ticket"}>Ticket</Link>
            </div>
        </div>
    )
}