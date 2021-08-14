import { ServiceNameEnum } from './service-name.enum';
import { getEnumLength } from '../functions/checks/get-enum-length';

describe(`ServiceNameEnum`, (): void => {
  it(`should have 122 members`, (): void => {
    expect.assertions(1);

    expect(getEnumLength(ServiceNameEnum)).toStrictEqual(122);
  });

  it(`should have a member "APP_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.APP_CONFIG_CORE_SERVICE).toStrictEqual(`AppConfigCoreService`);
  });

  it(`should have a member "APP_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.APP_CONFIG_MUTATOR_SERVICE).toStrictEqual(`AppConfigMutatorService`);
  });

  it(`should have a member "APP_CONFIG_QUERY_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.APP_CONFIG_QUERY_SERVICE).toStrictEqual(`AppConfigQueryService`);
  });

  it(`should have a member "APP_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.APP_CONFIG_SERVICE).toStrictEqual(`AppConfigService`);
  });

  it(`should have a member "CHALK_COLOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.CHALK_COLOR_SERVICE).toStrictEqual(`ChalkColorService`);
  });

  it(`should have a member "CHALK_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.CHALK_SERVICE).toStrictEqual(`ChalkService`);
  });

  it(`should have a member "CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.CONFIG_SERVICE).toStrictEqual(`ConfigService`);
  });

  it(`should have a member "CORE_EVENT_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.CORE_EVENT_SERVICE).toStrictEqual(`CoreEventService`);
  });

  it(`should have a member "CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.CORE_SERVICE).toStrictEqual(`CoreService`);
  });

  it(`should have a member "DISCORD_ACTIVITY_SONIA_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_ACTIVITY_SONIA_SERVICE).toStrictEqual(`DiscordActivitySoniaService`);
  });

  it(`should have a member "DISCORD_AUTHENTICATION_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_AUTHENTICATION_SERVICE).toStrictEqual(`DiscordAuthenticationService`);
  });

  it(`should have a member "DISCORD_AUTHOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_AUTHOR_SERVICE).toStrictEqual(`DiscordAuthorService`);
  });

  it(`should have a member "DISCORD_CHANNEL_GUILD_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_CHANNEL_GUILD_SERVICE).toStrictEqual(`DiscordChannelGuildService`);
  });

  it(`should have a member "DISCORD_CHANNEL_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_CHANNEL_SERVICE).toStrictEqual(`DiscordChannelService`);
  });

  it(`should have a member "DISCORD_CHANNEL_TYPING_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_CHANNEL_TYPING_SERVICE).toStrictEqual(`DiscordChannelTypingService`);
  });

  it(`should have a member "DISCORD_CLIENT_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_CLIENT_SERVICE).toStrictEqual(`DiscordClientService`);
  });

  it(`should have a member "DISCORD_GUILD_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_GUILD_CONFIG_CORE_SERVICE).toStrictEqual(`DiscordGuildConfigCoreService`);
  });

  it(`should have a member "DISCORD_GUILD_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_GUILD_CONFIG_MUTATOR_SERVICE).toStrictEqual(`DiscordGuildConfigMutatorService`);
  });

  it(`should have a member "DISCORD_GUILD_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_GUILD_CONFIG_SERVICE).toStrictEqual(`DiscordGuildConfigService`);
  });

  it(`should have a member "DISCORD_GUILD_CREATE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_GUILD_CREATE_SERVICE).toStrictEqual(`DiscordGuildCreateService`);
  });

  it(`should have a member "DISCORD_GUILD_MEMBER_ADD_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_GUILD_MEMBER_ADD_SERVICE).toStrictEqual(`DiscordGuildMemberAddService`);
  });

  it(`should have a member "DISCORD_GUILD_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_GUILD_SERVICE).toStrictEqual(`DiscordGuildService`);
  });

  it(`should have a member "DISCORD_GUILD_SONIA_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_GUILD_SONIA_SERVICE).toStrictEqual(`DiscordGuildSoniaService`);
  });

  it(`should have a member "DISCORD_LOGGER_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_LOGGER_ERROR_SERVICE).toStrictEqual(`DiscordLoggerErrorService`);
  });

  it(`should have a member "DISCORD_LOGGER_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_LOGGER_SERVICE).toStrictEqual(`DiscordLoggerService`);
  });

  it(`should have a member "DISCORD_LOGGER_WARNING_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_LOGGER_WARNING_SERVICE).toStrictEqual(`DiscordLoggerWarningService`);
  });

  it(`should have a member "DISCORD_MENTION_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MENTION_SERVICE).toStrictEqual(`DiscordMentionService`);
  });

  it(`should have a member "DISCORD_MESSAGE_ANY_QUESTION_PINEAPPLE_PIZZA_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_ANY_QUESTION_PINEAPPLE_PIZZA_SERVICE).toStrictEqual(
      `DiscordMessageAnyQuestionPineapplePizzaService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_AUTHOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_AUTHOR_SERVICE).toStrictEqual(`DiscordMessageAuthorService`);
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_CLI_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_CLI_ERROR_SERVICE).toStrictEqual(
      `DiscordMessageCommandCliErrorService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_COOKIE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_COOKIE_SERVICE).toStrictEqual(`DiscordMessageCommandCookieService`);
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_ERROR_SERVICE).toStrictEqual(`DiscordMessageCommandErrorService`);
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_DUPLICATED_FLAGS_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_DUPLICATED_FLAGS_ERROR_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureDuplicatedFlagsErrorService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_EMPTY_CONTENT_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_EMPTY_CONTENT_ERROR_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureEmptyContentErrorService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_EMPTY_FEATURE_NAME_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_EMPTY_FEATURE_NAME_ERROR_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureEmptyFeatureNameErrorService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_EMPTY_FLAGS_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_EMPTY_FLAGS_ERROR_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureEmptyFlagsErrorService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_FLAGS_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_FLAGS_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureFlagsService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_NOON_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_NOON_CONFIG_CORE_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureNoonConfigCoreService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_NOON_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_NOON_CONFIG_MUTATOR_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureNoonConfigMutatorService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_NOON_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_NOON_CONFIG_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureNoonConfigService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_NOON_ENABLED_SUCCESS_FLAG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_NOON_ENABLED_SUCCESS_FLAG_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureNoonEnabledSuccessFlagService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_NOON_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_NOON_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureNoonService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_OPPOSITE_FLAGS_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_OPPOSITE_FLAGS_ERROR_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureOppositeFlagsErrorService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_CONFIG_CORE_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureReleaseNotesConfigCoreService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_CONFIG_MUTATOR_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureReleaseNotesConfigMutatorService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_CONFIG_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureReleaseNotesConfigService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_ENABLED_SUCCESS_FLAG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_ENABLED_SUCCESS_FLAG_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureReleaseNotesEnabledSuccessFlagService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_RELEASE_NOTES_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureReleaseNotesService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_WRONG_FEATURE_NAME_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_WRONG_FEATURE_NAME_ERROR_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureWrongFeatureNameErrorService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_FEATURE_WRONG_FLAGS_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_WRONG_FLAGS_ERROR_SERVICE).toStrictEqual(
      `DiscordMessageCommandFeatureWrongFlagsErrorService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_HELP_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_HELP_SERVICE).toStrictEqual(`DiscordMessageCommandHelpService`);
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_LUNCH_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_LUNCH_SERVICE).toStrictEqual(`DiscordMessageCommandLunchService`);
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_QUOTE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_QUOTE_SERVICE).toStrictEqual(`DiscordMessageCommandQuoteService`);
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_RELEASE_NOTES_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_RELEASE_NOTES_SERVICE).toStrictEqual(
      `DiscordMessageCommandReleaseNotesService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_SERVICE).toStrictEqual(`DiscordMessageCommandService`);
  });

  it(`should have a member "DISCORD_MESSAGE_COMMAND_VERSION_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_COMMAND_VERSION_SERVICE).toStrictEqual(
      `DiscordMessageCommandVersionService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_CONFIG_CORE_SERVICE).toStrictEqual(`DiscordMessageConfigCoreService`);
  });

  it(`should have a member "DISCORD_MESSAGE_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_CONFIG_MUTATOR_SERVICE).toStrictEqual(`DiscordMessageConfigMutatorService`);
  });

  it(`should have a member "DISCORD_MESSAGE_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_CONFIG_SERVICE).toStrictEqual(`DiscordMessageConfigService`);
  });

  it(`should have a member "DISCORD_MESSAGE_CONTENT_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_CONTENT_SERVICE).toStrictEqual(`DiscordMessageContentService`);
  });

  it(`should have a member "DISCORD_MESSAGE_DM_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_DM_SERVICE).toStrictEqual(`DiscordMessageDmService`);
  });

  it(`should have a member "DISCORD_MESSAGE_ERROR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_ERROR_SERVICE).toStrictEqual(`DiscordMessageErrorService`);
  });

  it(`should have a member "DISCORD_MESSAGE_HELP_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_HELP_SERVICE).toStrictEqual(`DiscordMessageHelpService`);
  });

  it(`should have a member "DISCORD_MESSAGE_HOTEL_TRIVAGO_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_HOTEL_TRIVAGO_SERVICE).toStrictEqual(`DiscordMessageHotelTrivagoService`);
  });

  it(`should have a member "DISCORD_MESSAGE_PING_PONG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_PING_PONG_SERVICE).toStrictEqual(`DiscordMessagePingPongService`);
  });

  it(`should have a member "DISCORD_MESSAGE_RIGHTS_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_RIGHTS_SERVICE).toStrictEqual(`DiscordMessageRightsService`);
  });

  it(`should have a member "DISCORD_MESSAGE_SCHEDULE_NOON_COUNT_HUMANIZED_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_SCHEDULE_NOON_COUNT_HUMANIZED_SERVICE).toStrictEqual(
      `DiscordMessageScheduleNoonCountHumanizedService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_SCHEDULE_NOON_COUNT_MESSAGE_RESPONSE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_SCHEDULE_NOON_COUNT_MESSAGE_RESPONSE_SERVICE).toStrictEqual(
      `DiscordMessageScheduleNoonCountMessageResponseService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_SCHEDULE_NOON_COUNT_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_SCHEDULE_NOON_COUNT_SERVICE).toStrictEqual(
      `DiscordMessageScheduleNoonCountService`
    );
  });

  it(`should have a member "DISCORD_MESSAGE_SCHEDULE_NOON_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_SCHEDULE_NOON_SERVICE).toStrictEqual(`DiscordMessageScheduleNoonService`);
  });

  it(`should have a member "DISCORD_MESSAGE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_SERVICE).toStrictEqual(`DiscordMessageService`);
  });

  it(`should have a member "DISCORD_MESSAGE_SIMPLE_BASIC_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_SIMPLE_BASIC_SERVICE).toStrictEqual(`DiscordMessageSimpleBasicService`);
  });

  it(`should have a member "DISCORD_MESSAGE_TEXT_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_MESSAGE_TEXT_SERVICE).toStrictEqual(`DiscordMessageTextService`);
  });

  it(`should have a member "DISCORD_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_SERVICE).toStrictEqual(`DiscordService`);
  });

  it(`should have a member "DISCORD_SONIA_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_SONIA_CONFIG_CORE_SERVICE).toStrictEqual(`DiscordSoniaConfigCoreService`);
  });

  it(`should have a member "DISCORD_SONIA_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_SONIA_CONFIG_MUTATOR_SERVICE).toStrictEqual(`DiscordSoniaConfigMutatorService`);
  });

  it(`should have a member "DISCORD_SONIA_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_SONIA_CONFIG_SERVICE).toStrictEqual(`DiscordSoniaConfigService`);
  });

  it(`should have a member "DISCORD_SONIA_EMOTIONAL_STATE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_SONIA_EMOTIONAL_STATE_SERVICE).toStrictEqual(`DiscordSoniaEmotionalStateService`);
  });

  it(`should have a member "DISCORD_SONIA_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.DISCORD_SONIA_SERVICE).toStrictEqual(`DiscordSoniaService`);
  });

  it(`should have a member "ENVIRONMENT_VALIDITY_CHECK_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.ENVIRONMENT_VALIDITY_CHECK_SERVICE).toStrictEqual(`EnvironmentValidityCheckService`);
  });

  it(`should have a member "FIREBASE_APP_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_APP_SERVICE).toStrictEqual(`FirebaseAppService`);
  });

  it(`should have a member "FIREBASE_GUILDS_BREAKING_CHANGES_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_BREAKING_CHANGE_SERVICE).toStrictEqual(
      `FirebaseGuildsBreakingChangeService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_COMMANDS_FEATURE_NOON_ENABLED_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_CHANNELS_FEATURES_NOON_ENABLED_SERVICE).toStrictEqual(
      `FirebaseGuildsChannelsFeaturesNoonEnabledService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_CHANNELS_FEATURES_NOON_ENABLED_STATE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_CHANNELS_FEATURES_NOON_ENABLED_STATE_SERVICE).toStrictEqual(
      `FirebaseGuildsChannelsFeaturesNoonEnabledStateService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_CHANNELS_FEATURES_NOON_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_CHANNELS_FEATURES_NOON_SERVICE).toStrictEqual(
      `FirebaseGuildsChannelsFeaturesNoonService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_COMMANDS_FEATURE_RELEASE_NOTES_ENABLED_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_CHANNELS_FEATURES_RELEASE_NOTES_ENABLED_SERVICE).toStrictEqual(
      `FirebaseGuildsChannelsFeaturesReleaseNotesEnabledService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_CHANNELS_FEATURES_RELEASE_NOTES_ENABLED_STATE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_CHANNELS_FEATURES_RELEASE_NOTES_ENABLED_STATE_SERVICE).toStrictEqual(
      `FirebaseGuildsChannelsFeaturesReleaseNotesEnabledStateService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_CHANNELS_FEATURES_RELEASE_NOTES_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_CHANNELS_FEATURES_RELEASE_NOTES_SERVICE).toStrictEqual(
      `FirebaseGuildsChannelsFeaturesReleaseNotesService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_CHANNELS_FEATURES_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_CHANNELS_FEATURES_SERVICE).toStrictEqual(
      `FirebaseGuildsChannelsFeaturesService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_CHANNELS_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_CHANNELS_SERVICE).toStrictEqual(`FirebaseGuildsChannelsService`);
  });

  it(`should have a member "FIREBASE_GUILDS_NEW_VERSION_COUNT_HUMANIZED_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_NEW_VERSION_COUNT_HUMANIZED_SERVICE).toStrictEqual(
      `FirebaseGuildsNewVersionCountHumanizedService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_NEW_VERSION_COUNT_MESSAGE_RESPONSE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_NEW_VERSION_COUNT_MESSAGE_RESPONSE_SERVICE).toStrictEqual(
      `FirebaseGuildsNewVersionCountMessageResponseService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_NEW_VERSION_COUNT_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_NEW_VERSION_COUNT_SERVICE).toStrictEqual(
      `FirebaseGuildsNewVersionCountService`
    );
  });

  it(`should have a member "FIREBASE_GUILDS_NEW_VERSION_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_NEW_VERSION_SERVICE).toStrictEqual(`FirebaseGuildsNewVersionService`);
  });

  it(`should have a member "FIREBASE_GUILDS_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_SERVICE).toStrictEqual(`FirebaseGuildsService`);
  });

  it(`should have a member "FIREBASE_GUILDS_STORE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_STORE).toStrictEqual(`FirebaseGuildsStore`);
  });

  it(`should have a member "FIREBASE_GUILDS_STORE_QUERY"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_STORE_QUERY).toStrictEqual(`FirebaseGuildsStoreQuery`);
  });

  it(`should have a member "FIREBASE_GUILDS_STORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_GUILDS_STORE_SERVICE).toStrictEqual(`FirebaseGuildsStoreService`);
  });

  it(`should have a member "FIREBASE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.FIREBASE_SERVICE).toStrictEqual(`FirebaseService`);
  });

  it(`should have a member "GITHUB_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.GITHUB_CONFIG_CORE_SERVICE).toStrictEqual(`GithubConfigCoreService`);
  });

  it(`should have a member "GITHUB_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.GITHUB_CONFIG_MUTATOR_SERVICE).toStrictEqual(`GithubConfigMutatorService`);
  });

  it(`should have a member "GITHUB_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.GITHUB_CONFIG_SERVICE).toStrictEqual(`GithubConfigService`);
  });

  it(`should have a member "INIT_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.INIT_SERVICE).toStrictEqual(`InitService`);
  });

  it(`should have a member "LOGGER_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.LOGGER_CONFIG_CORE_SERVICE).toStrictEqual(`LoggerConfigCoreService`);
  });

  it(`should have a member "LOGGER_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.LOGGER_CONFIG_MUTATOR_SERVICE).toStrictEqual(`LoggerConfigMutatorService`);
  });

  it(`should have a member "LOGGER_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.LOGGER_CONFIG_SERVICE).toStrictEqual(`LoggerConfigService`);
  });

  it(`should have a member "LOGGER_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.LOGGER_SERVICE).toStrictEqual(`LoggerService`);
  });

  it(`should have a member "PROFILE_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.PROFILE_CONFIG_CORE_SERVICE).toStrictEqual(`ProfileConfigCoreService`);
  });

  it(`should have a member "PROFILE_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.PROFILE_CONFIG_MUTATOR_SERVICE).toStrictEqual(`ProfileConfigMutatorService`);
  });

  it(`should have a member "PROFILE_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.PROFILE_CONFIG_SERVICE).toStrictEqual(`ProfileConfigService`);
  });

  it(`should have a member "QUOTE_API_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.QUOTE_API_SERVICE).toStrictEqual(`QuoteApiService`);
  });

  it(`should have a member "QUOTE_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.QUOTE_CONFIG_CORE_SERVICE).toStrictEqual(`QuoteConfigCoreService`);
  });

  it(`should have a member "QUOTE_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.QUOTE_CONFIG_MUTATOR_SERVICE).toStrictEqual(`QuoteConfigMutatorService`);
  });

  it(`should have a member "QUOTE_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.QUOTE_CONFIG_SERVICE).toStrictEqual(`QuoteConfigService`);
  });

  it(`should have a member "QUOTE_ERROR_API_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.QUOTE_ERROR_API_SERVICE).toStrictEqual(`QuoteErrorApiService`);
  });

  it(`should have a member "QUOTE_RANDOM_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.QUOTE_RANDOM_SERVICE).toStrictEqual(`QuoteRandomService`);
  });

  it(`should have a member "RELEASE_TYPE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.RELEASE_TYPE_SERVICE).toStrictEqual(`ReleaseTypeService`);
  });

  it(`should have a member "SERVER_CONFIG_CORE_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.SERVER_CONFIG_CORE_SERVICE).toStrictEqual(`ServerConfigCoreService`);
  });

  it(`should have a member "SERVER_CONFIG_MUTATOR_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.SERVER_CONFIG_MUTATOR_SERVICE).toStrictEqual(`ServerConfigMutatorService`);
  });

  it(`should have a member "SERVER_CONFIG_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.SERVER_CONFIG_SERVICE).toStrictEqual(`ServerConfigService`);
  });

  it(`should have a member "SERVER_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.SERVER_SERVICE).toStrictEqual(`ServerService`);
  });

  it(`should have a member "TIME_SERVICE"`, (): void => {
    expect.assertions(1);

    expect(ServiceNameEnum.TIME_SERVICE).toStrictEqual(`TimeService`);
  });
});
