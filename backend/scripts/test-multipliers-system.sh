#!/bin/bash

# Script para testar o sistema de multiplicadores - Sprint 2
API_URL="http://localhost:3000"
TOKEN="" # Adicionar token JWT aqui

echo "🚀 Testando Sistema de Multiplicadores - Sprint 2"
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

# Teste 1: Verificar tipo de perfil do usuário
echo "👤 1. Verificando perfil do usuário (IC vs Manager)"
make_request "GET" "/gamification/profile/type"

# Teste 2: Obter informações de multiplicadores
echo "💫 2. Informações de multiplicadores disponíveis"
make_request "GET" "/gamification/multipliers/my-info"

# Teste 3: Dashboard completo de multiplicadores
echo "📊 3. Dashboard de multiplicadores"
make_request "GET" "/gamification/multipliers/dashboard"

# Teste 4: Simular multiplicador para ação de IC
echo "🧮 4. Simulando multiplicador para ação de IC (peer_development_support)"
make_request "POST" "/gamification/multipliers/simulate" '{
  "action": "peer_development_support",
  "baseXP": 50
}'

# Teste 5: Simular multiplicador para ação de Manager
echo "🧮 5. Simulando multiplicador para ação de Manager (process_improvement)"
make_request "POST" "/gamification/multipliers/simulate" '{
  "action": "process_improvement", 
  "baseXP": 120
}'

# Teste 6: Verificar elegibilidade de ação específica
echo "✅ 6. Verificando elegibilidade para multiplicador - knowledge_sharing"
make_request "GET" "/gamification/multipliers/action-eligibility/knowledge_sharing_session"

# Teste 7: Verificar elegibilidade de ação não elegível
echo "❌ 7. Verificando ação não elegível - meaningful_feedback"
make_request "GET" "/gamification/multipliers/action-eligibility/meaningful_feedback_given"

# Teste 8: Estatísticas de multiplicadores
echo "📈 8. Estatísticas de multiplicadores (semanal)"
make_request "GET" "/gamification/multipliers/stats?period=week"

# Teste 9: Submeter ação de IC elegível para multiplicador
echo "🎯 9. Submetendo ação de IC elegível para multiplicador"
make_request "POST" "/gamification/actions/peer-development-support" '{
  "colleague": "Ana Silva",
  "supportType": "Code Review",
  "outcome": "Melhorou qualidade do código",
  "description": "Ajudei com refatoração e boas práticas"
}'

# Teste 10: Submeter ação de Manager elegível para multiplicador
echo "🎯 10. Submetendo ação de Manager elegível para multiplicador"
make_request "POST" "/gamification/actions/process-improvement" '{
  "process": "Deploy",
  "problem": "Deploys demorados",
  "solution": "Automatização CI/CD", 
  "impact": "Reduziu tempo de 2h para 10min",
  "description": "Implementei pipeline automatizado",
  "evidence": "Link da documentação do pipeline"
}'

# Teste 11: Verificar perfil atualizado após ações
echo "👤 11. Verificando perfil atualizado"
make_request "GET" "/gamification/profile"

# Teste 12: Verificar histório XP para ver multiplicadores aplicados
echo "📋 12. Verificando submissões recentes"
make_request "GET" "/gamification/actions/my-submissions?limit=5"

echo ""
echo "🎉 Testes de multiplicadores concluídos!"
echo ""
echo "📝 Novos endpoints testados:"
echo "- GET  /gamification/profile/type"
echo "- GET  /gamification/multipliers/my-info"
echo "- GET  /gamification/multipliers/dashboard"
echo "- POST /gamification/multipliers/simulate"
echo "- GET  /gamification/multipliers/stats"
echo "- GET  /gamification/multipliers/action-eligibility/:action"
echo ""
echo "🔍 Multiplicadores implementados:"
echo "- IC: +30% em ações de liderança por influência"
echo "  • peer_development_support"
echo "  • knowledge_sharing_session"
echo "  • junior_onboarding_support"
echo "  • team_culture_building"
echo "  • conflict_resolution_support"
echo ""
echo "- Manager: +100% em melhorias de processo"
echo "  • process_improvement"
echo "  • team_goal_contribution"
echo "  • team_retrospective_facilitation"
echo "  • performance_improvement_support"
echo ""
echo "💡 Sistema de detecção automática de perfil:"
echo "- Verifica subordinados diretos"
echo "- Verifica gerenciamento de equipes"
echo "- Verifica roles de manager"
echo "- Verifica se é admin do sistema"
echo "- Cache de 24h para performance"