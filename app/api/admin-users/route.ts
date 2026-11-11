import { NextResponse } from "next/server";

import {
  createClient as createAdminClient,
} from "@supabase/supabase-js";

import { createClient } from "@/app/lib/supabase/server";

type CreateAdminBody = {
  email?: string;
  full_name?: string;
  password?: string;
  role?: "admin" | "super_admin";
  active?: boolean;
};

export async function POST(
  request: Request
) {
  try {
    /*
      VERIFY CURRENT LOGGED-IN USER
    */
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    /*
      VERIFY SUPER ADMIN
    */
    const {
      data: admin,
      error: adminError,
    } = await supabase
      .from("admin_users")
      .select("role, active")
      .eq("id", user.id)
      .single();

    if (
      adminError ||
      !admin ||
      !admin.active ||
      admin.role !== "super_admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Super Admin access required.",
        },
        {
          status: 403,
        }
      );
    }

    /*
      READ FORM DATA
    */
    const body =
      (await request.json()) as CreateAdminBody;

    const email =
      body.email
        ?.trim()
        .toLowerCase();

    const fullName =
      body.full_name?.trim();

    const password =
      body.password || "";

    const role =
      body.role === "super_admin"
        ? "super_admin"
        : "admin";

    const active =
      body.active ?? true;

    /*
      VALIDATION
    */
    if (!email) {
      return NextResponse.json(
        {
          error:
            "Email is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!fullName) {
      return NextResponse.json(
        {
          error:
            "Full name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      password.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    /*
      SERVER-ONLY SUPABASE
      SECRET CLIENT
    */
    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env
        .SUPABASE_SECRET_KEY;

    if (
      !supabaseUrl ||
      !secretKey
    ) {
      console.error(
        "Missing Supabase server environment variables."
      );

      return NextResponse.json(
        {
          error:
            "Server configuration error.",
        },
        {
          status: 500,
        }
      );
    }

    const adminSupabase =
      createAdminClient(
        supabaseUrl,
        secretKey,
        {
          auth: {
            autoRefreshToken:
              false,

            persistSession:
              false,

            detectSessionInUrl:
              false,
          },
        }
      );

    /*
      CREATE SUPABASE AUTH USER
    */
    const {
      data: createdUser,
      error: createUserError,
    } =
      await adminSupabase.auth.admin.createUser(
        {
          email,

          password,

          email_confirm:
            true,

          user_metadata: {
            full_name:
              fullName,
          },
        }
      );

    if (
      createUserError ||
      !createdUser.user
    ) {
      console.error(
        "Supabase create user error:",
        createUserError
      );

      return NextResponse.json(
        {
          error:
            createUserError?.message ||
            "Unable to create user.",
        },
        {
          status: 400,
        }
      );
    }

    /*
      CREATE ADMIN_USERS RECORD
    */
    const {
      error: insertError,
    } = await adminSupabase
      .from("admin_users")
      .insert({
        id:
          createdUser.user.id,

        email,

        full_name:
          fullName,

        role,

        active,
      });

    if (insertError) {
      console.error(
        "Admin profile insert error:",
        insertError
      );

      /*
        ROLLBACK AUTH USER
        IF ADMIN PROFILE FAILS
      */
      await adminSupabase.auth.admin.deleteUser(
        createdUser.user.id
      );

      return NextResponse.json(
        {
          error:
            insertError.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        id:
          createdUser.user.id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create admin user error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unexpected server error.",
      },
      {
        status: 500,
      }
    );
  }
}