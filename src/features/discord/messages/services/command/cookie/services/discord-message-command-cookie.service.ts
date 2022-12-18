import { ServiceNameEnum } from '../../../../../../../enums/service-name.enum';
import { DiscordChannelEnum } from '../../../../../channels/enums/discord-channel.enum';
import { DiscordSoniaService } from '../../../../../users/services/discord-sonia.service';
import { DiscordMessageCommandEnum } from '../../../../enums/commands/discord-message-command.enum';
import { discordHasThisCommand } from '../../../../functions/commands/checks/discord-has-this-command';
import { IDiscordMessageResponse } from '../../../../interfaces/discord-message-response';
import { DiscordMessageConfigService } from '../../../config/discord-message-config.service';
import { DiscordMessageCommandCoreService } from '../../discord-message-command-core.service';
import { DISCORD_MESSAGE_COMMAND_COOKIE_DESCRIPTION_MESSAGES } from '../constants/discord-message-command-cookie-description-messages';
import { DISCORD_MESSAGE_COMMAND_COOKIE_TITLE_MESSAGES } from '../constants/discord-message-command-cookie-title-messages';
import { EmbedAssetData, EmbedAuthorData, EmbedData, EmbedFooterData } from 'discord.js';
import _ from 'lodash';
import moment from 'moment-timezone';

export class DiscordMessageCommandCookieService extends DiscordMessageCommandCoreService {
  private static _instance: DiscordMessageCommandCookieService;

  public static getInstance(): DiscordMessageCommandCookieService {
    if (_.isNil(DiscordMessageCommandCookieService._instance)) {
      DiscordMessageCommandCookieService._instance = new DiscordMessageCommandCookieService();
    }

    return DiscordMessageCommandCookieService._instance;
  }

  public readonly allowedChannels: Set<DiscordChannelEnum> = new Set<DiscordChannelEnum>([
    DiscordChannelEnum.DM,
    DiscordChannelEnum.TEXT,
    DiscordChannelEnum.THREAD,
  ]);
  protected readonly _commandName: string = `cookie`;

  public constructor() {
    super(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_COOKIE_SERVICE);
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
      commands: [DiscordMessageCommandEnum.COOKIE, DiscordMessageCommandEnum.COOKIES, DiscordMessageCommandEnum.C],
      message,
      prefixes: DiscordMessageConfigService.getInstance().getMessageCommandPrefix(),
    });
  }

  private _getMessageEmbed(): EmbedData {
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

  private _getMessageEmbedAuthor(): EmbedAuthorData {
    return DiscordSoniaService.getInstance().getCorporationMessageEmbedAuthor();
  }

  private _getMessageEmbedColor(): number {
    return DiscordMessageConfigService.getInstance().getMessageCommandCookieImageColor();
  }

  private _getMessageDescription(): string {
    return DISCORD_MESSAGE_COMMAND_COOKIE_DESCRIPTION_MESSAGES.getRandomMessage();
  }

  private _getMessageEmbedFooter(): EmbedFooterData {
    const soniaImageUrl: string | null = DiscordSoniaService.getInstance().getImageUrl();

    return {
      iconURL: soniaImageUrl ?? undefined,
      text: `Bon appétit`,
    };
  }

  private _getMessageEmbedThumbnail(): EmbedAssetData {
    return {
      url: DiscordMessageConfigService.getInstance().getMessageCommandCookieImageUrl(),
    };
  }

  private _getMessageEmbedTimestamp(): Date {
    return moment().toDate();
  }

  private _getMessageEmbedTitle(): string {
    return DISCORD_MESSAGE_COMMAND_COOKIE_TITLE_MESSAGES.getRandomMessage();
  }
}
