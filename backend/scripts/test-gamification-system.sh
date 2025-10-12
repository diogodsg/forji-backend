#!/bin/bash

# Script para testar o sistema de gamificação
# Use este script após ter o backend rodando

API_URL="http://localhost:3000"
USER_TOKEN="YOUR_JWT_TOKEN_HERE"

echo "🎮 Testando Sistema de Gamificação Forge"
echo "========================================"

# Função para fazer requisições
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -z "$data" ]; then
        curl -s -X $method \
             -H "Authorization: Bearer $USER_TOKEN" \
             -H "Content-Type: application/json" \
             "$API_URL$endpoint"
    else
        curl -s -X $method \
             -H "Authorization: Bearer $USER_TOKEN" \
             -H "Content-Type: application/json" \
             -d "$data" \
             "$API_URL$endpoint"
    fi
}

echo "📊 1. Obtendo perfil atual do jogador..."
profile=$(make_request GET "/gamification/profile")
echo $profile | jq .

echo ""
echo "🎯 2. Testando milestone de PDI..."
milestone_response=$(make_request POST "/gamification/xp/pdi-milestone" '{
    "milestoneId": "test-milestone-1",
    "description": "Completei certificação AWS"
}')
echo $milestone_response | jq .

echo ""
echo "📈 3. Testando level up de competência..."
competency_response=$(make_request POST "/gamification/xp/competency-level-up" '{
    "competency": "Liderança",
    "fromLevel": "Intermediário",
    "toLevel": "Avançado"
}')
echo $competency_response | jq .

echo ""
echo "🎯 4. Testando key result alcançado..."
kr_response=$(make_request POST "/gamification/xp/key-result-achieved" '{
    "keyResultId": "kr-1",
    "description": "Aumentar NPS da equipe para 8.5"
}')
echo $kr_response | jq .

echo ""
echo "💬 5. Testando feedback significativo..."
feedback_response=$(make_request POST "/gamification/xp/meaningful-feedback" '{
    "targetUserId": 2,
    "feedbackId": "feedback-123",
    "rating": 4.5
}')
echo $feedback_response | jq .

echo ""
echo "🎓 6. Testando sessão de mentoria..."
mentoring_response=$(make_request POST "/gamification/xp/development-mentoring" '{
    "menteeId": 3,
    "duration": 60,
    "rating": 4.8
}')
echo $mentoring_response | jq .

echo ""
echo "📚 7. Testando compartilhamento de conhecimento..."
knowledge_response=$(make_request POST "/gamification/xp/knowledge-sharing" '{
    "topic": "React Hooks Avançados",
    "participants": 5,
    "avgRating": 4.3
}')
echo $knowledge_response | jq .

echo ""
echo "👥 8. Testando contribuição para meta da equipe..."
team_goal_response=$(make_request POST "/gamification/xp/team-goal-contribution" '{
    "goalId": "goal-q4-2024",
    "contribution": "Implementei 20 testes automatizados",
    "teamValidated": true
}')
echo $team_goal_response | jq .

echo ""
echo "⚙️ 9. Testando melhoria de processo..."
process_response=$(make_request POST "/gamification/xp/process-improvement" '{
    "improvement": "Automatização de code review",
    "measuredBenefit": "Tempo de review reduzido de 3 para 1 dia",
    "teamApproved": true
}')
echo $process_response | jq .

echo ""
echo "📊 10. Verificando perfil atualizado..."
updated_profile=$(make_request GET "/gamification/profile")
echo $updated_profile | jq .

echo ""
echo "🏆 11. Verificando leaderboard de equipes..."
leaderboard=$(make_request GET "/gamification/team-leaderboard?limit=5")
echo $leaderboard | jq .

echo ""
echo "🎉 Teste completo! Verifique o XP ganho e badges desbloqueados."