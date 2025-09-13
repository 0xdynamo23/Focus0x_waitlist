import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addToWaitlist(email: string) {
  try {
    // Check if email already exists
    const existingUser = await prisma.waitlist.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already exists in waitlist');
    }

    // Insert new email
    const result = await prisma.waitlist.create({
      data: { email }
    });

    return result.id;
  } catch (error) {
    throw error;
  }
}

export async function getWaitlistCount() {
  try {
    const count = await prisma.waitlist.count();
    return count;
  } catch (error) {
    throw error;
  }
}
