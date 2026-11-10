import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from './CommonStyles';

export const urbanAuthStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.xl,
    },
    heroContainer: {
        marginBottom: SPACING.lg,
    },
    brandBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: RADIUS.pill,
        marginBottom: 10,
    },
    brandBadgeText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: -0.4,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginTop: 6,
        lineHeight: 22,
    },
    formCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.card,
    },
    feedbackBanner: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
    },
    errorBanner: {
        backgroundColor: COLORS.dangerLight,
        borderColor: '#fecaca',
    },
    errorBannerText: {
        color: COLORS.danger,
        fontSize: 13,
        fontWeight: '600',
    },
    infoBanner: {
        backgroundColor: COLORS.successLight,
        borderColor: '#bbf7d0',
    },
    infoBannerText: {
        color: COLORS.success,
        fontSize: 13,
        fontWeight: '600',
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: -4,
        marginBottom: SPACING.md,
        paddingVertical: 4,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: '600',
    },
    submitButton: {
        marginTop: 4,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.lg,
        paddingVertical: 8,
    },
    footerText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    footerLinkText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
        marginLeft: 4,
    },
});
