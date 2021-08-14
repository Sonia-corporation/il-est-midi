import { DiscordMessageCommandFeatureWrongFeatureNameErrorService } from './discord-message-command-feature-wrong-feature-name-error.service';
import { ColorEnum } from '../../../../../../../../enums/color.enum';
import { IconEnum } from '../../../../../../../../enums/icon.enum';
import { ServiceNameEnum } from '../../../../../../../../enums/service-name.enum';
import { CoreEventService } from '../../../../../../../core/services/core-event.service';
import { DiscordSoniaService } from '../../../../../../users/services/discord-sonia.service';
import { DiscordMessageCommandEnum } from '../../../../../enums/commands/discord-message-command.enum';
import { IAnyDiscordMessage } from '../../../../../types/any-discord-message';
import { DiscordMessageConfigService } from '../../../../config/discord-message-config.service';
import { DiscordMessageCommandCliErrorService } from '../../../discord-message-command-cli-error.service';
import { DISCORD_MESSAGE_COMMAND_FEATURE_NAMES } from '../../constants/discord-message-command-feature-names';
import { EmbedFieldData, MessageEmbedAuthor, MessageEmbedFooter, MessageEmbedThumbnail } from 'discord.js';
import moment from 'moment-timezone';
import { createMock } from 'ts-auto-mock';

describe(`DiscordMessageCommandFeatureWrongFeatureNameErrorService`, (): void => {
  let service: DiscordMessageCommandFeatureWrongFeatureNameErrorService;
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
    it(`should create a DiscordMessageCommandFeatureWrongFeatureNameError service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageCommandFeatureWrongFeatureNameErrorService.getInstance();

      expect(service).toStrictEqual(expect.any(DiscordMessageCommandFeatureWrongFeatureNameErrorService));
    });

    it(`should return the created DiscordMessageCommandFeatureWrongFeatureNameError service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageCommandFeatureWrongFeatureNameErrorService.getInstance();

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

    it(`should notify the DiscordMessageCommandFeatureWrongFeatureNameError service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageCommandFeatureWrongFeatureNameErrorService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_COMMAND_FEATURE_WRONG_FEATURE_NAME_ERROR_SERVICE
      );
    });
  });

  describe(`getMessageResponse()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let commands: DiscordMessageCommandEnum[];
    let featureName: string;

    let discordMessageCommandCliErrorServiceGetCliErrorMessageResponseSpy: jest.SpyInstance;
    let discordSoniaServiceGetCorporationMessageEmbedAuthorSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandCliErrorImageColorSpy: jest.SpyInstance;
    let discordSoniaServiceGetImageUrlSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandCliErrorImageUrlSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandPrefixSpy: jest.SpyInstance<string | string[]>;

    beforeEach((): void => {
      service = new DiscordMessageCommandFeatureWrongFeatureNameErrorService();
      anyDiscordMessage = createMock<IAnyDiscordMessage>();
      commands = [DiscordMessageCommandEnum.COOKIE];
      featureName = `dummy-feature-name`;

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
      discordMessageConfigServiceGetMessageCommandPrefixSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandPrefix`
      );
      jest.spyOn(DISCORD_MESSAGE_COMMAND_FEATURE_NAMES, `getRandomArgumentUsageExample`).mockReturnValue(`noon`);
    });

    it(`should get the CLI error message response`, async (): Promise<void> => {
      expect.assertions(2);

      await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(discordMessageCommandCliErrorServiceGetCliErrorMessageResponseSpy).toHaveBeenCalledTimes(1);
      expect(discordMessageCommandCliErrorServiceGetCliErrorMessageResponseSpy).toHaveBeenCalledWith();
    });

    it(`should return a Discord message response embed with an author`, async (): Promise<void> => {
      expect.assertions(1);
      const messageEmbedAuthor: MessageEmbedAuthor = createMock<MessageEmbedAuthor>();
      discordSoniaServiceGetCorporationMessageEmbedAuthorSpy.mockReturnValue(messageEmbedAuthor);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embed?.author).toStrictEqual(messageEmbedAuthor);
    });

    it(`should return a Discord message response embed with a color`, async (): Promise<void> => {
      expect.assertions(1);
      discordMessageConfigServiceGetMessageCommandCliErrorImageColorSpy.mockReturnValue(ColorEnum.CANDY);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embed?.color).toStrictEqual(ColorEnum.CANDY);
    });

    it(`should return a Discord message response embed with 4 fields`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embed?.fields).toHaveLength(4);
    });

    it(`should return a Discord message response embed with a field explaining the error`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embed?.fields?.[0]).toStrictEqual({
        name: `Wrong feature name`,
        value: `\`dummy-feature-name\` is not an existing feature...\nLet me show you the list of available features with an example and maybe try again with a valid one this time, ok?`,
      } as EmbedFieldData);
    });

    it(`should return a Discord message response embed with a field to display all feature names separated with a comma and a space`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embed?.fields?.[1]).toStrictEqual({
        name: `All features`,
        value: `\`noon (or n)\`, \`release-notes (or r)\``,
      } as EmbedFieldData);
    });

    describe(`when the given Discord message content is null`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage.content = null;
      });

      it(`should return a Discord message response embed with a field to show an example of the command with a feature name and the "!feature" command`, async (): Promise<void> => {
        expect.assertions(1);
        discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([`-`]);

        const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

        expect(result.options.embed?.fields?.[2]).toStrictEqual({
          name: `Example`,
          value: `\`!feature noon\``,
        } as EmbedFieldData);
      });

      it(`should return a Discord message response embed with a field to show an example of the command with the help flag and the "!feature" command`, async (): Promise<void> => {
        expect.assertions(1);
        discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([`-`]);

        const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

        expect(result.options.embed?.fields?.[3]).toStrictEqual({
          name: `Need help?`,
          value: `If you need my help, you can also specify the help flag \`!feature --help\` and I will try my best to help you!`,
        } as EmbedFieldData);
      });
    });

    describe(`when the given Discord message content is not a valid command`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage.content = `dummy message without a command`;
      });

      it(`should return a Discord message response embed with a field to show an example of the command with a feature name and the "!feature" command`, async (): Promise<void> => {
        expect.assertions(1);
        discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([`-`]);

        const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

        expect(result.options.embed?.fields?.[2]).toStrictEqual({
          name: `Example`,
          value: `\`!feature noon\``,
        } as EmbedFieldData);
      });

      it(`should return a Discord message response embed with a field to show an example of the command with the help flag and the "!feature" command`, async (): Promise<void> => {
        expect.assertions(1);
        discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([`-`]);

        const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

        expect(result.options.embed?.fields?.[3]).toStrictEqual({
          name: `Need help?`,
          value: `If you need my help, you can also specify the help flag \`!feature --help\` and I will try my best to help you!`,
        } as EmbedFieldData);
      });
    });

    describe(`when the given Discord message content is a valid command as "!f"`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage.content = `!f`;
        commands = [DiscordMessageCommandEnum.F];
      });

      describe(`when the prefix is "!"`, (): void => {
        beforeEach((): void => {
          discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([`!`]);
        });

        it(`should return a Discord message response embed with a field to show an example of the command with a feature name by taking the prefix and command`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

          expect(result.options.embed?.fields?.[2]).toStrictEqual({
            name: `Example`,
            value: `\`!f noon\``,
          } as EmbedFieldData);
        });

        it(`should return a Discord message response embed with a field to show an example of the command with the help flag taking the prefix and command`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

          expect(result.options.embed?.fields?.[3]).toStrictEqual({
            name: `Need help?`,
            value: `If you need my help, you can also specify the help flag \`!f --help\` and I will try my best to help you!`,
          } as EmbedFieldData);
        });
      });

      describe(`when the prefix is "-"`, (): void => {
        beforeEach((): void => {
          discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([`-`]);
        });

        it(`should return a Discord message response embed with a field to show an example of the command with a feature name and the "!feature" command`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

          expect(result.options.embed?.fields?.[2]).toStrictEqual({
            name: `Example`,
            value: `\`!feature noon\``,
          } as EmbedFieldData);
        });

        it(`should return a Discord message response embed with a field to show an example of the command with the help flag and the "!feature" command`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

          expect(result.options.embed?.fields?.[3]).toStrictEqual({
            name: `Need help?`,
            value: `If you need my help, you can also specify the help flag \`!feature --help\` and I will try my best to help you!`,
          } as EmbedFieldData);
        });
      });
    });

    describe(`when the given Discord message content is a valid command as "-lunch"`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage.content = `-lunch`;
        commands = [DiscordMessageCommandEnum.LUNCH];
      });

      describe(`when the prefix is "!"`, (): void => {
        beforeEach((): void => {
          discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([`!`]);
        });

        it(`should return a Discord message response embed with a field to show an example of the command with a feature name and the "!feature" command`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

          expect(result.options.embed?.fields?.[2]).toStrictEqual({
            name: `Example`,
            value: `\`!feature noon\``,
          } as EmbedFieldData);
        });

        it(`should return a Discord message response embed with a field to show an example of the command with the help flag and the "!feature" command`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

          expect(result.options.embed?.fields?.[3]).toStrictEqual({
            name: `Need help?`,
            value: `If you need my help, you can also specify the help flag \`!feature --help\` and I will try my best to help you!`,
          } as EmbedFieldData);
        });
      });

      describe(`when the prefix is "-"`, (): void => {
        beforeEach((): void => {
          discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([`-`]);
        });

        it(`should return a Discord message response embed with a field to show an example of the command with a feature name by taking the prefix and command`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

          expect(result.options.embed?.fields?.[2]).toStrictEqual({
            name: `Example`,
            value: `\`-lunch noon\``,
          } as EmbedFieldData);
        });

        it(`should return a Discord message response embed with a field to show an example of the command with the help flag by taking the prefix and command`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

          expect(result.options.embed?.fields?.[3]).toStrictEqual({
            name: `Need help?`,
            value: `If you need my help, you can also specify the help flag \`-lunch --help\` and I will try my best to help you!`,
          } as EmbedFieldData);
        });
      });
    });

    it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
      expect.assertions(1);
      discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embed?.footer).toStrictEqual({
        iconURL: `dummy-image-url`,
        text: `Invalid feature command`,
      } as MessageEmbedFooter);
    });

    describe(`when the Sonia image url is null`, (): void => {
      beforeEach((): void => {
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(null);
      });

      it(`should return a Discord message response embed with a footer but without an icon`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

        expect(result.options.embed?.footer).toStrictEqual({
          iconURL: undefined,
          text: `Invalid feature command`,
        } as MessageEmbedFooter);
      });
    });

    describe(`when the Sonia image url is "image-url"`, (): void => {
      beforeEach((): void => {
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(`image-url`);
      });

      it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

        expect(result.options.embed?.footer).toStrictEqual({
          iconURL: `image-url`,
          text: `Invalid feature command`,
        } as MessageEmbedFooter);
      });
    });

    it(`should return a Discord message response embed with a thumbnail`, async (): Promise<void> => {
      expect.assertions(1);
      discordMessageConfigServiceGetMessageCommandCliErrorImageUrlSpy.mockReturnValue(IconEnum.ARTIFICIAL_INTELLIGENCE);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embed?.thumbnail).toStrictEqual({
        url: IconEnum.ARTIFICIAL_INTELLIGENCE,
      } as MessageEmbedThumbnail);
    });

    it(`should return a Discord message response embed with a timestamp`, async (): Promise<void> => {
      expect.assertions(2);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(moment(result.options.embed?.timestamp).isValid()).toStrictEqual(true);
      expect(moment(result.options.embed?.timestamp).fromNow()).toStrictEqual(`a few seconds ago`);
    });

    it(`should return a Discord message response embed with a title`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.embed?.title).toStrictEqual(`I can not handle your request.`);
    });

    it(`should return a Discord message response not split`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.options.split).toStrictEqual(false);
    });

    it(`should return a Discord message response without a response text`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getMessageResponse(anyDiscordMessage, commands, featureName);

      expect(result.response).toStrictEqual(``);
    });
  });
});
