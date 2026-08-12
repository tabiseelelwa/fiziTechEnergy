'use client';

import { useState} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { BeatLoader } from 'react-spinners';
import { BsCheckCircleFill, BsX } from 'react-icons/bs';

interface Forfait {
  codeTypeForfait: number;
  designation: string;
  dureeMinutes: number;
  prixFC: number;
}

interface VenteTickets {
  setModalVenteTicket: (value: boolean) => void;
}

interface VentePayload {
  telephone: string;
  durationMins: number;
  prix: number;
  codeTypeForfait: number;
  modePaiement: string;
}

interface VenteResponse {
  ticket: {
    code: string;
  };
}

const fetchForfaits = async (): Promise<Forfait[]> => {
  const { data } = await axios.get('/api/typeForfait');

  // Si l'API renvoie { typesForfait: [...] }
  if (data && Array.isArray(data.typesForfait)) {
    return data.typesForfait;
  }

  // Fallbacks de sécurité au cas où la structure change
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;

  return [];
};

export const VendeurPage = ({ setModalVenteTicket }: VenteTickets) => {
  const queryClient = useQueryClient();

  // États du formulaire
  const [telephone, setTelephone] = useState('');
  // 1. Déclaration de forfaitId acceptant number, string ou null
  const [forfaitId, setForfaitId] = useState<number | string | null>(null);
  const [modePaiement, setModePaiement] = useState('Cash');

  // État du ticket généré
  const [ticketGenere, setTicketGenere] = useState<{
    code: string;
    telephone: string;
    designation: string;
    prix: string;
  } | null>(null);

  // 1. Récupération des forfaits depuis la BDD
  const {
    data: forfaits = [],
    isLoading: isLoadingForfaits,
    isError: isErrorForfaits,
  } = useQuery({
    queryKey: ['forfaits-list'],
    queryFn: fetchForfaits,
    staleTime: 1000 * 60 * 60,
  });

  const effectiveForfaitId = forfaitId ?? forfaits[0]?.codeTypeForfait ?? '';

  // 2. Mutation pour enregistrer la vente
  const venteMutation = useMutation({
    mutationFn: async (payload: VentePayload) => {
      const response = await axios.post<VenteResponse>('/api/vente', payload);
      return response.data;
    },
    onSuccess: (data) => {
      const selectedForfait = forfaits.find(
        (f) => f.codeTypeForfait === Number(forfaitId)
      );

      setTicketGenere({
        code: data.ticket.code,
        telephone: telephone.trim(),
        designation: selectedForfait ? selectedForfait.designation : 'Forfait',
        prix: selectedForfait ? `${selectedForfait.prixFC.toLocaleString()} FC` : '',
      });

      setTelephone('');

      // Rafraîchit les statistiques du dashboard
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
    },
  });

  const selectedForfait = forfaits.find(
    (f) => f.codeTypeForfait === Number(effectiveForfaitId)
  );

  const handleVendreTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketGenere(null);

    if (!selectedForfait) return;

    venteMutation.mutate({
      telephone: telephone.trim(),
      durationMins: selectedForfait.dureeMinutes, 
      prix: selectedForfait.prixFC,
      codeTypeForfait: selectedForfait.codeTypeForfait,
      modePaiement,
    });
  };

  const errorMessage = venteMutation.isError
    ? (venteMutation.error as AxiosError<{ message?: string }>)?.response?.data?.message ||
      'Erreur lors de la création du ticket.'
    : null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/70 z-[1000] backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[500px] rounded-[16px] relative text-center text-[#1f2937] animate-[fadeModalIn_250ms_ease-out]">
        <div className="p-4">
          <div className="flex flex-col gap-[1rem] w-full">
            <div className="flex justify-end items-center text-[16px] font-semibold cursor-pointer w-full">
              <button
                type="button"
                onClick={() => setModalVenteTicket(false)}
                className="flex items-center gap-[0.5rem] bg-[#ff0000] p-[5px] text-[28px] text-white rounded-[0.5rem] font-bold cursor-pointer border-0"
              >
                <BsX />
              </button>
            </div>

            <h3 className="text-[18px] text-[#0070f3] font-[900]">PAIEMENT CASH</h3>

            {errorMessage && (
              <div className="p-[12px] bg-[#fee2e2] text-[#dc2626] font-normal text-[13px] rounded-[10px]">
                ⚠️ {errorMessage}
              </div>
            )}

            {isErrorForfaits && (
              <div className="p-[12px] bg-[#fee2e2] text-[#dc2626] font-normal text-[13px] rounded-[10px]">
                Impossible de charger la liste des forfaits depuis le serveur.
              </div>
            )}

            {/* Formulaire de Vente */}
            <form onSubmit={handleVendreTicket} className="flex flex-col gap-[1.2rem]">
              <div>
                <label className="block mb-[6px] text-[13px] font-semibold text-[#4b5563] text-left">
                  Numéro de téléphone du client *
                </label>
                <input
                  className="p-[12px] rounded-[10px] border border-[#d1d5db] text-[15px] box-border outline-0 w-full"
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="Ex: 0812345678"
                />
              </div>

              <div>
                <label className="block mb-[6px] text-[13px] font-semibold text-[#4b5563] text-left">
                  Forfait sélectionné *
                </label>
                <select
                  className="p-[12px] rounded-[10px] border border-[#d1d5db] text-[15px] box-border outline-0 w-full disabled:bg-slate-100"
                  value={effectiveForfaitId}
                  disabled={isLoadingForfaits || forfaits.length === 0}
                  onChange={(e) => setForfaitId(Number(e.target.value))}
                >
                  {isLoadingForfaits ? (
                    <option value="">Chargement des forfaits...</option>
                  ) : forfaits.length === 0 ? (
                    <option value="">Aucun forfait trouvé</option>
                  ) : (
                    forfaits.map((f) => (
                      <option key={f.codeTypeForfait} value={f.codeTypeForfait}>
                        {f.designation} — {f.prixFC.toLocaleString()} FC
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-[6px] text-[13px] font-semibold text-[#4b5563] text-left">
                  Mode de règlement *
                </label>
                <select
                  className="p-[12px] rounded-[10px] border border-[#d1d5db] text-[15px] box-border outline-0 w-full"
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value)}
                >
                  <option value="Cash">Espèces (Cash au comptoir)</option>
                  <option value="M-Pesa">Direct Cash (M-Pesa Vendeur)</option>
                  <option value="Airtel-Money">Direct Cash (Airtel Vendeur)</option>
                </select>
              </div>

              <button
                className="w-full p-[14px] rounded-[10px] border-0 text-white mt-[10px] text-[15px] font-bold"
                type="submit"
                disabled={venteMutation.isPending || isLoadingForfaits || !selectedForfait}
                style={{
                  backgroundColor:
                    venteMutation.isPending || isLoadingForfaits ? '#9ca3af' : '#22c55e',
                  cursor:
                    venteMutation.isPending || isLoadingForfaits ? 'not-allowed' : 'pointer',
                }}
              >
                {venteMutation.isPending ? (
                  <BeatLoader style={{ color: '#fff' }} color={'#fff'} size={8} />
                ) : selectedForfait ? (
                  `Valider la vente (${selectedForfait.prixFC.toLocaleString()} FC)`
                ) : (
                  'Valider la vente'
                )}
              </button>
            </form>
          </div>

          {/* Modal du ticket généré */}
          {ticketGenere && (
            <div className="fixed inset-0 flex justify-center items-center bg-black/70 z-[1000] backdrop-blur-sm p-4">
              <div className="bg-white max-w-[500px] rounded-[16px] w-full relative text-center text-[#1f2937] animate-[fadeModalIn_300ms_ease-out]">
                <div className="flex flex-col items-center justify-center text-[#1f2937] p-[1.5rem]">
                  <div className="flex items-center justify-center gap-[8px] text-[#22c55e] mb-[12px]">
                    <BsCheckCircleFill size={28} />
                    <span className="font-bold text-[18px] uppercase">Vente Enregistrée</span>
                  </div>

                  <p className="text-[14px] text-[#4b5563] my-[8px] mx-0">
                    Code du ticket à remettre au client :
                  </p>

                  <div className="bg-[#f3f4f6] p-[15px] rounded-[12px] border-2 border-dashed border-blue-500 my-[15px] w-full">
                    <h2 className="text-[38px] text-[#1d4ed8] tracking-widest m-0 font-bold">
                      {ticketGenere.code}
                    </h2>
                  </div>

                  <div className="text-left text-[14px] bg-[#f9fafb] py-[16px] px-[12px] rounded-[8px] border border-[#e5e7eb] w-full">
                    <div className="mt-[6px]">
                      <strong>Client :</strong> {ticketGenere.telephone}
                    </div>
                    <div className="mt-[6px]">
                      <strong>Forfait :</strong> {ticketGenere.designation}
                    </div>
                    <div className="mt-[6px]">
                      <strong>Montant payé :</strong> {ticketGenere.prix}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTicketGenere(null);
                      setModalVenteTicket(false);
                    }}
                    className="mt-[20px] w-full p-[12px] bg-[#2563eb] text-white border-0 rounded-[8px] text-[15px] font-bold cursor-pointer"
                  >
                    Fermer et retourner au tableau de bord
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};