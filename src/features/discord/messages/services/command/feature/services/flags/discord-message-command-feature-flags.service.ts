import { AbstractService } from '../../../../../../../../classes/services/abstract.service';
import { ServiceNameEnum } from '../../../../../../../../enums/service-name.enum';
import { IDiscordMessageResponse } from '../../../../../interfaces/discord-message-response';
import _ from 'lodash';

export class DiscordMessageCommandFeatureFlagsService extends AbstractService {
  private static _instance: DiscordMessageCommandFeatureFlagsService;

  public static getInstance(): DiscordMessageCommandFeatureFlagsService {
    if (_.isNil(DiscordMessageCommandFeatureFlagsService._instance)) {
      DiscordMessageCommandFeatureFlagsService._instance = new DiscordMessageCommandFeatureFlagsService();
    }

    return DiscordMessageCommandFeatureFlagsService._instance;
  }

  public constructor() {
    super(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_FLAGS_SERVICE);
  }

  public hasFlag(message: Readonly<string>): boolean {
    return false;
  }

  public getMessageResponse(message: Readonly<string>): Promise<IDiscordMessageResponse | IDiscordMessageResponse[]> {
    return Promise.resolve([]);
  }
}
