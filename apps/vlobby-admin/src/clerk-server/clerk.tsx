'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';
import { OccupantFormData } from '../app/admin/occupants/_form/occupant-upsert';
import { spaceRoleOptions } from '../app/lib/app-data/static-data';
import { UserCoreDetails } from '../app/lib/app-data/app-types';

export async function addUser(data: OccupantFormData) {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error('No organization found');
  }

  try {
    // Check if the user already exists
    let user = await clerkClient.users
      .getUserList({
        emailAddress: [data.email],
      })
      .then((users) => users.data[0] ?? null);

    // Generate a random password
    const randomPassword = generateRandomPassword();
    // If the user doesn't exist, create a new one
    if (!user) {
      user = await clerkClient.users.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: [data.email],
        password: randomPassword,
      });
    }
    return { success: true, userId: user.id, password: randomPassword };
  } catch (error) {
    console.error('Error adding occupant to org:', error);
    throw new Error('Failed to add user');
  }
}

export async function getOrgUsers() {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error('No organization found');
  }

  const members = await clerkClient.organizations.getOrganizationMembershipList(
    {
      organizationId: orgId,
    }
  );

  const filteredMembers = members.data.filter(
    (member) =>
      member.role === 'org:admin' || member.role === 'org:resolve_user'
  );

  const useValueLabelPairs = filteredMembers.map((member) => ({
    value: member.publicUserData?.userId ?? '',
    label: `${member.publicUserData?.firstName} ${member.publicUserData?.lastName}`,
  }));

  return useValueLabelPairs;
}

export async function getUser(userId: string) {
  if (!userId) {
    throw new Error('No user found');
  }
  const user = await clerkClient.users.getUser(userId);

  const userData: UserCoreDetails = {
    firstname: user.firstName ?? '',
    lastname: user.lastName ?? '',
    email: user.emailAddresses[0]?.emailAddress ?? '',
  };

  return userData;
}

const generateRandomPassword = () => {
  const length = 16;
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+{}[]|:;<>,.?/~`';
  const allChars = lowercase + uppercase + numbers + special;

  let password = '';
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += special.charAt(Math.floor(Math.random() * special.length));

  for (let i = 3; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};
