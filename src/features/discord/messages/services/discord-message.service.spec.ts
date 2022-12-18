import { DiscordMessageService } from './discord-message.service';
import { DiscordMessageErrorService } from './helpers/discord-message-error.service';
import { DiscordMessageRightsService } from './rights/discord-message-rights.service';
import { DiscordMessageDmService } from './types/discord-message-dm.service';
import { DiscordMessageTextService } from './types/discord-message-text.service';
import { ServiceNameEnum } from '../../../../enums/service-name.enum';
import { CoreEventService } from '../../../core/services/core-event.service';
import { ILoggerLog } from '../../../logger/interfaces/logger-log';
import { LoggerConfigService } from '../../../logger/services/config/logger-config.service';
import { LoggerService } from '../../../logger/services/logger.service';
import { DiscordChannelTypingService } from '../../channels/services/discord-channel-typing.service';
import { DiscordChannelService } from '../../channels/services/discord-channel.service';
import { DiscordDmFirebaseService } from '../../dms/services/discord-dm-firebase.service';
import { DiscordMentionService } from '../../mentions/services/discord-mention.service';
import { DiscordClientService } from '../../services/discord-client.service';
import { DiscordAuthorService } from '../../users/services/discord-author.service';
import { DiscordSoniaService } from '../../users/services/discord-sonia.service';
import { ISonia } from '../../users/types/sonia';
import { IDiscordMessageResponse } from '../interfaces/discord-message-response';
import { IAnyDiscordMessage } from '../types/any-discord-message';
import { BaseMessageOptions, Client, MessagePayload } from 'discord.js';
import { createHydratedMock, createMock } from 'ts-auto-mock';

jest.mock(`../../../logger/services/chalk/chalk.service`);

describe(`DiscordMessageService`, (): void => {
  let service: DiscordMessageService;
  let coreEventService: CoreEventService;
  let discordClientService: DiscordClientService;
  let loggerService: LoggerService;
  let discordAuthorService: DiscordAuthorService;
  let discordChannelService: DiscordChannelService;
  let discordMessageErrorService: DiscordMessageErrorService;
  let discordMessageDmService: DiscordMessageDmService;
  let discordMessageTextService: DiscordMessageTextService;
  let discordChannelTypingService: DiscordChannelTypingService;
  let discordMentionService: DiscordMentionService;
  let discordSoniaService: DiscordSoniaService;
  let discordMessageRightsService: DiscordMessageRightsService;
  let loggerConfigService: LoggerConfigService;
  let discordDmFirebaseService: DiscordDmFirebaseService;

  beforeEach((): void => {
    coreEventService = CoreEventService.getInstance();
    discordClientService = DiscordClientService.getInstance();
    loggerService = LoggerService.getInstance();
    discordAuthorService = DiscordAuthorService.getInstance();
    discordChannelService = DiscordChannelService.getInstance();
    discordMessageErrorService = DiscordMessageErrorService.getInstance();
    discordMessageDmService = DiscordMessageDmService.getInstance();
    discordMessageTextService = DiscordMessageTextService.getInstance();
    discordChannelTypingService = DiscordChannelTypingService.getInstance();
    discordMentionService = DiscordMentionService.getInstance();
    discordSoniaService = DiscordSoniaService.getInstance();
    discordMessageRightsService = DiscordMessageRightsService.getInstance();
    loggerConfigService = LoggerConfigService.getInstance();
    discordDmFirebaseService = DiscordDmFirebaseService.getInstance();
  });

  describe(`getInstance()`, (): void => {
    it(`should create a DiscordMessage service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageService.getInstance();

      expect(service).toStrictEqual(expect.any(DiscordMessageService));
    });

    it(`should return the created DiscordMessage service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageService.getInstance();

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

    it(`should notify the DiscordMessage service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(ServiceNameEnum.DISCORD_MESSAGE_SERVICE);
    });
  });

  describe(`init()`, (): void => {
    let client: Client;
    let anyDiscordMessage: IAnyDiscordMessage;
    let discordClientServiceGetClientOnMock: jest.Mock;

    let loggerServiceDebugSpy: jest.SpyInstance;
    let discordClientServiceGetClientSpy: jest.SpyInstance;
    let sendMessageSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageService();
      discordClientServiceGetClientOnMock = jest.fn();
      client = createHydratedMock<Client>({
        on: discordClientServiceGetClientOnMock,
      });
      anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>();

      loggerServiceDebugSpy = jest.spyOn(loggerService, `debug`).mockImplementation();
      discordClientServiceGetClientSpy = jest.spyOn(discordClientService, `getClient`).mockReturnValue(client);
      sendMessageSpy = jest.spyOn(service, `sendMessage`).mockRejectedValue(new Error(`Fake test error: sendMessage`));
    });

    it(`should get the Discord client`, (): void => {
      expect.assertions(2);

      service.init();

      expect(discordClientServiceGetClientSpy).toHaveBeenCalledTimes(1);
      expect(discordClientServiceGetClientSpy).toHaveBeenCalledWith();
    });

    it(`should listen for the Discord client message event`, (): void => {
      expect.assertions(2);

      service.init();

      expect(discordClientServiceGetClientOnMock).toHaveBeenCalledTimes(1);
      expect(discordClientServiceGetClientOnMock).toHaveBeenCalledWith(`messageCreate`, expect.any(Function));
    });

    describe(`when the Discord client message event is triggered`, (): void => {
      beforeEach((): void => {
        discordClientServiceGetClientOnMock = jest.fn(
          (_event: string, listener: (anyDiscordMessage: IAnyDiscordMessage) => void): void => {
            listener(anyDiscordMessage);
          }
        );
        client = createHydratedMock<Client>({
          on: discordClientServiceGetClientOnMock,
        });

        discordClientServiceGetClientSpy.mockReturnValue(client);
      });

      it(`should send a message`, (): void => {
        expect.assertions(2);

        service.init();

        expect(sendMessageSpy).toHaveBeenCalledTimes(1);
        expect(sendMessageSpy).toHaveBeenCalledWith(anyDiscordMessage);
      });
    });

    it(`should log about listening Discord message event`, (): void => {
      expect.assertions(2);

      service.init();

      expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
      expect(loggerServiceDebugSpy).toHaveBeenCalledWith({
        context: `DiscordMessageService`,
        message: `text-listen "message" event`,
      } as ILoggerLog);
    });
  });

  describe(`sendMessage()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;

    let loggerServiceLogSpy: jest.SpyInstance;
    let loggerServiceWarningSpy: jest.SpyInstance;
    let handleChannelMessageSpy: jest.SpyInstance;
    let discordAuthorServiceIsValidSpy: jest.SpyInstance;
    let discordAuthorServiceIsBotSpy: jest.SpyInstance;
    let discordChannelServiceIsValidSpy: jest.SpyInstance;
    let loggerConfigServiceShouldDisplayMoreDebugLogsSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageService();
      anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
        id: `dummy-id`,
      });

      loggerServiceLogSpy = jest.spyOn(loggerService, `log`).mockImplementation();
      loggerServiceWarningSpy = jest.spyOn(loggerService, `warning`).mockImplementation();
      handleChannelMessageSpy = jest.spyOn(service, `handleChannelMessage`).mockImplementation();
      discordAuthorServiceIsValidSpy = jest.spyOn(discordAuthorService, `isValid`);
      discordAuthorServiceIsBotSpy = jest.spyOn(discordAuthorService, `isBot`);
      discordChannelServiceIsValidSpy = jest.spyOn(discordChannelService, `isValid`).mockReturnValue(false);
      loggerConfigServiceShouldDisplayMoreDebugLogsSpy = jest
        .spyOn(loggerConfigService, `shouldDisplayMoreDebugLogs`)
        .mockReturnValue(false);
    });

    describe(`when the given Discord message content is null`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage.content = null;
      });

      describe(`when more logs should not be displayed`, (): void => {
        beforeEach((): void => {
          loggerConfigServiceShouldDisplayMoreDebugLogsSpy.mockReturnValue(false);
        });

        it(`should log a warning about not supporting other messages than text`, async (): Promise<void> => {
          expect.assertions(2);

          await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(
            new Error(`Discord message content is invalid or empty`)
          );

          expect(loggerServiceWarningSpy).not.toHaveBeenCalled();
        });
      });

      describe(`when more logs should be displayed`, (): void => {
        beforeEach((): void => {
          loggerConfigServiceShouldDisplayMoreDebugLogsSpy.mockReturnValue(true);
        });

        it(`should log a warning about not supporting other messages than text`, async (): Promise<void> => {
          expect.assertions(3);

          await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(
            new Error(`Discord message content is invalid or empty`)
          );

          expect(loggerServiceWarningSpy).toHaveBeenCalledTimes(1);
          expect(loggerServiceWarningSpy).toHaveBeenCalledWith({
            context: `DiscordMessageService`,
            hasExtendedContext: true,
            message: `context-[dummy-id] text-We only support for now text messages (embed or such are not handled)`,
          } as ILoggerLog);
        });
      });

      it(`should not log about the received message`, async (): Promise<void> => {
        expect.assertions(2);

        await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(
          new Error(`Discord message content is invalid or empty`)
        );

        expect(loggerServiceLogSpy).not.toHaveBeenCalled();
      });

      it(`should not handle the channel message`, async (): Promise<void> => {
        expect.assertions(2);

        await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(
          new Error(`Discord message content is invalid or empty`)
        );

        expect(handleChannelMessageSpy).not.toHaveBeenCalled();
      });
    });

    describe(`when the given Discord message content is an empty string`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage.content = ``;
      });

      it(`should not log about the received message`, async (): Promise<void> => {
        expect.assertions(2);

        await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(
          new Error(`Discord message content is invalid or empty`)
        );

        expect(loggerServiceLogSpy).not.toHaveBeenCalled();
      });

      it(`should not handle the channel message`, async (): Promise<void> => {
        expect.assertions(2);

        await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(
          new Error(`Discord message content is invalid or empty`)
        );

        expect(handleChannelMessageSpy).not.toHaveBeenCalled();
      });
    });

    describe(`when the given Discord message content is a valid string`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage.content = `dummy-content`;
      });

      it(`should log about the received message`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(new Error(`Invalid author`));

        expect(loggerServiceLogSpy).toHaveBeenCalledTimes(1);
        expect(loggerServiceLogSpy).toHaveBeenCalledWith({
          context: `DiscordMessageService`,
          hasExtendedContext: true,
          message: `context-[dummy-id] text-dummy-content`,
        } as ILoggerLog);
      });

      describe(`when the message author is valid`, (): void => {
        beforeEach((): void => {
          discordAuthorServiceIsValidSpy.mockReturnValue(true);
        });

        describe(`when the message author is a bot`, (): void => {
          beforeEach((): void => {
            discordAuthorServiceIsBotSpy.mockReturnValue(true);
          });

          it(`should not handle the channel message`, async (): Promise<void> => {
            expect.assertions(2);

            await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(
              new Error(`Discord message author is a Bot`)
            );

            expect(handleChannelMessageSpy).not.toHaveBeenCalled();
          });
        });

        describe(`when the message author is not a bot`, (): void => {
          beforeEach((): void => {
            discordAuthorServiceIsBotSpy.mockReturnValue(false);
          });

          describe(`when the message channel is not valid`, (): void => {
            beforeEach((): void => {
              discordChannelServiceIsValidSpy.mockReturnValue(false);
            });

            it(`should not handle the channel message`, async (): Promise<void> => {
              expect.assertions(2);

              await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(
                new Error(`Discord message channel is not valid`)
              );

              expect(handleChannelMessageSpy).not.toHaveBeenCalled();
            });
          });

          describe(`when the message channel is valid`, (): void => {
            beforeEach((): void => {
              discordChannelServiceIsValidSpy.mockReturnValue(true);
            });

            it(`should handle the channel message`, async (): Promise<void> => {
              expect.assertions(3);

              const result = await service.sendMessage(anyDiscordMessage);

              expect(result).toBeUndefined();
              expect(handleChannelMessageSpy).toHaveBeenCalledTimes(1);
              expect(handleChannelMessageSpy).toHaveBeenCalledWith(anyDiscordMessage);
            });
          });
        });
      });

      describe(`when the message author is not valid`, (): void => {
        beforeEach((): void => {
          discordAuthorServiceIsValidSpy.mockReturnValue(false);
        });

        describe(`when the message channel is not valid`, (): void => {
          beforeEach((): void => {
            discordChannelServiceIsValidSpy.mockReturnValue(false);
          });

          it(`should not handle the channel message`, async (): Promise<void> => {
            expect.assertions(2);

            await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(new Error(`Invalid author`));

            expect(handleChannelMessageSpy).not.toHaveBeenCalled();
          });
        });

        describe(`when the message channel is valid`, (): void => {
          beforeEach((): void => {
            discordChannelServiceIsValidSpy.mockReturnValue(true);
          });

          it(`should not handle the channel message`, async (): Promise<void> => {
            expect.assertions(2);

            await expect(service.sendMessage(anyDiscordMessage)).rejects.toThrow(new Error(`Invalid author`));

            expect(handleChannelMessageSpy).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe(`handleChannelMessage()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let discordMessageResponse: IDiscordMessageResponse;

    let anyDiscordMessageChannelSendMock: jest.Mock;
    let discordChannelServiceIsDmSpy: jest.SpyInstance;
    let discordMessageRightsServiceIsSoniaAuthorizedForThisGuildSpy: jest.SpyInstance;
    let discordChannelServiceIsTextSpy: jest.SpyInstance;
    let loggerServiceDebugSpy: jest.SpyInstance;
    let loggerServiceLogSpy: jest.SpyInstance;
    let loggerServiceErrorSpy: jest.SpyInstance;
    let loggerServiceWarningSpy: jest.SpyInstance;
    let discordMessageDmServiceGetMessageSpy: jest.SpyInstance;
    let discordMessageTextServiceGetMessageSpy: jest.SpyInstance;
    let discordMessageErrorServiceHandleErrorSpy: jest.SpyInstance;
    let discordChannelServiceIsValidSpy: jest.SpyInstance;
    let discordChannelTypingServiceAddOneIndicatorSpy: jest.SpyInstance;
    let discordAuthorServiceIsValidSpy: jest.SpyInstance;
    let discordMentionServiceIsValidSpy: jest.SpyInstance;
    let discordMentionServiceIsForEveryone: jest.SpyInstance;
    let discordSoniaServiceIsValidSpy: jest.SpyInstance;
    let discordMentionServiceIsUserMentionedSpy: jest.SpyInstance;
    let discordDmFirebaseServiceAddDmToFirebaseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageService();
      anyDiscordMessageChannelSendMock = jest.fn().mockRejectedValue(new Error(`Fake test error: send`));
      anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
        channel: {
          send: anyDiscordMessageChannelSendMock,
        },
        guild: {
          id: `dummy-guild-id`,
        },
        id: `dummy-id`,
      });
      discordMessageResponse = createMock<IDiscordMessageResponse>({
        afterSending: undefined,
        content: `dummy-response`,
        options: {},
      });

      discordChannelServiceIsDmSpy = jest.spyOn(discordChannelService, `isDm`).mockImplementation();
      discordMessageRightsServiceIsSoniaAuthorizedForThisGuildSpy = jest
        .spyOn(discordMessageRightsService, `isSoniaAuthorizedForThisGuild`)
        .mockImplementation();
      discordChannelServiceIsTextSpy = jest.spyOn(discordChannelService, `isText`).mockImplementation();
      loggerServiceDebugSpy = jest.spyOn(loggerService, `debug`).mockImplementation();
      loggerServiceLogSpy = jest.spyOn(loggerService, `log`).mockImplementation();
      loggerServiceErrorSpy = jest.spyOn(loggerService, `error`).mockImplementation();
      loggerServiceWarningSpy = jest.spyOn(loggerService, `warning`).mockImplementation();
      discordMessageDmServiceGetMessageSpy = jest
        .spyOn(discordMessageDmService, `getMessage`)
        .mockRejectedValue(new Error(`getMessage error`));
      discordMessageTextServiceGetMessageSpy = jest
        .spyOn(discordMessageTextService, `getMessage`)
        .mockRejectedValue(new Error(`getMessage error`));
      discordMessageErrorServiceHandleErrorSpy = jest.spyOn(discordMessageErrorService, `handleError`);
      discordChannelServiceIsValidSpy = jest.spyOn(discordChannelService, `isValid`);
      discordChannelTypingServiceAddOneIndicatorSpy = jest
        .spyOn(discordChannelTypingService, `sendTyping`)
        .mockResolvedValue();
      discordAuthorServiceIsValidSpy = jest.spyOn(discordAuthorService, `isValid`).mockImplementation();
      discordMentionServiceIsValidSpy = jest.spyOn(discordMentionService, `isValid`).mockImplementation();
      discordMentionServiceIsForEveryone = jest.spyOn(discordMentionService, `isForEveryone`).mockImplementation();
      jest.spyOn(discordSoniaService, `getSonia`).mockReturnValue(createHydratedMock<ISonia>());
      discordSoniaServiceIsValidSpy = jest.spyOn(discordSoniaService, `isValid`).mockImplementation();
      discordMentionServiceIsUserMentionedSpy = jest
        .spyOn(discordMentionService, `isUserMentioned`)
        .mockImplementation();
      discordDmFirebaseServiceAddDmToFirebaseSpy = jest
        .spyOn(discordDmFirebaseService, `addDmToFirebase`)
        .mockResolvedValue();
      jest.spyOn(loggerConfigService, `shouldDisplayMoreDebugLogs`).mockReturnValue(true);
    });

    describe(`when the given discord message is not DM message`, (): void => {
      beforeEach((): void => {
        discordChannelServiceIsDmSpy.mockReturnValue(false);
      });

      describe(`when the given discord message is not text message`, (): void => {
        beforeEach((): void => {
          discordChannelServiceIsTextSpy.mockReturnValue(false);
        });

        it(`should do nothing`, async (): Promise<void> => {
          expect.assertions(8);

          await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
            new Error(`Discord message is not a DM channel nor a text channel nor a thread`)
          );

          expect(discordChannelTypingServiceAddOneIndicatorSpy).not.toHaveBeenCalled();
          expect(discordDmFirebaseServiceAddDmToFirebaseSpy).not.toHaveBeenCalled();
          expect(loggerServiceDebugSpy).not.toHaveBeenCalled();
          expect(anyDiscordMessageChannelSendMock).not.toHaveBeenCalled();
          expect(discordChannelServiceIsValidSpy).not.toHaveBeenCalled();
          expect(loggerServiceLogSpy).not.toHaveBeenCalled();
          expect(discordMessageErrorServiceHandleErrorSpy).not.toHaveBeenCalled();
        });
      });

      describe(`when the given discord message is a text message`, (): void => {
        beforeEach((): void => {
          discordChannelServiceIsTextSpy.mockReturnValue(true);
        });

        describe(`when the given discord message guild is not authorized for Sonia`, (): void => {
          beforeEach((): void => {
            discordMessageRightsServiceIsSoniaAuthorizedForThisGuildSpy.mockReturnValue(false);
          });

          it(`should log about not being able to send local messages to this guild`, async (): Promise<void> => {
            expect.assertions(3);

            await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
              new Error(`Sonia is not authorized for this guild`)
            );

            expect(loggerServiceWarningSpy).toHaveBeenCalledTimes(1);
            expect(loggerServiceWarningSpy).toHaveBeenCalledWith({
              context: `DiscordMessageService`,
              hasExtendedContext: true,
              message: `context-[dummy-id] text-Sonia is not authorized to send messages to this guild in local environment`,
            } as ILoggerLog);
          });

          it(`should log a hint for the dev to add the guild id inside the secret environment`, async (): Promise<void> => {
            expect.assertions(3);

            await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
              new Error(`Sonia is not authorized for this guild`)
            );

            expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
            expect(loggerServiceDebugSpy).toHaveBeenCalledWith({
              context: `DiscordMessageService`,
              message: `text-add the guild id value-dummy-guild-id to your secret environment under 'discord.sonia.devGuildIdWhitelist' to allow Sonia to interact with it`,
            } as ILoggerLog);
          });

          it(`should do nothing`, async (): Promise<void> => {
            expect.assertions(7);

            await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
              new Error(`Sonia is not authorized for this guild`)
            );

            expect(discordChannelTypingServiceAddOneIndicatorSpy).not.toHaveBeenCalled();
            expect(discordDmFirebaseServiceAddDmToFirebaseSpy).not.toHaveBeenCalled();
            expect(anyDiscordMessageChannelSendMock).not.toHaveBeenCalled();
            expect(discordChannelServiceIsValidSpy).not.toHaveBeenCalled();
            expect(loggerServiceLogSpy).not.toHaveBeenCalled();
            expect(discordMessageErrorServiceHandleErrorSpy).not.toHaveBeenCalled();
          });
        });

        describe(`when the given discord message guild is authorized for Sonia`, (): void => {
          beforeEach((): void => {
            discordMessageRightsServiceIsSoniaAuthorizedForThisGuildSpy.mockReturnValue(true);
          });

          describe(`when the author is invalid`, (): void => {
            beforeEach((): void => {
              discordAuthorServiceIsValidSpy.mockReturnValue(false);
            });

            it(`should not show the typing indicator`, async (): Promise<void> => {
              expect.assertions(2);

              await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                new Error(`getMessage error`)
              );

              expect(discordChannelTypingServiceAddOneIndicatorSpy).not.toHaveBeenCalled();
            });
          });

          describe(`when the mention is invalid`, (): void => {
            beforeEach((): void => {
              discordAuthorServiceIsValidSpy.mockReturnValue(true);
              discordMentionServiceIsValidSpy.mockReturnValue(false);
            });

            it(`should not show the typing indicator`, async (): Promise<void> => {
              expect.assertions(2);

              await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                new Error(`getMessage error`)
              );

              expect(discordChannelTypingServiceAddOneIndicatorSpy).not.toHaveBeenCalled();
            });
          });

          describe(`when the mention is not for everyone`, (): void => {
            beforeEach((): void => {
              discordAuthorServiceIsValidSpy.mockReturnValue(true);
              discordMentionServiceIsValidSpy.mockReturnValue(true);
              discordMentionServiceIsForEveryone.mockReturnValue(false);
            });

            describe(`when Sonia is invalid`, (): void => {
              beforeEach((): void => {
                discordSoniaServiceIsValidSpy.mockReturnValue(false);
              });

              it(`should not show the typing indicator`, async (): Promise<void> => {
                expect.assertions(2);

                await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                  new Error(`getMessage error`)
                );

                expect(discordChannelTypingServiceAddOneIndicatorSpy).not.toHaveBeenCalled();
              });
            });

            describe(`when Sonia is not mentioned`, (): void => {
              beforeEach((): void => {
                discordSoniaServiceIsValidSpy.mockReturnValue(true);
                discordMentionServiceIsUserMentionedSpy.mockReturnValue(false);
              });

              it(`should not show the typing indicator`, async (): Promise<void> => {
                expect.assertions(2);

                await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                  new Error(`getMessage error`)
                );

                expect(discordChannelTypingServiceAddOneIndicatorSpy).not.toHaveBeenCalled();
              });
            });
          });

          describe(`when the author and the mention are valid`, (): void => {
            beforeEach((): void => {
              discordAuthorServiceIsValidSpy.mockReturnValue(true);
              discordMentionServiceIsValidSpy.mockReturnValue(true);
            });

            describe(`when the mention is not for everyone`, (): void => {
              beforeEach((): void => {
                discordMentionServiceIsForEveryone.mockReturnValue(false);
              });

              describe(`when Sonia is valid and mentioned`, (): void => {
                beforeEach((): void => {
                  discordSoniaServiceIsValidSpy.mockReturnValue(true);
                  discordMentionServiceIsUserMentionedSpy.mockReturnValue(true);
                });

                it(`should display one typing indicator`, async (): Promise<void> => {
                  expect.assertions(3);

                  await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                    new Error(`getMessage error`)
                  );

                  expect(discordChannelTypingServiceAddOneIndicatorSpy).toHaveBeenCalledTimes(1);
                  expect(discordChannelTypingServiceAddOneIndicatorSpy).toHaveBeenCalledWith(anyDiscordMessage.channel);
                });

                it(`should not add the author to the Firebase DM store`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                    new Error(`getMessage error`)
                  );

                  expect(discordDmFirebaseServiceAddDmToFirebaseSpy).not.toHaveBeenCalled();
                });
              });
            });

            describe(`when the mention is for everyone`, (): void => {
              beforeEach((): void => {
                discordMentionServiceIsForEveryone.mockReturnValue(true);
              });

              it(`should display one typing indicator`, async (): Promise<void> => {
                expect.assertions(3);

                await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                  new Error(`getMessage error`)
                );

                expect(discordChannelTypingServiceAddOneIndicatorSpy).toHaveBeenCalledTimes(1);
                expect(discordChannelTypingServiceAddOneIndicatorSpy).toHaveBeenCalledWith(anyDiscordMessage.channel);
              });

              it(`should not add the author to the Firebase DM store`, async (): Promise<void> => {
                expect.assertions(2);

                await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                  new Error(`getMessage error`)
                );

                expect(discordDmFirebaseServiceAddDmToFirebaseSpy).not.toHaveBeenCalled();
              });
            });
          });

          it(`should log about the text message`, async (): Promise<void> => {
            expect.assertions(3);

            await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
              new Error(`getMessage error`)
            );

            expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
            expect(loggerServiceDebugSpy).toHaveBeenCalledWith({
              context: `DiscordMessageService`,
              hasExtendedContext: true,
              message: `context-[dummy-id] text-text message`,
            } as ILoggerLog);
          });

          it(`should get a message response for the text message`, async (): Promise<void> => {
            expect.assertions(3);

            await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
              new Error(`getMessage error`)
            );

            expect(discordMessageTextServiceGetMessageSpy).toHaveBeenCalledTimes(1);
            expect(discordMessageTextServiceGetMessageSpy).toHaveBeenCalledWith(anyDiscordMessage);
          });

          describe(`when an error occurred when getting a message response`, (): void => {
            beforeEach((): void => {
              discordMessageTextServiceGetMessageSpy.mockRejectedValue(new Error(`getMessage error`));
            });

            it(`should log about the fail to get a valid message response`, async (): Promise<void> => {
              expect.assertions(3);

              await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                new Error(`getMessage error`)
              );

              expect(loggerServiceErrorSpy).toHaveBeenCalledTimes(1);
              expect(loggerServiceErrorSpy).toHaveBeenCalledWith({
                context: `DiscordMessageService`,
                hasExtendedContext: true,
                message: `context-[dummy-id] text-failed to get a valid message response`,
              } as ILoggerLog);
            });

            it(`should do nothing`, async (): Promise<void> => {
              expect.assertions(5);

              await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                new Error(`getMessage error`)
              );

              expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
              expect(discordChannelServiceIsValidSpy).not.toHaveBeenCalled();
              expect(loggerServiceLogSpy).not.toHaveBeenCalled();
              expect(discordMessageErrorServiceHandleErrorSpy).not.toHaveBeenCalled();
            });
          });

          describe(`when getting a message response was successful`, (): void => {
            beforeEach((): void => {
              discordMessageTextServiceGetMessageSpy.mockResolvedValue(discordMessageResponse);
            });

            describe(`when the given Discord message channel is not valid`, (): void => {
              beforeEach((): void => {
                discordChannelServiceIsValidSpy.mockReturnValue(false);
              });

              it(`should do nothing`, async (): Promise<void> => {
                expect.assertions(4);

                await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                  new Error(`Discord message channel not valid`)
                );

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
                expect(loggerServiceLogSpy).not.toHaveBeenCalled();
                expect(discordMessageErrorServiceHandleErrorSpy).not.toHaveBeenCalled();
              });
            });

            describe(`when the given Discord message channel is valid`, (): void => {
              beforeEach((): void => {
                discordChannelServiceIsValidSpy.mockReturnValue(true);
              });

              it(`should log about sending a message`, async (): Promise<void> => {
                expect.assertions(3);

                await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                  new Error(`Fake test error: send`)
                );

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(2);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(2, {
                  context: `DiscordMessageService`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-sending message...`,
                } as ILoggerLog);
              });

              it(`should send the message response to the given Discord message channel`, async (): Promise<void> => {
                expect.assertions(3);

                await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                  new Error(`Fake test error: send`)
                );

                const message: string | MessagePayload | BaseMessageOptions = {
                  content: `dummy-response`,
                };
                expect(anyDiscordMessageChannelSendMock).toHaveBeenCalledTimes(2);
                expect(anyDiscordMessageChannelSendMock).toHaveBeenCalledWith(message);
              });

              describe(`when the message was not successfully sent`, (): void => {
                beforeEach((): void => {
                  anyDiscordMessageChannelSendMock.mockRejectedValue(new Error(`Message sending error`));

                  anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
                    channel: {
                      send: anyDiscordMessageChannelSendMock,
                    },
                    guild: {
                      id: `dummy-guild-id`,
                    },
                    id: `dummy-id`,
                  });
                });

                it(`should handle the error`, async (): Promise<void> => {
                  expect.assertions(3);

                  await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                    new Error(`Message sending error`)
                  );

                  expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledTimes(1);
                  expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledWith(
                    new Error(`Message sending error`),
                    anyDiscordMessage
                  );
                });

                it(`should not log about the success of the message sending`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                    new Error(`Message sending error`)
                  );

                  expect(loggerServiceLogSpy).not.toHaveBeenCalled();
                });
              });

              describe(`when the message was successfully sent`, (): void => {
                beforeEach((): void => {
                  anyDiscordMessageChannelSendMock.mockResolvedValue(undefined);

                  anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
                    channel: {
                      send: anyDiscordMessageChannelSendMock,
                    },
                    guild: {
                      id: `dummy-guild-id`,
                    },
                    id: `dummy-id`,
                  });
                });

                it(`should log about the success of the message sending`, async (): Promise<void> => {
                  expect.assertions(3);

                  const result = await service.handleChannelMessage(anyDiscordMessage);

                  expect(result).toBeUndefined();
                  expect(loggerServiceLogSpy).toHaveBeenCalledTimes(1);
                  expect(loggerServiceLogSpy).toHaveBeenCalledWith({
                    context: `DiscordMessageService`,
                    hasExtendedContext: true,
                    message: `context-[dummy-id] text-message sent`,
                  } as ILoggerLog);
                });

                describe(`when the "afterSending" callback exist`, (): void => {
                  let afterSendingMock: jest.Mock;

                  beforeEach((): void => {
                    afterSendingMock = jest.fn().mockResolvedValue(undefined);
                    discordMessageResponse = createHydratedMock<IDiscordMessageResponse>({
                      afterSending: afterSendingMock,
                      content: `dummy-response`,
                      options: {},
                    });
                    discordMessageTextServiceGetMessageSpy.mockResolvedValue(discordMessageResponse);
                  });

                  it(`should log about executing the callback`, async (): Promise<void> => {
                    expect.assertions(2);

                    await service.handleChannelMessage(anyDiscordMessage);

                    expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(4);
                    expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(3, {
                      context: `DiscordMessageService`,
                      hasExtendedContext: true,
                      message: `context-[dummy-id] text-executing callback value-afterSending...`,
                    } as ILoggerLog);
                  });

                  it(`should execute the after sending callback`, async (): Promise<void> => {
                    expect.assertions(1);

                    await service.handleChannelMessage(anyDiscordMessage);

                    expect(afterSendingMock).toHaveBeenCalledTimes(1);
                  });

                  it(`should log about successfully executed the callback`, async (): Promise<void> => {
                    expect.assertions(2);

                    await service.handleChannelMessage(anyDiscordMessage);

                    expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(4);
                    expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(4, {
                      context: `DiscordMessageService`,
                      hasExtendedContext: true,
                      message: `context-[dummy-id] text-callback value-afterSending executed`,
                    } as ILoggerLog);
                  });
                });

                it(`should not handle the error`, async (): Promise<void> => {
                  expect.assertions(2);

                  const result = await service.handleChannelMessage(anyDiscordMessage);

                  expect(result).toBeUndefined();
                  expect(discordMessageErrorServiceHandleErrorSpy).not.toHaveBeenCalled();
                });
              });
            });
          });

          describe(`when getting three message responses was successful`, (): void => {
            let discordMessageResponses: IDiscordMessageResponse[];
            let discordMessageResponseA: IDiscordMessageResponse;
            let discordMessageResponseB: IDiscordMessageResponse;
            let discordMessageResponseC: IDiscordMessageResponse;

            beforeEach((): void => {
              discordMessageResponseA = createMock<IDiscordMessageResponse>({
                content: `dummy-response-a`,
                options: {},
              });
              discordMessageResponseB = createMock<IDiscordMessageResponse>({
                content: `dummy-response-b`,
                options: {},
              });
              discordMessageResponseC = createMock<IDiscordMessageResponse>({
                content: `dummy-response-c`,
                options: {},
              });
              discordMessageResponses = [discordMessageResponseA, discordMessageResponseB, discordMessageResponseC];

              discordMessageTextServiceGetMessageSpy.mockResolvedValue(discordMessageResponses);
            });

            describe(`when the given Discord message channel is not valid`, (): void => {
              beforeEach((): void => {
                discordChannelServiceIsValidSpy.mockReturnValue(false);
              });

              it(`should do nothing`, async (): Promise<void> => {
                expect.assertions(4);

                await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                  new Error(`Discord message channel not valid`)
                );

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
                expect(loggerServiceLogSpy).not.toHaveBeenCalled();
                expect(discordMessageErrorServiceHandleErrorSpy).not.toHaveBeenCalled();
              });
            });

            describe(`when the given Discord message channel is valid`, (): void => {
              beforeEach((): void => {
                discordChannelServiceIsValidSpy.mockReturnValue(true);
              });

              it(`should log about sending a message three times`, async (): Promise<void> => {
                expect.assertions(5);

                await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                  new Error(`Fake test error: send`)
                );

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(4);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(2, {
                  context: `DiscordMessageService`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-sending message...`,
                } as ILoggerLog);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(3, {
                  context: `DiscordMessageService`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-sending message...`,
                } as ILoggerLog);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(4, {
                  context: `DiscordMessageService`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-sending message...`,
                } as ILoggerLog);
              });

              it(`should send three message responses to the given Discord message channel`, async (): Promise<void> => {
                expect.assertions(5);

                await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                  new Error(`Fake test error: send`)
                );

                const messageA: string | MessagePayload | BaseMessageOptions = {
                  content: `dummy-response-a`,
                };
                const messageB: string | MessagePayload | BaseMessageOptions = {
                  content: `dummy-response-b`,
                };
                const messageC: string | MessagePayload | BaseMessageOptions = {
                  content: `dummy-response-c`,
                };
                // TODO should be 3 calls; weird!
                expect(anyDiscordMessageChannelSendMock).toHaveBeenCalledTimes(6);
                expect(anyDiscordMessageChannelSendMock).toHaveBeenNthCalledWith(1, messageA);
                expect(anyDiscordMessageChannelSendMock).toHaveBeenNthCalledWith(2, messageB);
                expect(anyDiscordMessageChannelSendMock).toHaveBeenNthCalledWith(3, messageC);
              });

              describe(`when the messages were not successfully sent`, (): void => {
                beforeEach((): void => {
                  anyDiscordMessageChannelSendMock.mockRejectedValue(new Error(`Message sending error`));

                  anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
                    channel: {
                      send: anyDiscordMessageChannelSendMock,
                    },
                    guild: {
                      id: `dummy-guild-id`,
                    },
                    id: `dummy-id`,
                  });
                });

                it(`should handle the errors`, async (): Promise<void> => {
                  expect.assertions(5);

                  await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                    new Error(`Message sending error`)
                  );

                  expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledTimes(3);
                  expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenNthCalledWith(
                    1,
                    new Error(`Message sending error`),
                    anyDiscordMessage
                  );
                  expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenNthCalledWith(
                    2,
                    new Error(`Message sending error`),
                    anyDiscordMessage
                  );
                  expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenNthCalledWith(
                    3,
                    new Error(`Message sending error`),
                    anyDiscordMessage
                  );
                });

                it(`should not log about the success of the message sending`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                    new Error(`Message sending error`)
                  );

                  expect(loggerServiceLogSpy).not.toHaveBeenCalled();
                });
              });

              describe(`when the messages were successfully sent`, (): void => {
                beforeEach((): void => {
                  anyDiscordMessageChannelSendMock.mockResolvedValue(undefined);

                  anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
                    channel: {
                      send: anyDiscordMessageChannelSendMock,
                    },
                    guild: {
                      id: `dummy-guild-id`,
                    },
                    id: `dummy-id`,
                  });
                });

                it(`should log about the success of the messages sending`, async (): Promise<void> => {
                  expect.assertions(5);

                  const result = await service.handleChannelMessage(anyDiscordMessage);

                  expect(result).toStrictEqual([undefined, undefined, undefined]);
                  expect(loggerServiceLogSpy).toHaveBeenCalledTimes(3);
                  expect(loggerServiceLogSpy).toHaveBeenNthCalledWith(1, {
                    context: `DiscordMessageService`,
                    hasExtendedContext: true,
                    message: `context-[dummy-id] text-message sent`,
                  } as ILoggerLog);
                  expect(loggerServiceLogSpy).toHaveBeenNthCalledWith(2, {
                    context: `DiscordMessageService`,
                    hasExtendedContext: true,
                    message: `context-[dummy-id] text-message sent`,
                  } as ILoggerLog);
                  expect(loggerServiceLogSpy).toHaveBeenNthCalledWith(3, {
                    context: `DiscordMessageService`,
                    hasExtendedContext: true,
                    message: `context-[dummy-id] text-message sent`,
                  } as ILoggerLog);
                });

                describe(`when the "afterSending" callback exist`, (): void => {
                  let afterSendingMock: jest.Mock;

                  beforeEach((): void => {
                    afterSendingMock = jest.fn().mockResolvedValue(undefined);
                    discordMessageResponseA = createMock<IDiscordMessageResponse>({
                      afterSending: afterSendingMock,
                      content: `dummy-response-a`,
                      options: {},
                    });
                    discordMessageResponseB = createMock<IDiscordMessageResponse>({
                      afterSending: afterSendingMock,
                      content: `dummy-response-b`,
                      options: {},
                    });
                    discordMessageResponseC = createMock<IDiscordMessageResponse>({
                      afterSending: afterSendingMock,
                      content: `dummy-response-c`,
                      options: {},
                    });
                    discordMessageResponses = [
                      discordMessageResponseA,
                      discordMessageResponseB,
                      discordMessageResponseC,
                    ];
                    discordMessageTextServiceGetMessageSpy.mockResolvedValue(discordMessageResponses);
                  });

                  it(`should log about executing the callback`, async (): Promise<void> => {
                    expect.assertions(4);

                    await service.handleChannelMessage(anyDiscordMessage);

                    expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(10);
                    expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(5, {
                      context: `DiscordMessageService`,
                      hasExtendedContext: true,
                      message: `context-[dummy-id] text-executing callback value-afterSending...`,
                    } as ILoggerLog);
                    expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(6, {
                      context: `DiscordMessageService`,
                      hasExtendedContext: true,
                      message: `context-[dummy-id] text-executing callback value-afterSending...`,
                    } as ILoggerLog);
                    expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(7, {
                      context: `DiscordMessageService`,
                      hasExtendedContext: true,
                      message: `context-[dummy-id] text-executing callback value-afterSending...`,
                    } as ILoggerLog);
                  });

                  it(`should execute the after sending callback`, async (): Promise<void> => {
                    expect.assertions(1);

                    await service.handleChannelMessage(anyDiscordMessage);

                    expect(afterSendingMock).toHaveBeenCalledTimes(3);
                  });

                  it(`should log about successfully executed the callback`, async (): Promise<void> => {
                    expect.assertions(4);

                    await service.handleChannelMessage(anyDiscordMessage);

                    expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(10);
                    expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(8, {
                      context: `DiscordMessageService`,
                      hasExtendedContext: true,
                      message: `context-[dummy-id] text-callback value-afterSending executed`,
                    } as ILoggerLog);
                    expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(9, {
                      context: `DiscordMessageService`,
                      hasExtendedContext: true,
                      message: `context-[dummy-id] text-callback value-afterSending executed`,
                    } as ILoggerLog);
                    expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(10, {
                      context: `DiscordMessageService`,
                      hasExtendedContext: true,
                      message: `context-[dummy-id] text-callback value-afterSending executed`,
                    } as ILoggerLog);
                  });
                });

                it(`should not handle the error`, async (): Promise<void> => {
                  expect.assertions(2);

                  const result = await service.handleChannelMessage(anyDiscordMessage);

                  expect(result).toStrictEqual([undefined, undefined, undefined]);
                  expect(discordMessageErrorServiceHandleErrorSpy).not.toHaveBeenCalled();
                });
              });
            });
          });
        });
      });
    });

    describe(`when the given discord message is a DM message`, (): void => {
      beforeEach((): void => {
        discordChannelServiceIsDmSpy.mockReturnValue(true);
      });

      it(`should display one typing indicator`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(new Error(`getMessage error`));

        expect(discordChannelTypingServiceAddOneIndicatorSpy).toHaveBeenCalledTimes(1);
        expect(discordChannelTypingServiceAddOneIndicatorSpy).toHaveBeenCalledWith(anyDiscordMessage.channel);
      });

      it(`should add the author to the Firebase DM store`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(new Error(`getMessage error`));

        expect(discordDmFirebaseServiceAddDmToFirebaseSpy).toHaveBeenCalledTimes(1);
        expect(discordDmFirebaseServiceAddDmToFirebaseSpy).toHaveBeenCalledWith(anyDiscordMessage);
      });

      it(`should log about the DM message`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(new Error(`getMessage error`));

        expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
        expect(loggerServiceDebugSpy).toHaveBeenCalledWith({
          context: `DiscordMessageService`,
          hasExtendedContext: true,
          message: `context-[dummy-id] text-dm message`,
        } as ILoggerLog);
      });

      it(`should get a message response for the DM message`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(new Error(`getMessage error`));

        expect(discordMessageDmServiceGetMessageSpy).toHaveBeenCalledTimes(1);
        expect(discordMessageDmServiceGetMessageSpy).toHaveBeenCalledWith(anyDiscordMessage);
      });

      describe(`when an error occurred when getting a message response`, (): void => {
        beforeEach((): void => {
          discordMessageDmServiceGetMessageSpy.mockRejectedValue(new Error(`getMessage error`));
        });

        it(`should log about the fail to get a valid message response`, async (): Promise<void> => {
          expect.assertions(3);

          await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(new Error(`getMessage error`));

          expect(loggerServiceErrorSpy).toHaveBeenCalledTimes(1);
          expect(loggerServiceErrorSpy).toHaveBeenCalledWith({
            context: `DiscordMessageService`,
            hasExtendedContext: true,
            message: `context-[dummy-id] text-failed to get a valid message response`,
          } as ILoggerLog);
        });

        it(`should do nothing`, async (): Promise<void> => {
          expect.assertions(5);

          await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(new Error(`getMessage error`));

          expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
          expect(discordChannelServiceIsValidSpy).not.toHaveBeenCalled();
          expect(loggerServiceLogSpy).not.toHaveBeenCalled();
          expect(discordMessageErrorServiceHandleErrorSpy).not.toHaveBeenCalled();
        });
      });

      describe(`when getting a message response was successful`, (): void => {
        beforeEach((): void => {
          discordMessageDmServiceGetMessageSpy.mockResolvedValue(discordMessageResponse);
        });

        describe(`when the given Discord message channel is not valid`, (): void => {
          beforeEach((): void => {
            discordChannelServiceIsValidSpy.mockReturnValue(false);
          });

          it(`should do nothing`, async (): Promise<void> => {
            expect.assertions(4);

            await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
              new Error(`Discord message channel not valid`)
            );

            expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
            expect(loggerServiceLogSpy).not.toHaveBeenCalled();
            expect(discordMessageErrorServiceHandleErrorSpy).not.toHaveBeenCalled();
          });
        });

        describe(`when the given Discord message channel is valid`, (): void => {
          beforeEach((): void => {
            discordChannelServiceIsValidSpy.mockReturnValue(true);
          });

          it(`should log about sending a message`, async (): Promise<void> => {
            expect.assertions(3);

            await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
              new Error(`Fake test error: send`)
            );

            expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(2);
            expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(2, {
              context: `DiscordMessageService`,
              hasExtendedContext: true,
              message: `context-[dummy-id] text-sending message...`,
            } as ILoggerLog);
          });

          it(`should send the message response to the given Discord message channel`, async (): Promise<void> => {
            expect.assertions(3);

            await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
              new Error(`Fake test error: send`)
            );

            const message: string | MessagePayload | BaseMessageOptions = {
              content: `dummy-response`,
            };
            expect(anyDiscordMessageChannelSendMock).toHaveBeenCalledTimes(2);
            expect(anyDiscordMessageChannelSendMock).toHaveBeenCalledWith(message);
          });

          describe(`when the message was not successfully sent`, (): void => {
            beforeEach((): void => {
              anyDiscordMessageChannelSendMock.mockRejectedValue(new Error(`Message sending error`));

              anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
                channel: {
                  send: anyDiscordMessageChannelSendMock,
                },
                id: `dummy-id`,
              });
            });

            it(`should handle the error`, async (): Promise<void> => {
              expect.assertions(3);

              await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                new Error(`Message sending error`)
              );

              expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledTimes(1);
              expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledWith(
                new Error(`Message sending error`),
                anyDiscordMessage
              );
            });

            it(`should not log about the success of the message sending`, async (): Promise<void> => {
              expect.assertions(2);

              await expect(service.handleChannelMessage(anyDiscordMessage)).rejects.toThrow(
                new Error(`Message sending error`)
              );

              expect(loggerServiceLogSpy).not.toHaveBeenCalled();
            });
          });

          describe(`when the message was successfully sent`, (): void => {
            beforeEach((): void => {
              anyDiscordMessageChannelSendMock.mockResolvedValue(undefined);

              anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
                channel: {
                  send: anyDiscordMessageChannelSendMock,
                },
                id: `dummy-id`,
              });
            });

            it(`should log about the success of the message sending`, async (): Promise<void> => {
              expect.assertions(3);

              const result = await service.handleChannelMessage(anyDiscordMessage);

              expect(result).toBeUndefined();
              expect(loggerServiceLogSpy).toHaveBeenCalledTimes(1);
              expect(loggerServiceLogSpy).toHaveBeenCalledWith({
                context: `DiscordMessageService`,
                hasExtendedContext: true,
                message: `context-[dummy-id] text-message sent`,
              } as ILoggerLog);
            });

            describe(`when the "afterSending" callback exist`, (): void => {
              let afterSendingMock: jest.Mock;

              beforeEach((): void => {
                afterSendingMock = jest.fn().mockResolvedValue(undefined);
                discordMessageResponse = createHydratedMock<IDiscordMessageResponse>({
                  afterSending: afterSendingMock,
                  content: `dummy-response`,
                  options: {},
                });
                discordMessageDmServiceGetMessageSpy.mockResolvedValue(discordMessageResponse);
              });

              it(`should log about executing the callback`, async (): Promise<void> => {
                expect.assertions(2);

                await service.handleChannelMessage(anyDiscordMessage);

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(4);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(3, {
                  context: `DiscordMessageService`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-executing callback value-afterSending...`,
                } as ILoggerLog);
              });

              it(`should execute the after sending callback`, async (): Promise<void> => {
                expect.assertions(1);

                await service.handleChannelMessage(anyDiscordMessage);

                expect(afterSendingMock).toHaveBeenCalledTimes(1);
              });

              it(`should log about successfully executed the callback`, async (): Promise<void> => {
                expect.assertions(2);

                await service.handleChannelMessage(anyDiscordMessage);

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(4);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(4, {
                  context: `DiscordMessageService`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-callback value-afterSending executed`,
                } as ILoggerLog);
              });
            });

            it(`should not handle the error`, async (): Promise<void> => {
              expect.assertions(2);

              const result = await service.handleChannelMessage(anyDiscordMessage);

              expect(result).toBeUndefined();
              expect(discordMessageErrorServiceHandleErrorSpy).not.toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});
