import { globalIgnores } from "eslint/config";
import { nextJsConfig } from "@repo/eslint-config/next-js";

/**
 * Public routes may not import `prisma` — only named helpers from @repo/database
 * (AD-B9-01 contract). Admin, API and a few Dev-B server routes are exempt.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...nextJsConfig,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    files: ["app/**/*.{js,jsx,ts,tsx}", "components/**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "app/admin/**",
      "app/api/**",
      "app/login/**",
      // Dev B stable-download redirect — not a public UI page.
      "app/downloads/**",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@repo/database",
              importNames: ["prisma"],
              message:
                "Public pages must use named helpers from @repo/database (listPublished…, getPublicSiteSettings, …). Do not import prisma. See documentation/user-stories/frontend/00-overview.md → Data contract.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message:
            "Use <RichText> from lib/rich-text-view.tsx — never dangerouslySetInnerHTML on public pages.",
        },
      ],
    },
  },
];
