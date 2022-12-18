import { DiscordMessageCommandHelpService } from './discord-message-command-help.service';
import { ColorEnum } from '../../../../../../enums/color.enum';
import { IconEnum } from '../../../../../../enums/icon.enum';
import { ServiceNameEnum } from '../../../../../../enums/service-name.enum';
import { CoreEventService } from '../../../../../core/services/core-event.service';
import { ILoggerLog } from '../../../../../logger/interfaces/logger-log';
import { LoggerService } from '../../../../../logger/services/logger.service';
import { DiscordSoniaService } from '../../../../users/services/discord-sonia.service';
import { IDiscordMessageResponse } from '../../../interfaces/discord-message-response';
import { IAnyDiscordMessage } from '../../../types/any-discord-message';
import { DiscordMessageConfigService } from '../../config/discord-message-config.service';
import { DiscordMessageHelpService } from '../../helpers/discord-message-help.service';
import { DiscordMessageCommandVerifyChannelRightService } from '../discord-message-command-verify-channel-right.service';
import {
  ChannelType,
  DMChannel,
  EmbedAssetData,
  EmbedAuthorData,
  EmbedField,
  EmbedFooterData,
  NewsChannel,
  TextChannel,
} from 'discord.js';
import moment from 'moment-timezone';
import { createHydratedMock, createMock } from 'ts-auto-mock';

jest.mock(`../../../../../logger/services/chalk/chalk.service`);

describe(`DiscordMessageCommandHelpService`, (): void => {
  let service: DiscordMessageCommandHelpService;
  let coreEventService: CoreEventService;
  let loggerService: LoggerService;
  let discordSoniaService: DiscordSoniaService;
  let discordMessageConfigService: DiscordMessageConfigService;
  let discordMessageHelpService: DiscordMessageHelpService;
  let discordMessageCommandVerifyChannelRightService: DiscordMessageCommandVerifyChannelRightService;

  beforeEach((): void => {
    coreEventService = CoreEventService.getInstance();
    loggerService = LoggerService.getInstance();
    discordSoniaService = DiscordSoniaService.getInstance();
    discordMessageConfigService = DiscordMessageConfigService.getInstance();
    discordMessageHelpService = DiscordMessageHelpService.getInstance();
    discordMessageCommandVerifyChannelRightService = DiscordMessageCommandVerifyChannelRightService.getInstance();
  });

  describe(`getInstance()`, (): void => {
    it(`should create a DiscordMessageCommandHelp service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageCommandHelpService.getInstance();

      expect(service).toStrictEqual(expect.any(DiscordMessageCommandHelpService));
    });

    it(`should return the created DiscordMessageCommandHelp service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageCommandHelpService.getInstance();

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

    it(`should notify the DiscordMessageCommandHelp service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageCommandHelpService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_COMMAND_HELP_SERVICE
      );
    });
  });

  describe(`handleResponse()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let discordMessageResponse: IDiscordMessageResponse;
    let errorDiscordMessageResponse: IDiscordMessageResponse;

    let loggerServiceDebugSpy: jest.SpyInstance;
    let canSendMessageResponseToThisChannelSpy: jest.SpyInstance;
    let getMessageResponseSpy: jest.SpyInstance;
    let getNotAllowedChannelErrorMessageResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandHelpService();
      discordMessageResponse = createHydratedMock<IDiscordMessageResponse>();
      errorDiscordMessageResponse = createHydratedMock<IDiscordMessageResponse>();
      anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
        channel: createHydratedMock<TextChannel>({ type: ChannelType.GuildText }),
        id: `dummy-id`,
      });

      loggerServiceDebugSpy = jest.spyOn(loggerService, `debug`).mockImplementation();
      canSendMessageResponseToThisChannelSpy = jest
        .spyOn(service, `canSendMessageResponseToThisChannel`)
        .mockReturnValue(false);
      getMessageResponseSpy = jest.spyOn(service, `getMessageResponse`).mockResolvedValue(discordMessageResponse);
      getNotAllowedChannelErrorMessageResponseSpy = jest
        .spyOn(service, `getNotAllowedChannelErrorMessageResponse`)
        .mockResolvedValue(errorDiscordMessageResponse);
    });

    it(`should log about the command`, async (): Promise<void> => {
      expect.assertions(2);

      await service.handleResponse(anyDiscordMessage);

      expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
      expect(loggerServiceDebugSpy).toHaveBeenCalledWith({
        context: `DiscordMessageCommandHelpService`,
        hasExtendedContext: true,
        message: `context-[dummy-id] text-help command detected`,
      } as ILoggerLog);
    });

    it(`should check if the command is allowed for this channel`, async (): Promise<void> => {
      expect.assertions(2);

      await service.handleResponse(anyDiscordMessage);

      expect(canSendMessageResponseToThisChannelSpy).toHaveBeenCalledTimes(1);
      expect(canSendMessageResponseToThisChannelSpy).toHaveBeenCalledWith(anyDiscordMessage);
    });

    describe(`when the command is not allowed for this channel`, (): void => {
      beforeEach((): void => {
        canSendMessageResponseToThisChannelSpy.mockReturnValue(false);
      });

      it(`should not get a message response`, async (): Promise<void> => {
        expect.assertions(1);

        await service.handleResponse(anyDiscordMessage);

        expect(getMessageResponseSpy).not.toHaveBeenCalled();
      });

      it(`should return an error message response`, async (): Promise<void> => {
        expect.assertions(4);

        const result = await service.handleResponse(anyDiscordMessage);

        expect(getNotAllowedChannelErrorMessageResponseSpy).toHaveBeenCalledTimes(1);
        expect(getNotAllowedChannelErrorMessageResponseSpy).toHaveBeenCalledWith(anyDiscordMessage);
        expect(result).toStrictEqual(errorDiscordMessageResponse);
        expect(result).not.toStrictEqual(discordMessageResponse);
      });
    });

    describe(`when the command is allowed for this channel`, (): void => {
      beforeEach((): void => {
        canSendMessageResponseToThisChannelSpy.mockReturnValue(true);
      });

      it(`should get a message response`, async (): Promise<void> => {
        expect.assertions(3);

        await service.handleResponse(anyDiscordMessage);

        expect(getNotAllowedChannelErrorMessageResponseSpy).not.toHaveBeenCalled();
        expect(getMessageResponseSpy).toHaveBeenCalledTimes(1);
        expect(getMessageResponseSpy).toHaveBeenCalledWith(anyDiscordMessage);
      });

      it(`should return the message response`, async (): Promise<void> => {
        expect.assertions(2);

        const result = await service.handleResponse(anyDiscordMessage);

        expect(result).not.toStrictEqual(errorDiscordMessageResponse);
        expect(result).toStrictEqual(discordMessageResponse);
      });
    });
  });

  describe(`canSendMessageResponseToThisChannel()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;

    let discordMessageCommandVerifyChannelRightServiceVerifySpy: jest.SpyInstance;

    beforeEach((): void => {
      anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>();
      discordMessageCommandVerifyChannelRightServiceVerifySpy = jest.spyOn(
        discordMessageCommandVerifyChannelRightService,
        `verify`
      );
    });

    it(`should verify if the command can be executed for the type of channel related to this message`, (): void => {
      expect.assertions(2);

      service.canSendMessageResponseToThisChannel(anyDiscordMessage);

      expect(discordMessageCommandVerifyChannelRightServiceVerifySpy).toHaveBeenCalledTimes(1);
      expect(discordMessageCommandVerifyChannelRightServiceVerifySpy).toHaveBeenCalledWith(
        anyDiscordMessage,
        service.allowedChannels
      );
    });

    describe(`when the message comes from a DM channel`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createHydratedMock<DMChannel>({ type: ChannelType.DM }),
        });
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.canSendMessageResponseToThisChannel(anyDiscordMessage);

        expect(result).toBeTrue();
      });
    });

    describe(`when the message comes from a text channel`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createHydratedMock<TextChannel>({ type: ChannelType.GuildText }),
        });
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.canSendMessageResponseToThisChannel(anyDiscordMessage);

        expect(result).toBeTrue();
      });
    });

    describe(`when the message comes from a thread channel`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: {
            type: ChannelType.PublicThread,
          },
        });
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const result = service.canSendMessageResponseToThisChannel(anyDiscordMessage);

        expect(result).toBeTrue();
      });
    });

    describe(`when the message comes from a news channel`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createHydratedMock<NewsChannel>({ type: ChannelType.GuildNews }),
        });
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const result = service.canSendMessageResponseToThisChannel(anyDiscordMessage);

        expect(result).toBeFalse();
      });
    });
  });

  describe(`getNotAllowedChannelErrorMessageResponse()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;

    let discordMessageCommandVerifyChannelRightServiceGetErrorMessageResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
        channel: createHydratedMock<TextChannel>({ type: ChannelType.GuildText }),
      });
      discordMessageCommandVerifyChannelRightServiceGetErrorMessageResponseSpy = jest.spyOn(
        discordMessageCommandVerifyChannelRightService,
        `getErrorMessageResponse`
      );
    });

    it(`should get the error message response`, async (): Promise<void> => {
      expect.assertions(2);

      await service.getNotAllowedChannelErrorMessageResponse(anyDiscordMessage);

      expect(discordMessageCommandVerifyChannelRightServiceGetErrorMessageResponseSpy).toHaveBeenCalledTimes(1);
      expect(discordMessageCommandVerifyChannelRightServiceGetErrorMessageResponseSpy).toHaveBeenCalledWith(
        anyDiscordMessage,
        service.allowedChannels
      );
    });

    it(`should return the error message response`, async (): Promise<void> => {
      expect.assertions(1);

      const result = await service.getNotAllowedChannelErrorMessageResponse(anyDiscordMessage);

      const discordMessageResponse: IDiscordMessageResponse = {
        options: {
          embeds: [
            {
              author: {
                iconURL: `https://i.ibb.co/XSB6Vng/icons8-girl-1024.png`,
                name: `[dev] Sonia`,
                url: `https://github.com/Sonia-corporation?type=source`,
              },
              color: 15562905,
              fields: [
                {
                  name: `Wrong channel!`,
                  value: `This command is not allowed on text channels.`,
                },
                {
                  name: `Allowed channels`,
                  value: `You can use this command only on private messages, text channels, and threads.`,
                },
                {
                  name: `Help me to get better!`,
                  value: `If you think that using this command on text channels should be allowed, do not hesitate to submit a [feature request](https://github.com/Sonia-corporation/sonia-discord/issues/new?labels=feature-request&template=feature_request.md&projects=sonia-corporation/sonia-discord/1&title=%5BFEATURE%5D+).`,
                },
              ],
              footer: {
                iconURL: undefined,
                text: `I don't allow you!`,
              },
              thumbnail: {
                url: `https://i.ibb.co/5jZmzSB/icons8-error-512.png`,
              },
              title: `I cannot let you do that!`,
            },
          ],
        },
      };
      expect(result).toMatchObject(discordMessageResponse);
    });
  });

  describe(`getMessageResponse()`, (): void => {
    let discordSoniaServiceGetCorporationMessageEmbedAuthorSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandHelpImageColorSpy: jest.SpyInstance;
    let discordSoniaServiceGetImageUrlSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandHelpImageUrlSpy: jest.SpyInstance;
    let discordMessageHelpServiceGetMessageResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandHelpService();

      discordSoniaServiceGetCorporationMessageEmbedAuthorSpy = jest.spyOn(
        discordSoniaService,
        `getCorporationMessageEmbedAuthor`
      );
      discordMessageConfigServiceGetMessageCommandHelpImageColorSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandHelpImageColor`
      );
      discordSoniaServiceGetImageUrlSpy = jest.spyOn(discordSoniaService, `getImageUrl`);
      discordMessageConfigServiceGetMessageCommandHelpImageUrlSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandHelpImageUrl`
      );
      discordMessageHelpServiceGetMessageResponseSpy = jest.spyOn(discordMessageHelpService, `getMessageResponse`);
    });

    it(`should get the message response for the help`, async (): Promise<void> => {
      expect.assertions(3);
      discordMessageHelpServiceGetMessageResponseSpy.mockRejectedValue(new Error(`getMessageResponse help error`));

      await expect(service.getMessageResponse()).rejects.toThrow(new Error(`getMessageResponse help error`));

      expect(discordMessageHelpServiceGetMessageResponseSpy).toHaveBeenCalledTimes(1);
      expect(discordMessageHelpServiceGetMessageResponseSpy).toHaveBeenCalledWith();
    });

    describe(`when the message response for the help failed to be fetched`, (): void => {
      beforeEach((): void => {
        discordMessageHelpServiceGetMessageResponseSpy.mockRejectedValue(new Error(`getMessageResponse help error`));
      });

      it(`should throw an error`, async (): Promise<void> => {
        expect.assertions(1);

        await expect(service.getMessageResponse()).rejects.toThrow(new Error(`getMessageResponse help error`));
      });
    });

    describe(`when the message response for the help command was successfully fetched`, (): void => {
      it(`should return a Discord message response embed with an author`, async (): Promise<void> => {
        expect.assertions(1);
        const messageEmbedAuthor: EmbedAuthorData = createMock<EmbedAuthorData>();
        discordSoniaServiceGetCorporationMessageEmbedAuthorSpy.mockReturnValue(messageEmbedAuthor);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.author).toStrictEqual(messageEmbedAuthor);
      });

      it(`should return a Discord message response embed with a color`, async (): Promise<void> => {
        expect.assertions(1);
        discordMessageConfigServiceGetMessageCommandHelpImageColorSpy.mockReturnValue(ColorEnum.CANDY);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.color).toStrictEqual(ColorEnum.CANDY);
      });

      it(`should return a Discord message response embed with a description`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.description).toBe(
          `Below is the complete list of commands.\nYou can either use \`-\`, \`!\` or \`$\` as prefix to run a command.`
        );
      });

      it(`should return a Discord message response embed with 10 fields`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields).toHaveLength(10);
      });

      it(`should return a Discord message response embed with a cookie field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields?.[0]).toStrictEqual({
          name: `Cookie (*cookie*, *cookies* or *c*)`,
          value: `Because I am good, life gave me cookies. Now it is my turn to give you some.`,
        } as EmbedField);
      });

      it(`should return a Discord message response embed with an error field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields?.[1]).toStrictEqual({
          name: `Error (*error* or *bug*)`,
          value: `Create a bug in my core system. Do not do this one, of course!`,
        } as EmbedField);
      });

      it(`should return a Discord message response embed with a feature field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields?.[2]).toStrictEqual({
          name: `Feature (*feature* or *f*)`,
          value: `Change my behavior on this guild or on this channel. Help me to be better! I have some cool abilities you know!`,
        } as EmbedField);
      });

      it(`should return a Discord message response embed with a heartbeat field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields?.[3]).toStrictEqual({
          name: `Heartbeat (*heartbeat* or *hb*)`,
          value: `Display my current heartbeat.`,
        } as EmbedField);
      });

      it(`should return a Discord message response embed with a help field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields?.[4]).toStrictEqual({
          name: `Help (*help* or *h*)`,
          value: `Ask for my help, it is obvious! And maybe I will, who knows?`,
        } as EmbedField);
      });

      it(`should return a Discord message response embed with a lunch field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields?.[5]).toStrictEqual({
          name: `Lunch (*lunch* or *l*)`,
          value: `There is a time to eat.`,
        } as EmbedField);
      });

      it(`should return a Discord message response embed with a quote field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields?.[6]).toStrictEqual({
          name: `Quote (*quote* or *q*)`,
          value: `I quote others only in order to better express myself.`,
        } as EmbedField);
      });

      it(`should return a Discord message response embed with a release notes field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields?.[7]).toStrictEqual({
          name: `Release notes (*release-notes* or *r*)`,
          value: `Display the last version release notes.`,
        } as EmbedField);
      });

      it(`should return a Discord message response embed with a version field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields?.[8]).toStrictEqual({
          name: `Version (*version* or *v*)`,
          value: `Display my current application version.`,
        } as EmbedField);
      });

      it(`should return a Discord message response embed with a more help field`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.fields?.[9]).toStrictEqual({
          name: `Further help`,
          value: `You can also checkout the [readme](https://github.com/Sonia-corporation/sonia-discord/blob/master/README.md).
      It contains more information about how I work.`,
        } as EmbedField);
      });

      it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
        expect.assertions(1);
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.footer).toStrictEqual({
          iconURL: `dummy-image-url`,
          text: `At your service`,
        } as EmbedFooterData);
      });

      describe(`when the Sonia image url is null`, (): void => {
        beforeEach((): void => {
          discordSoniaServiceGetImageUrlSpy.mockReturnValue(null);
        });

        it(`should return a Discord message response embed with a footer but without an icon`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse();

          expect(result.options.embeds?.[0]?.footer).toStrictEqual({
            iconURL: undefined,
            text: `At your service`,
          } as EmbedFooterData);
        });
      });

      describe(`when the Sonia image url is "image-url"`, (): void => {
        beforeEach((): void => {
          discordSoniaServiceGetImageUrlSpy.mockReturnValue(`image-url`);
        });

        it(`should return a Discord message response embed with a footer containing an icon and a text`, async (): Promise<void> => {
          expect.assertions(1);

          const result = await service.getMessageResponse();

          expect(result.options.embeds?.[0]?.footer).toStrictEqual({
            iconURL: `image-url`,
            text: `At your service`,
          } as EmbedFooterData);
        });
      });

      it(`should return a Discord message response embed with a thumbnail`, async (): Promise<void> => {
        expect.assertions(1);
        discordMessageConfigServiceGetMessageCommandHelpImageUrlSpy.mockReturnValue(IconEnum.ARTIFICIAL_INTELLIGENCE);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.thumbnail).toStrictEqual({
          url: IconEnum.ARTIFICIAL_INTELLIGENCE,
        } as EmbedAssetData);
      });

      it(`should return a Discord message response embed with a timestamp`, async (): Promise<void> => {
        expect.assertions(2);

        const result = await service.getMessageResponse();

        expect(moment(result.options.embeds?.[0]?.timestamp).isValid()).toBe(true);
        expect(moment(result.options.embeds?.[0]?.timestamp).fromNow()).toBe(`a few seconds ago`);
      });

      it(`should return a Discord message response embed with a title`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.options.embeds?.[0]?.title).toBe(`So, you need my help? Cool.`);
      });

      it(`should return a Discord message response without a response text`, async (): Promise<void> => {
        expect.assertions(1);

        const result = await service.getMessageResponse();

        expect(result.content).toBeUndefined();
      });
    });

    describe(`hasCommand()`, (): void => {
      let message: string;

      let discordMessageConfigServiceGetMessageCommandPrefixSpy: jest.SpyInstance;

      beforeEach((): void => {
        service = new DiscordMessageCommandHelpService();
        message = `dummy-message`;

        discordMessageConfigServiceGetMessageCommandPrefixSpy = jest
          .spyOn(discordMessageConfigService, `getMessageCommandPrefix`)
          .mockImplementation();
      });

      describe(`when the message command prefix is "@"`, (): void => {
        beforeEach((): void => {
          discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue(`@`);
        });

        describe(`when the given message is an empty string`, (): void => {
          beforeEach((): void => {
            message = ``;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message without a command`, (): void => {
          beforeEach((): void => {
            message = `hello world`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with another command starting with @`, (): void => {
          beforeEach((): void => {
            message = `@version`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with another command starting with -`, (): void => {
          beforeEach((): void => {
            message = `-version`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with another command starting with !`, (): void => {
          beforeEach((): void => {
            message = `!version`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with @`, (): void => {
          beforeEach((): void => {
            message = `@hel`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with -`, (): void => {
          beforeEach((): void => {
            message = `-hel`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with !`, (): void => {
          beforeEach((): void => {
            message = `!hel`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with @ and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `@hel dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with - and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `-hel dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with ! and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `!hel dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command starting with @`, (): void => {
          beforeEach((): void => {
            message = `@help`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command starting with -`, (): void => {
          beforeEach((): void => {
            message = `-help`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command starting with !`, (): void => {
          beforeEach((): void => {
            message = `!help`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command starting with @ and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `@help dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command starting with - and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `-help dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command starting with ! and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `!help dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with @`, (): void => {
          beforeEach((): void => {
            message = `@h`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with -`, (): void => {
          beforeEach((): void => {
            message = `-h`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with !`, (): void => {
          beforeEach((): void => {
            message = `!h`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with @ and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `@h dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with - and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `-h dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with ! and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `!h dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command starting uppercase with @`, (): void => {
          beforeEach((): void => {
            message = `@HELP`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with -`, (): void => {
          beforeEach((): void => {
            message = `-HELP`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with !`, (): void => {
          beforeEach((): void => {
            message = `!HELP`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with @ and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `@HELP dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with - and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `-HELP dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with ! and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `!HELP dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting uppercase with @`, (): void => {
          beforeEach((): void => {
            message = `@H`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with -`, (): void => {
          beforeEach((): void => {
            message = `-H`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with !`, (): void => {
          beforeEach((): void => {
            message = `!H`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with @ and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `@H dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with - and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `-H dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with ! and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `!H dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });
      });

      describe(`when the message command prefix is "-" or "!"`, (): void => {
        beforeEach((): void => {
          discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([`-`, `!`]);
        });

        describe(`when the given message is an empty string`, (): void => {
          beforeEach((): void => {
            message = ``;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message without a command`, (): void => {
          beforeEach((): void => {
            message = `hello world`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with another command starting with @`, (): void => {
          beforeEach((): void => {
            message = `@version`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with another command starting with -`, (): void => {
          beforeEach((): void => {
            message = `-version`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with another command starting with !`, (): void => {
          beforeEach((): void => {
            message = `!version`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with @`, (): void => {
          beforeEach((): void => {
            message = `@hel`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with -`, (): void => {
          beforeEach((): void => {
            message = `-hel`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with !`, (): void => {
          beforeEach((): void => {
            message = `!hel`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with @ and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `@hel dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with - and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `-hel dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with an almost help command starting with ! and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `!hel dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command starting with @`, (): void => {
          beforeEach((): void => {
            message = `@help`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command starting with -`, (): void => {
          beforeEach((): void => {
            message = `-help`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command starting with !`, (): void => {
          beforeEach((): void => {
            message = `!help`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command starting with @ and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `@help dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command starting with - and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `-help dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command starting with ! and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `!help dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with @`, (): void => {
          beforeEach((): void => {
            message = `@HELP`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with -`, (): void => {
          beforeEach((): void => {
            message = `-HELP`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with !`, (): void => {
          beforeEach((): void => {
            message = `!HELP`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with @ and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `@HELP dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with - and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `-HELP dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the help command uppercase starting with ! and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `!HELP dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with @`, (): void => {
          beforeEach((): void => {
            message = `@h`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with -`, (): void => {
          beforeEach((): void => {
            message = `-h`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with !`, (): void => {
          beforeEach((): void => {
            message = `!h`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with @ and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `@h dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with - and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `-h dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command starting with ! and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `!h dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with @`, (): void => {
          beforeEach((): void => {
            message = `@H`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with -`, (): void => {
          beforeEach((): void => {
            message = `-H`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with !`, (): void => {
          beforeEach((): void => {
            message = `!H`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with @ and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `@H dummy`;
          });

          it(`should return false`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(false);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with - and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `-H dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });

        describe(`when the given message is a message with the shortcut help command uppercase starting with ! and have more text after that`, (): void => {
          beforeEach((): void => {
            message = `!H dummy`;
          });

          it(`should return true`, (): void => {
            expect.assertions(1);

            const result = service.hasCommand(message);

            expect(result).toBe(true);
          });
        });
      });
    });
  });
});
