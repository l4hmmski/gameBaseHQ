import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

type DeleteAccountBody = {
  confirmation?: string;
};

export async function DELETE(
  request: NextRequest,
) {
  const origin =
    request.headers.get(
      "origin",
    );

  const expectedOrigin =
    new URL(
      request.url,
    ).origin;

  if (
    origin &&
    origin !== expectedOrigin
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid request origin.",
      },
      {
        status: 403,
      },
    );
  }

  let body: DeleteAccountBody;

  try {
    body =
      (await request.json()) as DeleteAccountBody;
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid request.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    body.confirmation !==
    "DELETE"
  ) {
    return NextResponse.json(
      {
        error:
          "Account deletion was not confirmed.",
      },
      {
        status: 400,
      },
    );
  }

  const supabase =
    await createSupabaseServerClient();

  const {
    data: {
      user,
    },
    error: userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !user
  ) {
    return NextResponse.json(
      {
        error:
          "You must be logged in to delete your account.",
      },
      {
        status: 401,
      },
    );
  }

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    console.error(
      "Missing Supabase admin environment variables.",
    );

    return NextResponse.json(
      {
        error:
          "Account deletion is temporarily unavailable.",
      },
      {
        status: 500,
      },
    );
  }

  const adminClient =
    createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken:
            false,
          persistSession:
            false,
        },
      },
    );

  try {
    const {
      error: gamesError,
    } =
      await adminClient
        .from("games")
        .delete()
        .eq(
          "user_id",
          user.id,
        );

    if (gamesError) {
      throw gamesError;
    }

    const {
      error: profileError,
    } =
      await adminClient
        .from("profiles")
        .delete()
        .eq(
          "id",
          user.id,
        );

    if (profileError) {
      throw profileError;
    }

    const {
      error: deleteUserError,
    } =
      await adminClient
        .auth.admin
        .deleteUser(
          user.id,
        );

    if (deleteUserError) {
      throw deleteUserError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Account deletion failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Your account could not be deleted. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}