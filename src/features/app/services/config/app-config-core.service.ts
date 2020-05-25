import _ from "lodash";
import moment from "moment-timezone";
import { AbstractService } from "../../../../classes/abstract.service";
import { ServiceNameEnum } from "../../../../enums/service-name.enum";
import { TimezoneEnum } from "../../../time/enums/timezone.enum";
import { IAppConfig } from "../../interfaces/app-config";

export class AppConfigCoreService extends AbstractService
  implements IAppConfig {
  private static _instance: AppConfigCoreService;

  public static getInstance(): AppConfigCoreService {
    if (_.isNil(AppConfigCoreService._instance)) {
      AppConfigCoreService._instance = new AppConfigCoreService();
    }

    return AppConfigCoreService._instance;
  }

  public firstReleaseDate = moment({
    day: 24,
    hour: 1,
    minute: 0,
    month: 2,
    second: 0,
    year: 2020,
  })
    .tz(TimezoneEnum.PARIS)
    .toISOString();
  public initializationDate = `unknown`;
  public isProduction = false;
  public releaseDate = `unknown`;
  public releaseNotes = ``;
  public totalReleaseCount = 0;
  public version = `unknown`;

  public constructor() {
    super(ServiceNameEnum.APP_CONFIG_CORE_SERVICE);
  }
}
