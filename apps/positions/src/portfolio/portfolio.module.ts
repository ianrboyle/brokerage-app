import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/common';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [LoggerModule],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
