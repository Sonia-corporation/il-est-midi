import { ServiceNameEnum } from '../../../../../../../../enums/service-name.enum';
import { DiscordMessageCommandEnum } from '../../../../../enums/commands/discord-message-command.enum';
import { IDiscordMessageResponse } from '../../../../../interfaces/discord-message-response';
import { IAnyDiscordMessage } from '../../../../../types/any-discord-message';
import { DiscordMessageCommandCliErrorService } from '../../../discord-message-command-cli-error.service';
import { DiscordMessageCommandFeatureErrorCoreService } from '../discord-message-command-feature-error-core.service';
import { EmbedData, EmbedField } from 'discord.js';
import _ from 'lodash';

export class DiscordMessageCommandFeatureEmptyFeatureNameErrorService extends DiscordMessageCommandFeatureErrorCoreService {
  private static _instance: DiscordMessageCommandFeatureEmptyFeatureNameErrorService;

  public static getInstance(): DiscordMessageCommandFeatureEmptyFeatureNameErrorService {
    if (_.isNil(DiscordMessageCommandFeatureEmptyFeatureNameErrorService._instance)) {
      DiscordMessageCommandFeatureEmptyFeatureNameErrorService._instance =
        new DiscordMessageCommandFeatureEmptyFeatureNameErrorService();
    }

    return DiscordMessageCommandFeatureEmptyFeatureNameErrorService._instance;
  }

  public constructor() {
    super(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_EMPTY_FEATURE_NAME_ERROR_SERVICE);
  }

  public getMessageResponse(
    anyDiscordMessage: IAnyDiscordMessage,
    commands: DiscordMessageCommandEnum[]
  ): Promise<IDiscordMessageResponse> {
    return DiscordMessageCommandCliErrorService.getInstance()
      .getCliErrorMessageResponse()
      .then((cliErrorMessageResponse: IDiscordMessageResponse): Promise<IDiscordMessageResponse> => {
        const message: IDiscordMessageResponse = {
          options: {
            embeds: [this._getMessageEmbed(anyDiscordMessage, commands)],
          },
        };

        return Promise.resolve(_.merge(cliErrorMessageResponse, message));
      });
  }

  private _getMessageEmbed(anyDiscordMessage: IAnyDiscordMessage, commands: DiscordMessageCommandEnum[]): EmbedData {
    return {
      fields: this._getMessageEmbedFields(anyDiscordMessage, commands),
      footer: this._getMessageEmbedFooter(),
      title: this._getMessageEmbedTitle(),
    };
  }

  private _getMessageEmbedFields(
    anyDiscordMessage: IAnyDiscordMessage,
    commands: DiscordMessageCommandEnum[]
  ): EmbedField[] {
    return [
      this._getMessageEmbedFieldError(),
      this._getMessageEmbedFieldAllFeatures(),
      this._getMessageEmbedFieldFeatureExample(anyDiscordMessage, commands),
    ];
  }

  private _getMessageEmbedFieldError(): EmbedField {
    return {
      name: `Empty feature name`,
      value: `You did not specify the name of the feature you wish to configure.\nI will not guess it for you so please try again with a feature name!\nAnd because I am kind and generous here is the list of all the features you can configure with an example.`,
    };
  }
}
