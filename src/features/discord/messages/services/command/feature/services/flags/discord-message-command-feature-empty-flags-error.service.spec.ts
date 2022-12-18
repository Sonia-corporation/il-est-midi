import { DiscordMessageCommandFeatureEmptyFlagsErrorService } from './discord-message-command-feature-empty-flags-error.service';
import { ColorEnum } from '../../../../../../../../enums/color.enum';
import { IconEnum } from '../../../../../../../../enums/icon.enum';
import { ServiceNameEnum } from '../../../../../../../../enums/service-name.enum';
import { CoreEventService } from '../../../../../../../core/services/core-event.service';
import { DiscordSoniaService } from '../../../../../../users/services/discord-sonia.service';
import { DiscordMessageCommandEnum } from '../../../../../enums/commands/discord-message-command.enum';
import { IAnyDiscordMessage } from '../../../../../types/any-discord-message';
import { DiscordMessageConfigService } from '../../../../config/discord-message-config.service';
import { DiscordMessageCommandCliErrorService } from '../../../discord-message-command-cli-error.service';
import { DiscordMessageCommandFeatureNameEnum } from '../../enums/discord-message-command-feature-name.enum';
import { DISCORD_MESSAGE_COMMAND_FEATURE_NOON_FLAGS } from '../../features/noon/constants/discord-message-command-feature-noon-flags';
import { EmbedAssetData, EmbedAuthorData, EmbedField, EmbedFooterData } from 'discord.js';
import moment from 'moment-timezone';
import { createMock } from 'ts-auto-mock';

describe(`DiscordMessageCommandFeatureEmptyFlagsErrorService`, (): void => {
  let service: DiscordMessageCommandFeatureEmptyFlagsErrorService;
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
    it(`should create a DiscordMessageCommandFeatureEmptyFlagsError service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageCommandFeatureEmptyFlagsErrorService.getInstance();

      expect(service).toStrictEqual(expect.any(DiscordMessageCommandFeatureEmptyFlagsErrorService));
    });

    it(`should return the created DiscordMessageCommandFeatureEmptyFlagsError service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageCommandFeatureEmptyFlagsErrorService.getInstance();

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

    it(`should notify the DiscordMessageCommandFeatureEmptyFlagsError service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageCommandFeatureEmptyFlagsErrorService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_EMPTY_FLAGS_ERROR_SERVICE
      );
    });
  });

  describe(`getMessageResponse()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let commands: DiscordMessageCommandEnum[];
    let featureName: DiscordMessageCommandFeatureNameEnum;

    let discordMessageCommandCliErrorServiceGetCliErrorMessageResponseSpy: jest.SpyInstance;
    let discordSoniaServiceGetCorporationMessageEmbedAuthorSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandCliErrorImageColorSpy: jest.SpyInstance;
    let discordSoniaServiceGetImageUrlSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandCliErrorImageUrlSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandFeatureEmptyFlagsErrorService();
      anyDiscordMessage = createMock<IAnyDiscordMessage>();
      commands = [DiscordMessageCommandEnum.FEATURE];
      featureName = DiscordMessageCommandFeatureNameEnum.NOON;

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

      await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(discordMessageCommandCliErrorServiceGetCliErrorMessageResponseSpy).toHaveBeenCalledTimes(1);
      expect(discordMessageCommandCliErrorServiceGetCliErrorMessageResponseSpy).toHaveBeenCalledWith();
    });

    it(`should return a Discord message response embed with an author`, async (): Promise<void> => {
      expect.assertions(1);
      const messageEmbedAuthor: EmbedAuthorData = createMock<EmbedAuthorData>();
      discordSoniaServiceGetCorporationMessageEmbedAuthorSpy.mockReturnValue(messageEmbedAuthor);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embeds?.[0]?.author).toStrictEqual(messageEmbedAuthor);
    });

    it(`should return a Discord message response embed with a color`, async (): Promise<void> => {
      expect.assertions(1);
      discordMessageConfigServiceGetMessageCommandCliErrorImageColorSpy.mockReturnValue(ColorEnum.CANDY);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embeds?.[0]?.color).toStrictEqual(ColorEnum.CANDY);
    });

    it(`should return a Discord message response embed with 3 fields`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embeds?.[0]?.fields).toHaveLength(3);
    });

    it(`should return a Discord message response embed with a field explaining the error`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embeds?.[0]?.fields?.[0]).toStrictEqual({
        name: `No flags specified`,
        value: `You did not specify a flag to configure the noon feature.\nI will not guess what you wish to configure so please try again with a flag!\nAnd because I am kind and generous here is the list of all the flags available for the noon feature with an example.`,
      } as EmbedField);
    });

    it(`should return a Discord message response embed with a field listing all flags`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embeds?.[0]?.fields?.[1]).toStrictEqual({
        name: `All flags`,
        value: `\`--disabled (or -d)\`, \`--enabled (or -e)\`, \`--help (or -h)\`, \`--humanize (or -hu)\`, \`--status (or -s)\``,
      } as EmbedField);
    });

    it(`should return a Discord message response embed with a field to show an example of the command with a random valid flag`, async (): Promise<void> => {
      expect.assertions(1);
      anyDiscordMessage.content = `dummy message !feature noon`;

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embeds?.[0]?.fields?.[2]).toStrictEqual({
        name: `Example`,
        value: `\`!feature noon --dummy-flag=dummy-value\``,
      } as EmbedField);
    });

    it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
      expect.assertions(1);
      discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embeds?.[0]?.footer).toStrictEqual({
        iconURL: `dummy-image-url`,
        text: `Invalid feature command`,
      } as EmbedFooterData);
    });

    describe(`when the Sonia image url is null`, (): void => {
      beforeEach((): void => {
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(null);
      });

      it(`should return a Discord message response embed with a footer but without an icon`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

        expect(result.options.embeds?.[0]?.footer).toStrictEqual({
          iconURL: undefined,
          text: `Invalid feature command`,
        } as EmbedFooterData);
      });
    });

    describe(`when the Sonia image url is "image-url"`, (): void => {
      beforeEach((): void => {
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(`image-url`);
      });

      it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

        expect(result.options.embeds?.[0]?.footer).toStrictEqual({
          iconURL: `image-url`,
          text: `Invalid feature command`,
        } as EmbedFooterData);
      });
    });

    it(`should return a Discord message response embed with a thumbnail`, async (): Promise<void> => {
      expect.assertions(1);
      discordMessageConfigServiceGetMessageCommandCliErrorImageUrlSpy.mockReturnValue(IconEnum.ARTIFICIAL_INTELLIGENCE);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embeds?.[0]?.thumbnail).toStrictEqual({
        url: IconEnum.ARTIFICIAL_INTELLIGENCE,
      } as EmbedAssetData);
    });

    it(`should return a Discord message response embed with a timestamp`, async (): Promise<void> => {
      expect.assertions(2);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(moment(result.options.embeds?.[0]?.timestamp).isValid()).toBe(true);
      expect(moment(result.options.embeds?.[0]?.timestamp).fromNow()).toBe(`a few seconds ago`);
    });

    it(`should return a Discord message response embed with a title`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embeds?.[0]?.title).toBe(`I can not handle your request.`);
    });

    it(`should return a Discord message response without a response text`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.content).toBeUndefined();
    });
  });
});
