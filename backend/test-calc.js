// Teste dos cálculos de gamificação
console.log('=== TESTE DOS CÁLCULOS DE GAMIFICAÇÃO ===\n');

const totalXP = 15470;

// 1. Calcular nível
const level = Math.floor(Math.sqrt(totalXP / 100));
console.log(`Total XP: ${totalXP}`);
console.log(`Nível calculado: ${level} (fórmula: floor(sqrt(${totalXP} / 100)))`);

// 2. Calcular progresso
const currentLevel = level;
const nextLevel = currentLevel + 1;
const xpForCurrentLevel = Math.pow(currentLevel, 2) * 100;
const xpForNextLevel = Math.pow(nextLevel, 2) * 100;
const xpNeeded = xpForNextLevel - xpForCurrentLevel;
const currentXP = totalXP - xpForCurrentLevel;
const progressPercent = Math.min(100, Math.floor((currentXP / xpNeeded) * 100));

console.log(`\n=== CÁLCULOS DETALHADOS ===`);
console.log(`XP para nível ${currentLevel}: ${xpForCurrentLevel}`);
console.log(`XP para nível ${nextLevel}: ${xpForNextLevel}`);
console.log(`XP necessário para subir: ${xpNeeded}`);
console.log(`XP atual no nível: ${currentXP} (${totalXP} - ${xpForCurrentLevel})`);
console.log(`Progresso: ${progressPercent}% (${currentXP} / ${xpNeeded} * 100)`);

console.log(`\n=== RESULTADO ESPERADO ===`);
const expectedResult = {
  level: level,
  currentXP: currentXP, // XP no nível atual = 1070
  totalXP: totalXP, // XP total = 15470
  nextLevelXP: xpNeeded, // XP necessário para subir = 2500
  progressToNextLevel: progressPercent, // Progresso = 42%
};

console.log(JSON.stringify(expectedResult, null, 2));

console.log(`\n=== PROBLEMA NO BANCO ===`);
console.log(`❌ currentXP no banco: 2890 (INCORRETO)`);
console.log(`✅ currentXP calculado: ${currentXP} (CORRETO)`);
console.log(`\n🔧 Solução: Calcular currentXP dinamicamente baseado no totalXP`);
