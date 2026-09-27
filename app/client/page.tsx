/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTarifs, TarifData } from "@/app/services/tarif/tarifService";
import { BeatLoader } from "react-spinners";

export default function PortailCaptifEmpireLab() {
  const router = useRouter();

  const { data: forfaits = [], isLoading, isError } = useQuery<TarifData[]>({
    queryKey: ["forfaits-publics"],
    queryFn: getTarifs,
  });

  const selectionnerForfait = (idForfait: number) => {
    router.push(`/client/achat?forfait=${idForfait}`);
  };

  const verifForfait = () => {
    router.push("/client/ticket");
  };

  const achatTicket = () => {
    router.push("/client/connexion");
  };

  return (
    <div className="min-h-screen max-w-[500px] mx-auto flex flex-col items-center gap-2 justify-center px-4 py-6">
      <div className="bg-[#0070f3] px-1.5 py-1 w-full rounded-[0.5rem]">
        <h1 className="text-white text-[28px] text-center font-bold">
          Empire-Lab Hotspot
        </h1>
      </div>

      <div className="font-bold mt-2 mb-2">
        <h2 className="text-[18px]">Choisissez votre forfait</h2>
      </div>

      {isLoading && (
        <div className="py-12 flex justify-center">
          <BeatLoader color="#0070f3" />
        </div>
      )}

      {isError && (
        <p className="text-red-500 text-sm text-center py-4">
          Impossible de charger les forfaits. Veuillez réinventer votre connexion.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-6 w-full">
          {forfaits.map((forfait) => {
            const isPopulaire = Boolean(forfait.designation === 'Forfait 24 heures');

            return (
              <div
                key={forfait.codeTypeForfait}
                className={`flex justify-between items-center relative gap-2 py-[1.25rem] px-[10px] rounded-[14px] bg-white border-[1px] ${isPopulaire
                  ? "border-[2px] border-[#0070f3] shadow-[0_4px_12px_rgba(0,112,243,0.1)]"
                  : "border-[#e5e7eb] shadow-[0_2px_4px_rgba(0,0,0,0.11)]"
                  }`}
              >
                {isPopulaire && (
                  <span className="absolute text-[13px] top-[-15px] right-[15px] bg-[#0070f3] text-white py-[5px] px-[10px] rounded-[20px] uppercase font-semibold">
                    Le plus vendu
                  </span>
                )}

                <div className="inline gap-16">
                  <h3 className="text-[16px] font-bold mt-0 mr-0 mb-[4px] ml-0">
                    {forfait.designation}
                  </h3>
                  <p className="text-[12px] text-[#6b7280]">
                    {forfait.description}
                  </p>
                  <span className="text-[22px] font-extrabold block">
                    {Number(forfait.prix).toLocaleString("fr-FR")} FC
                  </span>
                </div>

                <button
                  onClick={() => selectionnerForfait(forfait.codeTypeForfait)}
                  className="text-[18px] font-bold bg-[#0070f3] px-[10px] py-[12px] cursor-pointer text-white rounded-[10px] shrink-0"
                >
                  Choisir
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 w-full mt-2">
        <button
          onClick={() => achatTicket()}
          className="bg-[#F8FAFC] w-full py-[0.5rem] border-2 border-[#2563EB] text-[#2563EB] font-semibold px-0 rounded-[0.35rem] cursor-pointer"
        >
          J'ai un ticket
        </button>
        <button
          onClick={() => verifForfait()}
          className="bg-[#64748B] w-full py-[0.5rem] px-0 text-white font-semibold rounded-[0.35rem] cursor-pointer"
        >
          Vérifier mon ticket
        </button>
      </div>
    </div>
  );
}