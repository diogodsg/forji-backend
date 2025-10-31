import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private emailService: EmailService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<SendEmailDto>) {
    this.logger.log(`Processing email job ${job.id}: ${job.data.type} to ${job.data.to}`);

    try {
      await this.emailService.sendEmail(job.data);
      this.logger.log(`Email job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(`Email job ${job.id} failed: ${error.message}`, error.stack);
      throw error; // Bull will retry based on job options
    }
  }
}
