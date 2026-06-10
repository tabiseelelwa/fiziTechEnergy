import style from '@/app/styles/client/accueilClient.module.scss'
// import Link from 'next/link'
const ToutesVentes = () => {
    return (
        <div className={style.listeVentes}>
            <div className={style.listVenteHead}>
                <h1>Les ventes du jour</h1>
                {/* <Link className={style.btnAjouterVente} href={'/vente'}>NOUVELLE VENTE</Link> */}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID VENTE</th>
                        <th>DATE VENTE</th>
                        <th>TELEPHONE CLIENT</th>
                        <th>FORFAIT</th>
                        <th>MONTANT</th>
                        {/* <th></th> */}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>01</td>
                        <td>ighdsgfjdshfkjsjdsjgf</td>
                        <td>05/06/2026</td>
                        <td>+243 978 024 163</td>
                        <td>3 heures</td>
                        <td>2000</td>
                        {/* <td></td> */}
                    </tr>
                    <tr>
                        <td>02</td>
                        <td>ighdsgfjdshfkjsjdsjgf</td>
                        <td>05/06/2026</td>
                        <td>+243 978 024 163</td>
                        <td>3 heures</td>
                        <td>2000</td>
                        {/* <td></td> */}
                    </tr>
                    <tr>
                        <td>03</td>
                        <td>ighdsgfjdshfkjsjdsjgf</td>
                        <td>05/06/2026</td>
                        <td>+243 978 024 163</td>
                        <td>3 heures</td>
                        <td>2000</td>
                        {/* <td></td> */}
                    </tr>
                    <tr>
                        <td>04</td>
                        <td>ighdsgfjdshfkjsjdsjgf</td>
                        <td>05/06/2026</td>
                        <td>+243 978 024 163</td>
                        <td>3 heures</td>
                        <td>2000</td>
                        {/* <td></td> */}
                    </tr>
                    <tr>
                        <td>05</td>
                        <td>ighdsgfjdshfkjsjdsjgf</td>
                        <td>05/06/2026</td>
                        <td>+243 978 024 163</td>
                        <td>3 heures</td>
                        <td>2000</td>
                        {/* <td></td> */}
                    </tr>
                    <tr>
                        <td>06</td>
                        <td>ighdsgfjdshfkjsjdsjgf</td>
                        <td>05/06/2026</td>
                        <td>+243 978 024 163</td>
                        <td>3 heures</td>
                        <td>2000</td>
                        {/* <td></td> */}
                    </tr>
                    <tr>
                        <td>07</td>
                        <td>ighdsgfjdshfkjsjdsjgf</td>
                        <td>05/06/2026</td>
                        <td>+243 978 024 163</td>
                        <td>3 heures</td>
                        <td>2000</td>
                        {/* <td></td> */}
                    </tr>
                    <tr>
                        <td>08</td>
                        <td>ighdsgfjdshfkjsjdsjgf</td>
                        <td>05/06/2026</td>
                        <td>+243 978 024 163</td>
                        <td>3 heures</td>
                        <td>2000</td>
                        {/* <td></td> */}
                    </tr>
                    <tr>
                        <td>09</td>
                        <td>ighdsgfjdshfkjsjdsjgf</td>
                        <td>05/06/2026</td>
                        <td>+243 978 024 163</td>
                        <td>3 heures</td>
                        <td>2000</td>
                        {/* <td></td> */}
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>ighdsgfjdshfkjsjdsjgf</td>
                        <td>05/06/2026</td>
                        <td>+243 978 024 163</td>
                        <td>3 heures</td>
                        <td>2000</td>
                        {/* <td></td> */}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ToutesVentes