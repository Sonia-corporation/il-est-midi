import { Snowflake } from "discord.js";
import _ from "lodash";
import { ClassNameEnum } from "../../../../../../../../../enums/class-name.enum";
import { toBoolean } from "../../../../../../../../../functions/formatters/to-boolean";
import { hasFirebaseGuildChannels } from "../../../../../../../../firebase/functions/guilds/checks/has-firebase-guild-channels";
import { FirebaseGuildsCommandsFeatureNoonEnabledService } from "../../../../../../../../firebase/services/guilds/commands/feature/firebase-guilds-commands-feature-noon-enabled.service";
import { FirebaseGuildsStoreQuery } from "../../../../../../../../firebase/stores/guilds/services/firebase-guilds-store.query";
import { IFirebaseGuildChannel } from "../../../../../../../../firebase/types/guilds/channels/firebase-guild-channel";
import { IFirebaseGuild } from "../../../../../../../../firebase/types/guilds/firebase-guild";
import { ChalkService } from "../../../../../../../../logger/services/chalk/chalk.service";
import { LoggerService } from "../../../../../../../../logger/services/logger.service";
import { DiscordChannelService } from "../../../../../../../channels/services/discord-channel.service";
import { IAnyDiscordChannel } from "../../../../../../../channels/types/any-discord-channel";
import { DiscordCommandFlagAction } from "../../../../../../classes/commands/flags/discord-command-flag-action";
import { DiscordCommandFlagSuccessDescriptionEnum } from "../../../../../../enums/commands/flags/discord-command-flag-success-description.enum";
import { DiscordCommandFlagSuccessTitleEnum } from "../../../../../../enums/commands/flags/discord-command-flag-success-title.enum";
import { IDiscordCommandFlagSuccess } from "../../../../../../interfaces/commands/flags/discord-command-flag-success";
import { IAnyDiscordMessage } from "../../../../../../types/any-discord-message";

export class DiscordMessageCommandFeatureNoonEnabled
  implements DiscordCommandFlagAction {
  private readonly _serviceName =
    ClassNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_NOON_ENABLED;

  public execute(
    anyDiscordMessage: Readonly<IAnyDiscordMessage>,
    value?: Readonly<string | null | undefined>
  ): Promise<IDiscordCommandFlagSuccess> {
    const shouldEnable: boolean = toBoolean(value, true);

    this._logExecuteAction(anyDiscordMessage.id);
    this._logNewState(anyDiscordMessage.id, shouldEnable);

    return this.isEnabled(anyDiscordMessage).then(
      (
        isEnabled: Readonly<boolean | undefined>
      ): Promise<IDiscordCommandFlagSuccess> => {
        this._logCurrentState(anyDiscordMessage.id, isEnabled);

        if (!_.isNil(anyDiscordMessage.guild)) {
          if (
            DiscordChannelService.getInstance().isValid(
              anyDiscordMessage.channel
            )
          ) {
            return this.updateDatabase(
              shouldEnable,
              isEnabled,
              anyDiscordMessage.guild,
              anyDiscordMessage.channel
            );
          }

          return Promise.reject(new Error(`Firebase channel invalid`));
        }

        return Promise.reject(new Error(`Firebase guild invalid`));
      }
    );
  }

  public isEnabled(
    anyDiscordMessage: Readonly<IAnyDiscordMessage>
  ): Promise<boolean | undefined> {
    if (_.isNil(anyDiscordMessage.guild)) {
      return this._getNoGuildMessageError(anyDiscordMessage.id);
    }

    const firebaseGuild:
      | IFirebaseGuild
      | undefined = FirebaseGuildsStoreQuery.getInstance().getEntity(
      anyDiscordMessage.guild.id
    );

    if (_.isNil(firebaseGuild)) {
      return this._getNoFirebaseGuildError(
        anyDiscordMessage.id,
        anyDiscordMessage.guild.id
      );
    }

    return Promise.resolve(
      this._isNoonEnabled(firebaseGuild, anyDiscordMessage.channel.id)
    );
  }

  public updateDatabase(
    shouldEnable: Readonly<boolean>,
    isEnabled: Readonly<boolean | undefined>,
    { id }: Readonly<IFirebaseGuild>,
    discordChannel: Readonly<IAnyDiscordChannel>
  ): Promise<IDiscordCommandFlagSuccess> {
    if (!_.isNil(id)) {
      return FirebaseGuildsCommandsFeatureNoonEnabledService.getInstance()
        .updateState(id, discordChannel.id, shouldEnable)
        .then(
          (): Promise<IDiscordCommandFlagSuccess> =>
            Promise.resolve(
              this._getCommandFlagSuccess(shouldEnable, isEnabled)
            )
        );
    }

    return Promise.reject(new Error(`Firebase guild id invalid`));
  }

  private _isNoonEnabled(
    firebaseGuild: Readonly<IFirebaseGuild>,
    channelId: Readonly<Snowflake>
  ): boolean | undefined {
    const firebaseGuildChannel:
      | IFirebaseGuildChannel
      | undefined = this._getFirebaseGuildChannel(firebaseGuild, channelId);

    if (_.isNil(firebaseGuildChannel)) {
      return undefined;
    }

    return this._getFirebaseEnabledState(firebaseGuildChannel);
  }

  private _getFirebaseGuildChannel(
    firebaseGuild: Readonly<IFirebaseGuild>,
    channelId: Readonly<Snowflake>
  ): IFirebaseGuildChannel | undefined {
    if (hasFirebaseGuildChannels(firebaseGuild)) {
      return _.get(firebaseGuild.channels, channelId);
    }

    return undefined;
  }

  private _getFirebaseEnabledState(
    firebaseGuildChannel: Readonly<IFirebaseGuildChannel>
  ): boolean | undefined {
    return firebaseGuildChannel.features?.noon?.isEnabled;
  }

  private _getNoGuildMessageError(
    discordMessageId: Readonly<Snowflake>
  ): Promise<never> {
    LoggerService.getInstance().error({
      context: this._serviceName,
      hasExtendedContext: true,
      message: LoggerService.getInstance().getSnowflakeContext(
        discordMessageId,
        `could not get the guild from the message`
      ),
    });

    return Promise.reject(
      new Error(`Could not get the guild from the message`)
    );
  }

  private _getNoFirebaseGuildError(
    discordMessageId: Readonly<Snowflake>,
    guildId: Readonly<Snowflake>
  ): Promise<never> {
    LoggerService.getInstance().error({
      context: this._serviceName,
      hasExtendedContext: true,
      message: LoggerService.getInstance().getSnowflakeContext(
        discordMessageId,
        `could not find the guild ${ChalkService.getInstance().value(
          guildId
        )} in Firebase`
      ),
    });

    return Promise.reject(
      new Error(`Could not find the guild ${guildId} in Firebase`)
    );
  }

  private _logExecuteAction(discordMessageId: Readonly<Snowflake>): void {
    LoggerService.getInstance().debug({
      context: this._serviceName,
      hasExtendedContext: true,
      message: LoggerService.getInstance().getSnowflakeContext(
        discordMessageId,
        `executing ${ChalkService.getInstance().value(`enabled`)} action`
      ),
    });
  }

  private _logNewState(
    discordMessageId: Readonly<Snowflake>,
    isEnabled: Readonly<boolean>
  ): void {
    LoggerService.getInstance().debug({
      context: this._serviceName,
      hasExtendedContext: true,
      message: LoggerService.getInstance().getSnowflakeContext(
        discordMessageId,
        `new state: ${ChalkService.getInstance().value(isEnabled)}`
      ),
    });
  }

  private _logCurrentState(
    discordMessageId: Readonly<Snowflake>,
    isEnabled: Readonly<boolean | undefined>
  ): void {
    LoggerService.getInstance().debug({
      context: this._serviceName,
      hasExtendedContext: true,
      message: LoggerService.getInstance().getSnowflakeContext(
        discordMessageId,
        `current state: ${ChalkService.getInstance().value(
          _.isNil(isEnabled) ? `undefined` : isEnabled
        )}`
      ),
    });
  }

  private _getCommandFlagSuccess(
    shouldEnable: Readonly<boolean>,
    isEnabled: Readonly<boolean | undefined>
  ): IDiscordCommandFlagSuccess {
    if (_.isNil(isEnabled)) {
      return this._getCommandFlagSuccessWhenNotConfigured(shouldEnable);
    } else if (_.isEqual(isEnabled, true)) {
      return this._getCommandFlagSuccessWhenEnabled(shouldEnable);
    }

    return this._getCommandFlagSuccessWhenDisabled(shouldEnable);
  }

  private _getCommandFlagSuccessWhenNotConfigured(
    shouldEnable: Readonly<boolean>
  ): IDiscordCommandFlagSuccess {
    if (_.isEqual(shouldEnable, true)) {
      return {
        description:
          DiscordCommandFlagSuccessDescriptionEnum.NOT_CONFIGURED_AND_ENABLED,
        name: DiscordCommandFlagSuccessTitleEnum.NOON_FEATURE_ENABLED,
      };
    }

    return {
      description:
        DiscordCommandFlagSuccessDescriptionEnum.NOT_CONFIGURED_AND_DISABLED,
      name: DiscordCommandFlagSuccessTitleEnum.NOON_FEATURE_DISABLED,
    };
  }

  private _getCommandFlagSuccessWhenEnabled(
    shouldEnable: Readonly<boolean>
  ): IDiscordCommandFlagSuccess {
    if (_.isEqual(shouldEnable, true)) {
      return {
        description:
          DiscordCommandFlagSuccessDescriptionEnum.ENABLED_AND_ENABLED,
        name: DiscordCommandFlagSuccessTitleEnum.NOON_FEATURE_ENABLED,
      };
    }

    return {
      description:
        DiscordCommandFlagSuccessDescriptionEnum.ENABLED_AND_DISABLED,
      name: DiscordCommandFlagSuccessTitleEnum.NOON_FEATURE_DISABLED,
    };
  }

  private _getCommandFlagSuccessWhenDisabled(
    shouldEnable: Readonly<boolean>
  ): IDiscordCommandFlagSuccess {
    if (_.isEqual(shouldEnable, true)) {
      return {
        description:
          DiscordCommandFlagSuccessDescriptionEnum.DISABLED_AND_ENABLED,
        name: DiscordCommandFlagSuccessTitleEnum.NOON_FEATURE_ENABLED,
      };
    }

    return {
      description:
        DiscordCommandFlagSuccessDescriptionEnum.DISABLED_AND_DISABLED,
      name: DiscordCommandFlagSuccessTitleEnum.NOON_FEATURE_DISABLED,
    };
  }
}
