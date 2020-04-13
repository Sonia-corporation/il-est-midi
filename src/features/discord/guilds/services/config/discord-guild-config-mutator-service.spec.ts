import { PartialNested } from "../../../../../types/partial-nested";
import { IConfigUpdateBoolean } from "../../../../config/interfaces/config-update-boolean";
import { IConfigUpdateString } from "../../../../config/interfaces/config-update-string";
import { ConfigService } from "../../../../config/services/config-service";
import { IDiscordConfig } from "../../../interfaces/discord-config";
import { IDiscordGuildConfig } from "../../../interfaces/discord-guild-config";
import { DiscordGuildConfigCoreService } from "./discord-guild-config-core-service";
import { DiscordGuildConfigMutatorService } from "./discord-guild-config-mutator-service";

jest.mock(`../../../../config/services/config-service`);

describe(`DiscordGuildConfigMutatorService`, (): void => {
  let service: DiscordGuildConfigMutatorService;
  let configService: ConfigService;
  let discordGuildConfigCoreService: DiscordGuildConfigCoreService;

  beforeEach((): void => {
    service = DiscordGuildConfigMutatorService.getInstance();
    configService = ConfigService.getInstance();
    discordGuildConfigCoreService = DiscordGuildConfigCoreService.getInstance();
  });

  describe(`updateConfig()`, (): void => {
    let config: PartialNested<IDiscordConfig> | undefined;

    beforeEach((): void => {
      discordGuildConfigCoreService.shouldSendCookiesOnCreate = true;
      discordGuildConfigCoreService.shouldWelcomeNewMembers = true;
      discordGuildConfigCoreService.soniaPermanentGuildInviteUrl = `dummy-sonia-permanent-guild-invite-url`;
    });

    describe(`when the given config is undefined`, (): void => {
      beforeEach((): void => {
        config = undefined;
      });

      it(`should not update the config`, (): void => {
        expect.assertions(3);

        service.updateConfig(config);

        expect(
          discordGuildConfigCoreService.shouldSendCookiesOnCreate
        ).toStrictEqual(true);
        expect(
          discordGuildConfigCoreService.shouldWelcomeNewMembers
        ).toStrictEqual(true);
        expect(
          discordGuildConfigCoreService.soniaPermanentGuildInviteUrl
        ).toStrictEqual(`dummy-sonia-permanent-guild-invite-url`);
      });
    });

    describe(`when the given config contains a guild send cookies on create state`, (): void => {
      beforeEach((): void => {
        config = {
          guild: {
            shouldSendCookiesOnCreate: false,
          },
        };
      });

      it(`should update the config send cookie on create state`, (): void => {
        expect.assertions(1);

        service.updateConfig(config);

        expect(
          discordGuildConfigCoreService.shouldSendCookiesOnCreate
        ).toStrictEqual(false);
      });
    });

    describe(`when the given config contains a guild welcome new members state`, (): void => {
      beforeEach((): void => {
        config = {
          guild: {
            shouldWelcomeNewMembers: false,
          },
        };
      });

      it(`should update the config welcome new members state`, (): void => {
        expect.assertions(1);

        service.updateConfig(config);

        expect(
          discordGuildConfigCoreService.shouldWelcomeNewMembers
        ).toStrictEqual(false);
      });
    });

    describe(`when the given config contains a guild Sonia permanent guild invite url`, (): void => {
      beforeEach((): void => {
        config = {
          guild: {
            soniaPermanentGuildInviteUrl: `sonia-permanent-guild-invite-url`,
          },
        };
      });

      it(`should update the config Sonia permanent guild invite url`, (): void => {
        expect.assertions(1);

        service.updateConfig(config);

        expect(
          discordGuildConfigCoreService.soniaPermanentGuildInviteUrl
        ).toStrictEqual(`sonia-permanent-guild-invite-url`);
      });
    });
  });

  describe(`updateGuild()`, (): void => {
    let config: PartialNested<IDiscordGuildConfig> | undefined;

    beforeEach((): void => {
      discordGuildConfigCoreService.shouldSendCookiesOnCreate = true;
      discordGuildConfigCoreService.shouldWelcomeNewMembers = true;
      discordGuildConfigCoreService.soniaPermanentGuildInviteUrl = `dummy-sonia-permanent-guild-invite-url`;
    });

    describe(`when the given config is undefined`, (): void => {
      beforeEach((): void => {
        config = undefined;
      });

      it(`should not update the config`, (): void => {
        expect.assertions(3);

        service.updateGuild(config);

        expect(
          discordGuildConfigCoreService.shouldSendCookiesOnCreate
        ).toStrictEqual(true);
        expect(
          discordGuildConfigCoreService.shouldWelcomeNewMembers
        ).toStrictEqual(true);
        expect(
          discordGuildConfigCoreService.soniaPermanentGuildInviteUrl
        ).toStrictEqual(`dummy-sonia-permanent-guild-invite-url`);
      });
    });

    describe(`when the given config contains a send cookies on create state`, (): void => {
      beforeEach((): void => {
        config = {
          shouldSendCookiesOnCreate: false,
        };
      });

      it(`should update the config send cookies on create state`, (): void => {
        expect.assertions(1);

        service.updateGuild(config);

        expect(
          discordGuildConfigCoreService.shouldSendCookiesOnCreate
        ).toStrictEqual(false);
      });
    });

    describe(`when the given config contains a welcome new members state`, (): void => {
      beforeEach((): void => {
        config = {
          shouldWelcomeNewMembers: false,
        };
      });

      it(`should update the config welcome new members state`, (): void => {
        expect.assertions(1);

        service.updateGuild(config);

        expect(
          discordGuildConfigCoreService.shouldWelcomeNewMembers
        ).toStrictEqual(false);
      });
    });

    describe(`when the given config contains a Sonia permanent guild invite url`, (): void => {
      beforeEach((): void => {
        config = {
          soniaPermanentGuildInviteUrl: `sonia-permanent-guild-invite-url`,
        };
      });

      it(`should update the config Sonia permanent guild invite url`, (): void => {
        expect.assertions(1);

        service.updateGuild(config);

        expect(
          discordGuildConfigCoreService.soniaPermanentGuildInviteUrl
        ).toStrictEqual(`sonia-permanent-guild-invite-url`);
      });
    });
  });

  describe(`updateSendCookiesOnCreateState()`, (): void => {
    let shouldSendCookiesOnCreate: boolean;

    let configServiceGetUpdatedBooleanSpy: jest.SpyInstance;

    beforeEach((): void => {
      shouldSendCookiesOnCreate = true;
      discordGuildConfigCoreService.shouldSendCookiesOnCreate = false;

      configServiceGetUpdatedBooleanSpy = jest
        .spyOn(configService, `getUpdatedBoolean`)
        .mockReturnValue(true);
    });

    it(`should get the updated boolean`, (): void => {
      expect.assertions(2);

      service.updateSendCookiesOnCreateState(shouldSendCookiesOnCreate);

      expect(configServiceGetUpdatedBooleanSpy).toHaveBeenCalledTimes(1);
      expect(configServiceGetUpdatedBooleanSpy).toHaveBeenCalledWith({
        context: `DiscordGuildConfigMutatorService`,
        newValue: true,
        oldValue: false,
        valueName: `send cookies on create state`,
      } as IConfigUpdateBoolean);
    });

    it(`should update the Discord guild config send cookies on create state with the updated boolean`, (): void => {
      expect.assertions(1);

      service.updateSendCookiesOnCreateState(shouldSendCookiesOnCreate);

      expect(
        discordGuildConfigCoreService.shouldSendCookiesOnCreate
      ).toStrictEqual(true);
    });
  });

  describe(`updateWelcomeNewMembersState()`, (): void => {
    let shouldWelcomeNewMembers: boolean;

    let configServiceGetUpdatedBooleanSpy: jest.SpyInstance;

    beforeEach((): void => {
      shouldWelcomeNewMembers = true;
      discordGuildConfigCoreService.shouldWelcomeNewMembers = false;

      configServiceGetUpdatedBooleanSpy = jest
        .spyOn(configService, `getUpdatedBoolean`)
        .mockReturnValue(true);
    });

    it(`should get the updated boolean`, (): void => {
      expect.assertions(2);

      service.updateWelcomeNewMembersState(shouldWelcomeNewMembers);

      expect(configServiceGetUpdatedBooleanSpy).toHaveBeenCalledTimes(1);
      expect(configServiceGetUpdatedBooleanSpy).toHaveBeenCalledWith({
        context: `DiscordGuildConfigMutatorService`,
        newValue: true,
        oldValue: false,
        valueName: `welcome new members state`,
      } as IConfigUpdateBoolean);
    });

    it(`should update the Discord guild config welcome new members state with the updated boolean`, (): void => {
      expect.assertions(1);

      service.updateWelcomeNewMembersState(shouldWelcomeNewMembers);

      expect(
        discordGuildConfigCoreService.shouldWelcomeNewMembers
      ).toStrictEqual(true);
    });
  });

  describe(`updateSoniaPermanentGuildInviteUrl()`, (): void => {
    let soniaPermanentGuildInviteUrl: string;

    let configServiceGetUpdatedBooleanSpy: jest.SpyInstance;

    beforeEach((): void => {
      soniaPermanentGuildInviteUrl = `dummy-sonia-permanent-guild-invite-url`;
      discordGuildConfigCoreService.soniaPermanentGuildInviteUrl = `sonia-permanent-guild-invite-url`;

      configServiceGetUpdatedBooleanSpy = jest
        .spyOn(configService, `getUpdatedString`)
        .mockReturnValue(`dummy-sonia-permanent-guild-invite-url`);
    });

    it(`should get the updated string`, (): void => {
      expect.assertions(2);

      service.updateSoniaPermanentGuildInviteUrl(soniaPermanentGuildInviteUrl);

      expect(configServiceGetUpdatedBooleanSpy).toHaveBeenCalledTimes(1);
      expect(configServiceGetUpdatedBooleanSpy).toHaveBeenCalledWith({
        context: `DiscordGuildConfigMutatorService`,
        newValue: `dummy-sonia-permanent-guild-invite-url`,
        oldValue: `sonia-permanent-guild-invite-url`,
        valueName: `Sonia permanent guild invite url`,
      } as IConfigUpdateString);
    });

    it(`should update the Discord guild config sonia permanent guild invite url with the updated string`, (): void => {
      expect.assertions(1);

      service.updateSoniaPermanentGuildInviteUrl(soniaPermanentGuildInviteUrl);

      expect(
        discordGuildConfigCoreService.soniaPermanentGuildInviteUrl
      ).toStrictEqual(`dummy-sonia-permanent-guild-invite-url`);
    });
  });
});
