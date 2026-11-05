
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { BusinessType, UserRole } from "@/app/generated/prisma/enums";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      password,
      confirmPassword,
      role,
      address,
      suburb,
      city,
      country,
      phone,
      organisationName,
      description,
      website,
      businessType,
    } = body;

    // Validate common required fields
    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !password ||
      !confirmPassword ||
      !phone?.trim() ||
      !role
    ) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 }
      );
    }

  // Only allow public registration for these roles
const allowedRoles = [
  UserRole.CUSTOMER,
  UserRole.BUSINESS,
  UserRole.CHARITY,
];

if (!allowedRoles.includes(role)) {
  return NextResponse.json(
    { message: "Invalid account type." },
    { status: 400 }
  );
}

    // Validate password
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 400 }
      );
    }

    // Validate organisation details
    if (role === "BUSINESS" || role === "CHARITY") {
      if (
        !organisationName?.trim() ||
        !address?.trim() ||
        !city?.trim()
      ) {
        return NextResponse.json(
          { message: "Organisation name, address and city are required." },
          { status: 400 }
        );
      }
    }

    // Validate business type
    if (
      role === "BUSINESS" &&
      !Object.values(BusinessType).includes(businessType)
    ) {
      return NextResponse.json(
        { message: "Please select a valid business type." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const normalizedPhone = phone.trim();
    const organisation = organisationName?.trim();
    const locationCountry = country?.trim() || "South Africa";

    // Create account and related records in one transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          fullName: fullName.trim(),
          email: normalizedEmail,
          passwordHash,
          phone: normalizedPhone,
          role,
          address: address?.trim() || null,
          suburb: suburb?.trim() || null,
          city: city?.trim() || null,
          country: locationCountry,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      // Business account
      if (role === "BUSINESS") {
        const business = await tx.business.create({
          data: {
            name: organisation,
            email: normalizedEmail,
            phone: normalizedPhone,
            description: description?.trim() || null,
            website: website?.trim() || null,
            type: businessType,
          },
        });

        await tx.branch.create({
          data: {
            businessId: business.id,
            userId: newUser.id,
            name: organisation,
            address: address.trim(),
            suburb: suburb?.trim() || null,
            city: city.trim(),
            country: locationCountry,
            phone: normalizedPhone,
          },
        });
      }

      // Charity account
      if (role === "CHARITY") {
        await tx.charity.create({
          data: {
            userId: newUser.id,
            name: organisation,
            email: normalizedEmail,
            phone: normalizedPhone,
            description: description?.trim() || null,
            website: website?.trim() || null,
            address: address.trim(),
            suburb: suburb?.trim() || null,
            city: city.trim(),
            country: locationCountry,
          },
        });
      }

      return newUser;
    });

    return NextResponse.json(
      {
        message: "Account created successfully!",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Something went wrong during registration." },
      { status: 500 }
    );
  }
}
