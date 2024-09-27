'use server'

import { auth, clerkClient } from "@clerk/nextjs/server"
import { MultiStageFormData } from "../onboarding/_forms/onboarding-validation"

/**
 * Completes the onboarding process for a user
 * 
 * This function updates the user's public metadata to mark onboarding as complete.
 * It uses Clerk's authentication and user management features.
 *
 * @param {MultiStageFormData} formData - The form data from the onboarding process
 * @returns {Promise<{ message: any } | { error: string }>} A promise that resolves to a success message or an error
 */
export const completeOnboarding = async () => {
  const { userId } = auth()

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  try {
    const res = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    })
    return { message: res.publicMetadata }
  } catch (err) {
    return { error: 'There was an error updating the user metadata.' }
  }
}

/**
 * Creates a new organization for the user
 * 
 * This function uses Clerk's API to create a new organization with the given name and slug.
 * It requires an authenticated user to perform this action.
 *
 * @param {string} name - The name of the organization to create
 * @param {string} slug - The slug (URL-friendly name) for the organization
 * @returns {Promise<{ message: string } | { error: string }>} A promise that resolves to the organization ID or an error message
 */
export const createOrganization = async (name: string, slug: string) => {
  const { userId } = auth()

  if (!userId) {
    return { error: 'No logged in user' }
  }

  try {
    const organization = await clerkClient.organizations.createOrganization({
      name: name,
      slug: slug,
      createdBy: userId,
    })

    return { message: organization.id }
  } catch (err) {
    console.error('Error creating organization:', err)
    return { error: 'There was an error creating the organization.' }
  }
}