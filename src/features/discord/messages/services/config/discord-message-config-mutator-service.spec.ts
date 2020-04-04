import { PartialNested } from "../../../../../types/partial-nested";
import { IConfigUpdateNumber } from "../../../../config/interfaces/config-update-number";
import { IConfigUpdateString } from "../../../../config/interfaces/config-update-string";
import { ConfigService } from "../../../../config/services/config-service";
import { IDiscordConfig } from "../../../interfaces/discord-config";
import { IDiscordMessageCommandConfig } from "../../../interfaces/discord-message-command-config";
import { IDiscordMessageCommandErrorConfig } from "../../../interfaces/discord-message-command-error-config";
import { IDiscordMessageCommandVersionConfig } from "../../../interfaces/discord-message-command-version-config";
import { IDiscordMessageConfig } from "../../../interfaces/discord-message-config";
import { IDiscordMessageErrorConfig } from "../../../interfaces/discord-message-error-config";
import { DiscordMessageConfigCoreService } from "./discord-message-config-core-service";
import { DiscordMessageConfigMutatorService } from "./discord-message-config-mutator-service";

jest.mock(`../../../../config/services/config-service`);

describe(`DiscordMessageConfigMutatorService`, (): void => {
  let service: DiscordMessageConfigMutatorService;
  let configService: ConfigService;
  let discordMessageConfigCoreService: DiscordMessageConfigCoreService;

  beforeEach((): void => {
    service = DiscordMessageConfigMutatorService.getInstance();
    configService = ConfigService.getInstance();
    discordMessageConfigCoreService = DiscordMessageConfigCoreService.getInstance();
  });

  describe(`updateConfig()`, (): void => {
    let config: PartialNested<IDiscordConfig> | undefined;

    beforeEach((): void => {
      discordMessageConfigCoreService.command = {
        error: {
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        },
        prefix: `dummy-prefix`,
        version: {
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        },
      };
      discordMessageConfigCoreService.error = {
        imageColor: 8,
        imageUrl: `dummy-image-url`,
      };
    });

    describe(`when the given config is undefined`, (): void => {
      beforeEach((): void => {
        config = undefined;
      });

      it(`should not update the config`, (): void => {
        expect.assertions(2);

        service.updateConfig(config);

        expect(discordMessageConfigCoreService.command).toStrictEqual({
          error: {
            imageColor: 8,
            imageUrl: `dummy-image-url`,
          },
          prefix: `dummy-prefix`,
          version: {
            imageColor: 8,
            imageUrl: `dummy-image-url`,
          },
        } as IDiscordMessageCommandConfig);
        expect(discordMessageConfigCoreService.error).toStrictEqual({
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        } as IDiscordMessageErrorConfig);
      });
    });

    describe(`when the given config contains a message command`, (): void => {
      beforeEach((): void => {
        config = {
          message: {
            command: {
              error: {
                imageColor: 88,
                imageUrl: `image-url`,
              },
              prefix: `prefix`,
              version: {
                imageColor: 88,
                imageUrl: `image-url`,
              },
            },
          },
        };
      });

      it(`should update the config command`, (): void => {
        expect.assertions(1);

        service.updateConfig(config);

        expect(discordMessageConfigCoreService.command).toStrictEqual({
          error: {
            imageColor: 88,
            imageUrl: `image-url`,
          },
          prefix: `prefix`,
          version: {
            imageColor: 88,
            imageUrl: `image-url`,
          },
        } as IDiscordMessageCommandConfig);
      });
    });

    describe(`when the given config contains a message error`, (): void => {
      beforeEach((): void => {
        config = {
          message: {
            error: {
              imageColor: 88,
              imageUrl: `image-url`,
            },
          },
        };
      });

      it(`should update the config error`, (): void => {
        expect.assertions(1);

        service.updateConfig(config);

        expect(discordMessageConfigCoreService.error).toStrictEqual({
          imageColor: 88,
          imageUrl: `image-url`,
        } as IDiscordMessageErrorConfig);
      });
    });
  });

  describe(`updateMessage()`, (): void => {
    let config: PartialNested<IDiscordMessageConfig> | undefined;

    beforeEach((): void => {
      discordMessageConfigCoreService.command = {
        error: {
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        },
        prefix: `dummy-prefix`,
        version: {
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        },
      };
      discordMessageConfigCoreService.error = {
        imageColor: 8,
        imageUrl: `dummy-image-url`,
      };
    });

    describe(`when the given config is undefined`, (): void => {
      beforeEach((): void => {
        config = undefined;
      });

      it(`should not update the config`, (): void => {
        expect.assertions(2);

        service.updateMessage(config);

        expect(discordMessageConfigCoreService.command).toStrictEqual({
          error: {
            imageColor: 8,
            imageUrl: `dummy-image-url`,
          },
          prefix: `dummy-prefix`,
          version: {
            imageColor: 8,
            imageUrl: `dummy-image-url`,
          },
        } as IDiscordMessageCommandConfig);
        expect(discordMessageConfigCoreService.error).toStrictEqual({
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        } as IDiscordMessageErrorConfig);
      });
    });

    describe(`when the given config contains a command`, (): void => {
      beforeEach((): void => {
        config = {
          command: {
            error: {
              imageColor: 88,
              imageUrl: `image-url`,
            },
            prefix: `prefix`,
            version: {
              imageColor: 88,
              imageUrl: `image-url`,
            },
          },
        };
      });

      it(`should update the config command`, (): void => {
        expect.assertions(1);

        service.updateMessage(config);

        expect(discordMessageConfigCoreService.command).toStrictEqual({
          error: {
            imageColor: 88,
            imageUrl: `image-url`,
          },
          prefix: `prefix`,
          version: {
            imageColor: 88,
            imageUrl: `image-url`,
          },
        } as IDiscordMessageCommandConfig);
      });
    });

    describe(`when the given config contains a error`, (): void => {
      beforeEach((): void => {
        config = {
          error: {
            imageColor: 88,
            imageUrl: `image-url`,
          },
        };
      });

      it(`should update the config error`, (): void => {
        expect.assertions(1);

        service.updateMessage(config);

        expect(discordMessageConfigCoreService.error).toStrictEqual({
          imageColor: 88,
          imageUrl: `image-url`,
        } as IDiscordMessageErrorConfig);
      });
    });
  });

  describe(`updateMessageCommand()`, (): void => {
    let config: PartialNested<IDiscordMessageCommandConfig> | undefined;

    beforeEach((): void => {
      discordMessageConfigCoreService.command = {
        error: {
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        },
        prefix: `dummy-prefix`,
        version: {
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        },
      };
    });

    describe(`when the given config is undefined`, (): void => {
      beforeEach((): void => {
        config = undefined;
      });

      it(`should not update the config`, (): void => {
        expect.assertions(1);

        service.updateMessageCommand(config);

        expect(discordMessageConfigCoreService.command).toStrictEqual({
          error: {
            imageColor: 8,
            imageUrl: `dummy-image-url`,
          },
          prefix: `dummy-prefix`,
          version: {
            imageColor: 8,
            imageUrl: `dummy-image-url`,
          },
        } as IDiscordMessageCommandConfig);
      });
    });

    describe(`when the given config contains an error`, (): void => {
      beforeEach((): void => {
        config = {
          error: {
            imageColor: 88,
            imageUrl: `image-url`,
          },
        };
      });

      it(`should update the config command error`, (): void => {
        expect.assertions(1);

        service.updateMessageCommand(config);

        expect(discordMessageConfigCoreService.command.error).toStrictEqual({
          imageColor: 88,
          imageUrl: `image-url`,
        } as IDiscordMessageCommandErrorConfig);
      });
    });

    describe(`when the given config contains a prefix`, (): void => {
      beforeEach((): void => {
        config = {
          prefix: `prefix`,
        };
      });

      it(`should update the config command prefix`, (): void => {
        expect.assertions(1);

        service.updateMessageCommand(config);

        expect(discordMessageConfigCoreService.command.prefix).toStrictEqual(
          `prefix`
        );
      });
    });

    describe(`when the given config contains a version`, (): void => {
      beforeEach((): void => {
        config = {
          version: {
            imageColor: 88,
            imageUrl: `image-url`,
          },
        };
      });

      it(`should update the config command version`, (): void => {
        expect.assertions(1);

        service.updateMessageCommand(config);

        expect(discordMessageConfigCoreService.command.version).toStrictEqual({
          imageColor: 88,
          imageUrl: `image-url`,
        } as IDiscordMessageCommandVersionConfig);
      });
    });
  });

  describe(`updateMessageCommandError()`, (): void => {
    let config: PartialNested<IDiscordMessageCommandErrorConfig> | undefined;

    beforeEach((): void => {
      discordMessageConfigCoreService.command.error = {
        imageColor: 8,
        imageUrl: `dummy-image-url`,
      };
    });

    describe(`when the given config is undefined`, (): void => {
      beforeEach((): void => {
        config = undefined;
      });

      it(`should not update the config`, (): void => {
        expect.assertions(1);

        service.updateMessageCommandError(config);

        expect(discordMessageConfigCoreService.command.error).toStrictEqual({
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        } as IDiscordMessageCommandErrorConfig);
      });
    });

    describe(`when the given config contains an image color`, (): void => {
      beforeEach((): void => {
        config = {
          imageColor: 88,
        };
      });

      it(`should update the config command error image color`, (): void => {
        expect.assertions(1);

        service.updateMessageCommandError(config);

        expect(
          discordMessageConfigCoreService.command.error.imageColor
        ).toStrictEqual(88);
      });
    });

    describe(`when the given config contains an image url`, (): void => {
      beforeEach((): void => {
        config = {
          imageUrl: `image-url`,
        };
      });

      it(`should update the config command error image url`, (): void => {
        expect.assertions(1);

        service.updateMessageCommandError(config);

        expect(
          discordMessageConfigCoreService.command.error.imageUrl
        ).toStrictEqual(`image-url`);
      });
    });
  });

  describe(`updateMessageCommandErrorImageColor()`, (): void => {
    let imageColor: number;

    let configServiceGetUpdatedNumberSpy: jest.SpyInstance;

    beforeEach((): void => {
      imageColor = 8;
      discordMessageConfigCoreService.command.error.imageColor = 10;

      configServiceGetUpdatedNumberSpy = jest
        .spyOn(configService, `getUpdatedNumber`)
        .mockReturnValue(8);
    });

    it(`should get the updated number`, (): void => {
      expect.assertions(2);

      service.updateMessageCommandErrorImageColor(imageColor);

      expect(configServiceGetUpdatedNumberSpy).toHaveBeenCalledTimes(1);
      expect(configServiceGetUpdatedNumberSpy).toHaveBeenCalledWith({
        context: `DiscordMessageConfigMutatorService`,
        newValue: 8,
        oldValue: 10,
        valueName: `message command error image color`,
      } as IConfigUpdateNumber);
    });

    it(`should update the Discord message config command error image color with the updated number`, (): void => {
      expect.assertions(1);

      service.updateMessageCommandErrorImageColor(imageColor);

      expect(
        discordMessageConfigCoreService.command.error.imageColor
      ).toStrictEqual(8);
    });
  });

  describe(`updateMessageCommandErrorImageUrl()`, (): void => {
    let imageUrl: string;

    let configServiceGetUpdatedStringSpy: jest.SpyInstance;

    beforeEach((): void => {
      imageUrl = `dummy-image-url`;
      discordMessageConfigCoreService.command.error.imageUrl = `image-url`;

      configServiceGetUpdatedStringSpy = jest
        .spyOn(configService, `getUpdatedString`)
        .mockReturnValue(`dummy-image-url`);
    });

    it(`should get the updated string`, (): void => {
      expect.assertions(2);

      service.updateMessageCommandErrorImageUrl(imageUrl);

      expect(configServiceGetUpdatedStringSpy).toHaveBeenCalledTimes(1);
      expect(configServiceGetUpdatedStringSpy).toHaveBeenCalledWith({
        context: `DiscordMessageConfigMutatorService`,
        newValue: `dummy-image-url`,
        oldValue: `image-url`,
        valueName: `message command error image url`,
      } as IConfigUpdateString);
    });

    it(`should update the Discord message config command error image url with the updated string`, (): void => {
      expect.assertions(1);

      service.updateMessageCommandErrorImageUrl(imageUrl);

      expect(
        discordMessageConfigCoreService.command.error.imageUrl
      ).toStrictEqual(`dummy-image-url`);
    });
  });

  describe(`updateMessageCommandVersion()`, (): void => {
    let config: PartialNested<IDiscordMessageCommandErrorConfig> | undefined;

    beforeEach((): void => {
      discordMessageConfigCoreService.command.version = {
        imageColor: 8,
        imageUrl: `dummy-image-url`,
      };
    });

    describe(`when the given config is undefined`, (): void => {
      beforeEach((): void => {
        config = undefined;
      });

      it(`should not update the config`, (): void => {
        expect.assertions(1);

        service.updateMessageCommandError(config);

        expect(discordMessageConfigCoreService.command.version).toStrictEqual({
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        } as IDiscordMessageCommandVersionConfig);
      });
    });

    describe(`when the given config contains an image color`, (): void => {
      beforeEach((): void => {
        config = {
          imageColor: 88,
        };
      });

      it(`should update the config command version image color`, (): void => {
        expect.assertions(1);

        service.updateMessageCommandVersion(config);

        expect(
          discordMessageConfigCoreService.command.version.imageColor
        ).toStrictEqual(88);
      });
    });

    describe(`when the given config contains an image url`, (): void => {
      beforeEach((): void => {
        config = {
          imageUrl: `image-url`,
        };
      });

      it(`should update the config command version image url`, (): void => {
        expect.assertions(1);

        service.updateMessageCommandVersion(config);

        expect(
          discordMessageConfigCoreService.command.version.imageUrl
        ).toStrictEqual(`image-url`);
      });
    });
  });

  describe(`updateMessageCommandVersionImageColor()`, (): void => {
    let imageColor: number;

    let configServiceGetUpdatedNumberSpy: jest.SpyInstance;

    beforeEach((): void => {
      imageColor = 8;
      discordMessageConfigCoreService.command.version.imageColor = 10;

      configServiceGetUpdatedNumberSpy = jest
        .spyOn(configService, `getUpdatedNumber`)
        .mockReturnValue(8);
    });

    it(`should get the updated number`, (): void => {
      expect.assertions(2);

      service.updateMessageCommandVersionImageColor(imageColor);

      expect(configServiceGetUpdatedNumberSpy).toHaveBeenCalledTimes(1);
      expect(configServiceGetUpdatedNumberSpy).toHaveBeenCalledWith({
        context: `DiscordMessageConfigMutatorService`,
        newValue: 8,
        oldValue: 10,
        valueName: `message command version image color`,
      } as IConfigUpdateNumber);
    });

    it(`should update the Discord message config command version image color with the updated number`, (): void => {
      expect.assertions(1);

      service.updateMessageCommandVersionImageColor(imageColor);

      expect(
        discordMessageConfigCoreService.command.version.imageColor
      ).toStrictEqual(8);
    });
  });

  describe(`updateMessageCommandVersionImageUrl()`, (): void => {
    let imageUrl: string;

    let configServiceGetUpdatedStringSpy: jest.SpyInstance;

    beforeEach((): void => {
      imageUrl = `dummy-image-url`;
      discordMessageConfigCoreService.command.version.imageUrl = `image-url`;

      configServiceGetUpdatedStringSpy = jest
        .spyOn(configService, `getUpdatedString`)
        .mockReturnValue(`dummy-image-url`);
    });

    it(`should get the updated string`, (): void => {
      expect.assertions(2);

      service.updateMessageCommandVersionImageUrl(imageUrl);

      expect(configServiceGetUpdatedStringSpy).toHaveBeenCalledTimes(1);
      expect(configServiceGetUpdatedStringSpy).toHaveBeenCalledWith({
        context: `DiscordMessageConfigMutatorService`,
        newValue: `dummy-image-url`,
        oldValue: `image-url`,
        valueName: `message command version image url`,
      } as IConfigUpdateString);
    });

    it(`should update the Discord message config command version image url with the updated string`, (): void => {
      expect.assertions(1);

      service.updateMessageCommandVersionImageUrl(imageUrl);

      expect(
        discordMessageConfigCoreService.command.version.imageUrl
      ).toStrictEqual(`dummy-image-url`);
    });
  });

  describe(`updateMessageError()`, (): void => {
    let config: PartialNested<IDiscordMessageErrorConfig> | undefined;

    beforeEach((): void => {
      discordMessageConfigCoreService.error = {
        imageColor: 8,
        imageUrl: `dummy-image-url`,
      };
    });

    describe(`when the given config is undefined`, (): void => {
      beforeEach((): void => {
        config = undefined;
      });

      it(`should not update the config`, (): void => {
        expect.assertions(1);

        service.updateMessageError(config);

        expect(discordMessageConfigCoreService.error).toStrictEqual({
          imageColor: 8,
          imageUrl: `dummy-image-url`,
        } as IDiscordMessageErrorConfig);
      });
    });

    describe(`when the given config contains an image color`, (): void => {
      beforeEach((): void => {
        config = {
          imageColor: 88,
        };
      });

      it(`should update the config error image color`, (): void => {
        expect.assertions(1);

        service.updateMessageError(config);

        expect(discordMessageConfigCoreService.error.imageColor).toStrictEqual(
          88
        );
      });
    });

    describe(`when the given config contains an image url`, (): void => {
      beforeEach((): void => {
        config = {
          imageUrl: `image-url`,
        };
      });

      it(`should update the config error image url`, (): void => {
        expect.assertions(1);

        service.updateMessageError(config);

        expect(discordMessageConfigCoreService.error.imageUrl).toStrictEqual(
          `image-url`
        );
      });
    });
  });

  describe(`updateMessageErrorImageColor()`, (): void => {
    let imageColor: number;

    let configServiceGetUpdatedNumberSpy: jest.SpyInstance;

    beforeEach((): void => {
      imageColor = 8;
      discordMessageConfigCoreService.error.imageColor = 10;

      configServiceGetUpdatedNumberSpy = jest
        .spyOn(configService, `getUpdatedNumber`)
        .mockReturnValue(8);
    });

    it(`should get the updated number`, (): void => {
      expect.assertions(2);

      service.updateMessageErrorImageColor(imageColor);

      expect(configServiceGetUpdatedNumberSpy).toHaveBeenCalledTimes(1);
      expect(configServiceGetUpdatedNumberSpy).toHaveBeenCalledWith({
        context: `DiscordMessageConfigMutatorService`,
        newValue: 8,
        oldValue: 10,
        valueName: `message error image color`,
      } as IConfigUpdateNumber);
    });

    it(`should update the Discord message config error image color with the updated number`, (): void => {
      expect.assertions(1);

      service.updateMessageErrorImageColor(imageColor);

      expect(discordMessageConfigCoreService.error.imageColor).toStrictEqual(8);
    });
  });

  describe(`updateMessageErrorImageUrl()`, (): void => {
    let imageUrl: string;

    let configServiceGetUpdatedStringSpy: jest.SpyInstance;

    beforeEach((): void => {
      imageUrl = `dummy-image-url`;
      discordMessageConfigCoreService.error.imageUrl = `image-url`;

      configServiceGetUpdatedStringSpy = jest
        .spyOn(configService, `getUpdatedString`)
        .mockReturnValue(`dummy-image-url`);
    });

    it(`should get the updated string`, (): void => {
      expect.assertions(2);

      service.updateMessageErrorImageUrl(imageUrl);

      expect(configServiceGetUpdatedStringSpy).toHaveBeenCalledTimes(1);
      expect(configServiceGetUpdatedStringSpy).toHaveBeenCalledWith({
        context: `DiscordMessageConfigMutatorService`,
        newValue: `dummy-image-url`,
        oldValue: `image-url`,
        valueName: `message error image url`,
      } as IConfigUpdateString);
    });

    it(`should update the Discord message config error image url with the updated string`, (): void => {
      expect.assertions(1);

      service.updateMessageErrorImageUrl(imageUrl);

      expect(discordMessageConfigCoreService.error.imageUrl).toStrictEqual(
        `dummy-image-url`
      );
    });
  });
});
