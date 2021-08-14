import { DiscordMessageCommandFeatureFlagEnum } from './discord-message-command-feature-flag.enum';
import { getEnumLength } from '../../../../../../../functions/checks/get-enum-length';

describe(`DiscordMessageCommandFeatureFlagEnum`, (): void => {
  it(`should have 2 members`, (): void => {
    expect.assertions(1);

    expect(getEnumLength(DiscordMessageCommandFeatureFlagEnum)).toStrictEqual(2);
  });

  it(`should have a member "H"`, (): void => {
    expect.assertions(1);

    expect(DiscordMessageCommandFeatureFlagEnum.H).toStrictEqual(`h`);
  });

  it(`should have a member "HELP"`, (): void => {
    expect.assertions(1);

    expect(DiscordMessageCommandFeatureFlagEnum.HELP).toStrictEqual(`help`);
  });
});
