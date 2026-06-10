import style from '@/app/styles/client/venteTicket.module.scss'
import Link from 'next/link'
const AccueilClient = () => {
    return (
        <div className={style.formAchatForfait}>
            <h2>Achat forfait</h2>
            <form >
                <input type="text" placeholder='Tél : 978 024 163' />
                <select id='forfait'>
                    <option>Choisir le forfait</option>
                    <option value="">3 heures (1500 Fc)</option>
                    <option value="">8 heures (3000 Fc)</option>
                    <option value="">24 heures (5000 Fc)</option>
                </select>

                <select id='operateur'>
                    <option>Choisir l&apos;opérateur</option>
                    <option value="">M-Pesa</option>
                    <option value="">Airtel Money</option>
                    <option value="">Orange Money</option>
                </select>
                <button>Acheter</button>
                <Link href={'/ticket'}>Vérifier un ticket</Link>
            </form>
        </div>
    )
}

export default AccueilClient