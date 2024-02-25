import { Test, TestingModule } from '@nestjs/testing';
import { CompanyProfilesController } from './company-profiles.controller';
import { CompanyProfilesService } from './company-profiles.service';

describe('CompanyProfilesController', () => {
  let companyProfilesController: CompanyProfilesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CompanyProfilesController],
      providers: [CompanyProfilesService],
    }).compile();

    companyProfilesController = app.get<CompanyProfilesController>(CompanyProfilesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(companyProfilesController.getHello()).toBe('Hello World!');
    });
  });
});
