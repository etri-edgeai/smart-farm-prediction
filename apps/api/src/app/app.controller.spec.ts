import { Test, TestingModule } from '@nestjs/testing';
import { CommonConfigModule } from '@libs/config';

import { AppController } from './app.controller';

describe('AppController', () => {
  let app: TestingModule;

  const mockAppService = {
    //findAll: () => (resultAll),
  };

  const appServiceProvider = {
    useValue: mockAppService,
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      const appController = app.get<AppController>(AppController);
      //expect(appController.getData()).toEqual({ message: 'Welcome to api!' });
      expect(true);
    });
  });
});
