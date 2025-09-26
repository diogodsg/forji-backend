import { Controller, Get } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Controller("test")
export class TestController {
  private prisma = new PrismaClient();

  @Get("users")
  async testUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          githubId: true,
          isAdmin: true,
          position: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { id: "asc" },
      });

      return {
        success: true,
        count: users.length,
        users: users.map((user) => ({
          ...user,
          managers: [],
          reports: [],
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error,
      };
    }
  }
}
