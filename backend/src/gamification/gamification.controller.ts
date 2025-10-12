import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { GamificationService } from "./gamification.service";
import { ActionValidationService } from "./action-validation.service";
import { MultiplierService, MultiplierResult } from "./multiplier.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  AddXPDto,
  ActionSubmissionDto,
  ActionValidationDto,
} from "./dto/gamification.dto";

@Controller("gamification")
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(
    private readonly gamificationService: GamificationService,
    private readonly actionValidationService: ActionValidationService,
    private readonly multiplierService: MultiplierService
  ) {}

  // Obter perfil do jogador atual
  @Get("profile")
  async getMyProfile(@Req() req: any) {
    const userId = req.user.id;
    return this.gamificationService.getPlayerProfile(userId);
  }

  // Obter perfil de outro jogador (para managers)
  @Get("profile/:userId")
  async getPlayerProfile(@Param("userId") userId: string) {
    return this.gamificationService.getPlayerProfile(parseInt(userId));
  }

  // Obter leaderboard - Team First Philosophy
  @Get("leaderboard")
  async getLeaderboard(
    @Query("period") period?: "week" | "month" | "all",
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("type") type?: "individual" | "team"
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    const offsetNum = offset ? parseInt(offset) : 0;

    // Team First: Retorna equipes por padrão
    if (type !== "individual") {
      return this.gamificationService.getTeamLeaderboardDetailed(
        limitNum,
        period || "week"
      );
    }

    // Mantido para compatibilidade, mas desencorajado
    return this.gamificationService.getLeaderboard(
      limitNum,
      period || "week",
      offsetNum
    );
  }

  // Obter ranking por categoria
  @Get("leaderboard/:category")
  async getLeaderboardByCategory(
    @Param("category") category: "badges" | "teams",
    @Query("limit") limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.gamificationService.getLeaderboardByCategory(
      category,
      limitNum
    );
  }

  // Obter ranking de equipes detalhado
  @Get("team-leaderboard")
  async getTeamLeaderboard(
    @Query("limit") limit?: string,
    @Query("period") period?: "week" | "month" | "all"
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.gamificationService.getTeamLeaderboardDetailed(
      limitNum,
      period || "week"
    );
  }

  // Obter desafio semanal atual
  @Get("weekly-challenge")
  async getWeeklyChallenge(@Req() req: any) {
    const userId = req.user.id;
    return this.gamificationService.getWeeklyChallenge(userId);
  }

  // Adicionar XP (endpoint interno para outros serviços)
  @Post("xp")
  async addXP(@Body() addXPDto: AddXPDto) {
    return this.gamificationService.addXP(addXPDto);
  }

  // Trigger manual de XP para teste (remover em produção)
  @Post("xp/manual")
  async addManualXP(
    @Req() req: any,
    @Body() body: { action: string; points?: number }
  ) {
    const userId = req.user.id;
    return this.gamificationService.addXP({
      userId,
      action: body.action,
      points: body.points,
      description: `Manual XP gain: ${body.action}`,
    });
  }

  // 🏗️ Endpoints específicos para Desenvolvimento Pessoal
  @Post("xp/pdi-milestone")
  async completePDIMilestone(
    @Req() req: any,
    @Body() body: { milestoneId: string; description?: string }
  ) {
    const userId = req.user.id;
    return this.gamificationService.addXP({
      userId,
      action: "pdi_milestone_completed",
      description:
        body.description || `Completed PDI milestone: ${body.milestoneId}`,
    });
  }

  @Post("xp/competency-level-up")
  async competencyLevelUp(
    @Req() req: any,
    @Body() body: { competency: string; fromLevel: string; toLevel: string }
  ) {
    const userId = req.user.id;
    return this.gamificationService.addXP({
      userId,
      action: "competency_level_up",
      description: `Competency ${body.competency} improved: ${body.fromLevel} → ${body.toLevel}`,
    });
  }

  @Post("xp/key-result-achieved")
  async keyResultAchieved(
    @Req() req: any,
    @Body() body: { keyResultId: string; description?: string }
  ) {
    const userId = req.user.id;
    return this.gamificationService.addXP({
      userId,
      action: "key_result_achieved",
      description:
        body.description || `Achieved key result: ${body.keyResultId}`,
    });
  }

  @Post("xp/pdi-cycle-completed")
  async pdiCycleCompleted(
    @Req() req: any,
    @Body() body: { cycleId: string; description?: string }
  ) {
    const userId = req.user.id;
    return this.gamificationService.addXP({
      userId,
      action: "pdi_cycle_completed",
      description: body.description || `Completed PDI cycle: ${body.cycleId}`,
    });
  }

  @Post("xp/self-assessment")
  async selfAssessmentCompleted(
    @Req() req: any,
    @Body() body: { competency: string; assessment: string }
  ) {
    const userId = req.user.id;
    return this.gamificationService.addXP({
      userId,
      action: "self_assessment_completed",
      description: `Completed self-assessment for ${body.competency}`,
    });
  }

  @Post("xp/learning-goal-set")
  async learningGoalSet(
    @Req() req: any,
    @Body() body: { goal: string; timeline: string }
  ) {
    const userId = req.user.id;
    return this.gamificationService.addXP({
      userId,
      action: "learning_goal_set",
      description: `Set learning goal: ${body.goal} (${body.timeline})`,
    });
  }

  @Post("xp/pdi-meeting-documented")
  async pdiMeetingDocumented(
    @Req() req: any,
    @Body() body: { meetingDate: string; topics: string[] }
  ) {
    const userId = req.user.id;
    return this.gamificationService.addXP({
      userId,
      action: "pdi_meeting_documented",
      description: `Documented PDI meeting on ${body.meetingDate}`,
    });
  }

  // 🤝 Endpoints específicos para Colaboração e Mentoring
  @Post("xp/meaningful-feedback")
  async meaningfulFeedbackGiven(
    @Req() req: any,
    @Body() body: { targetUserId: number; feedbackId: string; rating?: number }
  ) {
    const userId = req.user.id;

    // TODO: Implementar validação de rating ≥4.0 do receptor
    if (body.rating && body.rating < 4.0) {
      throw new Error("Feedback must be rated ≥4.0 by recipient to earn XP");
    }

    return this.gamificationService.addXP({
      userId,
      action: "meaningful_feedback_given",
      description: `Gave meaningful feedback to user ${body.targetUserId}`,
    });
  }

  @Post("xp/development-mentoring")
  async developmentMentoringSession(
    @Req() req: any,
    @Body() body: { menteeId: number; duration: number; rating?: number }
  ) {
    const userId = req.user.id;

    // Validar duração mínima
    if (body.duration < 45) {
      throw new Error(
        "Development mentoring sessions must be at least 45 minutes"
      );
    }

    // TODO: Implementar validação de rating ≥4.5 do mentee
    if (body.rating && body.rating < 4.5) {
      throw new Error(
        "Mentoring session must be rated ≥4.5 by mentee to earn XP"
      );
    }

    return this.gamificationService.addXP({
      userId,
      action: "development_mentoring_session",
      description: `Conducted ${body.duration}min development mentoring with user ${body.menteeId}`,
    });
  }

  @Post("xp/knowledge-sharing")
  async knowledgeSharing(
    @Req() req: any,
    @Body() body: { topic: string; participants: number; avgRating?: number }
  ) {
    const userId = req.user.id;

    // Validar participantes mínimos
    if (body.participants < 3) {
      throw new Error(
        "Knowledge sharing sessions must have at least 3 participants"
      );
    }

    // TODO: Implementar validação de rating ≥4.0 dos participantes
    if (body.avgRating && body.avgRating < 4.0) {
      throw new Error(
        "Knowledge sharing must be rated ≥4.0 by participants to earn XP"
      );
    }

    return this.gamificationService.addXP({
      userId,
      action: "knowledge_sharing_session",
      description: `Shared knowledge on "${body.topic}" with ${body.participants} participants`,
    });
  }

  // 👥 Endpoints específicos para Contribuição de Equipe
  @Post("xp/team-goal-contribution")
  async teamGoalContribution(
    @Req() req: any,
    @Body()
    body: { goalId: string; contribution: string; teamValidated: boolean }
  ) {
    const userId = req.user.id;

    // Validar que a equipe confirmou a contribuição
    if (!body.teamValidated) {
      throw new Error(
        "Team goal contribution must be validated by team members"
      );
    }

    return this.gamificationService.addXP({
      userId,
      action: "team_goal_contribution",
      description: `Contributed to team goal: ${body.goalId} - ${body.contribution}`,
    });
  }

  @Post("xp/process-improvement")
  async processImprovement(
    @Req() req: any,
    @Body()
    body: {
      improvement: string;
      measuredBenefit: string;
      teamApproved: boolean;
    }
  ) {
    const userId = req.user.id;

    // Validar aprovação da equipe e benefício mensurável
    if (!body.teamApproved) {
      throw new Error("Process improvement must be approved by team");
    }

    return this.gamificationService.addXP({
      userId,
      action: "process_improvement",
      description: `Process improvement: ${body.improvement}. Benefit: ${body.measuredBenefit}`,
    });
  }

  // 🤝 Endpoints adicionais para Colaboração
  @Post("xp/peer-development-support")
  async peerDevelopmentSupport(
    @Req() req: any,
    @Body()
    body: { supportedUserId: number; supportType: string; duration: number }
  ) {
    const userId = req.user.id;

    // Validar duração mínima
    if (body.duration < 45) {
      throw new Error("Peer development support must be at least 45 minutes");
    }

    return this.gamificationService.addXP({
      userId,
      action: "peer_development_support",
      description: `Provided ${body.supportType} support to user ${body.supportedUserId} for ${body.duration} minutes`,
    });
  }

  @Post("xp/cross-team-collaboration")
  async crossTeamCollaboration(
    @Req() req: any,
    @Body()
    body: { collaboratingTeams: string[]; outcome: string; duration: number }
  ) {
    const userId = req.user.id;

    // Validar colaboração com múltiplas equipes
    if (body.collaboratingTeams.length < 2) {
      throw new Error("Cross-team collaboration requires at least 2 teams");
    }

    // Validar duração mínima (1 semana)
    if (body.duration < 7) {
      throw new Error("Cross-team collaboration must span at least 1 week");
    }

    return this.gamificationService.addXP({
      userId,
      action: "cross_team_collaboration",
      description: `Cross-team collaboration between ${body.collaboratingTeams.join(
        ", "
      )}. Outcome: ${body.outcome}`,
    });
  }

  @Post("xp/junior-onboarding")
  async juniorOnboardingSupport(
    @Req() req: any,
    @Body()
    body: {
      juniorUserId: number;
      program: string;
      weeksActive: number;
      successMetrics: string;
    }
  ) {
    const userId = req.user.id;

    // Validar programa estruturado de 4+ semanas
    if (body.weeksActive < 4) {
      throw new Error("Junior onboarding support must be at least 4 weeks");
    }

    return this.gamificationService.addXP({
      userId,
      action: "junior_onboarding_support",
      description: `${body.weeksActive}-week onboarding support for user ${body.juniorUserId}. Success: ${body.successMetrics}`,
    });
  }

  @Post("xp/career-coaching")
  async careerCoachingSession(
    @Req() req: any,
    @Body()
    body: {
      coacheeId: number;
      duration: number;
      roadmapCreated: boolean;
      rating?: number;
    }
  ) {
    const userId = req.user.id;

    // Validar duração mínima
    if (body.duration < 60) {
      throw new Error("Career coaching sessions must be at least 60 minutes");
    }

    // Validar que foi criado roadmap de carreira
    if (!body.roadmapCreated) {
      throw new Error(
        "Career coaching must result in a structured career roadmap"
      );
    }

    // TODO: Implementar validação de rating ≥4.5 transformativo
    if (body.rating && body.rating < 4.5) {
      throw new Error(
        "Career coaching must be rated as transformative (≥4.5) to earn XP"
      );
    }

    return this.gamificationService.addXP({
      userId,
      action: "career_coaching_session",
      description: `${body.duration}min career coaching with user ${body.coacheeId}, roadmap created`,
    });
  }

  @Post("xp/performance-improvement-support")
  async performanceImprovementSupport(
    @Req() req: any,
    @Body()
    body: {
      supportedUserId: number;
      program: string;
      weeksActive: number;
      measurableImprovement: string;
      hrValidated: boolean;
    }
  ) {
    const userId = req.user.id;

    // Validar programa estruturado de 4+ semanas
    if (body.weeksActive < 4) {
      throw new Error(
        "Performance improvement support must be at least 4 weeks"
      );
    }

    // Validar melhoria mensurável e validação HR
    if (!body.hrValidated) {
      throw new Error(
        "Performance improvement support must be validated by HR/Manager"
      );
    }

    return this.gamificationService.addXP({
      userId,
      action: "performance_improvement_support",
      description: `${body.weeksActive}-week performance support for user ${body.supportedUserId}. Improvement: ${body.measurableImprovement}`,
    });
  }

  // 👥 Endpoints adicionais para Contribuição de Equipe
  @Post("xp/team-retrospective-facilitation")
  async teamRetrospectiveFacilitation(
    @Req() req: any,
    @Body() body: { duration: number; actionItems: number; teamRating?: number }
  ) {
    const userId = req.user.id;

    // Validar duração mínima
    if (body.duration < 60) {
      throw new Error(
        "Team retrospective facilitation must be at least 60 minutes"
      );
    }

    // Validar que foram gerados action items
    if (body.actionItems < 1) {
      throw new Error("Retrospective must generate at least 1 action item");
    }

    // TODO: Implementar validação de rating ≥4.0 da equipe
    if (body.teamRating && body.teamRating < 4.0) {
      throw new Error(
        "Retrospective facilitation must be rated ≥4.0 by team to earn XP"
      );
    }

    return this.gamificationService.addXP({
      userId,
      action: "team_retrospective_facilitation",
      description: `Facilitated ${body.duration}min retrospective, generated ${body.actionItems} action items`,
    });
  }

  @Post("xp/conflict-resolution")
  async conflictResolutionSupport(
    @Req() req: any,
    @Body()
    body: {
      conflictParties: number;
      resolutionType: string;
      followUpCompleted: boolean;
      partiesAgreed: boolean;
    }
  ) {
    const userId = req.user.id;

    // Validar mediação de conflito real
    if (body.conflictParties < 2) {
      throw new Error("Conflict resolution requires at least 2 parties");
    }

    // Validar acordo mútuo e follow-up
    if (!body.partiesAgreed) {
      throw new Error(
        "Conflict resolution must result in mutually accepted agreement"
      );
    }

    if (!body.followUpCompleted) {
      throw new Error(
        "Conflict resolution must include follow-up implementation"
      );
    }

    return this.gamificationService.addXP({
      userId,
      action: "conflict_resolution_support",
      description: `Mediated conflict between ${body.conflictParties} parties using ${body.resolutionType} approach`,
    });
  }

  @Post("xp/team-culture-building")
  async teamCultureBuilding(
    @Req() req: any,
    @Body()
    body: {
      initiative: string;
      weeksActive: number;
      cultureMetric: string;
      teamValidated: boolean;
    }
  ) {
    const userId = req.user.id;

    // Validar implementação por 4+ semanas
    if (body.weeksActive < 4) {
      throw new Error(
        "Team culture building must be active for at least 4 weeks"
      );
    }

    // Validar impacto documentado e validação da equipe
    if (!body.teamValidated) {
      throw new Error("Culture building initiative must be validated by team");
    }

    return this.gamificationService.addXP({
      userId,
      action: "team_culture_building",
      description: `${body.weeksActive}-week culture initiative: ${body.initiative}. Impact: ${body.cultureMetric}`,
    });
  }

  @Post("xp/documentation-contribution")
  async documentationContribution(
    @Req() req: any,
    @Body()
    body: {
      documentType: string;
      topic: string;
      teamUsage: number;
      maintainedMonths: number;
    }
  ) {
    const userId = req.user.id;

    // Validar uso pela equipe
    if (body.teamUsage < 3) {
      throw new Error("Documentation must be used by at least 3 team members");
    }

    // Validar manutenção por 3+ meses
    if (body.maintainedMonths < 3) {
      throw new Error("Documentation must be maintained for at least 3 months");
    }

    return this.gamificationService.addXP({
      userId,
      action: "documentation_contribution",
      description: `Created ${body.documentType} on ${body.topic}, used by ${body.teamUsage} members, maintained ${body.maintainedMonths} months`,
    });
  }

  // 📋 SPRINT 1 - ENDPOINTS DE AÇÕES MANUAIS

  // 🤝 Colaboração & Mentoring Endpoints

  @Post("actions/meaningful-feedback")
  @HttpCode(HttpStatus.CREATED)
  async submitMeaningfulFeedback(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & { recipient: string; feedbackType: string }
  ) {
    const userId = req.user.id;
    const action = "meaningful_feedback_given";

    // Validar se pode submeter
    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    // Criar submission
    return this.submitAction(userId, action, {
      ...body,
      metadata: { recipient: body.recipient, feedbackType: body.feedbackType },
    });
  }

  @Post("actions/mentoring-session")
  @HttpCode(HttpStatus.CREATED)
  async submitMentoringSession(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      mentee: string;
      duration: number;
      topics: string[];
    }
  ) {
    const userId = req.user.id;
    const action = "development_mentoring_session";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        mentee: body.mentee,
        duration: body.duration,
        topics: body.topics,
      },
    });
  }

  @Post("actions/peer-development-support")
  @HttpCode(HttpStatus.CREATED)
  async submitPeerDevelopmentSupport(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      colleague: string;
      supportType: string;
      outcome: string;
    }
  ) {
    const userId = req.user.id;
    const action = "peer_development_support";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        colleague: body.colleague,
        supportType: body.supportType,
        outcome: body.outcome,
      },
    });
  }

  @Post("actions/knowledge-sharing")
  @HttpCode(HttpStatus.CREATED)
  async submitKnowledgeSharing(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      topic: string;
      audience: string;
      format: string;
      duration: number;
    }
  ) {
    const userId = req.user.id;
    const action = "knowledge_sharing_session";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    // Ação requer evidência
    if (!body.evidence) {
      throw new BadRequestException({
        message: "Esta ação requer evidência (foto, documento, link, etc.)",
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        topic: body.topic,
        audience: body.audience,
        format: body.format,
        duration: body.duration,
      },
    });
  }

  @Post("actions/cross-team-collaboration")
  @HttpCode(HttpStatus.CREATED)
  async submitCrossTeamCollaboration(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      teams: string[];
      project: string;
      contribution: string;
    }
  ) {
    const userId = req.user.id;
    const action = "cross_team_collaboration";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        teams: body.teams,
        project: body.project,
        contribution: body.contribution,
      },
    });
  }

  @Post("actions/career-coaching")
  @HttpCode(HttpStatus.CREATED)
  async submitCareerCoaching(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      coachee: string;
      careerGoal: string;
      actionPlan: string;
    }
  ) {
    const userId = req.user.id;
    const action = "career_coaching_session";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    // Ação requer evidência
    if (!body.evidence) {
      throw new BadRequestException({
        message: "Esta ação requer evidência do plano de ação criado",
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        coachee: body.coachee,
        careerGoal: body.careerGoal,
        actionPlan: body.actionPlan,
      },
    });
  }

  // 👥 Contribuição de Equipe Endpoints

  @Post("actions/team-goal-contribution")
  @HttpCode(HttpStatus.CREATED)
  async submitTeamGoalContribution(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      goal: string;
      contribution: string;
      impact: string;
    }
  ) {
    const userId = req.user.id;
    const action = "team_goal_contribution";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        goal: body.goal,
        contribution: body.contribution,
        impact: body.impact,
      },
    });
  }

  @Post("actions/process-improvement")
  @HttpCode(HttpStatus.CREATED)
  async submitProcessImprovement(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      process: string;
      problem: string;
      solution: string;
      impact: string;
    }
  ) {
    const userId = req.user.id;
    const action = "process_improvement";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    // Ação requer evidência
    if (!body.evidence) {
      throw new BadRequestException({
        message: "Esta ação requer evidência da melhoria implementada",
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        process: body.process,
        problem: body.problem,
        solution: body.solution,
        impact: body.impact,
      },
    });
  }

  @Post("actions/retrospective-facilitation")
  @HttpCode(HttpStatus.CREATED)
  async submitRetrospectiveFacilitation(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      meetingType: string;
      participants: number;
      outcomes: string[];
    }
  ) {
    const userId = req.user.id;
    const action = "team_retrospective_facilitation";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        meetingType: body.meetingType,
        participants: body.participants,
        outcomes: body.outcomes,
      },
    });
  }

  @Post("actions/conflict-resolution")
  @HttpCode(HttpStatus.CREATED)
  async submitConflictResolution(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      conflictType: string;
      resolution: string;
      outcome: string;
    }
  ) {
    const userId = req.user.id;
    const action = "conflict_resolution_support";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        conflictType: body.conflictType,
        resolution: body.resolution,
        outcome: body.outcome,
      },
    });
  }

  @Post("actions/team-culture-building")
  @HttpCode(HttpStatus.CREATED)
  async submitTeamCultureBuilding(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      initiative: string;
      participation: string;
      impact: string;
    }
  ) {
    const userId = req.user.id;
    const action = "team_culture_building";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        initiative: body.initiative,
        participation: body.participation,
        impact: body.impact,
      },
    });
  }

  @Post("actions/documentation-contribution")
  @HttpCode(HttpStatus.CREATED)
  async submitDocumentationContribution(
    @Req() req: any,
    @Body()
    body: ActionSubmissionDto & {
      docType: string;
      topic: string;
      audience: string;
      usage: string;
    }
  ) {
    const userId = req.user.id;
    const action = "documentation_contribution";

    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    return this.submitAction(userId, action, {
      ...body,
      metadata: {
        docType: body.docType,
        topic: body.topic,
        audience: body.audience,
        usage: body.usage,
      },
    });
  }

  // 🔍 Endpoints de Informação e Gestão

  @Get("actions/types")
  async getActionTypes() {
    return this.actionValidationService.getActionTypes();
  }

  @Get("actions/my-cooldowns")
  async getMyCooldowns(@Req() req: any) {
    const userId = req.user.id;
    return this.actionValidationService.getUserCooldowns(userId);
  }

  @Get("actions/my-weekly-caps")
  async getMyWeeklyCaps(@Req() req: any) {
    const userId = req.user.id;
    return this.actionValidationService.getUserWeeklyCaps(userId);
  }

  @Get("actions/my-submissions")
  async getMySubmissions(
    @Req() req: any,
    @Query("status") status?: "PENDING" | "APPROVED" | "REJECTED",
    @Query("limit") limit?: string,
    @Query("offset") offset?: string
  ) {
    const userId = req.user.id;
    const limitNum = limit ? parseInt(limit) : 20;
    const offsetNum = offset ? parseInt(offset) : 0;

    return this.gamificationService.getUserActionSubmissions(
      userId,
      status,
      limitNum,
      offsetNum
    );
  }

  @Get("actions/validate-queue")
  async getValidationQueue(@Req() req: any, @Query("limit") limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.gamificationService.getActionValidationQueue(limitNum);
  }

  @Post("actions/validate/:submissionId")
  @HttpCode(HttpStatus.OK)
  async validateSubmission(
    @Req() req: any,
    @Param("submissionId") submissionId: string,
    @Body() validation: ActionValidationDto
  ) {
    const validatorId = req.user.id;
    return this.gamificationService.validateActionSubmission(
      submissionId,
      validatorId,
      validation
    );
  }

  // 🚀 SPRINT 2 - ENDPOINTS DE MULTIPLICADORES

  @Get("multipliers/my-info")
  async getMyMultiplierInfo(@Req() req: any) {
    const userId = req.user.id;
    return this.multiplierService.getUserMultiplierInfo(userId);
  }

  @Get("multipliers/dashboard")
  async getMultiplierDashboard(@Req() req: any) {
    const userId = req.user.id;
    return this.multiplierService.getMultiplierDashboard(userId);
  }

  @Post("multipliers/simulate")
  async simulateMultipliers(
    @Req() req: any,
    @Body() body: { action: string; baseXP: number }
  ): Promise<MultiplierResult> {
    const userId = req.user.id;
    return this.multiplierService.simulateMultipliers(
      userId,
      body.action,
      body.baseXP
    );
  }

  @Get("multipliers/stats")
  async getMultiplierStats(
    @Req() req: any,
    @Query("period") period?: "week" | "month" | "all"
  ) {
    const userId = req.user.id;
    return this.multiplierService.getMultiplierStats(userId, period || "week");
  }

  @Get("multipliers/action-eligibility/:action")
  async checkActionEligibility(
    @Req() req: any,
    @Param("action") action: string
  ) {
    const userId = req.user.id;
    return this.multiplierService.isActionEligibleForMultiplier(userId, action);
  }

  @Get("profile/type")
  async getMyProfileType(@Req() req: any) {
    const userId = req.user.id;
    return this.multiplierService.getUserProfileInfo(userId);
  }

  // � Endpoint genérico para submissão de ações manuais
  @Post("actions/submit")
  @HttpCode(HttpStatus.CREATED)
  async submitGenericAction(
    @Req() req: any,
    @Body() body: ActionSubmissionDto & { action: string; metadata?: any }
  ) {
    const userId = req.user.id;
    const { action, ...submissionData } = body;

    // Validar se pode submeter
    const validation = await this.actionValidationService.canSubmitAction(
      userId,
      action
    );
    if (!validation.canSubmit) {
      throw new BadRequestException({
        message: "Não é possível submeter esta ação",
        reasons: validation.reasons,
        cooldownInfo: validation.cooldownInfo,
        capInfo: validation.capInfo,
      });
    }

    // Submeter ação
    return this.submitAction(userId, action, {
      ...submissionData,
      action,
      metadata: body.metadata,
    });
  }

  // �🔧 Método auxiliar para submissão de ações
  private async submitAction(
    userId: number,
    action: string,
    data: ActionSubmissionDto & { metadata?: any }
  ) {
    // Detectar gaming
    const gamingCheck = await this.actionValidationService.detectGaming(userId);
    if (gamingCheck.isGaming) {
      throw new BadRequestException({
        message: "Padrão suspeito detectado",
        reasons: gamingCheck.reasons,
        confidence: gamingCheck.confidence,
      });
    }

    // Submeter ação
    const result = await this.gamificationService.submitManualAction(
      userId,
      action,
      data
    );

    // Aplicar cooldowns e caps
    await this.actionValidationService.applyCooldown(userId, action);
    await this.actionValidationService.incrementWeeklyCap(userId, action);

    return result;
  }

  // 📊 Endpoint para resumo de ações manuais
  @Get("actions/summary")
  async getActionsSummary(@Req() req: any) {
    const userId = req.user.id;

    try {
      // Usar endpoints que já existem internamente
      const [submissions] = await Promise.all([
        this.gamificationService.getUserActionSubmissions(
          userId,
          "PENDING",
          10,
          0
        ),
      ]);

      // Mock data básico para as ações disponíveis baseado nos endpoints existentes
      const mockActions = [
        {
          action: "meaningful_feedback_given",
          name: "Feedback Significativo",
          baseXP: 150,
          cooldownHours: 24,
        },
        {
          action: "development_mentoring_session",
          name: "Sessão de Mentoria",
          baseXP: 200,
          cooldownHours: 48,
        },
        {
          action: "peer_development_support",
          name: "Apoio ao Desenvolvimento",
          baseXP: 100,
          cooldownHours: 24,
        },
        {
          action: "knowledge_sharing_session",
          name: "Compartilhamento de Conhecimento",
          baseXP: 120,
          cooldownHours: 48,
        },
        {
          action: "process_improvement_initiative",
          name: "Melhoria de Processo",
          baseXP: 250,
          cooldownHours: 72,
        },
      ];

      return {
        availableActionsCount: mockActions.length,
        pendingSubmissions: submissions.length,
        weeklyXP: 0, // Será calculado em implementação futura
        nextActions: mockActions,
      };
    } catch (error) {
      return {
        availableActionsCount: 0,
        pendingSubmissions: 0,
        weeklyXP: 0,
        nextActions: [],
      };
    }
  }
}
