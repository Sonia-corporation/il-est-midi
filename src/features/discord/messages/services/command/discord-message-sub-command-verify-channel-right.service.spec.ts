import { DiscordMessageSubCommandVerifyChannelRightService } from './discord-message-sub-command-verify-channel-right.service';
import { ColorEnum } from '../../../../../enums/color.enum';
import { IconEnum } from '../../../../../enums/icon.enum';
import { ServiceNameEnum } from '../../../../../enums/service-name.enum';
import { CoreEventService } from '../../../../core/services/core-event.service';
import { DiscordChannelEnum } from '../../../channels/enums/discord-channel.enum';
import { DiscordSoniaService } from '../../../users/services/discord-sonia.service';
import { IAnyDiscordMessage } from '../../types/any-discord-message';
import { DiscordMessageConfigService } from '../config/discord-message-config.service';
import {
  CategoryChannel,
  DMChannel,
  EmbedFieldData,
  MessageEmbedAuthor,
  MessageEmbedFooter,
  MessageEmbedThumbnail,
  NewsChannel,
  StageChannel,
  TextChannel,
  ThreadChannel,
  VoiceChannel,
} from 'discord.js';
import moment from 'moment-timezone';
import { createHydratedMock } from 'ts-auto-mock';

describe(`DiscordMessageSubCommandVerifyChannelRightService`, (): void => {
  let service: DiscordMessageSubCommandVerifyChannelRightService;
  let coreEventService: CoreEventService;
  let discordSoniaService: DiscordSoniaService;
  let discordMessageConfigService: DiscordMessageConfigService;

  beforeEach((): void => {
    coreEventService = CoreEventService.getInstance();
    discordSoniaService = DiscordSoniaService.getInstance();
    discordMessageConfigService = DiscordMessageConfigService.getInstance();
  });

  describe(`getInstance()`, (): void => {
    it(`should create a DiscordMessageSubCommandVerifyChannelRight service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageSubCommandVerifyChannelRightService.getInstance();

      expect(service).toStrictEqual(expect.any(DiscordMessageSubCommandVerifyChannelRightService));
    });

    it(`should return the created DiscordMessageSubCommandVerifyChannelRight service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageSubCommandVerifyChannelRightService.getInstance();

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

    it(`should notify the DiscordMessageSubCommandVerifyChannelRight service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageSubCommandVerifyChannelRightService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_SUB_COMMAND_VERIFY_CHANNEL_RIGHT_SERVICE
      );
    });
  });

  describe(`verify()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let allowedChannels: Set<DiscordChannelEnum>;

    beforeEach((): void => {
      service = new DiscordMessageSubCommandVerifyChannelRightService();
    });

    describe(`when the message is from a text channel and the text channel is not allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(TextChannel.prototype, { type: ChannelType.GuildText }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>();
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeFalse();
      });
    });

    describe(`when the message is from a text channel and the text channel is allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(TextChannel.prototype, { type: ChannelType.GuildText }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>([DiscordChannelEnum.TEXT]);
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeTrue();
      });
    });

    describe(`when the message is from a DM channel and the DM channel is not allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(DMChannel.prototype, { type: ChannelType.DM }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>();
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeFalse();
      });
    });

    describe(`when the message is from a DM channel and the DM channel is allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(DMChannel.prototype, { type: ChannelType.DM }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>([DiscordChannelEnum.DM]);
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeTrue();
      });
    });

    describe(`when the message is from a thread channel and the thread channel is not allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(ThreadChannel.prototype),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>();
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeFalse();
      });
    });

    describe(`when the message is from a thread channel and the thread channel is allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(ThreadChannel.prototype),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>([DiscordChannelEnum.THREAD]);
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeTrue();
      });
    });

    describe(`when the message is from a news channel and the news channel is not allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(NewsChannel.prototype, { type: ChannelType.GuildNews }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>();
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeFalse();
      });
    });

    describe(`when the message is from a news channel and the news channel is allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(NewsChannel.prototype, { type: ChannelType.GuildNews }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>([DiscordChannelEnum.NEWS]);
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeTrue();
      });
    });

    describe(`when the message is from a category channel and the category channel is not allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(CategoryChannel.prototype, { type: ChannelType.GuildCategory }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>();
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeFalse();
      });
    });

    describe(`when the message is from a category channel and the category channel is allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(CategoryChannel.prototype, { type: ChannelType.GuildCategory }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>([DiscordChannelEnum.CATEGORY]);
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeTrue();
      });
    });

    describe(`when the message is from a stage channel and the stage channel is not allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(StageChannel.prototype, { type: ChannelType.GuildStageVoice }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>();
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeFalse();
      });
    });

    describe(`when the message is from a stage channel and the stage channel is allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(StageChannel.prototype, { type: ChannelType.GuildStageVoice }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>([DiscordChannelEnum.STAGE]);
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeTrue();
      });
    });

    describe(`when the message is from a voice channel and the voice channel is not allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(VoiceChannel.prototype, { type: ChannelType.GuildVoice }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>();
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeFalse();
      });
    });

    describe(`when the message is from a voice channel and the voice channel is allowed`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(VoiceChannel.prototype, { type: ChannelType.GuildVoice }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>([DiscordChannelEnum.VOICE]);
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeTrue();
      });
    });

    describe(`when the message is from an unsupported channel`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: undefined,
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>();
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const result = service.verify(anyDiscordMessage, allowedChannels);

        expect(result).toBeUndefined();
      });
    });
  });

  describe(`getMessageResponse()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let allowedChannels: Set<DiscordChannelEnum>;

    let discordSoniaServiceGetCorporationMessageEmbedAuthorSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandErrorImageColorSpy: jest.SpyInstance;
    let discordSoniaServiceGetImageUrlSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandErrorImageUrlSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageSubCommandVerifyChannelRightService();

      discordSoniaServiceGetCorporationMessageEmbedAuthorSpy = jest.spyOn(
        discordSoniaService,
        `getCorporationMessageEmbedAuthor`
      );
      discordMessageConfigServiceGetMessageCommandErrorImageColorSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandErrorImageColor`
      );
      discordSoniaServiceGetImageUrlSpy = jest.spyOn(discordSoniaService, `getImageUrl`);
      discordMessageConfigServiceGetMessageCommandErrorImageUrlSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandErrorImageUrl`
      );
    });

    describe(`when the channel is a text channel and the allowed channels is containing only a text channel`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(TextChannel.prototype, { type: ChannelType.GuildText }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>([DiscordChannelEnum.TEXT]);
      });

      it(`should return a Discord message response embed with an author`, async (): Promise<void> => {
        expect.assertions(1);
        const messageEmbedAuthor: MessageEmbedAuthor = createHydratedMock<MessageEmbedAuthor>();
        discordSoniaServiceGetCorporationMessageEmbedAuthorSpy.mockReturnValue(messageEmbedAuthor);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.author).toStrictEqual(messageEmbedAuthor);
      });

      it(`should return a Discord message response embed with a color`, async (): Promise<void> => {
        expect.assertions(1);
        discordMessageConfigServiceGetMessageCommandErrorImageColorSpy.mockReturnValue(ColorEnum.CANDY);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.color).toStrictEqual(ColorEnum.CANDY);
      });

      it(`should return a Discord message response embed with 3 fields`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.fields).toHaveLength(3);
      });

      it(`should return a Discord message response embed with a wrong channel field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.fields?.[0]).toStrictEqual({
          name: `Wrong channel!`,
          value: `This sub-command is not allowed on text channels.`,
        } as EmbedFieldData);
      });

      it(`should return a Discord message response embed with a hint field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.fields?.[1]).toStrictEqual({
          name: `Allowed channels`,
          value: `You can use this sub-command only on text channels.`,
        } as EmbedFieldData);
      });

      it(`should return a Discord message response embed with a report field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.fields?.[2]).toStrictEqual({
          name: `Help me to get better!`,
          value: `If you think that using this sub-command on text channels should be allowed, do not hesitate to submit a [feature request](https://github.com/Sonia-corporation/sonia-discord/issues/new?labels=feature-request&template=feature_request.md&projects=sonia-corporation/sonia-discord/1&title=%5BFEATURE%5D+).`,
        } as EmbedFieldData);
      });

      it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
        expect.assertions(1);
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.footer).toStrictEqual({
          iconURL: `dummy-image-url`,
          text: `I don't allow you!`,
        } as MessageEmbedFooter);
      });

      describe(`when the Sonia image url is null`, (): void => {
        beforeEach((): void => {
          discordSoniaServiceGetImageUrlSpy.mockReturnValue(null);
        });

        it(`should return a Discord message response embed with a footer but without an icon`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

          expect(result.options.embeds?.[0]?.footer).toStrictEqual({
            iconURL: undefined,
            text: `I don't allow you!`,
          } as MessageEmbedFooter);
        });
      });

      describe(`when the Sonia image url is "image-url"`, (): void => {
        beforeEach((): void => {
          discordSoniaServiceGetImageUrlSpy.mockReturnValue(`image-url`);
        });

        it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

          expect(result.options.embeds?.[0]?.footer).toStrictEqual({
            iconURL: `image-url`,
            text: `I don't allow you!`,
          } as MessageEmbedFooter);
        });
      });

      it(`should return a Discord message response embed with a thumbnail`, async (): Promise<void> => {
        expect.assertions(1);
        discordMessageConfigServiceGetMessageCommandErrorImageUrlSpy.mockReturnValue(IconEnum.ARTIFICIAL_INTELLIGENCE);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.thumbnail).toStrictEqual({
          url: IconEnum.ARTIFICIAL_INTELLIGENCE,
        } as MessageEmbedThumbnail);
      });

      it(`should return a Discord message response embed with a timestamp`, async (): Promise<void> => {
        expect.assertions(2);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(moment(result.options.embeds?.[0]?.timestamp).isValid()).toBe(true);
        expect(moment(result.options.embeds?.[0]?.timestamp).fromNow()).toBe(`a few seconds ago`);
      });

      it(`should return a Discord message response embed with a title`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.title).toBe(`I cannot let you do that!`);
      });

      it(`should return a Discord message response without a response text`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.content).toBeUndefined();
      });
    });

    describe(`when the channel is a text channel and the allowed channels is containing a text channel, a DM channel, and a news channel`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createInstance(TextChannel.prototype, { type: ChannelType.GuildText }),
          id: `dummy-id`,
        });
        allowedChannels = new Set<DiscordChannelEnum>([
          DiscordChannelEnum.TEXT,
          DiscordChannelEnum.DM,
          DiscordChannelEnum.NEWS,
        ]);
      });

      it(`should return a Discord message response embed with an author`, async (): Promise<void> => {
        expect.assertions(1);
        const messageEmbedAuthor: MessageEmbedAuthor = createHydratedMock<MessageEmbedAuthor>();
        discordSoniaServiceGetCorporationMessageEmbedAuthorSpy.mockReturnValue(messageEmbedAuthor);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.author).toStrictEqual(messageEmbedAuthor);
      });

      it(`should return a Discord message response embed with a color`, async (): Promise<void> => {
        expect.assertions(1);
        discordMessageConfigServiceGetMessageCommandErrorImageColorSpy.mockReturnValue(ColorEnum.CANDY);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.color).toStrictEqual(ColorEnum.CANDY);
      });

      it(`should return a Discord message response embed with 3 fields`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.fields).toHaveLength(3);
      });

      it(`should return a Discord message response embed with a wrong channel field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.fields?.[0]).toStrictEqual({
          name: `Wrong channel!`,
          value: `This sub-command is not allowed on text channels.`,
        } as EmbedFieldData);
      });

      it(`should return a Discord message response embed with a hint field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.fields?.[1]).toStrictEqual({
          name: `Allowed channels`,
          value: `You can use this sub-command only on text channels, private messages, and news channels.`,
        } as EmbedFieldData);
      });

      it(`should return a Discord message response embed with a report field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.fields?.[2]).toStrictEqual({
          name: `Help me to get better!`,
          value: `If you think that using this sub-command on text channels should be allowed, do not hesitate to submit a [feature request](https://github.com/Sonia-corporation/sonia-discord/issues/new?labels=feature-request&template=feature_request.md&projects=sonia-corporation/sonia-discord/1&title=%5BFEATURE%5D+).`,
        } as EmbedFieldData);
      });

      it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
        expect.assertions(1);
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.footer).toStrictEqual({
          iconURL: `dummy-image-url`,
          text: `I don't allow you!`,
        } as MessageEmbedFooter);
      });

      describe(`when the Sonia image url is null`, (): void => {
        beforeEach((): void => {
          discordSoniaServiceGetImageUrlSpy.mockReturnValue(null);
        });

        it(`should return a Discord message response embed with a footer but without an icon`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

          expect(result.options.embeds?.[0]?.footer).toStrictEqual({
            iconURL: undefined,
            text: `I don't allow you!`,
          } as MessageEmbedFooter);
        });
      });

      describe(`when the Sonia image url is "image-url"`, (): void => {
        beforeEach((): void => {
          discordSoniaServiceGetImageUrlSpy.mockReturnValue(`image-url`);
        });

        it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

          expect(result.options.embeds?.[0]?.footer).toStrictEqual({
            iconURL: `image-url`,
            text: `I don't allow you!`,
          } as MessageEmbedFooter);
        });
      });

      it(`should return a Discord message response embed with a thumbnail`, async (): Promise<void> => {
        expect.assertions(1);
        discordMessageConfigServiceGetMessageCommandErrorImageUrlSpy.mockReturnValue(IconEnum.ARTIFICIAL_INTELLIGENCE);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.thumbnail).toStrictEqual({
          url: IconEnum.ARTIFICIAL_INTELLIGENCE,
        } as MessageEmbedThumbnail);
      });

      it(`should return a Discord message response embed with a timestamp`, async (): Promise<void> => {
        expect.assertions(2);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(moment(result.options.embeds?.[0]?.timestamp).isValid()).toBe(true);
        expect(moment(result.options.embeds?.[0]?.timestamp).fromNow()).toBe(`a few seconds ago`);
      });

      it(`should return a Discord message response embed with a title`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.options.embeds?.[0]?.title).toBe(`I cannot let you do that!`);
      });

      it(`should return a Discord message response without a response text`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getErrorMessageResponse(anyDiscordMessage, allowedChannels);

        expect(result.content).toBeUndefined();
      });
    });
  });
});
