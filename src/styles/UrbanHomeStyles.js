import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from './CommonStyles';

export const urbanHomeStyles = StyleSheet.create({
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
    welcomeCard: {
        backgroundColor: COLORS.primaryDark,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        ...SHADOWS.card,
    },
    welcomeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.pill,
        marginBottom: 10,
    },
    welcomeBadgeText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.white,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#dbeafe',
        marginTop: 6,
        lineHeight: 20,
    },
    primaryActionWrapper: {
        marginTop: SPACING.md,
    },
    sectionHeader: {
        marginTop: 4,
        marginBottom: 2,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    gridContainer: {
        gap: 12,
    },
    navCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...SHADOWS.card,
    },
    navCardPressed: {
        backgroundColor: COLORS.surfaceMuted,
        transform: [{ scale: 0.99 }],
    },
    navCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 12,
    },
    navIconBox: {
        width: 46,
        height: 46,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    navIconText: {
        fontSize: 20,
    },
    navTextContainer: {
        flex: 1,
    },
    navCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    navCardDescription: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
        lineHeight: 18,
    },
    navChevron: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
    },
    accountSummaryCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    accountSummaryLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    accountSummaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 4,
    },
    logoutContainer: {
        marginTop: 8,
        marginBottom: SPACING.md,
    },
});
