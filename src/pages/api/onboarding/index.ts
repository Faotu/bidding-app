import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { completeOnboarding } from '~/lib/server/onboarding/complete-onboarding';
import { withPipe } from '~/core/middleware/with-pipe';
import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import withCsrf from '~/core/middleware/with-csrf';
import { UserData, UserType } from '~/core/session/types/user-data';
import { GlobalRole } from '~/core/session/types/global-role';
import { Gender, ImprovementOptions, PersonalityType, PreferredRolePlayDuration, PreferredSessionsPerWeek, RolePlayLevel, SpokenLanguage, Timezone, YearsOfExperience } from '~/core/session/types/role-play-tribe';

const Body = z.object({
  organization: z.string(),
  availability: z.string(),
  languagesFluentIn: z.array(z.nativeEnum(SpokenLanguage)),
  timezone: z.nativeEnum(Timezone),
  firstLanguage: z.nativeEnum(SpokenLanguage),
  aboutMe: z.string(),
  dateOfBirth: z.string(),
  gender: z.nativeEnum(Gender),
  yearsOfRolePlayExperience: z.nativeEnum(YearsOfExperience),
  selfAssessedRolePlayLevel: z.nativeEnum(RolePlayLevel),
  preferredSessionsPerWeek: z.nativeEnum(PreferredSessionsPerWeek),
  preferredRolePlayDuration: z.nativeEnum(PreferredRolePlayDuration),
  improvementList: z.array(z.nativeEnum(ImprovementOptions)),
  personalityType: z.array(z.nativeEnum(PersonalityType)),
  yearsOfIndustryExperience: z.nativeEnum(YearsOfExperience),
  transactionsLastTwelveMonths: z.preprocess((val) => Number(val), z.number()),
  brokerageName: z.string(),
  displayName: z.string(),
  public: z.boolean(),
});

const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['POST'];

async function onboardingHandler(req: NextApiRequest, res: NextApiResponse) {
  const body = await Body.parseAsync(req.body);
  const userId = req.firebaseUser.uid;

  const {
    organization,
    availability,
    timezone,
    firstLanguage,
    languagesFluentIn,
    aboutMe,
    dateOfBirth,
    gender,
    yearsOfRolePlayExperience,
    selfAssessedRolePlayLevel,
    preferredSessionsPerWeek,
    preferredRolePlayDuration,
    improvementList,
    personalityType,
    yearsOfIndustryExperience,
    transactionsLastTwelveMonths,
    brokerageName,
    displayName,
  } = body;

  const dob = new Date(dateOfBirth);

  const userData: UserData = {
    role: GlobalRole.User,
    userId,
    userRating: RolePlayLevel.Beginner,
    timezone,
    availability: JSON.parse(availability),
    firstLanguage,
    languagesFluentIn,
    aboutMe,
    dateOfBirth: dob,
    gender,
    yearsOfRolePlayExperience,
    selfAssessedRolePlayLevel,
    preferredSessionsPerWeek,
    preferredRolePlayDuration,
    improvementList,
    personalityType,
    yearsOfIndustryExperience,
    transactionsLastTwelveMonths,
    brokerageName,
    displayName,
    public: body.public || false,
    userType: UserType.user,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await completeOnboarding(userData, organization);

  return res.send({ success: true });
}

export default function completeOnboardingHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withPipe(
    withCsrf(),
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAuthedUser,
    onboardingHandler
  );

  return withExceptionFilter(req, res)(handler);
}
