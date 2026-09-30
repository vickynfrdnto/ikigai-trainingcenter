# Organization schema rollout

This rollout adds organization assignments and permission-aware Firebase access. It does not migrate video files or change employee progress.

## Before rollout

1. Review `database.rules.json` and deploy Functions before deploying the rules. Existing anonymous sessions must sign in again through the access-code callable.
2. Set `FIREBASE_DATABASE_URL` to the production Realtime Database URL and authenticate the deployment machine with Application Default Credentials for the matching Firebase project.
3. Run `node functions/migrate-organization.js --dry-run` and review the counts and skipped profiles. Head Office users are intentionally skipped because their department cannot be inferred safely from their legacy profile.
4. Back up the database independently, then run `node functions/migrate-organization.js --apply`. The script writes a local rollback journal under the ignored `database-backups/` directory.
5. Deploy Functions and the database rules, then test admin and employee login, progress updates, module visibility, and access-code reset with test accounts.

## Rollback

Use the exact journal path printed by the apply command:

```sh
node functions/migrate-organization.js --rollback database-backups/organization-YYYY-MM-DDTHH-MM-SS.sssZ.json
```

Rollback checks every migrated value first and refuses to proceed if it has since changed. It restores only fields owned by this migration and leaves training progress untouched. Restore the independent Firebase backup if reverting deployed code or rules is also necessary.

## Legacy profiles

Operational legacy roles (Kasir, Supervisor, Operasional, Terapis) map to the initial operational job roles. Outlet is copied from `outletId` or the existing `divisi` field. Head Office and unknown roles are reported for manual mapping; they are not guessed. The migration is additive and skips profiles already marked with migration version 1.
