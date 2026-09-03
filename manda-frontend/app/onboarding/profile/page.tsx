"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";

const QUESTIONS = [
  { key: "monthly_salary", label: "Combien gagnes-tu par mois ?", suffix: "DH", type: "number" },
  { key: "salary_day", label: "Quel jour du mois reçois-tu ton salaire ?", suffix: "", type: "number" },
  { key: "fixed_charges", label: "À combien s'élèvent tes charges fixes ?", suffix: "DH", type: "number" },
  { key: "current_savings", label: "Combien as-tu déjà épargné aujourd'hui ?", suffix: "DH", type: "number" },
];

export default function FinancialProfilePage() {
  const router = useRouter();

  // États pour le profil
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // États pour le formulaire (questionnaire)
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  // Récupération du profil existant
  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (!token || !storedUser) {
        router.push("/login");
        return;
      }
      const user = JSON.parse(storedUser);

      try {
        const res = await fetch(`http://localhost:8000/users/${user.id}/financial-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          // Pas de profil → on reste en mode création
          setProfile(null);
        } else if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Erreur de chargement");
        } else {
          const data = await res.json();
          setProfile(data);
          // Pré-remplir les réponses si on veut éditer plus tard
          setAnswers({
            monthly_salary: data.monthly_salary?.toString() || "",
            salary_day: data.salary_day?.toString() || "",
            fixed_charges: data.fixed_charges?.toString() || "",
            current_savings: data.current_savings?.toString() || "",
          });
        }
      } catch (err) {
        console.error(err);
        setProfile(null); // en cas d'erreur, on considère qu'il n'y a pas de profil
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, [router]);

  // Gestion du changement de champ
  function handleChange(value: string) {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
  }

  // Soumission (création ou mise à jour)
  async function handleSubmit() {
    setError("");
    const value = answers[current.key];
    if (!value && current.key !== "current_savings") {
      setError("Cette info est nécessaire pour continuer");
      return;
    }

    // Si ce n'est pas la dernière étape, on avance
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    // Dernière étape → envoi au backend
    setLoading(true);
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(storedUser);

    const payload = {
      monthly_salary: parseFloat(answers.monthly_salary),
      salary_day: parseInt(answers.salary_day),
      fixed_charges: parseFloat(answers.fixed_charges || "0"),
      current_savings: parseFloat(answers.current_savings || "0"),
    };

    try {
      const res = await fetch(`http://localhost:8000/users/${user.id}/financial-profile`, {
        method: "POST", // upsert : crée ou met à jour
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur lors de l'enregistrement");
      }

      // Recharger le profil mis à jour
      const updated = await res.json();
      setProfile(updated);
      setAnswers({
        monthly_salary: updated.monthly_salary?.toString() || "",
        salary_day: updated.salary_day?.toString() || "",
        fixed_charges: updated.fixed_charges?.toString() || "",
        current_savings: updated.current_savings?.toString() || "",
      });
      setIsEditing(false);
      setStep(0);
      router.push("/dashboard"); // ou rester sur la page, selon votre besoin
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  }

  // Annuler l'édition et revenir à l'affichage
  function cancelEdit() {
    if (profile) {
      // Restaurer les réponses avec les données du profil
      setAnswers({
        monthly_salary: profile.monthly_salary?.toString() || "",
        salary_day: profile.salary_day?.toString() || "",
        fixed_charges: profile.fixed_charges?.toString() || "",
        current_savings: profile.current_savings?.toString() || "",
      });
      setIsEditing(false);
      setStep(0);
      setError("");
    } else {
      // Pas de profil → on quitte la page ou on réinitialise
      router.push("/dashboard");
    }
  }

  // Affichage du résumé du profil
  function renderSummary() {
    const fields = [
      { label: "Salaire mensuel", value: `${profile.monthly_salary} DH` },
      { label: "Jour de versement", value: `${profile.salary_day}` },
      { label: "Charges fixes", value: `${profile.fixed_charges} DH` },
      { label: "Épargne actuelle", value: `${profile.current_savings} DH` },
    ];

    return (
      <div className="max-w-sm w-full mx-auto flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[18px] font-bold text-[#0B1229]">Mon profil financier</h1>
          <button onClick={() => router.push("/dashboard")}>
            <X className="w-5 h-5 text-[#8B93A7]" />
          </button>
        </div>

        <div className="space-y-4 bg-gray-50 rounded-2xl p-6">
          {fields.map((f) => (
            <div key={f.label} className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-[#8B93A7]">{f.label}</span>
              <span className="text-base font-semibold text-[#0B1229]">{f.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setIsEditing(true);
            setStep(0);
            // Les réponses sont déjà pré-remplies dans l'état
          }}
          className="mt-6 w-full bg-[#2563EB] text-white font-medium py-3 rounded-full flex items-center justify-center gap-2"
        >
          <Pencil className="w-4 h-4" />
          Modifier
        </button>
      </div>
    );
  }

  // Affichage du questionnaire (création ou modification)
  function renderQuestionnaire() {
    return (
      <div className="max-w-sm w-full mx-auto flex-1 flex flex-col">
        {/* Progression */}
        <div className="flex gap-1.5 mb-16">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? "bg-[#2563EB]" : "bg-[#F0F2F5]"
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <h1 className="text-[26px] font-bold text-[#0B1229] leading-tight mb-8">
          {current.label}
        </h1>

        <div className="flex items-center border-b-2 border-[#2563EB] pb-2">
          <input
            type={current.type}
            autoFocus
            value={answers[current.key] || ""}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="0"
            className="flex-1 text-[28px] font-semibold text-[#0B1229] focus:outline-none"
          />
          {current.suffix && (
            <span className="text-[18px] text-[#8B93A7] ml-2">{current.suffix}</span>
          )}
        </div>

        {current.key === "current_savings" && (
          <p className="text-[12px] text-[#8B93A7] mt-3">
            Optionnel, laisse à 0 si rien pour l&apos;instant
          </p>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {/* Boutons de navigation */}
        <div className="mt-auto pt-8 space-y-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#0B1229] text-white font-medium py-4 rounded-full disabled:opacity-50"
          >
            {loading
              ? "Enregistrement..."
              : isLast
              ? profile && isEditing
                ? "Mettre à jour"
                : "Terminer"
              : "Suivant"}
          </button>

          {/* Bouton Annuler (visible uniquement en édition) */}
          {isEditing && (
            <button
              onClick={cancelEdit}
              className="w-full text-[#8B93A7] text-sm py-2"
            >
              Annuler
            </button>
          )}
        </div>
      </div>
    );
  }

  // Rendu principal
  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Si un profil existe et qu'on n'est pas en édition → afficher le résumé
  if (profile && !isEditing) {
    return (
      <div className="min-h-screen bg-white flex flex-col px-6 py-10">
        {renderSummary()}
      </div>
    );
  }

  // Sinon (pas de profil ou en édition) → afficher le questionnaire
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between px-6 py-10">
      {renderQuestionnaire()}
    </div>
  );
}