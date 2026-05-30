/* eslint-disable react/no-unescaped-entities */
'use client'
import style from '@/app/styles/client/acccueil.module.scss'
import Link from 'next/link'
const AccueilClient = () => {
    return (
        <div className={style.accueil}>
            <form className="formulaire">
                <h2>Veuillez completer ce formulaire</h2>
                <input type="tel" placeholder="Numéro téléphone (+243 999 942 102)" required />
                <select>
                    <option value="">Choisir le forfait</option>
                    <option value="">Forfait 1 heure</option>
                    <option value="">Forfait 8 heures</option>
                    <option value="">Forfait 24 heures</option>
                </select>
                <select>
                    <option value="">Choisir l'opérateur</option>
                    <option value="">M-pesa</option>
                    <option value="">Airtel Money</option>
                    <option value="">Orange Money</option>
                    <option value="">Afrimoney</option>
                </select>

                <button>Payer</button>
                <div className={style.montant}>
                    {/* <Link href="/">Retour à l'accueil</Link> */}
                    <Link href="/ticket">Vérifier un ticket</Link>
                </div>
            </form>
        </div>
    )
}

export default AccueilClient