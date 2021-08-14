import { ServiceNameEnum } from '../../../../../../../../enums/service-name.enum';
import { DiscordMessageCommandEnum } from '../../../../../enums/commands/discord-message-command.enum';
import { discordGetCommandAndPrefix } from '../../../../../functions/commands/getters/discord-get-command-and-prefix';
import { IDiscordMessageResponse } from '../../../../../interfaces/discord-message-response';
import { IAnyDiscordMessage } from '../../../../../types/any-discord-message';
import { DiscordMessageConfigService } from '../../../../config/discord-message-config.service';
import { DiscordMessageCommandCliErrorService } from '../../../discord-message-command-cli-error.service';
import { DiscordMessageCommandFeatureErrorCoreService } from '../discord-message-command-feature-error-core.service';
import { EmbedFieldData, MessageEmbedOptions } from 'discord.js';
import _ from 'lodash';

export class DiscordMessageCommandFeatureEmptyFeatureNameErrorService extends DiscordMessageCommandFeatureErrorCoreService {
  private static _instance: DiscordMessageCommandFeatureEmptyFeatureNameErrorService;

  public static getInstance(): DiscordMessageCommandFeatureEmptyFeatureNameErrorService {
    if (_.isNil(DiscordMessageCommandFeatureEmptyFeatureNameErrorService._instance)) {
      DiscordMessageCommandFeatureEmptyFeatureNameErrorService._instance = new DiscordMessageCommandFeatureEmptyFeatureNameErrorService();
    }

    return DiscordMessageCommandFeatureEmptyFeatureNameErrorService._instance;
  }

  public constructor() {
    super(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_EMPTY_FEATURE_NAME_ERROR_SERVICE);
  }

  public getMessageResponse(
    anyDiscordMessage: Readonly<IAnyDiscordMessage>,
    commands: Readonly<DiscordMessageCommandEnum>[]
  ): Promise<IDiscordMessageResponse> {
    return DiscordMessageCommandCliErrorService.getInstance()
      .getCliErrorMessageResponse()
      .then(
        (cliErrorMessageResponse: Readonly<IDiscordMessageResponse>): Promise<IDiscordMessageResponse> =>
          Promise.resolve(
            _.merge(cliErrorMessageResponse, {
              options: {
                embed: this._getMessageEmbed(anyDiscordMessage, commands),
                split: false,
              },
              response: ``,
            } as IDiscordMessageResponse)
          )
      );
  }

  private _getMessageEmbed(
    anyDiscordMessage: Readonly<IAnyDiscordMessage>,
    commands: Readonly<DiscordMessageCommandEnum>[]
  ): MessageEmbedOptions {
    return {
      fields: this._getMessageEmbedFields(anyDiscordMessage, commands),
      footer: this._getMessageEmbedFooter(),
      title: this._getMessageEmbedTitle(),
    };
  }

  private _getMessageEmbedFields(
    anyDiscordMessage: Readonly<IAnyDiscordMessage>,
    commands: Readonly<DiscordMessageCommandEnum>[]
  ): EmbedFieldData[] {
    return [
      this._getMessageEmbedFieldError(),
      this._getMessageEmbedFieldAllFeatures(),
      this._getMessageEmbedFieldFeatureExample(anyDiscordMessage, commands),
      this._getMessageEmbedFieldNeedHelp(anyDiscordMessage, commands),
    ];
  }

  private _getMessageEmbedFieldError(): EmbedFieldData {
    return {
      name: `Empty feature name`,
      value: `You did not specify the name of the feature you wish to configure.\nI will not guess it for you so please try again with a feature name!\nAnd because I am kind and generous here is the list of all the features you can configure with an example.`,
    };
  }

  private _getMessageEmbedFieldNeedHelp(
    { content }: Readonly<IAnyDiscordMessage>,
    commands: Readonly<DiscordMessageCommandEnum>[]
  ): EmbedFieldData {
    let userCommand: string | null = discordGetCommandAndPrefix({
      commands,
      message: _.isNil(content) ? `` : content,
      prefixes: DiscordMessageConfigService.getInstance().getMessageCommandPrefix(),
    });

    if (_.isNil(userCommand)) {
      userCommand = `!${_.toLower(DiscordMessageCommandEnum.FEATURE)}`;
    }

    return {
      name: `Need help?`,
      value: `If you need my help, you can also specify the help flag \`${userCommand} --help\` and I will try my best to help you!`,
    };
  }
}
