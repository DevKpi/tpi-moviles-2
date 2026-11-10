import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from './CommonStyles';

export const urbanPerfilStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
        gap: SPACING.md,
    },
    avatarCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.card,
    },
    avatarButton: {
        width: 104,
        height: 104,
        borderRadius: 52,
        backgroundColor: COLORS.primaryLight,
        borderWidth: 3,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 12,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    avatarInitials: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.primary,
    },
    avatarName: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    avatarEmail: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    avatarHint: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 8,
    },
    avatarActionsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: SPACING.md,
        width: '100%',
    },
    avatarActionItem: {
        flex: 1,
    },
    infoCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.card,
    },
    infoCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    infoRow: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    infoRowLast: {
        paddingVertical: 10,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 4,
    },
    infoValueMono: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    feedbackText: {
        fontSize: 13,
        color: COLORS.danger,
        textAlign: 'center',
        fontWeight: '600',
    },
    actionsSection: {
        gap: 10,
        marginTop: 4,
        marginBottom: SPACING.lg,
    },
});
