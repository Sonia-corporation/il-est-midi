import { FirebaseGuildChannelFeatureVersionEnum } from '../../../../enums/guilds/channels/features/firebase-guild-channel-feature-version.enum';

/**
 * @description
 * A simply Firebase guild channel feature with the default configuration.
 * @see [sonia-link-002]{@link https://github.com/Sonia-corporation/sonia-discord/blob/master/CONTRIBUTING.md#sonia-link-002}.
 */
export interface INewFirebaseGuildChannelFeature {
  noon?: undefined;
  releaseNotes?: undefined;
  version: FirebaseGuildChannelFeatureVersionEnum.V2;
}
