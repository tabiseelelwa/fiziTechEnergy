"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { BsCheckCircleFill, BsX } from "react-icons/bs";
import { createVente, VentePayload } from "@/app/services/vente/venteService";

interface Forfait {
  codeTypeForfait: number;
  designation: string;
  dureeMinutes: number;
  prixFC: number;
}

interface VenteTickets {
  setModalVenteTicket: (value: boolean) => void;
}

const fetchForfaits = async (): Promise<Forfait[]> => {
  const { data } = await axios.get("/api/typeForfait");

  if (data && Array.isArray(data.typesForfait)) {
    return data.typesForfait;
  }
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;

  return [];
};

export const VendeurPage = ({ setModalVenteTicket }: VenteTickets) => {
  const queryClient = useQueryClient();

  const [formdata, setFormData] = useState<VentePayload>({
    telephone: "",
    codeTypeForfait: 4,
    operateur: "Cash",
    nomClient: "",
  });

  const [ticketGenere, setTicketGenere] = useState<{
    code: string;
    telephone: string;
    designation: string;
    prixFC: string;
  } | null>(null);

  // 2. Chargement des forfaits
  const {
    data: forfaits = [],
    isLoading: isLoadingForfaits,
    isError: isErrorForfaits,
  } = useQuery({
    queryKey: ["forfaits-list"],
    queryFn: fetchForfaits,
    staleTime: 1000 * 60 * 5,
  });

  const effectiveForfaitId = formdata.codeTypeForfait ?? forfaits[0]?.codeTypeForfait ?? "";

  const selectedForfait = forfaits.find(
    (f) => Number(f.codeTypeForfait) === Number(effectiveForfaitId)
  );

 const { mutate, isError, error, isPending } = useMutation({
  mutationFn: createVente,
  onSuccess: (data) => {
    queryClient.invalidateQueries({ 
      queryKey: ["ventes"],
      exact: false 
    });

    if (selectedForfait && data?.ticket) {
      setTicketGenere({
        code: data.ticket.code,
        telephone: formdata.telephone,
        designation: selectedForfait.designation,
        prixFC: `${selectedForfait.prixFC.toLocaleString()} FC`,
      });
    }
  },
});

  const handleVendreTicket = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formdata);
  };

  return (
    <>
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

              <h3 className="text-[18px] text-[#0070f3] font-[900]">
                PAIEMENT CASH
              </h3>

              {isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                  {axios.isAxiosError(error)
                    ? error.response?.data?.message ||
                    "Une erreur est survenue lors de la création."
                    : "Une erreur inattendue est survenue."}
                </div>
              )}

              {isErrorForfaits && (
                <div className="p-[12px] bg-[#fee2e2] text-[#dc2626] font-normal text-[13px] rounded-[10px]">
                  Impossible de charger la liste des forfaits depuis le serveur.
                </div>
              )}

              <form onSubmit={handleVendreTicket} className="flex flex-col gap-[1.2rem]">
                <div>
                  <label className="block mb-[6px] text-[13px] font-semibold text-[#4b5563] text-left">
                    Numéro de téléphone du client *
                  </label>
                  <input
                    className="p-[12px] rounded-[10px] border border-[#d1d5db] text-[15px] box-border outline-0 w-full"
                    type="tel"
                    required
                    value={formdata.telephone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, telephone: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        codeTypeForfait: Number(e.target.value),
                      }))
                    }
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
                    value={formdata.operateur}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, operateur: e.target.value }))
                    }
                  >
                    <option value="Cash">Espèces (Cash au comptoir)</option>
                    <option value="M-Pesa">M-Pesa Vendeur</option>
                    <option value="Airtel-Money">DAirtel Vendeur</option>
                  </select>
                </div>

                <button
                  className="w-full p-[14px] rounded-[10px] border-0 text-white mt-[10px] text-[15px] font-bold transition-all"
                  type="submit"
                  disabled={
                    isPending || isLoadingForfaits || !selectedForfait
                  }
                  style={{
                    backgroundColor:
                      isPending || isLoadingForfaits || !selectedForfait
                        ? "#9ca3af"
                        : "#22c55e",
                    cursor:
                      isPending || isLoadingForfaits || !selectedForfait
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isPending ? (
                    <BeatLoader color="#fff" size={8} />
                  ) : selectedForfait ? (
                    `Valider la vente (${selectedForfait.prixFC.toLocaleString()} FC)`
                  ) : (
                    "Valider la vente"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {ticketGenere && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/70 z-[1100] backdrop-blur-sm p-4">
          <div className="bg-white max-w-[500px] rounded-[16px] w-full relative text-center text-[#1f2937] animate-[fadeModalIn_300ms_ease-out]">
            <div className="flex flex-col items-center justify-center text-[#1f2937] p-[1.5rem]">
              <div className="flex items-center justify-center gap-[8px] text-[#22c55e] mb-[12px]">
                <BsCheckCircleFill size={28} />
                <span className="font-bold text-[18px] uppercase">
                  Vente Enregistrée
                </span>
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
                  <strong>Montant payé :</strong> {ticketGenere.prixFC}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTicketGenere(null);
                  setModalVenteTicket(false); // Ferme tout après affichage du ticket
                }}
                className="mt-[20px] w-full p-[12px] bg-[#2563eb] text-white border-0 rounded-[8px] text-[15px] font-bold cursor-pointer hover:bg-blue-700 transition"
              >
                Fermer et retourner au tableau de bord
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
