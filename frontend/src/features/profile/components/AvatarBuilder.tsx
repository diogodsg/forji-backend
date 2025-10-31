import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiRefreshCw } from "react-icons/fi";

// Cores disponíveis para os diferentes elementos
const COLORS = [
  { id: "000000", name: "Preto", hex: "#000000" },
  { id: "6bd9e9", name: "Ciano", hex: "#6bd9e9" },
  { id: "77311d", name: "Marrom", hex: "#77311d" },
  { id: "9287ff", name: "Roxo", hex: "#9287ff" },
  { id: "ac6651", name: "Marrom Claro", hex: "#ac6651" },
  { id: "d2eff3", name: "Azul Claro", hex: "#d2eff3" },
  { id: "e0ddff", name: "Lavanda", hex: "#e0ddff" },
  { id: "f4d150", name: "Amarelo", hex: "#f4d150" },
  { id: "f9c9b6", name: "Pêssego", hex: "#f9c9b6" },
  { id: "fc909f", name: "Rosa", hex: "#fc909f" },
  { id: "ffeba4", name: "Amarelo Claro", hex: "#ffeba4" },
  { id: "ffedef", name: "Rosa Claro", hex: "#ffedef" },
  { id: "ffffff", name: "Branco", hex: "#ffffff" },
];

interface MicahConfig {
  baseColor: string[];
  earringColor: string;
  earrings: string;
  ears: string;
  eyeShadowColor: string;
  eyebrows: string;
  eyebrowsColor: string;
  eyes: string;
  eyesColor: string;
  facialHair: string;
  facialHairColor: string;
  glasses: string;
  glassesColor: string;
  hair: string;
  hairColor: string;
  mouth: string;
  mouthColor: string;
  nose: string;
  shirt: string;
  shirtColor: string;
}

interface AvatarBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avatarConfig: string) => void;
  currentAvatar?: string;
}

export function AvatarBuilder({
  isOpen,
  onClose,
  onSave,
  currentAvatar,
}: AvatarBuilderProps) {
  // Config padrão
  const defaultConfig: MicahConfig = {
    baseColor: ["77311d"],
    earringColor: "000000",
    earrings: "hoop",
    ears: "attached",
    eyeShadowColor: "d2eff3",
    eyebrows: "down",
    eyebrowsColor: "000000",
    eyes: "eyes",
    eyesColor: "000000",
    facialHair: "beard",
    facialHairColor: "000000",
    glasses: "round",
    glassesColor: "000000",
    hair: "dannyPhantom",
    hairColor: "000000",
    mouth: "frown",
    mouthColor: "000000",
    nose: "curve",
    shirt: "collared",
    shirtColor: "000000",
  };

  const generateRandomSeed = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Função para parsear um avatar customizado e extrair a configuração
  const parseCurrentAvatar = (
    avatarId?: string
  ): { seed: string; config: MicahConfig } => {
    if (!avatarId || !avatarId.startsWith("micah-")) {
      return { seed: generateRandomSeed(), config: defaultConfig };
    }

    try {
      // Formato: micah-{seed}-{bg}-{params}
      const parts = avatarId.split("-");
      const seed = parts[1] || generateRandomSeed();
      const paramsString = parts.slice(3).join("-");

      // Parse dos parâmetros da URL
      const params = new URLSearchParams(paramsString);

      const config: MicahConfig = {
        baseColor:
          params.get("baseColor")?.split(",") || defaultConfig.baseColor,
        earringColor: params.get("earringColor") || defaultConfig.earringColor,
        earrings:
          params.get("earringsProbability") === "0"
            ? ""
            : params.get("earrings") || defaultConfig.earrings,
        ears: params.get("ears") || defaultConfig.ears,
        eyeShadowColor:
          params.get("eyeShadowColor") || defaultConfig.eyeShadowColor,
        eyebrows: params.get("eyebrows") || defaultConfig.eyebrows,
        eyebrowsColor:
          params.get("eyebrowsColor") || defaultConfig.eyebrowsColor,
        eyes: params.get("eyes") || defaultConfig.eyes,
        eyesColor: params.get("eyesColor") || defaultConfig.eyesColor,
        facialHair:
          params.get("facialHairProbability") === "0"
            ? ""
            : params.get("facialHair") || defaultConfig.facialHair,
        facialHairColor:
          params.get("facialHairColor") || defaultConfig.facialHairColor,
        glasses:
          params.get("glassesProbability") === "0"
            ? ""
            : params.get("glasses") || defaultConfig.glasses,
        glassesColor: params.get("glassesColor") || defaultConfig.glassesColor,
        hair:
          params.get("hairProbability") === "0"
            ? ""
            : params.get("hair") || defaultConfig.hair,
        hairColor: params.get("hairColor") || defaultConfig.hairColor,
        mouth: params.get("mouth") || defaultConfig.mouth,
        mouthColor: params.get("mouthColor") || defaultConfig.mouthColor,
        nose: params.get("nose") || defaultConfig.nose,
        shirt: params.get("shirt") || defaultConfig.shirt,
        shirtColor: params.get("shirtColor") || defaultConfig.shirtColor,
      };

      return { seed, config };
    } catch (error) {
      console.error("Erro ao parsear avatar atual:", error);
      return { seed: generateRandomSeed(), config: defaultConfig };
    }
  };

  // Inicializa com o avatar atual ou usa valores padrão
  const initialState = parseCurrentAvatar(currentAvatar);
  const [seed, setSeed] = useState(initialState.seed);
  const [config, setConfig] = useState<MicahConfig>(initialState.config);
  const [activeTab, setActiveTab] = useState<
    "face" | "eyes" | "hair" | "accessories" | "body"
  >("face");

  // Reinicializa o estado quando o modal abrir com um novo avatar
  useEffect(() => {
    if (isOpen) {
      const newState = parseCurrentAvatar(currentAvatar);
      setSeed(newState.seed);
      setConfig(newState.config);
      setActiveTab("face"); // Volta para a primeira aba
    }
  }, [isOpen, currentAvatar]);

  const updateConfig = <K extends keyof MicahConfig>(
    key: K,
    value: MicahConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateBaseColor = (colorId: string) => {
    setConfig((prev) => ({
      ...prev,
      baseColor: [colorId], // Seleção única
    }));
  };

  const avatarUrl = useMemo(() => {
    const params = new URLSearchParams({
      backgroundColor: "d1d4f9", // Lavanda fixo
      baseColor: config.baseColor.join(","),
      ears: config.ears,
      eyeShadowColor: config.eyeShadowColor,
      eyebrows: config.eyebrows,
      eyebrowsColor: config.eyebrowsColor,
      eyes: config.eyes,
      eyesColor: config.eyesColor,
      mouth: config.mouth,
      mouthColor: config.mouthColor,
      nose: config.nose,
      shirt: config.shirt,
      shirtColor: config.shirtColor,
    });

    // Adiciona earrings apenas se não for vazio
    if (config.earrings) {
      params.append("earrings", config.earrings);
      params.append("earringColor", config.earringColor);
      params.append("earringsProbability", "100");
    } else {
      params.append("earringsProbability", "0");
    }

    // Adiciona glasses apenas se não for vazio
    if (config.glasses) {
      params.append("glasses", config.glasses);
      params.append("glassesColor", config.glassesColor);
      params.append("glassesProbability", "100");
    } else {
      params.append("glassesProbability", "0");
    }

    // Adiciona hair apenas se não for vazio
    if (config.hair) {
      params.append("hair", config.hair);
      params.append("hairColor", config.hairColor);
      params.append("hairProbability", "100");
    } else {
      params.append("hairProbability", "0");
    }

    // Adiciona facialHair apenas se não for vazio
    if (config.facialHair) {
      params.append("facialHair", config.facialHair);
      params.append("facialHairColor", config.facialHairColor);
      params.append("facialHairProbability", "100");
    } else {
      params.append("facialHairProbability", "0");
    }

    return `https://api.dicebear.com/7.x/micah/svg?seed=${seed}&${params.toString()}&size=200`;
  }, [seed, config]);

  const handleRandomize = () => {
    // Função para pegar item aleatório de um array
    const randomItem = <T,>(array: T[]): T => {
      return array[Math.floor(Math.random() * array.length)];
    };

    // Função para cor aleatória
    const randomColor = () => randomItem(COLORS).id;

    // Opções para cada categoria
    const eyebrowsOptions = ["down", "eyelashesDown", "up", "eyelashesUp"];
    const noseOptions = ["curve", "pointed", "tound"];
    const mouthOptions = [
      "smile",
      "laughing",
      "smirk",
      "surprised",
      "frown",
      "nervous",
      "pucker",
      "sad",
    ];
    const eyesOptions = ["eyes", "round", "smiling"];
    const hairOptions = [
      "",
      "dannyPhantom",
      "dougFunny",
      "fonze",
      "full",
      "mrT",
      "pixie",
      "turban",
    ];
    const facialHairOptions = ["", "beard", "scruff"];
    const earringsOptions = ["", "hoop", "stud"];
    const glassesOptions = ["", "round", "square"];
    const earsOptions = ["attached", "detached"];
    const shirtOptions = ["collared", "crew", "open"];
    const skinColors = ["77311d", "ac6651", "f9c9b6"];
    const shadowColors = ["d2eff3", "e0ddff", "ffeba4", "ffedef", "ffffff"];

    // Gera nova seed E nova configuração aleatória
    setSeed(generateRandomSeed());
    setConfig({
      baseColor: [randomItem(skinColors)],
      earringColor: randomColor(),
      earrings: randomItem(earringsOptions),
      ears: randomItem(earsOptions),
      eyeShadowColor: randomItem(shadowColors),
      eyebrows: randomItem(eyebrowsOptions),
      eyebrowsColor: "000000",
      eyes: randomItem(eyesOptions),
      eyesColor: randomColor(),
      facialHair: randomItem(facialHairOptions),
      facialHairColor: randomColor(),
      glasses: randomItem(glassesOptions),
      glassesColor: randomColor(),
      hair: randomItem(hairOptions),
      hairColor: randomColor(),
      mouth: randomItem(mouthOptions),
      mouthColor: "000000",
      nose: randomItem(noseOptions),
      shirt: randomItem(shirtOptions),
      shirtColor: randomColor(),
    });
  };

  const handleSave = () => {
    const params = new URLSearchParams({
      backgroundColor: "d1d4f9",
      baseColor: config.baseColor.join(","),
      ears: config.ears,
      eyeShadowColor: config.eyeShadowColor,
      eyebrows: config.eyebrows,
      eyebrowsColor: config.eyebrowsColor,
      eyes: config.eyes,
      eyesColor: config.eyesColor,
      mouth: config.mouth,
      mouthColor: config.mouthColor,
      nose: config.nose,
      shirt: config.shirt,
      shirtColor: config.shirtColor,
    });

    // Adiciona earrings apenas se não for vazio
    if (config.earrings) {
      params.append("earrings", config.earrings);
      params.append("earringColor", config.earringColor);
      params.append("earringsProbability", "100");
    } else {
      params.append("earringsProbability", "0");
    }

    // Adiciona glasses apenas se não for vazio
    if (config.glasses) {
      params.append("glasses", config.glasses);
      params.append("glassesColor", config.glassesColor);
      params.append("glassesProbability", "100");
    } else {
      params.append("glassesProbability", "0");
    }

    // Adiciona hair apenas se não for vazio
    if (config.hair) {
      params.append("hair", config.hair);
      params.append("hairColor", config.hairColor);
      params.append("hairProbability", "100");
    } else {
      params.append("hairProbability", "0");
    }

    // Adiciona facialHair apenas se não for vazio
    if (config.facialHair) {
      params.append("facialHair", config.facialHair);
      params.append("facialHairColor", config.facialHairColor);
      params.append("facialHairProbability", "100");
    } else {
      params.append("facialHairProbability", "0");
    }

    const avatarId = `micah-${seed}-d1d4f9-${params.toString()}`;
    onSave(avatarId);
  };

  if (!isOpen) return null;

  const ColorPicker = ({
    label,
    colors,
    selected,
    onChange,
  }: {
    label: string;
    colors: typeof COLORS;
    selected: string | string[];
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-surface-800 block">
        {label}
      </label>
      <div className="flex flex-wrap gap-2.5">
        {colors.map((color) => {
          const isSelected = Array.isArray(selected)
            ? selected.includes(color.id)
            : selected === color.id;
          return (
            <button
              key={color.id}
              onClick={() => onChange(color.id)}
              className={`relative w-10 h-10 rounded-xl transition-all ${
                isSelected
                  ? "ring-2 ring-brand-500 ring-offset-2 scale-110 shadow-lg"
                  : "hover:scale-105 shadow-md hover:shadow-lg"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-brand-500 rounded-full" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const SelectOption = ({
    label,
    options,
    selected,
    onChange,
  }: {
    label: string;
    options: { value: string; label: string }[];
    selected: string;
    onChange: (value: string) => void;
  }) => (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-surface-800 block">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              selected === option.value
                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md scale-105"
                : "bg-white text-surface-700 hover:bg-surface-50 border border-surface-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-0 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">
              Personalizar Avatar
            </h2>
            <p className="text-sm text-surface-600 mt-1">
              Personalize seu avatar Micah
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <FiX className="w-5 h-5 text-surface-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-0 space-y-4">
                <div className="relative aspect-square bg-gradient-to-br from-brand-100 via-purple-100 to-pink-100 rounded-3xl p-8 flex items-center justify-center shadow-lg border-2 border-white">
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-brand-600 shadow-md z-10">
                    Preview
                  </div>
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>
                <button
                  onClick={handleRandomize}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <FiRefreshCw className="w-5 h-5" />
                  Gerar Aleatório
                </button>
              </div>
            </div>

            {/* Options with Tabs */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-surface-100 p-1 rounded-lg overflow-x-auto">
                <button
                  onClick={() => setActiveTab("face")}
                  className={`flex-1 px-4 py-2.5 font-medium text-sm transition-all rounded-md whitespace-nowrap ${
                    activeTab === "face"
                      ? "bg-white text-brand-600 shadow-sm"
                      : "text-surface-600 hover:text-surface-900"
                  }`}
                >
                  Rosto
                </button>
                <button
                  onClick={() => setActiveTab("eyes")}
                  className={`flex-1 px-4 py-2.5 font-medium text-sm transition-all rounded-md whitespace-nowrap ${
                    activeTab === "eyes"
                      ? "bg-white text-brand-600 shadow-sm"
                      : "text-surface-600 hover:text-surface-900"
                  }`}
                >
                  Olhos
                </button>
                <button
                  onClick={() => setActiveTab("hair")}
                  className={`flex-1 px-4 py-2.5 font-medium text-sm transition-all rounded-md whitespace-nowrap ${
                    activeTab === "hair"
                      ? "bg-white text-brand-600 shadow-sm"
                      : "text-surface-600 hover:text-surface-900"
                  }`}
                >
                  Cabelo
                </button>
                <button
                  onClick={() => setActiveTab("accessories")}
                  className={`flex-1 px-4 py-2.5 font-medium text-sm transition-all rounded-md whitespace-nowrap ${
                    activeTab === "accessories"
                      ? "bg-white text-brand-600 shadow-sm"
                      : "text-surface-600 hover:text-surface-900"
                  }`}
                >
                  Acessórios
                </button>
                <button
                  onClick={() => setActiveTab("body")}
                  className={`flex-1 px-4 py-2.5 font-medium text-sm transition-all rounded-md whitespace-nowrap ${
                    activeTab === "body"
                      ? "bg-white text-brand-600 shadow-sm"
                      : "text-surface-600 hover:text-surface-900"
                  }`}
                >
                  Corpo
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {/* Face Tab */}
                {activeTab === "face" && (
                  <>
                    <div className="bg-gradient-to-br from-brand-50 to-purple-50 p-4 rounded-xl">
                      <ColorPicker
                        label="Cor da Pele"
                        colors={COLORS.filter((c) =>
                          ["77311d", "ac6651", "f9c9b6"].includes(c.id)
                        )}
                        selected={config.baseColor}
                        onChange={updateBaseColor}
                      />
                    </div>

                    <div className="bg-surface-50 p-4 rounded-xl space-y-6">
                      <SelectOption
                        label="Sobrancelhas"
                        options={[
                          { value: "down", label: "Para Baixo" },
                          { value: "eyelashesDown", label: "Cílios Baixo" },
                          { value: "up", label: "Para Cima" },
                          { value: "eyelashesUp", label: "Cílios Cima" },
                        ]}
                        selected={config.eyebrows}
                        onChange={(v) => updateConfig("eyebrows", v)}
                      />

                      <SelectOption
                        label="Nariz"
                        options={[
                          { value: "curve", label: "Curvo" },
                          { value: "pointed", label: "Pontudo" },
                          { value: "tound", label: "Redondo" },
                        ]}
                        selected={config.nose}
                        onChange={(v) => updateConfig("nose", v)}
                      />

                      <SelectOption
                        label="Boca"
                        options={[
                          { value: "smile", label: "Sorriso" },
                          { value: "laughing", label: "Rindo" },
                          { value: "smirk", label: "Malicioso" },
                          { value: "surprised", label: "Surpreso" },
                          { value: "frown", label: "Carranca" },
                          { value: "nervous", label: "Nervoso" },
                          { value: "pucker", label: "Beijinho" },
                          { value: "sad", label: "Triste" },
                        ]}
                        selected={config.mouth}
                        onChange={(v) => updateConfig("mouth", v)}
                      />
                    </div>
                  </>
                )}

                {/* Eyes Tab */}
                {activeTab === "eyes" && (
                  <>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl space-y-6">
                      <SelectOption
                        label="Estilo dos Olhos"
                        options={[
                          { value: "eyes", label: "Normal" },
                          { value: "round", label: "Redondos" },
                          { value: "smiling", label: "Sorrindo" },
                        ]}
                        selected={config.eyes}
                        onChange={(v) => updateConfig("eyes", v)}
                      />

                      <ColorPicker
                        label="Cor dos Olhos"
                        colors={COLORS}
                        selected={config.eyesColor}
                        onChange={(v) => updateConfig("eyesColor", v)}
                      />

                      <ColorPicker
                        label="Cor da Sombra"
                        colors={COLORS.filter((c) =>
                          [
                            "d2eff3",
                            "e0ddff",
                            "ffeba4",
                            "ffedef",
                            "ffffff",
                          ].includes(c.id)
                        )}
                        selected={config.eyeShadowColor}
                        onChange={(v) => updateConfig("eyeShadowColor", v)}
                      />
                    </div>
                  </>
                )}

                {/* Hair & Facial Hair Tab */}
                {activeTab === "hair" && (
                  <>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl space-y-6">
                      <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                        Cabelo
                      </h3>
                      <SelectOption
                        label="Estilo"
                        options={[
                          { value: "", label: "Sem Cabelo" },
                          { value: "dannyPhantom", label: "Danny Phantom" },
                          { value: "dougFunny", label: "Doug Funny" },
                          { value: "fonze", label: "Fonze" },
                          { value: "full", label: "Cheio" },
                          { value: "mrT", label: "Mr T" },
                          { value: "pixie", label: "Pixie" },
                          { value: "turban", label: "Turbante" },
                        ]}
                        selected={config.hair}
                        onChange={(v) => updateConfig("hair", v)}
                      />

                      {config.hair && (
                        <ColorPicker
                          label="Cor"
                          colors={COLORS}
                          selected={config.hairColor}
                          onChange={(v) => updateConfig("hairColor", v)}
                        />
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-stone-50 to-slate-50 p-4 rounded-xl space-y-6">
                      <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                        Barba
                      </h3>
                      <SelectOption
                        label="Estilo"
                        options={[
                          { value: "", label: "Sem Barba" },
                          { value: "beard", label: "Barba" },
                          { value: "scruff", label: "Por Fazer" },
                        ]}
                        selected={config.facialHair}
                        onChange={(v) => updateConfig("facialHair", v)}
                      />

                      {config.facialHair && (
                        <ColorPicker
                          label="Cor"
                          colors={COLORS}
                          selected={config.facialHairColor}
                          onChange={(v) => updateConfig("facialHairColor", v)}
                        />
                      )}
                    </div>
                  </>
                )}

                {/* Accessories Tab */}
                {activeTab === "accessories" && (
                  <>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl space-y-6">
                      <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                        Brincos
                      </h3>
                      <SelectOption
                        label="Estilo"
                        options={[
                          { value: "", label: "Sem Brinco" },
                          { value: "hoop", label: "Argola" },
                          { value: "stud", label: "Ponto" },
                        ]}
                        selected={config.earrings}
                        onChange={(v) => updateConfig("earrings", v)}
                      />

                      {config.earrings && (
                        <ColorPicker
                          label="Cor"
                          colors={COLORS}
                          selected={config.earringColor}
                          onChange={(v) => updateConfig("earringColor", v)}
                        />
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl space-y-6">
                      <h3 className="font-semibold text-surface-900 flex items-center gap-2">
                        Óculos
                      </h3>
                      <SelectOption
                        label="Estilo"
                        options={[
                          { value: "", label: "Sem Óculos" },
                          { value: "round", label: "Redondos" },
                          { value: "square", label: "Quadrados" },
                        ]}
                        selected={config.glasses}
                        onChange={(v) => updateConfig("glasses", v)}
                      />

                      {config.glasses && (
                        <ColorPicker
                          label="Cor"
                          colors={COLORS}
                          selected={config.glassesColor}
                          onChange={(v) => updateConfig("glassesColor", v)}
                        />
                      )}
                    </div>
                  </>
                )}

                {/* Body Tab */}
                {activeTab === "body" && (
                  <>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl space-y-6">
                      <SelectOption
                        label="Orelhas"
                        options={[
                          { value: "attached", label: "Coladas" },
                          { value: "detached", label: "Separadas" },
                        ]}
                        selected={config.ears}
                        onChange={(v) => updateConfig("ears", v)}
                      />

                      <SelectOption
                        label="Camisa"
                        options={[
                          { value: "collared", label: "Com Colarinho" },
                          { value: "crew", label: "Gola Redonda" },
                          { value: "open", label: "Aberta" },
                        ]}
                        selected={config.shirt}
                        onChange={(v) => updateConfig("shirt", v)}
                      />

                      <ColorPicker
                        label="Cor da Camisa"
                        colors={COLORS}
                        selected={config.shirtColor}
                        onChange={(v) => updateConfig("shirtColor", v)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-surface-200 bg-surface-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-surface-700 hover:bg-surface-100 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            Salvar Avatar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
