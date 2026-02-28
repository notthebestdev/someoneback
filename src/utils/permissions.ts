/**
 * Checks if a member has the "Mention Everyone" permission
 */
export function hasRequiredPermissions(memberPermissions?: string): boolean {
	if (!memberPermissions) return false;
	const hasMentionEveryonePermission = BigInt(memberPermissions) & BigInt(0x20000);
	return !!hasMentionEveryonePermission;
}
