import { DiscordMessageCommandFeatureDuplicatedFlagsErrorService } from './discord-message-command-feature-duplicated-flags-error.service';
import { ColorEnum } from '../../../../../../../../enums/color.enum';
import { IconEnum } from '../../../../../../../../enums/icon.enum';
import { ServiceNameEnum } from '../../../../../../../../enums/service-name.enum';
import { CoreEventService } from '../../../../../../../core/services/core-event.service';
import { DiscordSoniaService } from '../../../../../../users/services/discord-sonia.service';
import { IDiscordCommandFlagDuplicated } from '../../../../../interfaces/commands/flags/discord-command-flag-duplicated';
import { IDiscordCommandFlagsDuplicated } from '../../../../../types/commands/flags/discord-command-flags-duplicated';
import { DiscordMessageConfigService } from '../../../../config/discord-message-config.service';
import { DiscordMessageCommandCliErrorService } from '../../../discord-message-command-cli-error.service';
import { DISCORD_MESSAGE_COMMAND_FEATURE_NOON_FLAGS } from '../../features/noon/constants/discord-message-command-feature-noon-flags';
import { APIEmbed, APIEmbedAuthor, APIEmbedField, APIEmbedFooter, APIEmbedImage } from 'discord.js';
import moment from 'moment-timezone';
import { createMock } from 'ts-auto-mock';

describe(`DiscordMessageCommandFeatureDuplicatedFlagsErrorService`, (): void => {
  let service: DiscordMessageCommandFeatureDuplicatedFlagsErrorService;
  let coreEventService: CoreEventService;
  let discordSoniaService: DiscordSoniaService;
  let discordMessageConfigService: DiscordMessageConfigService;
  let discordMessageCommandCliErrorService: DiscordMessageCommandCliErrorService;

  beforeEach((): void => {
    coreEventService = CoreEventService.getInstance();
    discordSoniaService = DiscordSoniaService.getInstance();
    discordMessageConfigService = DiscordMessageConfigService.getInstance();
    discordMessageCommandCliErrorService = DiscordMessageCommandCliErrorService.getInstance();
  });

  describe(`getInstance()`, (): void => {
    it(`should create a DiscordMessageCommandFeatureDuplicatedFlagsError service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageCommandFeatureDuplicatedFlagsErrorService.getInstance();

      expect(service).toStrictEqual(expect.any(DiscordMessageCommandFeatureDuplicatedFlagsErrorService));
    });

    it(`should return the created DiscordMessageCommandFeatureDuplicatedFlagsError service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageCommandFeatureDuplicatedFlagsErrorService.getInstance();

      expect(result).toStrictEqual(service);
    });
  });

  describe(`constructor()`, (): void => {
    let coreEventServiceNotifyServiceCreatedSpy: jest.SpyInstance;

    beforeEach((): void => {
      coreEventServiceNotifyServiceCreatedSpy = jest
        .spyOn(coreEventService, `notifyServiceCreated`)
        .mockImplementation();
    });

    it(`should notify the DiscordMessageCommandFeatureDuplicatedFlagsError service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageCommandFeatureDuplicatedFlagsErrorService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_DUPLICATED_FLAGS_ERROR_SERVICE
      );
    });
  });

  describe(`getMessageResponse()`, (): void => {
    let flagsDuplicated: IDiscordCommandFlagsDuplicated;

    let discordMessageCommandCliErrorServiceGetCliErrorMessageResponseSpy: jest.SpyInstance;
    let discordSoniaServiceGetCorporationMessageEmbedAuthorSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandCliErrorImageColorSpy: jest.SpyInstance;
    let discordSoniaServiceGetImageUrlSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandCliErrorImageUrlSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandFeatureDuplicatedFlagsErrorService();
      flagsDuplicated = createMock<IDiscordCommandFlagsDuplicated>();

      discordMessageCommandCliErrorServiceGetCliErrorMessageResponseSpy = jest.spyOn(
        discordMessageCommandCliErrorService,
        `getCliErrorMessageResponse`
      );
      discordSoniaServiceGetCorporationMessageEmbedAuthorSpy = jest.spyOn(
        discordSoniaService,
        `getCorporationMessageEmbedAuthor`
      );
      discordMessageConfigServiceGetMessageCommandCliErrorImageColorSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandCliErrorImageColor`
      );
      discordSoniaServiceGetImageUrlSpy = jest.spyOn(discordSoniaService, `getImageUrl`);
      discordMessageConfigServiceGetMessageCommandCliErrorImageUrlSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandCliErrorImageUrl`
      );
      jest
        .spyOn(DISCORD_MESSAGE_COMMAND_FEATURE_NOON_FLAGS, `getRandomFlagUsageExample`)
        .mockReturnValue(`--dummy-flag=dummy-value`);
    });

    it(`should get the CLI error message response`, async (): Promise<void> => {
      expect.assertions(2);

      await service.getMessageResponse(flagsDuplicated);

      expect(discordMessageCommandCliErrorServiceGetCliErrorMessageResponseSpy).toHaveBeenCalledTimes(1);
      expect(discordMessageCommandCliErrorServiceGetCliErrorMessageResponseSpy).toHaveBeenCalledWith();
    });

    it(`should return a Discord message response embed with an author`, async (): Promise<void> => {
      expect.assertions(1);
      const messageEmbedAuthor: APIEmbedAuthor = createMock<APIEmbedAuthor>();
      discordSoniaServiceGetCorporationMessageEmbedAuthorSpy.mockReturnValue(messageEmbedAuthor);

      const result = await service.getMessageResponse(flagsDuplicated);

      const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
      expect(embed?.author).toStrictEqual(messageEmbedAuthor);
    });

    it(`should return a Discord message response embed with a color`, async (): Promise<void> => {
      expect.assertions(1);
      discordMessageConfigServiceGetMessageCommandCliErrorImageColorSpy.mockReturnValue(ColorEnum.CANDY);

      const result = await service.getMessageResponse(flagsDuplicated);

      const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
      expect(embed?.color).toStrictEqual(ColorEnum.CANDY);
    });

    describe(`when there is one given duplicated flag`, (): void => {
      beforeEach((): void => {
        flagsDuplicated = [createMock<IDiscordCommandFlagDuplicated>()];
      });

      it(`should return a Discord message response embed with a description indicating that one duplicated flag has been found`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(flagsDuplicated);

        const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
        expect(embed?.description).toBe(`**1** duplicated flag found.`);
      });

      it(`should return a Discord message response embed with 2 fields`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(flagsDuplicated);

        const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
        expect(embed?.fields).toHaveLength(2);
      });

      it(`should return a Discord message response embed with the fields containing the duplicated flags`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(flagsDuplicated);

        const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
        expect(embed?.fields?.[0]).toStrictEqual({
          inline: false,
          name: flagsDuplicated[0].name,
          value: flagsDuplicated[0].description,
        } as APIEmbedField);
      });

      it(`should return a Discord message response embed field containing a hint to solve this error`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(flagsDuplicated);

        const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
        expect(embed?.fields?.[1]).toStrictEqual({
          inline: false,
          name: `How to solve this?`,
          value: `I am here to help you but do not mess with me!\nTry again but remove the extra duplicated flags and then we can talk.`,
        } as APIEmbedField);
      });
    });

    describe(`when there is three given duplicated flags`, (): void => {
      beforeEach((): void => {
        flagsDuplicated = [
          createMock<IDiscordCommandFlagDuplicated>(),
          createMock<IDiscordCommandFlagDuplicated>(),
          createMock<IDiscordCommandFlagDuplicated>(),
        ];
      });

      it(`should return a Discord message response embed with a description indicating that three duplicated flags have been found`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(flagsDuplicated);

        const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
        expect(embed?.description).toBe(`**3** duplicated flags found.`);
      });

      it(`should return a Discord message response embed with 4 fields`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(flagsDuplicated);

        const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
        expect(embed?.fields).toHaveLength(4);
      });

      it(`should return a Discord message response embed with the fields containing the duplicated flags`, async (): Promise<void> => {
        expect.assertions(3);

        const result = await service.getMessageResponse(flagsDuplicated);

        const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
        expect(embed?.fields?.[0]).toStrictEqual({
          inline: false,
          name: flagsDuplicated[0].name,
          value: flagsDuplicated[0].description,
        } as APIEmbedField);
        expect(embed?.fields?.[1]).toStrictEqual({
          inline: false,
          name: flagsDuplicated[1].name,
          value: flagsDuplicated[1].description,
        } as APIEmbedField);
        expect(embed?.fields?.[2]).toStrictEqual({
          inline: false,
          name: flagsDuplicated[2].name,
          value: flagsDuplicated[2].description,
        } as APIEmbedField);
      });

      it(`should return a Discord message response embed field containing a hint to solve this error`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(flagsDuplicated);

        const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
        expect(embed?.fields?.[3]).toStrictEqual({
          inline: false,
          name: `How to solve this?`,
          value: `I am here to help you but do not mess with me!\nTry again but remove the extra duplicated flags and then we can talk.`,
        } as APIEmbedField);
      });
    });

    it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
      expect.assertions(1);
      discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

      const result = await service.getMessageResponse(flagsDuplicated);

      const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
      expect(embed?.footer).toStrictEqual({
        icon_url: `dummy-image-url`,
        text: `Invalid feature command`,
      } as APIEmbedFooter);
    });

    describe(`when the Sonia image url is null`, (): void => {
      beforeEach((): void => {
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(null);
      });

      it(`should return a Discord message response embed with a footer but without an icon`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(flagsDuplicated);

        const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
        expect(embed?.footer).toStrictEqual({
          icon_url: undefined,
          text: `Invalid feature command`,
        } as APIEmbedFooter);
      });
    });

    describe(`when the Sonia image url is "image-url"`, (): void => {
      beforeEach((): void => {
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(`image-url`);
      });

      it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(flagsDuplicated);

        const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
        expect(embed?.footer).toStrictEqual({
          icon_url: `image-url`,
          text: `Invalid feature command`,
        } as APIEmbedFooter);
      });
    });

    it(`should return a Discord message response embed with a thumbnail`, async (): Promise<void> => {
      expect.assertions(1);
      discordMessageConfigServiceGetMessageCommandCliErrorImageUrlSpy.mockReturnValue(IconEnum.ARTIFICIAL_INTELLIGENCE);

      const result = await service.getMessageResponse(flagsDuplicated);

      const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
      expect(embed?.thumbnail).toStrictEqual({
        url: IconEnum.ARTIFICIAL_INTELLIGENCE,
      } as APIEmbedImage);
    });

    it(`should return a Discord message response embed with a timestamp`, async (): Promise<void> => {
      expect.assertions(2);

      const result = await service.getMessageResponse(flagsDuplicated);

      const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
      expect(moment(embed?.timestamp).isValid()).toBe(true);
      expect(moment(embed?.timestamp).fromNow()).toBe(`a few seconds ago`);
    });

    it(`should return a Discord message response embed with a title`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(flagsDuplicated);

      const embed: APIEmbed = result.options.embeds?.[0] as APIEmbed;
      expect(embed?.title).toBe(`I can not handle your request.`);
    });

    it(`should return a Discord message response without a response text`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(flagsDuplicated);

      expect(result.content).toBeUndefined();
    });
  });
});
