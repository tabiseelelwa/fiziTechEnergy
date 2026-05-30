'use client'
import style from '@/app/styles/client/ticket.module.scss'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RechTicket = () => {
    const router = useRouter();
    const rechercher = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        router.push('');
    }
    return (
        <div className={style.rechercher}>
            <form onSubmit={rechercher}>
                <h2>Vérifiez votre ticket</h2>
                <input type="tel" placeholder='Entrez votre numéro de téléphone. Ne mettez pas' required />
                <Link id={style.btnRech} href="/ticket/dddd">Rechercher</Link>
                <Link id={style.retour} href='/'>Retour</Link>
            </form>
        </div>
    )
}

export default RechTicket