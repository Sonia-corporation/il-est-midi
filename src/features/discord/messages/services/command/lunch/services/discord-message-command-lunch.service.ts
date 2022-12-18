import { ServiceNameEnum } from '../../../../../../../enums/service-name.enum';
import { DiscordChannelEnum } from '../../../../../channels/enums/discord-channel.enum';
import { DiscordSoniaService } from '../../../../../users/services/discord-sonia.service';
import { DiscordMessageCommandEnum } from '../../../../enums/commands/discord-message-command.enum';
import { discordHasThisCommand } from '../../../../functions/commands/checks/discord-has-this-command';
import { IDiscordMessageResponse } from '../../../../interfaces/discord-message-response';
import { DiscordMessageConfigService } from '../../../config/discord-message-config.service';
import { DiscordMessageCommandCoreService } from '../../discord-message-command-core.service';
import { DISCORD_MESSAGE_COMMAND_LUNCH_DESCRIPTION_MESSAGES } from '../constants/discord-message-command-lunch-description-messages';
import { DISCORD_MESSAGE_COMMAND_LUNCH_TITLE_MESSAGES } from '../constants/discord-message-command-lunch-title-messages';
import { APIEmbed, APIEmbedAuthor, APIEmbedFooter, APIEmbedImage } from 'discord.js';
import _ from 'lodash';
import moment from 'moment-timezone';

export class DiscordMessageCommandLunchService extends DiscordMessageCommandCoreService {
  private static _instance: DiscordMessageCommandLunchService;

  public static getInstance(): DiscordMessageCommandLunchService {
    if (_.isNil(DiscordMessageCommandLunchService._instance)) {
      DiscordMessageCommandLunchService._instance = new DiscordMessageCommandLunchService();
    }

    return DiscordMessageCommandLunchService._instance;
  }

  public readonly allowedChannels: Set<DiscordChannelEnum> = new Set<DiscordChannelEnum>([
    DiscordChannelEnum.DM,
    DiscordChannelEnum.TEXT,
    DiscordChannelEnum.THREAD,
  ]);
  protected readonly _commandName: string = `lunch`;

  public constructor() {
    super(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_LUNCH_SERVICE);
  }

  public getMessageResponse(): Promise<IDiscordMessageResponse> {
    const message: IDiscordMessageResponse = {
      options: {
        embeds: [this._getMessageEmbed()],
      },
    };

    return Promise.resolve(message);
  }

  public hasCommand(message: string): boolean {
    return discordHasThisCommand({
      commands: [DiscordMessageCommandEnum.LUNCH, DiscordMessageCommandEnum.L],
      message,
      prefixes: DiscordMessageConfigService.getInstance().getMessageCommandPrefix(),
    });
  }

  private _getMessageEmbed(): APIEmbed {
    return {
      author: this._getMessageEmbedAuthor(),
      color: this._getMessageEmbedColor(),
      description: this._getMessageDescription(),
      footer: this._getMessageEmbedFooter(),
      thumbnail: this._getMessageEmbedThumbnail(),
      timestamp: this._getMessageEmbedTimestamp(),
      title: this._getMessageEmbedTitle(),
    };
  }

  private _getMessageEmbedAuthor(): APIEmbedAuthor {
    return DiscordSoniaService.getInstance().getCorporationMessageEmbedAuthor();
  }

  private _getMessageEmbedColor(): number {
    return DiscordMessageConfigService.getInstance().getMessageCommandLunchImageColor();
  }

  private _getMessageDescription(): string {
    return DISCORD_MESSAGE_COMMAND_LUNCH_DESCRIPTION_MESSAGES.getRandomMessage();
  }

  private _getMessageEmbedFooter(): APIEmbedFooter {
    const soniaImageUrl: string | null = DiscordSoniaService.getInstance().getImageUrl();

    return {
      icon_url: soniaImageUrl ?? undefined,
      text: `Bon appétit`,
    };
  }

  private _getMessageEmbedThumbnail(): APIEmbedImage {
    return {
      url: DiscordMessageConfigService.getInstance().getMessageCommandLunchImageUrl(),
    };
  }

  private _getMessageEmbedTimestamp(): string {
    return moment().toISOString();
  }

  private _getMessageEmbedTitle(): string {
    return DISCORD_MESSAGE_COMMAND_LUNCH_TITLE_MESSAGES.getRandomMessage();
  }
}
