// import { Test, TestingModule } from '@nestjs/testing';
// import { PositionsController } from './positions.controller';
// import { PositionsService } from './positions.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Position } from '../../../libs/common/src';
// import { PositionsRepository } from './positions.repository';
// import { CompanyProfilesService } from '../../company-profiles/src/company-profiles.service';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// describe('PositionsController', () => {
//   let controller: PositionsController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         ConfigModule.forRoot(), // Add necessary imports here
//         // Import other modules as needed
//       ],
//       providers: [
//         PositionsService,
//         PositionsRepository,
//         {
//           provide: getRepositoryToken(Position),
//           useValue: {
//             create: jest.fn(),
//             save: jest.fn(),
//             find: jest.fn(),
//           },
//         },
//         ConfigService,
//       ],
//       controllers: [PositionsController],
//     }).compile();

//     controller = module.get<PositionsController>(PositionsController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
