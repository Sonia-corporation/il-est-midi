import { DiscordMessageCommandFeatureNoonEnabled } from './discord-message-command-feature-noon-enabled';
import { FirebaseDmVersionEnum } from '../../../../../../../../firebase/enums/dms/firebase-dm-version.enum';
import { FirebaseGuildVersionEnum } from '../../../../../../../../firebase/enums/guilds/firebase-guild-version.enum';
import { IFirebaseDmV1 } from '../../../../../../../../firebase/interfaces/dms/firebase-dm-v1';
import { IFirebaseGuildV1 } from '../../../../../../../../firebase/interfaces/guilds/firebase-guild-v1';
import { IFirebaseGuildV2 } from '../../../../../../../../firebase/interfaces/guilds/firebase-guild-v2';
import { FirebaseDmsFeaturesNoonEnabledService } from '../../../../../../../../firebase/services/dms/features/noon/firebase-dms-features-noon-enabled.service';
import { FirebaseGuildsChannelsFeaturesNoonEnabledService } from '../../../../../../../../firebase/services/guilds/channels/features/noon/firebase-guilds-channels-features-noon-enabled.service';
import { FirebaseDmsStoreService } from '../../../../../../../../firebase/stores/dms/services/firebase-dms-store.service';
import { FirebaseGuildsStoreService } from '../../../../../../../../firebase/stores/guilds/services/firebase-guilds-store.service';
import { IFirebaseDm } from '../../../../../../../../firebase/types/dms/firebase-dm';
import { IFirebaseDmVFinal } from '../../../../../../../../firebase/types/dms/firebase-dm-v-final';
import { IFirebaseGuildChannelVFinal } from '../../../../../../../../firebase/types/guilds/channels/firebase-guild-channel-v-final';
import { IFirebaseGuild } from '../../../../../../../../firebase/types/guilds/firebase-guild';
import { IFirebaseGuildVFinal } from '../../../../../../../../firebase/types/guilds/firebase-guild-v-final';
import { ILoggerLog } from '../../../../../../../../logger/interfaces/logger-log';
import { LoggerService } from '../../../../../../../../logger/services/logger.service';
import { DiscordChannelService } from '../../../../../../../channels/services/discord-channel.service';
import { IAnyDiscordChannel } from '../../../../../../../channels/types/any-discord-channel';
import { IDiscordCommandFlagSuccess } from '../../../../../../interfaces/commands/flags/discord-command-flag-success';
import { IAnyDiscordMessage } from '../../../../../../types/any-discord-message';
import { DiscordMessageErrorService } from '../../../../../helpers/discord-message-error.service';
import { DMChannel, Message, TextChannel } from 'discord.js';
import { WriteResult } from 'firebase-admin/firestore';
import { createHydratedMock, createMock } from 'ts-auto-mock';

jest.mock(`../../../../../../../../logger/services/chalk/chalk.service`);

/**
 * @description
 * There is a fucking weird thing going on here.
 * A memory leak occur with test like:
 * "expect(updateDatabaseSpy).toHaveBeenCalledWith(false, true, {});".
 * It crash Jest only for this method...
 */
describe(`DiscordMessageCommandFeatureNoonEnabled`, (): void => {
  let service: DiscordMessageCommandFeatureNoonEnabled<string>;
  let loggerService: LoggerService;
  let firebaseGuildsStoreService: FirebaseGuildsStoreService;
  let firebaseGuildsChannelsFeaturesNoonEnabledService: FirebaseGuildsChannelsFeaturesNoonEnabledService;
  let discordChannelService: DiscordChannelService;
  let discordMessageErrorService: DiscordMessageErrorService;
  let firebaseDmsStoreService: FirebaseDmsStoreService;
  let firebaseDmsFeaturesNoonEnabledService: FirebaseDmsFeaturesNoonEnabledService;

  beforeEach((): void => {
    loggerService = LoggerService.getInstance();
    firebaseGuildsStoreService = FirebaseGuildsStoreService.getInstance();
    firebaseGuildsChannelsFeaturesNoonEnabledService = FirebaseGuildsChannelsFeaturesNoonEnabledService.getInstance();
    discordChannelService = DiscordChannelService.getInstance();
    discordMessageErrorService = DiscordMessageErrorService.getInstance();
    firebaseDmsStoreService = FirebaseDmsStoreService.getInstance();
    firebaseDmsFeaturesNoonEnabledService = FirebaseDmsFeaturesNoonEnabledService.getInstance();
  });

  describe(`execute()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let value: string | null | undefined;

    let loggerServiceDebugSpy: jest.SpyInstance;
    let isEnabledForThisGuildSpy: jest.SpyInstance;
    let isEnabledForThisDmSpy: jest.SpyInstance;
    let updateDatabaseForThisGuildSpy: jest.SpyInstance;
    let updateDatabaseForThisDmSpy: jest.SpyInstance;
    let discordChannelServiceIsValidSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandFeatureNoonEnabled();
      anyDiscordMessage = createMock<IAnyDiscordMessage>({
        id: `dummy-id`,
      });
      value = undefined;

      loggerServiceDebugSpy = jest.spyOn(loggerService, `debug`).mockImplementation();
      isEnabledForThisGuildSpy = jest
        .spyOn(service, `isEnabledForThisGuild`)
        .mockRejectedValue(new Error(`isEnabledForThisGuild error`));
      isEnabledForThisDmSpy = jest
        .spyOn(service, `isEnabledForThisDm`)
        .mockRejectedValue(new Error(`isEnabledForThisDm error`));
      updateDatabaseForThisGuildSpy = jest
        .spyOn(service, `updateDatabaseForThisGuild`)
        .mockRejectedValue(new Error(`updateDatabaseForThisGuild error`));
      updateDatabaseForThisDmSpy = jest
        .spyOn(service, `updateDatabaseForThisDm`)
        .mockRejectedValue(new Error(`updateDatabaseForThisDm error`));
      discordChannelServiceIsValidSpy = jest.spyOn(discordChannelService, `isValid`).mockReturnValue(false);
    });

    it(`should log about executing the enabled action`, async (): Promise<void> => {
      expect.assertions(3);

      await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(new Error(`isEnabledForThisGuild error`));

      expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(2);
      expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(1, {
        context: `DiscordMessageCommandFeatureNoonEnabled`,
        hasExtendedContext: true,
        message: `context-[dummy-id] text-executing value-enabled action`,
      } as ILoggerLog);
    });

    it(`should log the new enabled value`, async (): Promise<void> => {
      expect.assertions(3);

      await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(new Error(`isEnabledForThisGuild error`));

      expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(2);
      expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(2, {
        context: `DiscordMessageCommandFeatureNoonEnabled`,
        hasExtendedContext: true,
        message: `context-[dummy-id] text-new state: value-true`,
      } as ILoggerLog);
    });

    it(`should get the current enabled state`, async (): Promise<void> => {
      expect.assertions(3);

      await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(new Error(`isEnabledForThisGuild error`));

      expect(isEnabledForThisGuildSpy).toHaveBeenCalledTimes(1);
      expect(isEnabledForThisGuildSpy).toHaveBeenCalledWith(anyDiscordMessage);
    });

    describe(`when the enabled state failed to be fetched`, (): void => {
      beforeEach((): void => {
        isEnabledForThisGuildSpy.mockRejectedValue(new Error(`isEnabledForThisGuild error`));
      });

      it(`should throw an error`, async (): Promise<void> => {
        expect.assertions(1);

        await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
          new Error(`isEnabledForThisGuild error`)
        );
      });
    });

    describe(`when the message comes from a DM`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createHydratedMock<DMChannel>({ type: ChannelType.DM }),
          id: `dummy-id`,
        });
      });

      describe(`when the enabled state was successfully fetched`, (): void => {
        beforeEach((): void => {
          isEnabledForThisDmSpy.mockResolvedValue(undefined);
        });

        describe(`when the Discord message author is not valid`, (): void => {
          beforeEach((): void => {
            anyDiscordMessage = createMock<IAnyDiscordMessage>({
              author: null,
              channel: createHydratedMock<DMChannel>({ type: ChannelType.DM }),
              id: `dummy-id`,
            });

            discordChannelServiceIsValidSpy.mockReturnValue(false);
          });

          it(`should not update the database to enable the noon feature`, async (): Promise<void> => {
            expect.assertions(2);

            await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
              new Error(`Firebase author invalid`)
            );

            expect(updateDatabaseForThisDmSpy).not.toHaveBeenCalled();
          });

          it(`should throw an error about the Firebase author being invalid`, async (): Promise<void> => {
            expect.assertions(1);

            await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
              new Error(`Firebase author invalid`)
            );
          });
        });

        describe(`when the Discord message author is valid`, (): void => {
          beforeEach((): void => {
            anyDiscordMessage = createMock<IAnyDiscordMessage>({
              author: {
                id: `dummy-author-id`,
              },
              channel: createHydratedMock<DMChannel>({ type: ChannelType.DM }),
              id: `dummy-id`,
            });
          });

          describe(`when the channel is not valid`, (): void => {
            beforeEach((): void => {
              discordChannelServiceIsValidSpy.mockReturnValue(false);
            });

            it(`should throw an error`, async (): Promise<void> => {
              expect.assertions(1);

              await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                new Error(`Firebase channel invalid`)
              );
            });
          });

          describe(`when the channel is valid`, (): void => {
            beforeEach((): void => {
              discordChannelServiceIsValidSpy.mockReturnValue(true);
            });

            describe(`when the current noon feature is not configured`, (): void => {
              beforeEach((): void => {
                isEnabledForThisDmSpy.mockResolvedValue(undefined);
              });

              it(`should log the current state`, async (): Promise<void> => {
                expect.assertions(3);

                await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                  new Error(`updateDatabaseForThisDm error`)
                );

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(3);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(3, {
                  context: `DiscordMessageCommandFeatureNoonEnabled`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-current state: value-undefined`,
                } as ILoggerLog);
              });

              describe(`when the flag value is "true"`, (): void => {
                beforeEach((): void => {
                  value = `true`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "TRUE"`, (): void => {
                beforeEach((): void => {
                  value = `TRUE`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "false"`, (): void => {
                beforeEach((): void => {
                  value = `false`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "FALSE"`, (): void => {
                beforeEach((): void => {
                  value = `FALSE`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is null`, (): void => {
                beforeEach((): void => {
                  value = null;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is undefined`, (): void => {
                beforeEach((): void => {
                  value = undefined;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });
            });

            describe(`when the current noon feature is enabled`, (): void => {
              beforeEach((): void => {
                isEnabledForThisDmSpy.mockResolvedValue(true);
              });

              it(`should log the current state`, async (): Promise<void> => {
                expect.assertions(3);

                await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                  new Error(`updateDatabaseForThisDm error`)
                );

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(3);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(3, {
                  context: `DiscordMessageCommandFeatureNoonEnabled`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-current state: value-true`,
                } as ILoggerLog);
              });

              describe(`when the flag value is "true"`, (): void => {
                beforeEach((): void => {
                  value = `true`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "TRUE"`, (): void => {
                beforeEach((): void => {
                  value = `TRUE`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "false"`, (): void => {
                beforeEach((): void => {
                  value = `false`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "FALSE"`, (): void => {
                beforeEach((): void => {
                  value = `FALSE`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is null`, (): void => {
                beforeEach((): void => {
                  value = null;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is undefined`, (): void => {
                beforeEach((): void => {
                  value = undefined;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });
            });

            describe(`when the current noon feature is disabled`, (): void => {
              beforeEach((): void => {
                isEnabledForThisDmSpy.mockResolvedValue(false);
              });

              it(`should log the current state`, async (): Promise<void> => {
                expect.assertions(3);

                await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                  new Error(`updateDatabaseForThisDm error`)
                );

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(3);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(3, {
                  context: `DiscordMessageCommandFeatureNoonEnabled`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-current state: value-false`,
                } as ILoggerLog);
              });

              describe(`when the flag value is "true"`, (): void => {
                beforeEach((): void => {
                  value = `true`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "TRUE"`, (): void => {
                beforeEach((): void => {
                  value = `TRUE`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "false"`, (): void => {
                beforeEach((): void => {
                  value = `false`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "FALSE"`, (): void => {
                beforeEach((): void => {
                  value = `FALSE`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is null`, (): void => {
                beforeEach((): void => {
                  value = null;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is undefined`, (): void => {
                beforeEach((): void => {
                  value = undefined;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisDm error`)
                  );

                  expect(updateDatabaseForThisDmSpy).toHaveBeenCalledTimes(1);
                });
              });
            });
          });
        });
      });
    });

    describe(`when the message does not come from a DM`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
          channel: createHydratedMock<TextChannel>({ type: ChannelType.GuildText }),
          id: `dummy-id`,
        });
      });

      describe(`when the enabled state was successfully fetched`, (): void => {
        beforeEach((): void => {
          isEnabledForThisGuildSpy.mockResolvedValue(undefined);
        });

        describe(`when the Discord message guild is not valid`, (): void => {
          beforeEach((): void => {
            anyDiscordMessage = createMock<IAnyDiscordMessage>({
              channel: createHydratedMock<TextChannel>({ type: ChannelType.GuildText }),
              guild: null,
              id: `dummy-id`,
            });

            discordChannelServiceIsValidSpy.mockReturnValue(false);
          });

          it(`should not update the database to enable the noon feature`, async (): Promise<void> => {
            expect.assertions(2);

            await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
              new Error(`Firebase guild invalid`)
            );

            expect(updateDatabaseForThisGuildSpy).not.toHaveBeenCalled();
          });

          it(`should throw an error about the Firebase guild being invalid`, async (): Promise<void> => {
            expect.assertions(1);

            await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
              new Error(`Firebase guild invalid`)
            );
          });
        });

        describe(`when the Discord message guild is valid`, (): void => {
          beforeEach((): void => {
            anyDiscordMessage = createMock<IAnyDiscordMessage>({
              channel: {
                id: `dummy-channel-id`,
                type: `GUILD_TEXT`,
              },
              guild: {
                id: `dummy-guild-id`,
              },
              id: `dummy-id`,
            });
          });

          describe(`when the channel is not valid`, (): void => {
            beforeEach((): void => {
              discordChannelServiceIsValidSpy.mockReturnValue(false);
            });

            it(`should throw an error`, async (): Promise<void> => {
              expect.assertions(1);

              await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                new Error(`Firebase channel invalid`)
              );
            });
          });

          describe(`when the channel is valid`, (): void => {
            beforeEach((): void => {
              discordChannelServiceIsValidSpy.mockReturnValue(true);
            });

            describe(`when the current noon feature is not configured`, (): void => {
              beforeEach((): void => {
                isEnabledForThisGuildSpy.mockResolvedValue(undefined);
              });

              it(`should log the current state`, async (): Promise<void> => {
                expect.assertions(3);

                await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                  new Error(`updateDatabaseForThisGuild error`)
                );

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(3);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(3, {
                  context: `DiscordMessageCommandFeatureNoonEnabled`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-current state: value-undefined`,
                } as ILoggerLog);
              });

              describe(`when the flag value is "true"`, (): void => {
                beforeEach((): void => {
                  value = `true`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "TRUE"`, (): void => {
                beforeEach((): void => {
                  value = `TRUE`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "false"`, (): void => {
                beforeEach((): void => {
                  value = `false`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "FALSE"`, (): void => {
                beforeEach((): void => {
                  value = `FALSE`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is null`, (): void => {
                beforeEach((): void => {
                  value = null;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is undefined`, (): void => {
                beforeEach((): void => {
                  value = undefined;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });
            });

            describe(`when the current noon feature is enabled`, (): void => {
              beforeEach((): void => {
                isEnabledForThisGuildSpy.mockResolvedValue(true);
              });

              it(`should log the current state`, async (): Promise<void> => {
                expect.assertions(3);

                await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                  new Error(`updateDatabaseForThisGuild error`)
                );

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(3);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(3, {
                  context: `DiscordMessageCommandFeatureNoonEnabled`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-current state: value-true`,
                } as ILoggerLog);
              });

              describe(`when the flag value is "true"`, (): void => {
                beforeEach((): void => {
                  value = `true`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "TRUE"`, (): void => {
                beforeEach((): void => {
                  value = `TRUE`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "false"`, (): void => {
                beforeEach((): void => {
                  value = `false`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "FALSE"`, (): void => {
                beforeEach((): void => {
                  value = `FALSE`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is null`, (): void => {
                beforeEach((): void => {
                  value = null;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is undefined`, (): void => {
                beforeEach((): void => {
                  value = undefined;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });
            });

            describe(`when the current noon feature is disabled`, (): void => {
              beforeEach((): void => {
                isEnabledForThisGuildSpy.mockResolvedValue(false);
              });

              it(`should log the current state`, async (): Promise<void> => {
                expect.assertions(3);

                await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                  new Error(`updateDatabaseForThisGuild error`)
                );

                expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(3);
                expect(loggerServiceDebugSpy).toHaveBeenNthCalledWith(3, {
                  context: `DiscordMessageCommandFeatureNoonEnabled`,
                  hasExtendedContext: true,
                  message: `context-[dummy-id] text-current state: value-false`,
                } as ILoggerLog);
              });

              describe(`when the flag value is "true"`, (): void => {
                beforeEach((): void => {
                  value = `true`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "TRUE"`, (): void => {
                beforeEach((): void => {
                  value = `TRUE`;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "false"`, (): void => {
                beforeEach((): void => {
                  value = `false`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is "FALSE"`, (): void => {
                beforeEach((): void => {
                  value = `FALSE`;
                });

                it(`should update the database to disable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is null`, (): void => {
                beforeEach((): void => {
                  value = null;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });

              describe(`when the flag value is undefined`, (): void => {
                beforeEach((): void => {
                  value = undefined;
                });

                it(`should update the database to enable the noon feature`, async (): Promise<void> => {
                  expect.assertions(2);

                  await expect(service.execute(anyDiscordMessage, value)).rejects.toThrow(
                    new Error(`updateDatabaseForThisGuild error`)
                  );

                  expect(updateDatabaseForThisGuildSpy).toHaveBeenCalledTimes(1);
                });
              });
            });
          });
        });
      });
    });
  });

  describe(`isEnabledForThisDm()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let firebaseDm: IFirebaseDm;

    let firebaseDmsStoreQueryGetEntitySpy: jest.SpyInstance;
    let discordMessageErrorServiceHandleErrorSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandFeatureNoonEnabled();
      anyDiscordMessage = createMock<IAnyDiscordMessage>();
      firebaseDm = createMock<IFirebaseDm>();

      firebaseDmsStoreQueryGetEntitySpy = jest.spyOn(firebaseDmsStoreService, `getEntity`).mockReturnValue(undefined);
      discordMessageErrorServiceHandleErrorSpy = jest
        .spyOn(discordMessageErrorService, `handleError`)
        .mockImplementation();
    });

    describe(`when the given Discord message author is null`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createMock<IAnyDiscordMessage>({
          author: null,
          id: `dummy-id`,
        });
      });

      it(`should handle the error about the empty author`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.isEnabledForThisDm(anyDiscordMessage)).rejects.toThrow(
          new Error(`Could not get the author from the message`)
        );

        expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledTimes(1);
        expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledWith(
          new Error(`Could not get the author from the message`),
          anyDiscordMessage,
          `could not get the author from the message`
        );
      });

      it(`should throw an error`, async (): Promise<void> => {
        expect.assertions(1);

        await expect(service.isEnabledForThisDm(anyDiscordMessage)).rejects.toThrow(
          new Error(`Could not get the author from the message`)
        );
      });
    });

    describe(`when the given Discord message author is valid`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createMock<Message>({
          author: {
            id: `dummy-author-id`,
          },
          channel: {
            id: `dummy-channel-id`,
          },
          id: `dummy-id`,
        });
      });

      it(`should get the Discord message DM from the Firebase DMs store`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.isEnabledForThisDm(anyDiscordMessage)).rejects.toThrow(
          new Error(`Could not find the DM <@!dummy-author-id> in Firebase`)
        );

        expect(firebaseDmsStoreQueryGetEntitySpy).toHaveBeenCalledTimes(1);
        expect(firebaseDmsStoreQueryGetEntitySpy).toHaveBeenCalledWith(`dummy-author-id`);
      });

      describe(`when the given Discord message DM does not exist in the Firebase DMs store`, (): void => {
        beforeEach((): void => {
          firebaseDmsStoreQueryGetEntitySpy.mockReturnValue(undefined);
        });

        it(`should handle the error about the empty DM in Firebase`, async (): Promise<void> => {
          expect.assertions(3);

          await expect(service.isEnabledForThisDm(anyDiscordMessage)).rejects.toThrow(
            new Error(`Could not find the DM <@!dummy-author-id> in Firebase`)
          );

          expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledTimes(1);
          expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledWith(
            new Error(`Could not find the DM <@!dummy-author-id> in Firebase`),
            anyDiscordMessage,
            `could not find the DM value-dummy-author-id in Firebase`
          );
        });

        it(`should throw an error`, async (): Promise<void> => {
          expect.assertions(1);

          await expect(service.isEnabledForThisDm(anyDiscordMessage)).rejects.toThrow(
            new Error(`Could not find the DM <@!dummy-author-id> in Firebase`)
          );
        });
      });

      describe(`when the given Discord message DM exist in the Firebase DMs store`, (): void => {
        beforeEach((): void => {
          firebaseDmsStoreQueryGetEntitySpy.mockReturnValue(firebaseDm);
        });

        describe(`when the Firebase DMs are v1`, (): void => {
          beforeEach((): void => {
            firebaseDm = createMock<IFirebaseDmV1>({
              version: FirebaseDmVersionEnum.V1,
            });

            firebaseDmsStoreQueryGetEntitySpy.mockReturnValue(firebaseDm);
          });

          it(`should return undefined`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.isEnabledForThisDm(anyDiscordMessage);

            expect(result).toBeUndefined();
          });
        });

        describe(`when the given Discord message DM does not exist in the Firebase DMs store`, (): void => {
          beforeEach((): void => {
            firebaseDm = createMock<IFirebaseDmVFinal>({
              id: `bad-dummy-dm-id`,
              version: FirebaseDmVersionEnum.V1,
            });

            firebaseDmsStoreQueryGetEntitySpy.mockReturnValue(firebaseDm);
          });

          it(`should return undefined`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.isEnabledForThisDm(anyDiscordMessage);

            expect(result).toBeUndefined();
          });
        });

        describe(`when the given Discord message DM exist in the Firebase DMs store`, (): void => {
          beforeEach((): void => {
            firebaseDm = createMock<IFirebaseDmVFinal>({
              id: `dummy-dm-id`,

              version: FirebaseDmVersionEnum.V1,
            });

            firebaseDmsStoreQueryGetEntitySpy.mockReturnValue(firebaseDm);
          });

          describe(`when the DM does not have the noon feature configured yet`, (): void => {
            beforeEach((): void => {
              firebaseDm = createMock<IFirebaseDmVFinal>({
                features: {
                  noon: undefined,
                },
                id: `dummy-dm-id`,
                version: FirebaseDmVersionEnum.V1,
              });

              firebaseDmsStoreQueryGetEntitySpy.mockReturnValue(firebaseDm);
            });

            it(`should return undefined`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.isEnabledForThisDm(anyDiscordMessage);

              expect(result).toBeUndefined();
            });
          });

          describe(`when the DM does not have the noon feature enabled option configured yet`, (): void => {
            beforeEach((): void => {
              firebaseDm = createMock<IFirebaseDmVFinal>({
                features: {
                  noon: {
                    isEnabled: undefined,
                  },
                },
                id: `dummy-dm-id`,
                version: FirebaseDmVersionEnum.V1,
              });

              firebaseDmsStoreQueryGetEntitySpy.mockReturnValue(firebaseDm);
            });

            it(`should return undefined`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.isEnabledForThisDm(anyDiscordMessage);

              expect(result).toBeUndefined();
            });
          });

          describe(`when the DM has the noon feature enabled`, (): void => {
            beforeEach((): void => {
              firebaseDm = createMock<IFirebaseDmVFinal>({
                features: {
                  noon: {
                    isEnabled: true,
                  },
                },
                id: `dummy-dm-id`,
                version: FirebaseDmVersionEnum.V1,
              });

              firebaseDmsStoreQueryGetEntitySpy.mockReturnValue(firebaseDm);
            });

            it(`should return true`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.isEnabledForThisDm(anyDiscordMessage);

              expect(result).toBe(true);
            });
          });

          describe(`when the DM has the noon feature disabled`, (): void => {
            beforeEach((): void => {
              firebaseDm = createMock<IFirebaseDmVFinal>({
                features: {
                  noon: {
                    isEnabled: false,
                  },
                },
                id: `dummy-dm-id`,
                version: FirebaseDmVersionEnum.V1,
              });

              firebaseDmsStoreQueryGetEntitySpy.mockReturnValue(firebaseDm);
            });

            it(`should return false`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.isEnabledForThisDm(anyDiscordMessage);

              expect(result).toBe(false);
            });
          });
        });
      });
    });
  });

  describe(`isEnabledForThisGuild()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let firebaseGuild: IFirebaseGuild;

    let firebaseGuildsStoreQueryGetEntitySpy: jest.SpyInstance;
    let discordMessageErrorServiceHandleErrorSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandFeatureNoonEnabled();
      anyDiscordMessage = createMock<IAnyDiscordMessage>();
      firebaseGuild = createMock<IFirebaseGuild>();

      firebaseGuildsStoreQueryGetEntitySpy = jest
        .spyOn(firebaseGuildsStoreService, `getEntity`)
        .mockReturnValue(undefined);
      discordMessageErrorServiceHandleErrorSpy = jest
        .spyOn(discordMessageErrorService, `handleError`)
        .mockImplementation();
    });

    describe(`when the given Discord message guild is null`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createMock<IAnyDiscordMessage>({
          guild: null,
          id: `dummy-id`,
        });
      });

      it(`should handle the error about the empty guild`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.isEnabledForThisGuild(anyDiscordMessage)).rejects.toThrow(
          new Error(`Could not get the guild from the message`)
        );

        expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledTimes(1);
        expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledWith(
          new Error(`Could not get the guild from the message`),
          anyDiscordMessage,
          `could not get the guild from the message`
        );
      });

      it(`should throw an error`, async (): Promise<void> => {
        expect.assertions(1);

        await expect(service.isEnabledForThisGuild(anyDiscordMessage)).rejects.toThrow(
          new Error(`Could not get the guild from the message`)
        );
      });
    });

    describe(`when the given Discord message guild is valid`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage = createMock<Message>({
          channel: {
            id: `dummy-channel-id`,
          },
          guild: {
            id: `dummy-guild-id`,
          },
          id: `dummy-id`,
        });
      });

      it(`should get the Discord message guild from the Firebase guilds store`, async (): Promise<void> => {
        expect.assertions(3);

        await expect(service.isEnabledForThisGuild(anyDiscordMessage)).rejects.toThrow(
          new Error(`Could not find the guild dummy-guild-id in Firebase`)
        );

        expect(firebaseGuildsStoreQueryGetEntitySpy).toHaveBeenCalledTimes(1);
        expect(firebaseGuildsStoreQueryGetEntitySpy).toHaveBeenCalledWith(`dummy-guild-id`);
      });

      describe(`when the given Discord message guild does not exist in the Firebase guilds store`, (): void => {
        beforeEach((): void => {
          firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(undefined);
        });

        it(`should handle the error about the empty guild in Firebase`, async (): Promise<void> => {
          expect.assertions(3);

          await expect(service.isEnabledForThisGuild(anyDiscordMessage)).rejects.toThrow(
            new Error(`Could not find the guild dummy-guild-id in Firebase`)
          );

          expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledTimes(1);
          expect(discordMessageErrorServiceHandleErrorSpy).toHaveBeenCalledWith(
            new Error(`Could not find the guild dummy-guild-id in Firebase`),
            anyDiscordMessage,
            `could not find the guild value-dummy-guild-id in Firebase`
          );
        });

        it(`should throw an error`, async (): Promise<void> => {
          expect.assertions(1);

          await expect(service.isEnabledForThisGuild(anyDiscordMessage)).rejects.toThrow(
            new Error(`Could not find the guild dummy-guild-id in Firebase`)
          );
        });
      });

      describe(`when the given Discord message guild exist in the Firebase guilds store`, (): void => {
        beforeEach((): void => {
          firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(firebaseGuild);
        });

        describe(`when the Firebase guilds store channels are empty`, (): void => {
          beforeEach((): void => {
            firebaseGuild = createMock<IFirebaseGuildVFinal>({
              channels: {},
              version: FirebaseGuildVersionEnum.V5,
            });

            firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(firebaseGuild);
          });

          it(`should return undefined`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.isEnabledForThisGuild(anyDiscordMessage);

            expect(result).toBeUndefined();
          });
        });

        describe(`when the Firebase guilds are v1`, (): void => {
          beforeEach((): void => {
            firebaseGuild = createMock<IFirebaseGuildV1>({
              version: FirebaseGuildVersionEnum.V1,
            });

            firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(firebaseGuild);
          });

          it(`should return undefined`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.isEnabledForThisGuild(anyDiscordMessage);

            expect(result).toBeUndefined();
          });
        });

        describe(`when the Firebase guilds are v2`, (): void => {
          beforeEach((): void => {
            firebaseGuild = createMock<IFirebaseGuildV2>({
              version: FirebaseGuildVersionEnum.V2,
            });

            firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(firebaseGuild);
          });

          it(`should return undefined`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.isEnabledForThisGuild(anyDiscordMessage);

            expect(result).toBeUndefined();
          });
        });

        describe(`when the given Discord message channel does not exist in the Firebase guilds store channels`, (): void => {
          beforeEach((): void => {
            firebaseGuild = createMock<IFirebaseGuildVFinal>({
              channels: {
                'bad-dummy-channel-id': createMock<IFirebaseGuildChannelVFinal>({
                  id: `bad-dummy-channel-id`,
                }),
              },
              version: FirebaseGuildVersionEnum.V5,
            });

            firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(firebaseGuild);
          });

          it(`should return undefined`, async (): Promise<void> => {
            expect.assertions(1);

            const result = await service.isEnabledForThisGuild(anyDiscordMessage);

            expect(result).toBeUndefined();
          });
        });

        describe(`when the given Discord message channel exist in the Firebase guilds store channels`, (): void => {
          beforeEach((): void => {
            firebaseGuild = createMock<IFirebaseGuildVFinal>({
              channels: {
                'dummy-channel-id': createMock<IFirebaseGuildChannelVFinal>({
                  id: `dummy-channel-id`,
                }),
              },
              version: FirebaseGuildVersionEnum.V5,
            });

            firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(firebaseGuild);
          });

          describe(`when the channel does not have the noon feature configured yet`, (): void => {
            beforeEach((): void => {
              firebaseGuild = createMock<IFirebaseGuildVFinal>({
                channels: {
                  'dummy-channel-id': createMock<IFirebaseGuildChannelVFinal>({
                    features: {
                      noon: undefined,
                    },
                    id: `dummy-channel-id`,
                  }),
                },
                version: FirebaseGuildVersionEnum.V5,
              });

              firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(firebaseGuild);
            });

            it(`should return undefined`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.isEnabledForThisGuild(anyDiscordMessage);

              expect(result).toBeUndefined();
            });
          });

          describe(`when the channel does not have the noon feature enabled option configured yet`, (): void => {
            beforeEach((): void => {
              firebaseGuild = createMock<IFirebaseGuildVFinal>({
                channels: {
                  'dummy-channel-id': createMock<IFirebaseGuildChannelVFinal>({
                    features: {
                      noon: {
                        isEnabled: undefined,
                      },
                    },
                    id: `dummy-channel-id`,
                  }),
                },
                version: FirebaseGuildVersionEnum.V5,
              });

              firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(firebaseGuild);
            });

            it(`should return undefined`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.isEnabledForThisGuild(anyDiscordMessage);

              expect(result).toBeUndefined();
            });
          });

          describe(`when the channel has the noon feature enabled`, (): void => {
            beforeEach((): void => {
              firebaseGuild = createMock<IFirebaseGuildVFinal>({
                channels: {
                  'dummy-channel-id': createMock<IFirebaseGuildChannelVFinal>({
                    features: {
                      noon: {
                        isEnabled: true,
                      },
                    },
                    id: `dummy-channel-id`,
                  }),
                },
                version: FirebaseGuildVersionEnum.V5,
              });

              firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(firebaseGuild);
            });

            it(`should return true`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.isEnabledForThisGuild(anyDiscordMessage);

              expect(result).toBe(true);
            });
          });

          describe(`when the channel has the noon feature disabled`, (): void => {
            beforeEach((): void => {
              firebaseGuild = createMock<IFirebaseGuildVFinal>({
                channels: {
                  'dummy-channel-id': createMock<IFirebaseGuildChannelVFinal>({
                    features: {
                      noon: {
                        isEnabled: false,
                      },
                    },
                    id: `dummy-channel-id`,
                  }),
                },
                version: FirebaseGuildVersionEnum.V5,
              });

              firebaseGuildsStoreQueryGetEntitySpy.mockReturnValue(firebaseGuild);
            });

            it(`should return false`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.isEnabledForThisGuild(anyDiscordMessage);

              expect(result).toBe(false);
            });
          });
        });
      });
    });
  });

  describe(`updateDatabaseForThisDm()`, (): void => {
    let shouldEnable: boolean;
    let isEnabled: boolean | undefined;
    let firebaseDm: IFirebaseDm;
    let writeResult: WriteResult;
    let anyDiscordMessage: IAnyDiscordMessage;

    let firebaseDmsFeaturesNoonEnabledServiceUpdateStateByDmIdSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandFeatureNoonEnabled();
      shouldEnable = false;
      isEnabled = undefined;
      firebaseDm = createMock<IFirebaseDm>();
      writeResult = createMock<WriteResult>();
      anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
        channel: createHydratedMock<DMChannel>({ type: ChannelType.DM }),
      });

      firebaseDmsFeaturesNoonEnabledServiceUpdateStateByDmIdSpy = jest
        .spyOn(firebaseDmsFeaturesNoonEnabledService, `updateStateByDmId`)
        .mockRejectedValue(new Error(`updateStateByDmId error`));
    });

    describe(`when the given Firebase DM ID is undefined`, (): void => {
      beforeEach((): void => {
        firebaseDm.id = undefined;
      });

      it(`should not update the enable state for the feature command in the Firebase DMs`, async (): Promise<void> => {
        expect.assertions(2);

        await expect(
          service.updateDatabaseForThisDm(shouldEnable, isEnabled, firebaseDm, anyDiscordMessage)
        ).rejects.toThrow(new Error(`Firebase DM ID invalid`));

        expect(firebaseDmsFeaturesNoonEnabledServiceUpdateStateByDmIdSpy).not.toHaveBeenCalled();
      });

      it(`should throw an error about the Firebase DM ID being invalid`, async (): Promise<void> => {
        expect.assertions(1);

        await expect(
          service.updateDatabaseForThisDm(shouldEnable, isEnabled, firebaseDm, anyDiscordMessage)
        ).rejects.toThrow(new Error(`Firebase DM ID invalid`));
      });
    });

    describe(`when the given Firebase DM ID is valid`, (): void => {
      beforeEach((): void => {
        firebaseDm.id = `dummy-id`;
      });

      describe(`when the new state is not enabled`, (): void => {
        beforeEach((): void => {
          shouldEnable = false;
        });

        it(`should update the enable state to not enabled for the feature command in the Firebase DMs`, async (): Promise<void> => {
          expect.assertions(3);

          await expect(
            service.updateDatabaseForThisDm(shouldEnable, isEnabled, firebaseDm, anyDiscordMessage)
          ).rejects.toThrow(new Error(`updateStateByDmId error`));

          expect(firebaseDmsFeaturesNoonEnabledServiceUpdateStateByDmIdSpy).toHaveBeenCalledTimes(1);
          expect(firebaseDmsFeaturesNoonEnabledServiceUpdateStateByDmIdSpy).toHaveBeenCalledWith(`dummy-id`, false);
        });
      });

      describe(`when the new state is enabled`, (): void => {
        beforeEach((): void => {
          shouldEnable = true;
        });

        it(`should update the enable state to enabled for the feature command in the Firebase DMs`, async (): Promise<void> => {
          expect.assertions(3);

          await expect(
            service.updateDatabaseForThisDm(shouldEnable, isEnabled, firebaseDm, anyDiscordMessage)
          ).rejects.toThrow(new Error(`updateStateByDmId error`));

          expect(firebaseDmsFeaturesNoonEnabledServiceUpdateStateByDmIdSpy).toHaveBeenCalledTimes(1);
          expect(firebaseDmsFeaturesNoonEnabledServiceUpdateStateByDmIdSpy).toHaveBeenCalledWith(`dummy-id`, true);
        });
      });

      describe(`when the enable state for the feature command in the Firebase DMs was not successfully updated`, (): void => {
        beforeEach((): void => {
          firebaseDmsFeaturesNoonEnabledServiceUpdateStateByDmIdSpy.mockRejectedValue(
            new Error(`updateStateByDmId error`)
          );
        });

        it(`should throw an error about the enable state for the feature command in the Firebase DMs not being successfully updated`, async (): Promise<void> => {
          expect.assertions(1);

          await expect(
            service.updateDatabaseForThisDm(shouldEnable, isEnabled, firebaseDm, anyDiscordMessage)
          ).rejects.toThrow(new Error(`updateStateByDmId error`));
        });
      });

      describe(`when the enable state for the feature command in the Firebase DMs was successfully updated`, (): void => {
        beforeEach((): void => {
          firebaseDmsFeaturesNoonEnabledServiceUpdateStateByDmIdSpy.mockResolvedValue(writeResult);
        });

        describe(`when the current noon feature is not configured`, (): void => {
          beforeEach((): void => {
            isEnabled = undefined;
          });

          describe(`when the new state is enable`, (): void => {
            beforeEach((): void => {
              shouldEnable = true;
            });

            it(`should return a flag success about the noon feature not configured yet but enabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisDm(
                shouldEnable,
                isEnabled,
                firebaseDm,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature was not configured yet and is now enabled on this private message. A message will be sent each day at noon (12 A.M) on Paris timezone.`,
                name: `Noon feature enabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });

          describe(`when the new state is disable`, (): void => {
            beforeEach((): void => {
              shouldEnable = false;
            });

            it(`should return a flag success about the noon feature not configured yet but disabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisDm(
                shouldEnable,
                isEnabled,
                firebaseDm,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature was not configured yet and is now disabled on this private message.`,
                name: `Noon feature disabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });
        });

        describe(`when the current noon feature is enabled`, (): void => {
          beforeEach((): void => {
            isEnabled = true;
          });

          describe(`when the new state is enable`, (): void => {
            beforeEach((): void => {
              shouldEnable = true;
            });

            it(`should return a flag success about the noon feature being already enabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisDm(
                shouldEnable,
                isEnabled,
                firebaseDm,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature was already enabled on this private message. A message will be sent each day at noon (12 A.M) on Paris timezone.`,
                name: `Noon feature enabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });

          describe(`when the new state is disable`, (): void => {
            beforeEach((): void => {
              shouldEnable = false;
            });

            it(`should return a flag success about the noon feature being enabled but now disabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisDm(
                shouldEnable,
                isEnabled,
                firebaseDm,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature is now disabled on this private message.`,
                name: `Noon feature disabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });
        });

        describe(`when the current noon feature is disabled`, (): void => {
          beforeEach((): void => {
            isEnabled = false;
          });

          describe(`when the new state is enable`, (): void => {
            beforeEach((): void => {
              shouldEnable = true;
            });

            it(`should return a flag success about the noon feature being disabled but now enabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisDm(
                shouldEnable,
                isEnabled,
                firebaseDm,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature is now enabled on this private message. A message will be sent each day at noon (12 A.M) on Paris timezone.`,
                name: `Noon feature enabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });

          describe(`when the new state is disable`, (): void => {
            beforeEach((): void => {
              isEnabled = false;
            });

            it(`should return a flag success about the noon feature being already disabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisDm(
                shouldEnable,
                isEnabled,
                firebaseDm,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature was already disabled on this private message.`,
                name: `Noon feature disabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });
        });
      });
    });
  });

  describe(`updateDatabaseForThisGuild()`, (): void => {
    let shouldEnable: boolean;
    let isEnabled: boolean | undefined;
    let firebaseGuild: IFirebaseGuild;
    let channel: IAnyDiscordChannel;
    let writeResult: WriteResult;
    let anyDiscordMessage: IAnyDiscordMessage;

    let firebaseGuildsChannelsFeaturesNoonEnabledServiceUpdateStateByGuildIdSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandFeatureNoonEnabled();
      shouldEnable = false;
      isEnabled = undefined;
      firebaseGuild = createMock<IFirebaseGuild>();
      channel = createMock<IAnyDiscordChannel>({
        id: `dummy-channel-id`,
      });
      writeResult = createMock<WriteResult>();
      anyDiscordMessage = createHydratedMock<IAnyDiscordMessage>({
        channel: createHydratedMock<TextChannel>({ type: ChannelType.GuildText }),
      });

      firebaseGuildsChannelsFeaturesNoonEnabledServiceUpdateStateByGuildIdSpy = jest
        .spyOn(firebaseGuildsChannelsFeaturesNoonEnabledService, `updateStateByGuildId`)
        .mockRejectedValue(new Error(`updateStateByGuildId error`));
    });

    describe(`when the given Firebase guild id is undefined`, (): void => {
      beforeEach((): void => {
        firebaseGuild.id = undefined;
      });

      it(`should not update the enable state for the feature command in the Firebase guilds`, async (): Promise<void> => {
        expect.assertions(2);

        await expect(
          service.updateDatabaseForThisGuild(shouldEnable, isEnabled, firebaseGuild, channel, anyDiscordMessage)
        ).rejects.toThrow(new Error(`Firebase guild id invalid`));

        expect(firebaseGuildsChannelsFeaturesNoonEnabledServiceUpdateStateByGuildIdSpy).not.toHaveBeenCalled();
      });

      it(`should throw an error about the Firebase guild id being invalid`, async (): Promise<void> => {
        expect.assertions(1);

        await expect(
          service.updateDatabaseForThisGuild(shouldEnable, isEnabled, firebaseGuild, channel, anyDiscordMessage)
        ).rejects.toThrow(new Error(`Firebase guild id invalid`));
      });
    });

    describe(`when the given Firebase guild id is valid`, (): void => {
      beforeEach((): void => {
        firebaseGuild.id = `dummy-id`;
      });

      describe(`when the new state is not enabled`, (): void => {
        beforeEach((): void => {
          shouldEnable = false;
        });

        it(`should update the enable state to not enabled for the feature command in the Firebase guilds`, async (): Promise<void> => {
          expect.assertions(3);

          await expect(
            service.updateDatabaseForThisGuild(shouldEnable, isEnabled, firebaseGuild, channel, anyDiscordMessage)
          ).rejects.toThrow(new Error(`updateStateByGuildId error`));

          expect(firebaseGuildsChannelsFeaturesNoonEnabledServiceUpdateStateByGuildIdSpy).toHaveBeenCalledTimes(1);
          expect(firebaseGuildsChannelsFeaturesNoonEnabledServiceUpdateStateByGuildIdSpy).toHaveBeenCalledWith(
            `dummy-id`,
            `dummy-channel-id`,
            false
          );
        });
      });

      describe(`when the new state is enabled`, (): void => {
        beforeEach((): void => {
          shouldEnable = true;
        });

        it(`should update the enable state to enabled for the feature command in the Firebase guilds`, async (): Promise<void> => {
          expect.assertions(3);

          await expect(
            service.updateDatabaseForThisGuild(shouldEnable, isEnabled, firebaseGuild, channel, anyDiscordMessage)
          ).rejects.toThrow(new Error(`updateStateByGuildId error`));

          expect(firebaseGuildsChannelsFeaturesNoonEnabledServiceUpdateStateByGuildIdSpy).toHaveBeenCalledTimes(1);
          expect(firebaseGuildsChannelsFeaturesNoonEnabledServiceUpdateStateByGuildIdSpy).toHaveBeenCalledWith(
            `dummy-id`,
            `dummy-channel-id`,
            true
          );
        });
      });

      describe(`when the enable state for the feature command in the Firebase guilds was not successfully updated`, (): void => {
        beforeEach((): void => {
          firebaseGuildsChannelsFeaturesNoonEnabledServiceUpdateStateByGuildIdSpy.mockRejectedValue(
            new Error(`updateStateByGuildId error`)
          );
        });

        it(`should throw an error about the enable state for the feature command in the Firebase guilds not being successfully updated`, async (): Promise<void> => {
          expect.assertions(1);

          await expect(
            service.updateDatabaseForThisGuild(shouldEnable, isEnabled, firebaseGuild, channel, anyDiscordMessage)
          ).rejects.toThrow(new Error(`updateStateByGuildId error`));
        });
      });

      describe(`when the enable state for the feature command in the Firebase guilds was successfully updated`, (): void => {
        beforeEach((): void => {
          firebaseGuildsChannelsFeaturesNoonEnabledServiceUpdateStateByGuildIdSpy.mockResolvedValue(writeResult);
        });

        describe(`when the current noon feature is not configured`, (): void => {
          beforeEach((): void => {
            isEnabled = undefined;
          });

          describe(`when the new state is enable`, (): void => {
            beforeEach((): void => {
              shouldEnable = true;
            });

            it(`should return a flag success about the noon feature not configured yet but enabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisGuild(
                shouldEnable,
                isEnabled,
                firebaseGuild,
                channel,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature was not configured yet and is now enabled on this text channel. A message will be sent each day at noon (12 A.M) on Paris timezone.`,
                name: `Noon feature enabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });

          describe(`when the new state is disable`, (): void => {
            beforeEach((): void => {
              shouldEnable = false;
            });

            it(`should return a flag success about the noon feature not configured yet but disabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisGuild(
                shouldEnable,
                isEnabled,
                firebaseGuild,
                channel,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature was not configured yet and is now disabled on this text channel.`,
                name: `Noon feature disabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });
        });

        describe(`when the current noon feature is enabled`, (): void => {
          beforeEach((): void => {
            isEnabled = true;
          });

          describe(`when the new state is enable`, (): void => {
            beforeEach((): void => {
              shouldEnable = true;
            });

            it(`should return a flag success about the noon feature being already enabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisGuild(
                shouldEnable,
                isEnabled,
                firebaseGuild,
                channel,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature was already enabled on this text channel. A message will be sent each day at noon (12 A.M) on Paris timezone.`,
                name: `Noon feature enabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });

          describe(`when the new state is disable`, (): void => {
            beforeEach((): void => {
              shouldEnable = false;
            });

            it(`should return a flag success about the noon feature being enabled but now disabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisGuild(
                shouldEnable,
                isEnabled,
                firebaseGuild,
                channel,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature is now disabled on this text channel.`,
                name: `Noon feature disabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });
        });

        describe(`when the current noon feature is disabled`, (): void => {
          beforeEach((): void => {
            isEnabled = false;
          });

          describe(`when the new state is enable`, (): void => {
            beforeEach((): void => {
              shouldEnable = true;
            });

            it(`should return a flag success about the noon feature being disabled but now enabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisGuild(
                shouldEnable,
                isEnabled,
                firebaseGuild,
                channel,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature is now enabled on this text channel. A message will be sent each day at noon (12 A.M) on Paris timezone.`,
                name: `Noon feature enabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });

          describe(`when the new state is disable`, (): void => {
            beforeEach((): void => {
              isEnabled = false;
            });

            it(`should return a flag success about the noon feature being already disabled`, async (): Promise<void> => {
              expect.assertions(1);

              const result = await service.updateDatabaseForThisGuild(
                shouldEnable,
                isEnabled,
                firebaseGuild,
                channel,
                anyDiscordMessage
              );

              expect(result).toStrictEqual({
                description: `The noon feature was already disabled on this text channel.`,
                name: `Noon feature disabled`,
              } as IDiscordCommandFlagSuccess);
            });
          });
        });
      });
    });
  });
});
