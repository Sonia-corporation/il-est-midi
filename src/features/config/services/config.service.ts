import _ from "lodash";
import { AbstractService } from "../../../classes/abstract.service";
import { ServiceNameEnum } from "../../../enums/service-name.enum";
import { wrapInQuotes } from "../../../functions/formatters/wrap-in-quotes";
import { ChalkService } from "../../logger/services/chalk.service";
import { LoggerService } from "../../logger/services/logger.service";
import { TimeService } from "../../time/services/time.service";
import { IConfigUpdateBoolean } from "../interfaces/config-update-boolean";
import { IConfigUpdateDate } from "../interfaces/config-update-date";
import { IConfigUpdateDateInternal } from "../interfaces/config-update-date-internal";
import { IConfigUpdateNumber } from "../interfaces/config-update-number";
import { IConfigUpdateString } from "../interfaces/config-update-string";
import { IConfigUpdateStringInternal } from "../interfaces/config-update-string-internal";

export class ConfigService extends AbstractService {
  private static _instance: ConfigService;

  public static getInstance(): ConfigService {
    if (_.isNil(ConfigService._instance)) {
      ConfigService._instance = new ConfigService();
    }

    return ConfigService._instance;
  }

  private readonly _loggerService: LoggerService = LoggerService.getInstance();
  private readonly _chalkService: ChalkService = ChalkService.getInstance();
  private readonly _timeService: TimeService = TimeService.getInstance();

  public constructor() {
    super(ServiceNameEnum.CONFIG_SERVICE);
  }

  public getUpdatedNumber(
    configUpdateNumber: Readonly<IConfigUpdateNumber>
  ): number {
    if (_.isNumber(configUpdateNumber.newValue)) {
      this._loggerService.log({
        context: configUpdateNumber.context,
        message: this._chalkService.text(
          `${
            configUpdateNumber.valueName
          } updated to: ${this._chalkService.value(
            configUpdateNumber.newValue
          )}`
        ),
      });

      return configUpdateNumber.newValue;
    }

    return configUpdateNumber.oldValue;
  }

  public getUpdatedString<T>(
    configUpdateString: Readonly<IConfigUpdateString<T>>
  ): T {
    if (_.isString(configUpdateString.newValue)) {
      this._loggerService.log({
        context: configUpdateString.context,
        message: this._getUpdatedStringMessage(configUpdateString),
      });

      return configUpdateString.newValue;
    }

    return configUpdateString.oldValue;
  }

  public getUpdatedDate<T>(
    configUpdateDate: Readonly<IConfigUpdateDate<T>>
  ): T {
    if (_.isString(configUpdateDate.newValue)) {
      this._loggerService.log({
        context: configUpdateDate.context,
        message: this._getUpdatedDateMessage(configUpdateDate),
      });

      return configUpdateDate.newValue;
    }

    return configUpdateDate.oldValue;
  }

  public getUpdatedBoolean(
    configUpdateString: Readonly<IConfigUpdateBoolean>
  ): boolean {
    if (_.isBoolean(configUpdateString.newValue)) {
      this._loggerService.log({
        context: configUpdateString.context,
        message: this._chalkService.text(
          `${
            configUpdateString.valueName
          } updated to: ${this._chalkService.value(
            configUpdateString.newValue
          )}`
        ),
      });

      return configUpdateString.newValue;
    }

    return configUpdateString.oldValue;
  }

  private _getUpdatedStringMessage<T>(
    configUpdateString: Readonly<IConfigUpdateStringInternal<T>>
  ): string {
    let message = `${configUpdateString.valueName} updated`;

    if (_.isEqual(configUpdateString.isValueHidden, true)) {
      message = this._loggerService.getHiddenValueUpdate(
        `${message} to: `,
        true
      );
    } else {
      if (!_.isEqual(configUpdateString.isValueDisplay, false)) {
        message = this._chalkService.text(
          `${message} to: ${this._chalkService.value(
            wrapInQuotes<T>(configUpdateString.newValue)
          )}`
        );
      } else {
        message = this._chalkService.text(message);
      }
    }

    return message;
  }

  private _getUpdatedDateMessage<T>(
    configUpdateDate: Readonly<IConfigUpdateDateInternal<T>>
  ): string {
    let message = `${configUpdateDate.valueName} updated`;

    if (_.isEqual(configUpdateDate.isValueHidden, true)) {
      message = this._loggerService.getHiddenValueUpdate(
        `${message} to: `,
        true
      );
    } else {
      if (!_.isEqual(configUpdateDate.isValueDisplay, false)) {
        message = this._chalkService.text(
          `${message} to: ${this._chalkService.value(
            wrapInQuotes<T>(configUpdateDate.newValue)
          )} ${this._chalkService.hint(
            `(${this._timeService.fromNow<T>(
              configUpdateDate.newValue,
              false
            )})`
          )}`
        );
      } else {
        message = this._chalkService.text(message);
      }
    }

    return message;
  }
}
