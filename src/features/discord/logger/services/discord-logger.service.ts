import { Client } from "discord.js";
import _ from "lodash";
import { AbstractService } from "../../../../classes/abstract.service";
import { ServiceNameEnum } from "../../../../enums/service-name.enum";
import { wrapInQuotes } from "../../../../functions/formatters/wrap-in-quotes";
import { ChalkService } from "../../../logger/services/chalk.service";
import { LoggerService } from "../../../logger/services/logger.service";
import { DiscordClientService } from "../../services/discord-client.service";
import { DiscordLoggerErrorService } from "./discord-logger-error.service";
import { DiscordLoggerWarningService } from "./discord-logger-warning.service";

export class DiscordLoggerService extends AbstractService {
  private static _instance: DiscordLoggerService;

  public static getInstance(): DiscordLoggerService {
    if (_.isNil(DiscordLoggerService._instance)) {
      DiscordLoggerService._instance = new DiscordLoggerService();
    }

    return DiscordLoggerService._instance;
  }

  public readonly discordClient: Client = DiscordClientService.getInstance().getClient();
  private readonly _loggerService: LoggerService = LoggerService.getInstance();
  private readonly _chalkService: ChalkService = ChalkService.getInstance();
  private readonly _discordLoggerErrorService: DiscordLoggerErrorService = DiscordLoggerErrorService.getInstance();
  private readonly _discordLoggerWarningService: DiscordLoggerWarningService = DiscordLoggerWarningService.getInstance();

  protected constructor() {
    super(ServiceNameEnum.DISCORD_LOGGER_SERVICE);
    this.init();
  }

  public init(): void {
    this._listenForWarnings();
    this._listenForErrors();
  }

  private _listenForWarnings(): void {
    this.discordClient.on(`warn`, (warning: Readonly<string>): void => {
      this._discordLoggerWarningService.handleWarning(warning);
    });

    setTimeout((): void => {
      this._discordLoggerWarningService.handleWarning(`adazd`);
    }, 6000);

    this._loggerService.debug({
      context: this._serviceName,
      message: this._chalkService.text(`listen ${wrapInQuotes(`warn`)} event`),
    });
  }

  private _listenForErrors(): void {
    this.discordClient.on(`error`, (error: Readonly<Error>): void => {
      this._discordLoggerErrorService.handleError(error);
    });

    this._loggerService.debug({
      context: this._serviceName,
      message: this._chalkService.text(`listen ${wrapInQuotes(`error`)} event`),
    });
  }
}
