import { useState } from 'react';
import { X, Award, RotateCcw, ArrowRight } from 'lucide-react';

interface LevelQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGroup: (group: string) => void;
}

export default function LevelQuizModal({ isOpen, onClose, onSelectGroup }: LevelQuizModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    distanceAndTerrain: 2,
    handlingSkills: 2,
    climbingAndPace: 2,
  });
  const [result, setResult] = useState<{
    tech: number;
    phys: number;
    group: string;
    advice: string;
  } | null>(null);

  const calculateResult = (ans: typeof answers) => {
    const tech = Math.min(5, Math.max(1, ans.handlingSkills));
    const phys = Math.min(5, Math.max(1, Math.round((ans.distanceAndTerrain + ans.climbingAndPace) / 2)));
    
    let group = 'Groupe Tempo / Convivial';
    let advice = 'Vous avez une belle base d’endurance et vous profiterez pleinement de nos sorties club régulières. Idéal pour rouler en groupe sans stress.';
    if (phys <= 2) {
      group = 'Groupe Découverte & Social Ride';
      advice = 'Parfait pour le dimanche matin et nos sorties accessibles. Nous vous accompagnerons pour progresser en douceur.';
    } else if (phys >= 4) {
      group = 'Groupe Sport & Aventure';
      advice = 'Vous aimez envoyer du braquet et avaler les kilomètres. Nos sorties ardennaises et nos raids gravel sont taillés pour vous.';
    }

    setResult({ tech, phys, group, advice });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      calculateResult(answers);
      setStep(4);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setAnswers({ distanceAndTerrain: 2, handlingSkills: 2, climbingAndPace: 2 });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-xl shadow-2xl relative overflow-hidden text-stone-900">
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span className="font-display text-lg font-bold uppercase text-stone-900 tracking-wide">
              Diagnostic KM0 : Trouver son Niveau
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step <= 3 && (
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-6 text-xs text-stone-500 font-semibold">
                <span>Question {step} sur 3</span>
                <span className="font-mono text-amber-700">Étape {step}/3</span>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold uppercase text-stone-950">
                    1. Vos sorties cyclistes habituelles
                  </h3>
                  <p className="text-xs text-stone-600">
                    Quelle est votre distance et fréquence moyenne lors d’une sortie dominicale ?
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {[
                      { val: 1, title: '25 à 45 km', sub: 'Rythme promenade, quelques arrêts pour souffler' },
                      { val: 2, title: '50 à 75 km', sub: 'Rythme régulier, sorties de 2 à 3 heures sans problème' },
                      { val: 3, title: '75 à 100 km', sub: 'Habitué au dénivelé modéré et sorties de 3 à 4 heures' },
                      { val: 4, title: '100 à 140 km+', sub: 'Entraînement régulier, grandes sorties et cyclosportives' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setAnswers({ ...answers, distanceAndTerrain: opt.val })}
                        className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                          answers.distanceAndTerrain === opt.val
                            ? 'bg-blue-50 border-[#1e2f47] text-stone-950 ring-1 ring-[#1e2f47]/30'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-bold">{opt.title}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{opt.sub}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            answers.distanceAndTerrain === opt.val
                              ? 'border-[#1e2f47] bg-[#1e2f47]'
                              : 'border-stone-300'
                          }`}
                        >
                          {answers.distanceAndTerrain === opt.val && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold uppercase text-stone-950">
                    2. Votre aisance technique &amp; terrain
                  </h3>
                  <p className="text-xs text-stone-600">
                    Comment réagissez-vous face à la boue d’hiver, aux cailloux ou aux pavés glissants ?
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {[
                      { val: 1, title: 'Asphalte et pistes lisses', sub: 'Je préfère éviter la boue et les pentes raides' },
                      { val: 2, title: 'Chemins de terre & graviers propres', sub: 'À l’aise sur le gravel classique et sous-bois secs' },
                      { val: 3, title: 'Singletracks ardennais & racines', sub: 'J’aime quand ça bouge, je passe les ornières et les pavés' },
                      { val: 4, title: 'Passages engagés, pierriers & devers', sub: 'Pilote aguerri en VTT et gravel technique' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setAnswers({ ...answers, handlingSkills: opt.val })}
                        className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                          answers.handlingSkills === opt.val
                            ? 'bg-blue-50 border-[#1e2f47] text-stone-950 ring-1 ring-[#1e2f47]/30'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-bold">{opt.title}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{opt.sub}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            answers.handlingSkills === opt.val
                              ? 'border-[#1e2f47] bg-[#1e2f47]'
                              : 'border-stone-300'
                          }`}
                        >
                          {answers.handlingSkills === opt.val && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold uppercase text-stone-950">
                    3. Votre profil dans les côtes (dénivelé)
                  </h3>
                  <p className="text-xs text-stone-600">
                    Face aux raidards belges (Redoute, Mur de Huy, monts flandriens) :
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {[
                      { val: 1, title: 'Au train, en moulinant tout à gauche', sub: 'Je gère mon souffle tranquillement' },
                      { val: 2, title: 'Régulier et constant', sub: 'Je grimpe à mon rythme sans me mettre dans le rouge' },
                      { val: 3, title: 'Tonique et dynamique', sub: 'J’aime relancer au sommet et maintenir une bonne cadence' },
                      { val: 4, title: 'Puncheur ou grimpeur d’endurance', sub: 'Prêt à enchaîner 1 500m à 2 000m de D+ sans faiblir' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setAnswers({ ...answers, climbingAndPace: opt.val })}
                        className={`w-full p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                          answers.climbingAndPace === opt.val
                            ? 'bg-blue-50 border-[#1e2f47] text-stone-950 ring-1 ring-[#1e2f47]/30'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-bold">{opt.title}</div>
                          <div className="text-xs text-stone-500 mt-0.5">{opt.sub}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            answers.climbingAndPace === opt.val
                              ? 'border-[#1e2f47] bg-[#1e2f47]'
                              : 'border-stone-300'
                          }`}
                        >
                          {answers.climbingAndPace === opt.val && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation button */}
              <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    ← Précédent
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#1e2f47] hover:bg-[#152336] rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{step === 3 ? 'Voir mon diagnostic' : 'Suivant'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && result && (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center mx-auto text-[#1e2f47]">
                <Award className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#1e2f47] font-bold block mb-1">
                  Votre Profil Cycliste KM0
                </span>
                <h3 className="font-display text-3xl font-black uppercase text-stone-950">
                  {result.group}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200 max-w-sm mx-auto">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-stone-500 uppercase font-mono font-bold mb-1">Niveau Technique</span>
                  <div className="font-display text-3xl font-black text-[#1e2f47]">T{result.tech} / 5</div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-stone-500 uppercase font-mono font-bold mb-1">Niveau Physique</span>
                  <div className="font-display text-3xl font-black text-stone-900">P{result.phys} / 5</div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                {result.advice}
              </p>

              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onSelectGroup(result.group);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white bg-[#1e2f47] hover:bg-[#152336] rounded-xl shadow-xs cursor-pointer"
                >
                  Voir les sorties adaptées à mon profil
                </button>
                <button
                  onClick={handleReset}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recommencer le test</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
