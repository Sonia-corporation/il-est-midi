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

export class DiscordMessageCommandFeatureWrongFeatureNameErrorService extends DiscordMessageCommandFeatureErrorCoreService {
  private static _instance: DiscordMessageCommandFeatureWrongFeatureNameErrorService;

  public static getInstance(): DiscordMessageCommandFeatureWrongFeatureNameErrorService {
    if (_.isNil(DiscordMessageCommandFeatureWrongFeatureNameErrorService._instance)) {
      DiscordMessageCommandFeatureWrongFeatureNameErrorService._instance = new DiscordMessageCommandFeatureWrongFeatureNameErrorService();
    }

    return DiscordMessageCommandFeatureWrongFeatureNameErrorService._instance;
  }

  public constructor() {
    super(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_WRONG_FEATURE_NAME_ERROR_SERVICE);
  }

  public getMessageResponse(
    anyDiscordMessage: Readonly<IAnyDiscordMessage>,
    commands: Readonly<DiscordMessageCommandEnum>[],
    featureName: Readonly<string>
  ): Promise<IDiscordMessageResponse> {
    return DiscordMessageCommandCliErrorService.getInstance()
      .getCliErrorMessageResponse()
      .then(
        (cliErrorMessageResponse: Readonly<IDiscordMessageResponse>): Promise<IDiscordMessageResponse> =>
          Promise.resolve(
            _.merge(cliErrorMessageResponse, {
              options: {
                embed: this._getMessageEmbed(anyDiscordMessage, commands, featureName),
                split: false,
              },
              response: ``,
            } as IDiscordMessageResponse)
          )
      );
  }

  private _getMessageEmbed(
    anyDiscordMessage: Readonly<IAnyDiscordMessage>,
    commands: Readonly<DiscordMessageCommandEnum>[],
    featureName: Readonly<string>
  ): MessageEmbedOptions {
    return {
      fields: this._getMessageEmbedFields(anyDiscordMessage, commands, featureName),
      footer: this._getMessageEmbedFooter(),
      title: this._getMessageEmbedTitle(),
    };
  }

  private _getMessageEmbedFields(
    anyDiscordMessage: Readonly<IAnyDiscordMessage>,
    commands: Readonly<DiscordMessageCommandEnum>[],
    featureName: Readonly<string>
  ): EmbedFieldData[] {
    return [
      this._getMessageEmbedFieldError(featureName),
      this._getMessageEmbedFieldAllFeatures(),
      this._getMessageEmbedFieldFeatureExample(anyDiscordMessage, commands),
      this._getMessageEmbedFieldNeedHelp(anyDiscordMessage, commands),
    ];
  }

  private _getMessageEmbedFieldError(featureName: Readonly<string>): EmbedFieldData {
    return {
      name: `Wrong feature name`,
      value: `\`${featureName}\` is not an existing feature...\nLet me show you the list of available features with an example and maybe try again with a valid one this time, ok?`,
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
