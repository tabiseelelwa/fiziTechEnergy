/* eslint-disable react/no-unescaped-entities */
import style from "@/app/styles/client/detailsTicket.module.scss"

const Ticket = () => {
    return (
        <div className={style.ticket}>
            <span><strong>Téléphone</strong> : +243 822 077 545</span>
            <span><strong>Ticket</strong> : fjlmax</span>
            <span><strong>Expiration</strong> :Jeudi 12 octobre 2026 à 00h:23min:48sec</span>
        </div>
    )
}

export default Ticket