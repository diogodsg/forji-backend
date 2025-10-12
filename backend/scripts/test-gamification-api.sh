#!/bin/bash

# Script para testar os novos endpoints de gamificação
# Sprint 1 - Sistema de Ações Manuais

API_URL="http://localhost:3000"
TOKEN="" # Adicionar token JWT aqui

echo "🧪 Testando Sistema de Ações Manuais - Sprint 1"
echo "================================================="

# Função para fazer requisições
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo "📡 $method $endpoint"
    
    if [ -n "$data" ]; then
        curl -X $method \
             -H "Content-Type: application/json" \
             -H "Authorization: Bearer $TOKEN" \
             -d "$data" \
             "$API_URL$endpoint" \
             -w "\n🔍 Status: %{http_code}\n" \
             -s | jq '.' 2>/dev/null || echo "Resposta não é JSON válido"
    else
        curl -X $method \
             -H "Authorization: Bearer $TOKEN" \
             "$API_URL$endpoint" \
             -w "\n🔍 Status: %{http_code}\n" \
             -s | jq '.' 2>/dev/null || echo "Resposta não é JSON válido"
    fi
    
    echo "---"
}

# Teste 1: Verificar tipos de ação disponíveis
echo "🎯 1. Verificando tipos de ação disponíveis"
make_request "GET" "/gamification/actions/types"

# Teste 2: Verificar cooldowns atuais
echo "🕒 2. Verificando cooldowns do usuário"
make_request "GET" "/gamification/actions/my-cooldowns"

# Teste 3: Verificar caps semanais
echo "📊 3. Verificando caps semanais"
make_request "GET" "/gamification/actions/my-weekly-caps"

# Teste 4: Submeter feedback significativo
echo "💬 4. Submetendo feedback significativo"
make_request "POST" "/gamification/actions/meaningful-feedback" '{
  "recipient": "João Silva",
  "feedbackType": "Técnico",
  "description": "Feedback sobre implementação de API REST",
  "evidence": "Screenshot da conversa no Slack"
}'

# Teste 5: Submeter sessão de mentoria
echo "👨‍🏫 5. Submetendo sessão de mentoria"
make_request "POST" "/gamification/actions/mentoring-session" '{
  "mentee": "Maria Santos",
  "duration": 60,
  "topics": ["Arquitetura de Software", "Boas Práticas"],
  "description": "Sessão focada em padrões de design",
  "evidence": "Ata da reunião"
}'

# Teste 6: Submeter compartilhamento de conhecimento
echo "🧠 6. Submetendo compartilhamento de conhecimento"
make_request "POST" "/gamification/actions/knowledge-sharing" '{
  "topic": "React Hooks Avançados",
  "audience": "Time Frontend",
  "format": "Workshop",
  "duration": 90,
  "description": "Workshop sobre hooks customizados",
  "evidence": "Link da apresentação no Confluence"
}'

# Teste 7: Submeter melhoria de processo
echo "⚙️ 7. Submetendo melhoria de processo"
make_request "POST" "/gamification/actions/process-improvement" '{
  "process": "Deploy",
  "problem": "Deploy manual demorado",
  "solution": "Implementação de CI/CD",
  "impact": "Reduziu tempo de deploy de 2h para 10min",
  "description": "Automação completa do pipeline",
  "evidence": "Documentação do pipeline no GitLab"
}'

# Teste 8: Tentar submeter novamente (testar cooldown)
echo "🚫 8. Testando cooldown - tentando submeter feedback novamente"
make_request "POST" "/gamification/actions/meaningful-feedback" '{
  "recipient": "Ana Costa",
  "feedbackType": "Comportamental",
  "description": "Feedback sobre comunicação"
}'

# Teste 9: Verificar submissões do usuário
echo "📋 9. Verificando minhas submissões"
make_request "GET" "/gamification/actions/my-submissions?limit=10"

# Teste 10: Verificar fila de validação
echo "✅ 10. Verificando fila de validação"
make_request "GET" "/gamification/actions/validate-queue?limit=5"

echo ""
echo "🎉 Testes concluídos!"
echo ""
echo "📝 Para usar este script:"
echo "1. Inicie o backend: npm run start:dev"
echo "2. Faça login para obter um token JWT"
echo "3. Edite este script adicionando o token na variável TOKEN"
echo "4. Execute: chmod +x test-gamification-api.sh && ./test-gamification-api.sh"
echo ""
echo "🔧 Dependências necessárias:"
echo "- curl (requisições HTTP)"
echo "- jq (formatação JSON)"
echo ""
echo "💡 Endpoints implementados:"
echo "- POST /gamification/actions/meaningful-feedback"
echo "- POST /gamification/actions/mentoring-session" 
echo "- POST /gamification/actions/peer-development-support"
echo "- POST /gamification/actions/knowledge-sharing"
echo "- POST /gamification/actions/cross-team-collaboration"
echo "- POST /gamification/actions/career-coaching"
echo "- POST /gamification/actions/team-goal-contribution"
echo "- POST /gamification/actions/process-improvement"
echo "- POST /gamification/actions/retrospective-facilitation"
echo "- POST /gamification/actions/conflict-resolution"
echo "- POST /gamification/actions/team-culture-building"
echo "- POST /gamification/actions/documentation-contribution"
echo "- GET  /gamification/actions/types"
echo "- GET  /gamification/actions/my-cooldowns"
echo "- GET  /gamification/actions/my-weekly-caps"
echo "- GET  /gamification/actions/my-submissions"
echo "- GET  /gamification/actions/validate-queue"
echo "- POST /gamification/actions/validate/:submissionId"
echo "🏆 Testing GET /gamification/leaderboard"
curl -s "$BASE_URL/gamification/leaderboard" \
  -H "Content-Type: application/json" \
  | jq '.' || echo "❌ Leaderboard endpoint failed"

echo -e "\n"

# Test 3: Add XP manually
echo "⚡ Testing POST /gamification/xp/manual"
curl -s "$BASE_URL/gamification/xp/manual" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"action": "daily_activity", "points": 10}' \
  | jq '.' || echo "❌ Add XP endpoint failed"

echo -e "\n"

# Test 4: Get updated profile after XP gain
echo "📈 Testing updated profile after XP gain"
curl -s "$BASE_URL/gamification/profile" \
  -H "Content-Type: application/json" \
  | jq '.' || echo "❌ Updated profile failed"

echo -e "\n✅ Gamification API tests completed!"